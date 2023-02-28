# Autocompletar

`Autocomplete` le permite proporcionar dinámicamente una selección de valores al usuario, basándose en su entrada, en lugar de depender de opciones estáticas. En esta sección veremos cómo añadir la función de autocompletar a tus comandos.

::: tip
Esta página es una continuación de la sección [creación de comandos avanzados](/slash-commands/advanced-creation.md) que trata de las opciones y de la elección de opciones. Por favor, lea atentamente esas páginas primero para que pueda entender los métodos utilizados en esta sección.
:::

## Activar autocompletar

Para utilizar el autocompletado con sus comandos, *en lugar* de listar las opciones estáticas, la opción debe configurarse para utilizar el autocompletado utilizando <DocsLink section="builders" path="class/SlashCommandStringOption?scrollTo=setAutocomplete" type="method" />:

```js {9}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('guide')
	.setDescription('Busca en discordjs-guide-es.netlify.app!')
	.addStringOption(option =>
		option.setName('query')
			.setDescription('Frase a buscar')
			.setAutocomplete(true));
```

## Respuesta a las interacciones de autocompletar

Para manejar un <DocsLink path="class/AutocompleteInteraction"/>, utilice la protección de tipo (`type guard`) <DocsLink path="class/BaseInteraction?scrollTo=isAutocomplete"/> para asegurarse de que la instancia de interacción es una interacción de autocompletar. Puedes hacer esto en un listener `interactionCreate` separado:

<!-- eslint-skip -->

```js
client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isAutocomplete()) return;
	// gestión de autocompletar
});
```

O alternativamente, haciendo un pequeño cambio en tu [manejador de comandos](/creating-your-bot/command-handling.md) y añadiendo un método adicional a tus archivos de comandos individuales.

El siguiente ejemplo muestra cómo podría aplicarse esto a una versión conceptual del comando `guide` para determinar el tema más cercano a la entrada de búsqueda:

:::: code-group
::: code-group-item index.js
```js {4,13}
client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
		// manejo de comandos
	} else if (interaction.isAutocomplete()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No se ha encontrado ningún comando que coincida con ${interaction.commandName}.`);
			return;
		}

		try {
			await command.autocomplete(interaction);
		} catch (error) {
			console.error(error);
		}
	}
});
```
:::
::: code-group-item commands/guide.js
```js
module.exports = {
	data: new SlashCommandBuilder()
		.setName('guide')
		.setDescription('Busca en discordjs-guide-es.netlify.app!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Frase a buscar')
				.setAutocomplete(true)),
	async autocomplete(interaction) {
		// gestiona la respuesta de autocompletado (más adelante se explica cómo hacerlo)
	},
	async execute(interaction) {
		// responder al comando de barra completo
	},
};
```
:::
::::

El manejo de los comandos es casi idéntico, pero fíjate en el cambio de `execute` a `autocomplete` en la nueva rama else-if. Añadiendo una función `autocomplete` separada al `module.exports` de los comandos que requieren autocompletado, puedes separar de forma segura la lógica de proporcionar opciones dinámicas del código que necesita responder al comando slash una vez que se ha completado.

:::tip
Puede que ya hayas movido este código a `events/interactionCreate.js` si también has seguido nuestra guía [Manejo de eventos](/creating-your-bot/event-handling.md).
:::

### Envío de resultados

La clase <DocsLink path="class/AutocompleteInteraction"/> proporciona el método <DocsLink path="class/AutocompleteInteraction?scrollTo=respond"/> para enviar una respuesta. Usando esto, puede enviar una matriz de objetos <DocsLink path="typedef/ApplicationCommandOptionChoiceData" /> para que el usuario elija. Si se pasa una matriz vacía, se mostrará al usuario el mensaje "No hay opciones que coincidan con su búsqueda".

::: warning
A diferencia de las opciones estáticas, las sugerencias de autocompletado *no* son obligatorias, y los usuarios pueden introducir texto libre.
:::

El método <DocsLink path="class/CommandInteractionOptionResolver?scrollTo=getFocused" /> devuelve el valor de la opción actualmente enfocada, que puede utilizarse para aplicar filtros a las opciones presentadas. Por ejemplo, para mostrar sólo las opciones que comienzan con el valor enfocado se puede utilizar el método `Array#filter()`, luego utilizando `Array#map()`, se puede transformar el array en un array de objetos <DocsLink path="typedef/ApplicationCommandOptionChoiceData" />.

```js {10-15}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('guide')
		.setDescription('Buscar en discordjs-guide-es.netlify.app!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Frase a buscar')
				.setAutocomplete(true)),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const choices = ['Temas populares: Threads', 'Sharding: Primeros pasos', 'Biblioteca: Conexiones de voz', 'Interacciones: Responder a comandos de barra", "Temas populares: Incrustar vista previa'];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
};
```

### Manejo de múltiples opciones de autocompletar

To distinguish between multiple options, you can pass `true` into <DocsLink path="class/CommandInteractionOptionResolver?scrollTo=getFocused"/>, which will now return the full focused object instead of just the value. This is used to get the name of the focused option below, allowing for multiple options to each have their own set of suggestions:

```js {10-19}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('guide')
		.setDescription('Busca en discordjs-guide-es.netlify.app!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Frase a buscar')
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('version')
				.setDescription('Version en la que buscar')
				.setAutocomplete(true)),
	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);
		let choices;

		if (focusedOption.name === 'query') {
			choices = ['Temas populares: Threads', 'Sharding: Primeros pasos', 'Biblioteca: Conexiones de voz', 'Interacciones: Responder a comandos de barra", "Temas populares: Incrustar vista previa'];
		}

		if (focusedOption.name === 'version') {
			choices = ['v9', 'v11', 'v12', 'v13', 'v14'];
		}

		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
};
```

### Acceso a otros valores

Además de filtrar basándose en el valor enfocado, puede que también desee cambiar las opciones mostradas basándose en el valor de otros argumentos del comando. Los siguientes métodos funcionan igual en <DocsLink path="class/AutocompleteInteraction"/>:

```js
const string = interaction.options.getString('input');
const integer = interaction.options.getInteger('int');
const boolean = interaction.options.getBoolean('choice');
const number = interaction.options.getNumber('num');
```

Sin embargo, los métodos `.getUser()`, `.getMember()`, `.getRole()`, `.getChannel()`, `.getMentionable()` y `.getAttachment()` no están disponibles para autocompletar interacciones. Discord no envía los respectivos objetos completos para estos métodos hasta que se completa el comando de barra. Para estos, puedes obtener el valor Snowflake usando `interaction.options.get('option').value`:

### Notas

- Al igual que con otras interacciones de comandos de aplicación, las interacciones de autocompletar deben recibir una respuesta antes de 3 segundos. 
- No se puede aplazar la respuesta a una interacción de autocompletar. Si se trata de sugerencias asíncronas, como las procedentes de una API, considere la posibilidad de mantener una caché local.
- Después de que el usuario seleccione un valor y envíe el comando, se recibirá como un <DocsLink path="class/ChatInputCommandInteraction" /> normal con el valor elegido.
- Sólo se puede responder con un máximo de 25 opciones a la vez, aunque más que esto probablemente significa que usted debe revisar su filtro para reducir aún más las selecciones.
