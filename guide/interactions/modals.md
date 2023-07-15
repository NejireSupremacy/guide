# Modales

Con los modales (modals) puedes crear formularios emergentes que permiten a los usuarios proporcionar entradas formateadas a través de envíos. Cubriremos cómo crear, mostrar y recibir formularios modales utilizando discord.js.

::: tip CONSEJO
Esta página es un seguimiento de la sección de [interacciones (comandos de barra)](/guide/slash-commands/advanced-creation.md). Por favor, lee atentamente esa sección primero para que puedas comprender los métodos utilizados en esta sección.
:::

## Construyendo y respondiendo con modales

A diferencia de los componentes de mensaje, los modales no son estrictamente componentes en sí mismos. Son una estructura de devolución de llamada (callback) utilizada para responder a las interacciones.

::: tip CONSEJO
Puedes tener un máximo de cinco <DocsLink path="class/ActionRowBuilder" /> por constructor de modales y un <DocsLink path="class/TextInputBuilder" /> dentro de un <DocsLink path="class/ActionRowBuilder" />. Actualmente, no puedes usar <DocsLink path="class/StringSelectMenuBuilder" /> p <DocsLink path="class/ButtonBuilder" /> en los contenedores de componentes de los modales.
:::

Para crear un modal, crea un nuevo <DocsLink path="class/ModalBuilder" />. Luego puedes usar los métodos "setters" para agregar el ID personalizado (`custom_id`) y el título (`title`).

```js {1,7-13}
const { Events, ModalBuilder } = require('discord.js');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const modal = new ModalBuilder()
			.setCustomId('miModal')
			.setTitle('Mi Modal');

		// TODO: Agregar componentes al modal...
	}
});
```
::: tip CONSEJO
La id personalizada (`custom_id`) es una string definida por ti de hasta 100 caracteres. Utiliza este campo para asegurarte de que puedas definir de forma única todas las interacciones procedentes de tus modales.
:::
El siguiente paso es agregar los campos de entrada en los cuales los usuarios pueden ingresar texto libremente al responder. Agregar los campos de entrada es similar a agregar componentes a los mensajes.

Al final, llamamos a <DocsLink path="class/ChatInputCommandInteraction?scrollTo=showModal" /> para mostrar el modal al usuario.

::: warning ADVERTENCIA
Si estás utilizando TypeScript, deberás especificar el tipo de componentes que contiene tu contenedor de componentes. Esto se puede hacer especificando el parámetro genérico en <DocsLink path="class/ActionRowBuilder" />.

```diff
- new ActionRowBuilder()
+ new ActionRowBuilder<ModalActionRowComponentBuilder>()
```
:::

```js {1,12-34}
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		// Crear el modal
		const modal = new ModalBuilder()
			.setCustomId('miModal')
			.setTitle('Mi Modal');

		// Añadir componentes al modal

		// Crear los componentes de entrada de texto
		const favoriteColorInput = new TextInputBuilder()
			.setCustomId('entradaColorFavorito')
		    // La etiqueta es el indicador que el usuario ve para esta entrada
			.setLabel("What's your favorite color?")
		    // Corto significa una sola línea de texto
			.setStyle(TextInputStyle.Short);

		const hobbiesInput = new TextInputBuilder()
			.setCustomId('entradaPasatiempos')
			.setLabel('¿Cuáles son tus aficiones favoritas?')
		    // Párrafo significa varias líneas de texto.
			.setStyle(TextInputStyle.Paragraph);

		// Un contenedor de componentes solo contiene una entrada de texto,
		// por lo que necesita un contenedor de componentes por cada entrada de texto.
		const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
		const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

		// Añadir entradas al modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Mostrar el modal al usuario
		await interaction.showModal(modal);
	}
});
```

Reinicia tu bot y vuelve a utilizar el comando `/ping`. Deberías ver un formulario emergente parecido a la imagen de abajo:

<img width=450 src="./images/modal-example.png">

