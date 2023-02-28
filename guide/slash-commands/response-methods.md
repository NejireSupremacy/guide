# Métodos de respuesta de comandos

Hay múltiples formas de responder a un comando de barra; cada uno de estos son cubiertos en el siguiente segmento. El uso de un método de respuesta a interacciones confirmará a Discord que su bot recibió con éxito la interacción, y ha respondido al usuario. Discord aplica esto para garantizar que todos los comandos de barra brinden una buena experiencia de usuario (UX). Si no responde, Discord mostrará que el comando falló, incluso si su bot está realizando otras acciones como resultado.

Las formas más comunes de enviar una respuesta es usando el método `ChatInputCommandInteraction#reply()`, como lo ha hecho en ejemplos anteriores. Este método reconoce a interacción y envía un nuevo mensaje en respuesta.

```js {6}
module.exports = {

	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('¡Responde con Pong!'),
	async execute(interaction) {

		await interaction.reply('¡Pong!');
	},
};
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		¡Pong!
	</DiscordMessage>
</DiscordMessages>

::: warning
Inicialmente, un token de interacción es solo válido por tres segundos, por lo que ese es el periodo de tiempo en el que puede utilizar el método `ChatInputCommandInteraction#reply()`. Las respuestas que requieren más tiempo ("Respuestas diferidas") se explican más adelante en esta página.

:::

## Respuestas efímeras

Es posible que no siempre desee que todos los que tienen acceso al canal vean la respuesta de un comando de barra. Anteriormente, habría tenido que enviar un mensaje privado (DM) al usuario para lograr esto, lo que podría encontrar altos límites (ratelimits) asociados con los DM, o simplemente no poder enviarlo, si los DM del usuario están deshabilitados.

Afortunadamente, Discord proporciona una forma de ocultar los mensajes de respuesta de todos menos el ejecutor del comando de barra. Este tipo de mensaje es llamado un mensaje "efímero" y se puede configurar proporcionando `ephemeral: true` en `InteractionReplyOptions`, de la siguiente manera:

```js {5}
client.on(Events.InteractionCreate, async interaction => {

	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {

		await interaction.reply({ content: '¡Pong oculto!', ephemeral: true });
	}
});
```

Ahora, cuando ejecute su comando de nuevo, debería ver algo como esto:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
				:ephemeral="true"
			>ping</DiscordInteraction>
		</template>
		¡Pong oculto!
	</DiscordMessage>
</DiscordMessages>

Las respuestas efímeras *solo* están disponibles para la respuesta de la interacción; otra gran razón para utilizar la nueva y mejorada interfaz de usuario del comando de barra.

## Edición de respuestas

Después de enviar una respuesta inicial, es posible que desee editar esa respuesta por varios motivos. Esto se puede lograr con el método `ChatInputCOmmandInteraction#editReply()`: 

::: warning
Después de la respuesta iniciar, el token de una interacción es válido por 15 minutos, por lo que este es el periodo de tiempo en el cual puede editar la respuesta y enviar mensajes de seguimiento. Tampoco **puede** editar el estado efímero del mensaje, así que asegúrese de que su primera respuesta establezca esto correctamente.

:::

```js {1,8-9}
const wait = require('node:timers/promises').setTimeout;

client.on(Events.InteractionCreate, async interaction => {

	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {

		await interaction.reply('¡Pong!');
		await wait(2000);
		await interaction.editReply('¡Pong otra vez!');
	}
});
```

