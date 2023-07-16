# Analizando opciones

## Opciones de comando

En esta sección, cubriremos cómo acceder a los valores de las opciones de un comando. Considere el siguiente ejemplo de comando `ban` con dos opciones:

```js {7-15}
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Seleccione un miembro y prohíbalo.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('El miembro a banear')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('La razón de la banear'))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false),
};
```

En el método de ejecución, puede recuperar el valor de estas dos opciones de `CommandInteractionOptionResolver` como se muestra a continuación:

```js {4-8}
module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No se proporcionó ninguna razón';

		await interaction.reply(`Baneando a ${target.username} por la razón: ${reason}`);
		await interaction.guild.members.ban(target);
	},
};
```

Dado que `reason` no es una opción obligatoria, el ejemplo anterior utiliza el `??` [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) para establecer un valor predeterminado en caso de que el usuario no proporcione un valor por `reason`.

Si el usuario objetivo todavía está en el servidor donde se ejecuta el comando, también puedes usar `.getMember('target')` para obtener su objeto `GuildMember`.

::: tip CONSEJO
Si desea el Snowflake de una estructura, tome la opción a través de `get()` y acceda al Snowflake a través de la propiedad `value`. Tenga en cuenta que debe usar `const { value: name } = ...` aquí para [desestructurar y cambiar el nombre](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) el valor obtenido de la estructura <DocsLink path="typedef/CommandInteractionOption" /> para evitar conflictos de nombres de identificadores.
:::

De la misma manera que en los ejemplos anteriores, puede obtener valores de cualquier tipo utilizando el método `CommandInteractionOptionResolver#get_____()` correspondiente. Las opciones `String`, `Integer`, `Number` y `Boolean` proporcionan los respectivos tipos primitivos, mientras que las opciones `User`, `Channel`, `Role` y `Mentionable` proporcionarán la respectiva clase de discord.js instanciada si su aplicación tiene un usuario bot en el servidor o una estructura de API sin procesar para implementaciones de solo comandos.

### Opciones

Si especificó opciones preestablecidas para su opción String, Integer o Number, obtener la opción seleccionada es exactamente lo mismo que las opciones de entrada libre anteriores. Considere el ejemplo [comando gif](/slash-commands/advanced-creation.html#choices) que vio anteriormente:

```js {11-15,17}
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gif')
		.setDescription('¡Envía un gif al azar!')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('La categoría del gif')
				.setRequired(true)
				.addChoices(
					{ name: 'Funny', value: 'gif_funny' },
					{ name: 'Meme', value: 'gif_meme' },
					{ name: 'Movie', value: 'gif_movie' },
				));
	async execute(interaction) {
		const category = interaction.options.getString('category');
		// la categoría debe ser 'gif_funny', 'gif_meme' o 'gif_movie'
	},
};
```

Tenga en cuenta que nada cambia: todavía usa `getString()` para obtener el valor de elección. La única diferencia es que, en este caso, puede estar seguro de que es uno de los tres valores posibles.

### SubComandos

Si tiene un comando que contiene subcomandos, `CommandInteractionOptionResolver#getSubcommand()` le dirá qué subcomando se usó. A continuación, puede obtener cualquier opción adicional del subcomando seleccionado utilizando los mismos métodos anteriores.

El siguiente fragmento utiliza el mismo comando `info` de la [guía de creación de subcomandos](/slash-commands/advanced-creation.md#subcommands) para demostrar cómo puede controlar el flujo lógico al responder a diferentes subcomandos:

```js {4,12}
module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');

			if (user) {
				await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
			} else {
				await interaction.reply(`Tu username: ${interaction.user.username}\nTu ID: ${interaction.user.id}`);
			}
		} else if (interaction.options.getSubcommand() === 'server') {
			await interaction.reply(`Nombre del server: ${interaction.guild.name}\nTotal de miembros: ${interaction.guild.memberCount}`);
		}
	},
};
```