::: warning ADVERTENCIA
Mostrar un modal debe ser la primera respuesta a una interacción. No se puede `defer()` o `deferUpdate()` y mostrar un modal más tarde.
:::

### Estilos de entrada

Actualmente hay dos estilos de entrada disponibles::
- `Short`, una entrada de texto de una sola línea;
- `Paragraph`, una entrada de texto de varias líneas similar a la etiqueta HTML `<textarea>`;

### Propiedades de entradas

Además del `customId`, `label` y `style`, una entrada de texto puede personalizarse de varias formas para aplicar validación, preguntar al usuario o establecer valores por defecto a través de los métodos <DocsLink path="class/TextInputBuilder" />:

```js
const input = new TextInputBuilder()
	// establece el número máximo de caracteres permitidos
	.setMaxLength(1000)
	// establece el número mínimo de caracteres necesarios para el envío
	.setMinLength(10)
	// establece un marcador de posición de cadena para preguntar al usuario
	.setPlaceholder('¡Ingresa un texto!')
	// establecer un valor por defecto para pre-llenar la entrada
	.setValue('Predeterminado')
	// requiere un valor en este campo de entrada
	.setRequired(true);
```

## Recibiendo envíos de modales

### Colectores de interacciones

Los envíos de modales se pueden recopilar dentro del ámbito de la interacción que los mostró utilizando un <DocsLink path="class/InteractionCollector"/>, o el método <DocsLink path="class/ChatInputCommandInteraction?scrollTo=awaitModalSubmit" /> a modo de promesa. Ambos proporcionan instancias de la clase <DocsLink path="class/ModalSubmitInteraction"/> como elementos recogidos.

Para obtener una guía detallada sobre la recepción de componentes de mensajes a través de recopiladores, consulte la [guía de recopiladores](/guide/popular-topics/collectors.md#interaction-collectors).

### El evento interactionCreate

Para recibir un evento <DocsLink path="class/ModalSubmitInteraction"/>, adjunta un receptor de eventos <DocsLink path="class/Client?scrollTo=e-interactionCreate"/> a su cliente y usa la protección de tipado <DocsLink path="class/BaseInteraction?scrollTo=isModalSubmit"/> para asegurarte de que solo recibe modales:

```js {1,4}
client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isModalSubmit()) return;
	console.log(interaction);
});
```

## Responder a los envíos de modales

La clase <DocsLink path="class/ModalSubmitInteraction"/> proporciona los mismos métodos que la clase <DocsLink path="class/ChatInputCommandInteraction"/>. Estos métodos se comportan igual:
- `reply()`
- `editReply()`
- `deferReply()`
- `fetchReply()`
- `deleteReply()`
- `followUp()`

Si el modal se mostró desde un <DocsLink path="class/ButtonInteraction"/> o <DocsLink path="class/StringSelectMenuInteraction"/>, también proporcionará estos métodos, que se comportan igual:
- `update()`
- `deferUpdate()`

```js{1,3-5}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'miModal') {
		await interaction.reply({ content: '¡Tu envío se ha recibido correctamente!' });
	}
});
```

::: tip CONSEJO
Si estás usando typescript, puedes usar la protección de tipado <DocsLink path="class/ModalSubmitInteraction?scrollTo=isFromMessage"/>, para asegurarte de que la interacción recibida proviene de un `MessageComponentInteraction`.
:::

## Extrayendo datos desde un modal recibido

Lo más probable es que necesites leer los datos enviados por el usuario en el modal. Puedes hacerlo accediendo al <DocsLink path="class/ModalSubmitInteraction?scrollTo=fields"/>. Desde ahí puedes llamar a <DocsLink path="class/ModalSubmitFields?scrollTo=getTextInputValue"/> con el id personalizado de la entrada de texto para obtener el valor.

```js{5-7}
client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isModalSubmit()) return;

	// Obtener los datos introducidos por el usuario
	const favoriteColor = interaction.fields.getTextInputValue('entradaColorFavorito');
	const hobbies = interaction.fields.getTextInputValue('entradaPasatiempos');
	console.log({ favoriteColor, hobbies });
});
```
