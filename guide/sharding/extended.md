# Amplicación de cambios

::: tip CONSEJO
Esta página es una continuación y basa su código en [la página anterior](/sharding/additional-information.md), que asume el conocimiento de argumentos y funciones de paso.
:::

## Envío de mensajes entre shards

Empecemos con el uso básico de los shards. En algún momento del desarrollo del bot, puede que hayas querido enviar un mensaje a otro canal, que puede o no estar necesariamente en el mismo servidor, lo que significa que puede o no estar en el mismo shard. Para conseguir esto, necesitarás volver a tu amigo `.broadcastEval()` y probar cada shard para el canal deseado. Supongamos que tienes el siguiente código en tu evento `interactionCreate`:

```js {3-11}
client.on(Events.InteractionCreate, interaction => {
	// ...
	if (commandName === 'send') {
		const id = interaction.options.getString('destino');
		const channel = client.channels.cache.get(id);

		if (!channel) return interaction.reply('No pude encontrar dicho canal.');

		channel.send('¡Hola!');
		return interaction.reply(`¡He enviado un mensaje al canal: \`${id}\`!`);
	}
});
```

Esto nunca funcionará para un canal que se encuentra en otro shard. Así que vamos a remediar esto.

::: tip CONSEJO
En discord.js v13, <DocsLink path="class/ShardClientUtil?scrollTo=ids">`Client#shard`</DocsLink> puede contener múltiples ids. Si utilizas el gestor de fragmentación por defecto, el array `.ids` sólo tendrá una entrada.
:::

```js {4-13}
if (commandName === 'send') {
	const id = interaction.options.getString('destino');
	return client.shard.broadcastEval(async (c, { channelId }) => {
		const channel = c.channels.cache.get(channelId);
		if (channel) {
			await channel.send(`Este es un mensaje de ${c.shard.ids.join(',')}!`);
			return true;
		}
		return false;
	}, { context: { channelId: id } })
		.then(console.log);
}
```

Si todo va bien, debería ver una salida como `[false, true, false, false]`. Si no está claro por qué `true` y `false` están dando vueltas, se devolverá la última expresión de la sentencia eval. Querrás esto si quieres alguna respuesta de los resultados. Ahora que has observado dichos resultados, puedes ajustar el comando para que te dé una retroalimentación adecuada, así:

```js {4-10}
return client.shard.broadcastEval(c => {
	// ...
})
	.then(sentArray => {
		// Buscar un valor no falso antes de dar una respuesta
		if (!sentArray.includes(true)) {
			return message.reply('No pude encontrar dicho canal.');
		}
		return message.reply(`¡He enviado un mensaje al canal: \`${id}\`!`);
	});
```

Y eso es todo por esta sección. Te has comunicado con éxito en todos tus fragmentos.

## Uso de las funciones (continuación)

Si recuerdas, hubo una breve mención de pasar funciones a través de `.broadcastEval()`, pero ninguna descripción super clara de cómo hacerlo exactamente. Bueno, no te preocupes, esta sección lo cubrirá. Supongamos que tienes el siguiente código en tu evento `interactionCreate`:

```js {3-8}
client.on(Events.InteractionCreate, interaction => {
	// ...
	if (commandName === 'emoji') {
		const emojiId = interaction.options.getString('emoji');
		const emoji = client.emojis.cache.get(emojiId);

		return interaction.reply(`Encontré un emoji: ${emoji}!`);
	}
});
```

El código antes mencionado esencialmente buscará a través de `client.emojis.cache` el id proporcionado, que será dado por la opción `emoji`. Sin embargo, con el sharding, puedes notar que no busca a través de todos los emojis del cliente. Como se mencionó en una sección anterior de esta guía, los diferentes shards particionan el cliente y su caché. Los emojis derivan de los servidores, lo que significa que cada shard tendrá los emojis de todos los servidores de esa shard. La solución es utilizar `.broadcastEval()` para buscar el emoji deseado en todas las shards.

Empecemos con una función básica, que intentará obtener un emoji del cliente actual y devolverlo.

```js
function findEmoji(c, { nameOrId }) {
	return c.emojis.cache.get(nameOrId) || c.emojis.cache.find(e => e.name.toLowerCase() === nameOrId.toLowerCase());
}
```

A continuación, tienes que llamar a la función en tu comando correctamente. Si recuerdas [esta sección](/guide/sharding/additional-information.md#eval-arguments), allí se muestra cómo pasar una función y argumentos correctamente.

```js {4-7}
client.on(Events.InteractionCreate, interaction => {
	// ...
	if (commandName === 'emoji') {
		const emojiNameOrId = interaction.options.getString('emoji');

		return client.shard.broadcastEval(findEmoji, { context: { nameOrId: emojiNameOrId } })
			.then(console.log);
	}
});
```

Ahora, ejecuta este código, y seguramente obtendrás un resultado parecido al siguiente:

<!-- eslint-skip  -->

```js
[
	{ 
		guild: { 
			members: {},
			// ...
			id: '222078108977594368',
			name: 'discord.js Official',
			icon: '6e4b4d1a0c7187f9fd5d4976c50ac96e',
			// ...
			emojis: {} 
		},
		id: '383735055509356544',
		name: 'duckSmug',
		requiresColons: true,
		managed: false,
		animated: false,
		_roles: []
	}
]
```

Aunque este resultado no es *necesariamente* malo o incorrecto, es simplemente un objeto sin procesar al que se le ha aplicado `JSON.parse()` y `JSON.stringify()`, por lo que todas las referencias circulares han desaparecido. Más importante aún, el objeto ya no es un verdadero objeto `GuildEmoji` como el proporcionado por discord.js.* Si esto es un problema para ti, querrás manejar el objeto *dentro* de `broadcastEval`. Convenientemente, la función `findEmoji` será ejecutada, así que deberías ejecutar tus métodos relevantes allí, antes de que el objeto abandone el contexto.

```js {2-3,5-6}
function findEmoji(c, { nameOrId }) {
	const emoji = c.emojis.cache.get(nameOrId) || c.emojis.cache.find(e => e.name.toLowerCase() === nameOrId.toLowerCase());
	if (!emoji) return null;
	// Si quisieras eliminar el emoji con discord.js, aquí es donde lo harías. De lo contrario, no incluyas este código.
	emoji.delete();
	return emoji;
}
```

Una vez dicho todo esto, normalmente querrás mostrar el resultado, así que aquí tienes cómo hacerlo:

```js {2-7}
return client.shard.broadcastEval(findEmoji, { context: { nameOrId: emojiNameOrId } })
	.then(emojiArray => {
		// Localiza un resultado no falso, que será el emoji en cuestión
		const foundEmoji = emojiArray.find(emoji => emoji);
		if (!foundEmoji) return message.reply('No pude encontrar ese emoji.');
		return message.reply(`¡Encontré el emoji ${foundEmoji.animated ? `<${foundEmoji.identifier}>` : `<:${foundEmoji.identifier}>`}!`);
	});
```

¡Y eso es todo! El emoji debe tener una bonita impresión en un mensaje, como era de esperar.

## Resultado final

<ResultingCode />