De hecho, es necesario editar su respuesta de interacción para [calcular el ping][/popular-topics/faq.html#how-do-i-check-the-bot-s-ping] correctamente para este comando.

## Respuestas diferidas

Como se mencionó anteriormente, Discord requiere un reconocimiento de su bot dentro de los tres segundos posteriores a la recepción de la interacción. De lo contrario, Discord considerará que la interacción ha fallado y el token dejara de ser válido. Pero, ¿qué sucede si tiene un comando que realiza una tarea que demora más de tres segundos antes de poder responder?

En este caso, puede hacer uso del método `ChatInputCommandInteraction#deferReply()`, que activa el mensaje `<aplicación> está pensando…`. Esto también actúa como una respuesta inicial, para confirmar a Discord que esa interacción se recibió con éxito y le da un plazo de 15 minutos para completar sus tareas antes de responder.
<!--- TODO: Thinking... message, once available in components -->

```js {7-9}
const wait = require('node:timers/promises').setTimeout;

client.on(Events.InteractionCreate, async interaction => {

	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {

		await interaction.deferReply();
		await wait(4000);
		await interaction.editReply('¡Pong!');
	}
});
```

Si tiene un comando que lleva a cabo tareas más largas, asegúrese de llamar a `deferReply()` lo antes posible.

Tenga en cuenta que si desea que su respuesta sea efímera, debe pasar un indicador `ephemeral` a `InteractionDeferOptions` aquí:

<!-- eslint-skip -->

```js
await interaction.deferReply({ ephemeral: true });
```

No es posible editar una respuesta para cambiar su estado efímero una vez enviada.

::: tip
Si desea efectuar un comando de ping adecuado, hay uno disponible en nuestro [FAQ](/popular-topics/faq.md#how-do-i-check-the-bot-s-ping).

:::

## Seguimientos

Los métodos `reply()` y `deferReply()` son respuestas *iniciales*, los cuales le dicen a Discord que su bot recibió la interacción correctamente, pero no pueden ser usados para enviar un mensaje adicional. Aquí es donde entran los mensajes `follow-up`. Después de haber respondido inicialmente a una interacción, puede usar `ChatInputCommandInteraction#followUp()` para enviar mensajes adicionales:

::: warning
Después de la respuesta inicial, un token de interacción es válido durante 15 minutos, por lo que este es el período de tiempo en el que puede editar la respuesta y enviar mensajes de seguimiento.

:::

```js {6}
client.on(Events.InteractionCreate, async interaction => {

	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {

		await interaction.reply('¡Pong!');
		await interaction.followUp('¡Pong otra vez!');
	}
});
```

Si ejecuta este código, debería terminar teniendo algo parecido a esto:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		¡Pong!
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="bot">¡Pong!</DiscordInteraction>
		</template>
		¡Pong otra vez!
	</DiscordMessage>
</DiscordMessages>

También puedes pasar un indicador `ephemeral` a `InteractionReplyOptions`:

<!-- eslint-skip -->

```js
await interaction.followUp({ content: '¡Pong otra vez!', ephemeral: true });
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		¡Pong!
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="bot" :ephemeral="true">¡Pong!</DiscordInteraction>
		</template>
		¡Pong otra vez!
	</DiscordMessage>
</DiscordMessages>

Tenga en cuenta que si utiliza `followUp()` después de `deferReply()`, el primer seguimiento editará el mensaje `<aplicación> está pensando…` en lugar de enviar uno nuevo.

Eso es todo, ¡ahora sabes todo lo que hay que saber sobre cómo responder a los comandos de barra!

::: tip
Las respuestas de interacción pueden emplear enlaces enmascarados (por ejemplo, `[texto](http://sitio.com)`) en el contenido del mensaje.

:::

## Obtener y eliminar respuestas

Además de responder a un comando de barra, es posible que también desee eliminar la respuesta inicial. Puedes usar `ChatInputCommandInteraction#deleteReply()` para esto:

<!-- eslint-skip -->

```js {2}
await interaction.reply('¡Pong!');
await interaction.deleteReply();
```

Por último, es posible que necesite el objeto `Message` de una respuesta por varios motivos, como agregar reacciones. Puedes usar el método `ChatInputCommandInteraction#fetchReply()` para obtener la instancia `Message` de una respuesta inicial:

<!-- eslint-skip -->

```js
await interaction.reply('¡Pong!');
const message = await interaction.fetchReply();
console.log(message);
```

## Respuestas localizadas

Además de la capacidad de proporcionar definiciones de comandos localizadas, también puede localizar sus respuestas. Para hacer esto, obtenga la configuración regional del usuario con `ChatInputCommandInteraction#locale` y responda en consecuencia:

```js
const locales = {

	pl: 'Witaj Świecie!',
	de: 'Hallo Welt!',
	en: 'Hello World!',
	es: '¡Hola Mundo!',
};
client.on(Events.InteractionCreate, interaction => {

	interaction.reply(locales[interaction.locale] ?? locales.es);
});
```

