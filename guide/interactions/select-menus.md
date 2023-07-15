# Menús de selección

Con la API de componentes, puedes crear componentes de mensajes interactivos. En esta página, veremos cómo enviar, recibir y responder a menús de selección con discord.js.

::: tip CONSEJO
Esta página es un seguimiento de la sección de [interacciones (comandos de barra)](/guide/slash-commands/advanced-creation.md). Por favor, lee atentamente esa sección primero para que puedas comprender los métodos utilizados en esta sección.

:::

## Creación y envío de menús de selección

Los menús de selección son una de las clases `MessageComponent`, que pueden enviarse a través de mensajes o respuestas de interacción. Un menú de selección, como cualquier otro componente de mensaje, debe estar en una `ActionRow`.

::: warning ADVERTENCIA
Puede tener un máximo de cinco `ActionRow` por mensaje, y un menú de selección dentro de un `ActionRow`.
:::

Para crear un menú de selección, utilice las clases <DocsLink path="class/ActionRowBuilder"/> y <DocsLink path="class/StringSelectMenuBuilder"/>. A continuación, pase el contenedor de componentes resultante a <DocsLink path="class/ChatInputCommandInteraction?scrollTo=reply" /> en el array `components` de <DocsLink path="typedef/InteractionReplyOptions" />:

```js {1,7-24,26}
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('selección')
					.setPlaceholder('Nada seleccionado')
					.addOptions(
						{
							label: 'Seleccioname',
							description: 'Esto es una descripción',
							value: 'primera_opción',
						},
						{
							label: 'También puedes seleccionarme',
							description: 'Esto también es otra descripción',
							value: 'segunda_opción',
						},
					),
			);

		await interaction.reply({ content: '¡Pong!', components: [row] });
	}
});
```

::: tip CONSEJO
La id personalizada (`custom_id`) es una string definida por ti de hasta 100 caracteres. Utiliza este campo para asegurarte de que puedas definir de forma única todas las interacciones procedentes de tus menús de selección.
:::

Reinicia tu bot y luego envía el comando a un canal al que tu bot tenga acceso. Si todo va bien, deberías ver algo como esto:

<!--- vue-discord-message doesn't yet have support for select menus
<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>
-->
![select](./images/select.png)

También puede enviar componentes de mensajes dentro de una respuesta efímera o junto a embeds.

```js {1,12-16,18}
const { ActionRowBuilder, EmbedBuilder, Events, StringSelectMenuBuilder } = require('discord.js');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new ActionRowBuilder()
			.addComponents(
				// ...
			);

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Titulo ingenioso')
			.setURL('https://discord.js.org/')
			.setDescription('Alguna descripción');

		await interaction.reply({ content: '¡Pong!', ephemeral: true, embeds: [embed], components: [row] });
	}
});
```

Reinicia tu bot y luego envía el comando a un canal al que tu bot tenga acceso. Si todo va bien, deberías ver algo como esto:

<!--- vue-discord-message doesn't yet have support for select menus
<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
				:ephemeral="true"
			>ping</DiscordInteraction>
		</template>
		Pong! (+ components)
		<template #embeds>
			<DiscordEmbed
				border-color="#0099ff"
				embed-title="Some title"
				url="https://discord.js.org"
			>
				Some description here
			</DiscordEmbed>
		</template>
	</DiscordMessage>
</DiscordMessages>
-->
![selectephem](./images/selectephem.png)

::: warning ADVERTENCIA
Si estás usando TypeScript necesitarás especificar el tipo de componentes que contiene tu contenedor de componentes. Esto se puede hacer especificando el constructor de componentes que le añadirás utilizando un parámetro genérico en <DocsLink path="class/ActionRowBuilder"/>.

```diff
- new ActionRowBuilder()
+ new ActionRowBuilder<StringSelectMenuBuilder>()
```
:::

¡Ahora ya sabes todo lo que hay que saber para construir y enviar un `SelectMenu`! Pasemos ahora a cómo recibir menús.

## Recibiendo interacciones de menús de selección

### Colectores de componentes

Las interacciones de componentes de mensajes se pueden recopilar dentro del ámbito del comando de barra que las envió utilizando un <DocsLink path="class/InteractionCollector"/>, o su variante `awaitMessageComponent` a base de promesa. Ambos proporcionan instancias de la clase <DocsLink path="class/MessageComponentInteraction"/> como elementos recogidos.

