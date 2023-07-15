# Botones

Con la API de componentes, puedes crear componentes de mensajes interactivos. En esta página, aprenderás cómo enviar, recibir y responder a interacción de botones con discord.js.

::: tip CONSEJO
Esta página es una continuación de la página de [creación de comandos avanzados](/guide/slash-commands/advanced-creation.md). Por favor, leé primero con atención para que puedas entender los métodos utilizados en esta sección.
:::

## Construyendo y enviando botones

Los botones son una de las clases `MessageComponent`, que pueden enviarse a través de mensajes o respuestas de interacción. Un botón, como cualquier otro componente de mensaje, debe estar en una `ActionRow`.


::: warning ADVERTENCIA
Puedes tener un máximo de cinco `ActionRow` por mensaje, y cinco botones dentro de un `ActionRow`.

Si estás utilizando TypeScript, necestiarás especificar el tipo de componentes que contiene tu `ActionRow`. Esto se puede hacer especificando el constructor del componente que le añadirás utilizando un parámetro genérico en <DocsLink path="class/ActionRowBuilder"/>.

```diff
- new ActionRowBuilder()
+ new ActionRowBuilder<ButtonBuilder>()
```
:::

Para crear tus botones, haz uso de las clases <DocsLink path="class/ActionRowBuilder"/> y <DocsLink path="class/ButtonBuilder"/>. A continuación, pasa el `ActionRow` a <DocsLink path="class/ChatInputCommandInteraction?scrollTo=reply" /> en el array `components` de <DocsLink path="typedef/InteractionReplyOptions" />:

```js {1,7-13,15}
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'button') {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary')
					.setLabel('¡Presionarme!')
					.setStyle(ButtonStyle.Primary),
			);

		await interaction.reply({ content: 'Creo que deberías...', components: [row] });
	}
});
```

::: tip CONSEJO
La id personalizada (`custom_id`) es una string definida por ti de hasta 100 caracteres. Utiliza este campo para asegurarte de que puedas definir de forma única todas las interacciones procedentes de tus botones.
:::

Reinicia tu bot y luego envía el comando a un canal al que tu bot tenga acceso. Si todo va bien, deberías ver algo como esto:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">button</DiscordInteraction>
		</template>
		Creo que deberías...
		<template #actions>
			<DiscordButtons>
				<DiscordButton>¡Presionarme!</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

También puede enviar componentes de mensajes dentro de una respuesta efímera o junto a embeds.

```js {1,12-16,18}
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events } = require('discord.js');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'button') {
		const row = new ActionRowBuilder()
			.addComponents(
				// ...
			);

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Titulo ingenioso')
			.setURL('https://discord.js.org')
			.setDescription('Una descripción');

		await interaction.reply({ content: 'Creo que deberías...', ephemeral: true, embeds: [embed], components: [row] });
	}
});
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
				:ephemeral="true"
			>button</DiscordInteraction>
		</template>
		Creo que deberías...
		<template #embeds>
			<DiscordEmbed
				border-color="#0099ff"
				embed-title="Titulo ingenioso"
				url="https://discord.js.org"
			>
				Una descripción
			</DiscordEmbed>
		</template>
		<template #actions>
			<DiscordButtons>
				<DiscordButton>¡Presionarme!</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

### Deshabilitar botones

Si deseas evitar que se utilice un botón, pero sin eliminarlo del mensaje, puedes desactivarlo con el método <DocsLink path="class/ButtonBuilder?scrollTo=setDisabled"/>:

```js {5}
const button = new ButtonBuilder()
	.setCustomId('primary')
	.setLabel('¡Presionarme!')
	.setStyle(ButtonStyle.Primary)
	.setDisabled(true);
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">button</DiscordInteraction>
		</template>
		Creo que deberías...
		<template #actions>
			<DiscordButtons>
				<DiscordButton :disabled="true">¡Presionarme!</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

### Botones con emojis

Si deseas usar un emoji con un <DocsLink path="class/ButtonBuilder"/>, puedes utilizar el método <DocsLink path="class/ButtonBuilder?scrollTo=setEmoji"/>:

```js {5}
const button = new ButtonBuilder()
	.setCustomId('primary')
	.setLabel('Botón con emoji')
	.setStyle(ButtonStyle.Primary)
	.setEmoji('123456789012345678');
```

Ahora ya sabes todo lo que hay que hacer para crear y enviar un botón. Pasemos ahora a recibir las interacciones de los botones.

## Recibiendo interacción de botones

### Colectores de componentes

Las interacciones de los componentes de mensajes pueden ser recolectados dentro del ámbito del comando de barra que las envió con un <DocsLink path="class/InteractionCollector"/>, o con su variante `awaitMessageComponent` a base de promesa. Ambas proporcionan instancias de la clase <DocsLink path="class/MessageComponentInteraction"/> como elementos recogidos.

::: tip CONSEJO
Puedes crear los colectores en un `message` o en un `channel`.
:::

Para obtener una guía detallada sobre la recepción de componentes de mensaje a través de colectores, puedes consultar la [guía de colectores](/guide/popular-topics/collectors.md#interaction-collectors).

### El evento interactionCreate

Para recibir un evento <DocsLink path="class/ButtonInteraction"/>, adjunta un oyente de evento <DocsLink path="class/Client?scrollTo=e-interactionCreate"/> a tu cliente y usa la protección de tipado <DocsLink path="class/BaseInteraction?scrollTo=isButton"/> para asegurarte que solo estás recibiendo botones:

```js {2}
client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isButton()) return;
	console.log(interaction);
});
```

## Respondiendo a botones

La clase <DocsLink path="class/MessageComponentInteraction"/> proporciona los mismos métodos que la clase <DocsLink path="class/ChatInputCommandInteraction"/>. Estos métodos se comportan igual:
- `reply()`
- `editReply()`
- `deferReply()`
- `fetchReply()`
- `deleteReply()`
- `followUp()`

### Actualizar el mensaje del botón

La clase <DocsLink path="class/MessageComponentInteraction"/> también proporciona el método <DocsLink path="class/MessageComponentInteraction?scrollTo=update"/> para actualizar el mensaje del botón al que fue adjuntado. Pasar un array vacío a la opción `components` hará que se remuevan todos los botones que se hayan presionado.

Este método debería usarse en lugar de `editReply()` en la interacción original, para asegurarse de que responde a la interacción del botón.

<!-- eslint-skip -->

```js {6}
const filter = i => i.customId === 'primary' && i.user.id === '122157285790187530';

const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

collector.on('collect', async i => {
	await i.update({ content: '¡Un botón fue presionado!', components: [] });
});

collector.on('end', collected => console.log(`${collected.size} elementos recolectados`));
```

### Aplazar y actualizar el mensaje del botón

Además de aplazar una respuesta de interacción, puede aplazar la actualización del botón, que activará un estado de carga y luego volverá a su estado original:

<!-- eslint-skip -->

```js {1,7-9}
const wait = require('node:timers/promises').setTimeout;

// ...

collector.on('collect', async i => {
	if (i.customId === 'primary') {
		await i.deferUpdate();
		await wait(4000);
		await i.editReply({ content: '¡Un botón fue presionado!', components: [] });
	}
});

collector.on('end', collected => console.log(`${collected.size} elementos recolectados`));
```

## Estilos de botones

Actualmente hay cinco estilos de botón disponibles:
- `Primary`, un botón blurple;
- `Secondary`, un botón gris;
- `Success`, un botón verde;
- `Danger`, un botón rojo;
- `Link`, un botón que te dirige a una URL.

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #actions>
			<DiscordButtons>
				<DiscordButton>Primary</DiscordButton>
				<DiscordButton type="secondary">Secondary</DiscordButton>
				<DiscordButton type="success">Success</DiscordButton>
				<DiscordButton type="danger">Danger</DiscordButton>
				<DiscordButton type="link" url="https://discord.js.org">Link</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

::: warning ADVERTENCIA
Solo los botones `Link` pueden contener una `url`. Los botones `Link` _no pueden_ tener una `customId` y _no envían_ un evento de interacción cuando son pulsados.
:::