::: tip CONSEJO
Puede crear los colectores en un `message` o en un `channel`.
:::

Para obtener una guía detallada sobre la recepción de componentes de mensajes a través de recopiladores, consulta la [guía de recopiladores](/guide/popular-topics/collectors.md#interaction-collectors).

### El evento interactionCreate

Para recibir un <DocsLink path="class/StringSelectMenuInteraction"/>, adjunta un oyente de evento <DocsLink path="class/Client?scrollTo=e-interactionCreate" /> a su cliente y utilice la protección de tipado <DocsLink path="class/BaseInteraction?scrollTo=isStringSelectMenu"/> para asegurarte de que sólo recibe menús de selección:

```js {2}
client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isStringSelectMenu()) return;
	console.log(interaction);
});
```

## Respondiendo a menús de selección

La clase <DocsLink path="class/MessageComponentInteraction"/> proporciona los mismos métodos que la clase <DocsLink path="class/ChatInputCommandInteraction"/>. Estos métodos se comportan igual:
- `reply()`
- `editReply()`
- `deferReply()`
- `fetchReply()`
- `deleteReply()`
- `followUp()`

### Actualización del mensaje del menú de selección

La clase <DocsLink path="class/MessageComponentInteraction"/> proporciona un método <DocsLink path="class/MessageComponentInteraction?scrollTo=update" /> para actualizar el mensaje al que se adjuntó el menú de selección. Si se pasa un array vacío a la opción `components` se eliminarán todos los menús una vez seleccionada una opción.

This method should be used in favour of `editReply()` on the original interaction, to ensure you respond to the select menu interaction.

```js {1,4-6}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;

	if (interaction.customId === 'select') {
		await interaction.update({ content: 'Something was selected!', components: [] });
	}
});
```

### Deferring and updating the select menu's message

Este método debe usarse en lugar de `editReply()` en la interacción original, para asegurar que respondes a la interacción del menú de selección.

```js {1,6-10}
const wait = require('node:timers/promises').setTimeout;

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;

	if (interaction.customId === 'select') {
		await interaction.deferUpdate();
		await wait(4000);
		await interaction.editReply({ content: '¡Se seleccionó algo!', components: [] });
	}
});
```

## Menús multiselección

Un menú de selección no está vinculado a una única selección; puede especificar una cantidad mínima y máxima de opciones que deben seleccionarse. Puede utilizar los métodos <DocsLink path="class/SelectMenuBuilder?scrollTo=setMinValues" /> y <DocsLink path="class/StringSelectMenuBuilder?scrollTo=setMaxValues" /> para determinar estos valores.

```js {1,7-31,33}
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('selección')
					.setPlaceholder('Nada seleccionado')
					.setMinValues(2)
					.setMaxValues(3)
					.addOptions([
						{
							label: 'Seleccioname',
							description: 'Esto es una descripción',
							value: 'primera_opción',
						},
						{
							label: 'También puedes seleccionarme',
							description: 'Esto también es una descripción',
							value: 'segunda_opción',
						},
						{
							label: 'También soy una opción',
							description: 'Esta es una descripción también',
							value: 'tercera_opción',
						},
					]),
			);

		await interaction.reply({ content: '¡Pong!', components: [row] });
	}
});
```

## Accediendo a los valores de interacción del menú de selección

Después de recibir su <DocsLink path="class/StringSelectMenuInteraction"/>, podrás acceder a los valores seleccionados desde <DocsLink path="class/StringSelectMenuInteraction?scrollTo=values"/>. Esto devolverá un array de string asociados a las opciones seleccionadas en su menú de selección.

Por defecto, los menús de selección sólo aceptan una única selección. Puede recuperar el valor seleccionado accediendo al primer índice del array devuelta, como se muestra en el siguiente fragmento:

```js {4,6-10}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;

	const selected = interaction.values[0];

	if (selected === 'ping') {
		await interaction.update('¡Se ha seleccionado la opción ping!');
	} else if (selected === 'pong') {
		await interaction.update('¡Se ha seleccionado la opción Pong!');
	}
});
```

En el caso de un menú de selección múltiple, el <DocsLink path="class/StringSelectMenuInteraction?scrollTo=values"/> recibido puede contener más de un valor, y debe tratarse en consecuencia:

```js {4,6}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;

	const selected = interaction.values.join(', ');

	await interaction.update(`¡El usuario ha seleccionado ${selected}!`);
});
```
