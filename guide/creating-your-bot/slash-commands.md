# Creando comandos de barra

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong! 🏓
	</DiscordMessage>
</DiscordMessages>

Discord permite a los desarrolladores registrar [comandos de barra](https://discord.com/developers/docs/interactions/application-commands), que proporcionan a los usuarios una forma de primera clase de interactuar directamente con su aplicación.

Los comandos de barra proporcionan un gran número de beneficios sobre el análisis manual de mensajes, incluyendo:

- Integración con la interfaz de cliente de Discord.
- Detección automática de comandos y análisis de las opciones/argumentos asociados.
- Introducción de argumentos para las opciones de comandos, por ejemplo, "Cadena de carácteres", "Usuario" o "Rol".
- Opciones validadas o dinámicas para opciones de comandos.
- Respuestas privadas en el canal (mensajes efímeros).
- Formularios emergentes para obtener información adicional.

...and many more!

## Antes de continuar

Suponiendo que hayas seguido la guía hasta ahora, el directorio de tu proyecto debería tener este aspecto o parecido:

```:no-line-numbers
discord-bot/
├── node_modules
├── config.json
├── index.js
├── package-lock.json
└── package.json
```

Para pasar de este código inicial a comandos de barra completamente funcionales, hay tres piezas clave de código que necesitan ser escritas. Ellos son:

* Los archivos de comandos individuales, que contienen sus definiciones y funcionalidad.
* El manejador de comandos, que lee dinámicamente los archivos y ejecuta los comandos.
* El script de despliegue de comandos, para registrar tus comandos slash con Discord para que aparezcan en la interfaz.

Estos pasos pueden realizarse en cualquier orden, pero todos son necesarios antes de que los comandos sean completamente funcionales. Esta sección de la guía utilizará el orden indicado anteriormente. Así que, ¡empecemos!

## Archivos de comando individuales

Cree una nueva carpeta llamada `commands`, que es donde almacenará todos sus archivos de comandos. Utilizarás la clase `<DocsLink section="builders" path="class/SlashCommandBuilder" />` para construir las definiciones de los comandos.

Como mínimo, la definición de un comando de barra debe tener un nombre y una descripción. Los nombres de las órdenes de barra deben tener entre 1 y 32 caracteres y no deben contener mayúsculas, espacios ni símbolos distintos de `-` y `_`. Utilizando el constructor, una definición simple de una orden `ping` tendría este aspecto:

```js
new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Responde con Pong! 🏓');
```

Un comando de barra también requiere una función que se ejecute cuando se utiliza el comando, para responder a la interacción. El uso de un método de respuesta a la interacción confirma a Discord que tu bot ha recibido correctamente la interacción y ha respondido al usuario. Discord impone esto para garantizar que todos los comandos de barra proporcionen una buena experiencia de usuario (UX). Si no respondes, Discord mostrará que el comando ha fallado, aunque tu bot esté realizando otras acciones como resultado.

La forma más sencilla de reconocer y responder a una interacción es el método `interaction.reply()`. Otros métodos de respuesta se tratan en la página [Métodos de respuesta](/slash-commands/response-methods.md) más adelante en esta sección.

<!-- eslint-skip -->

```js
async execute(interaction) {
	await interaction.reply({ content: 'Pong! 🏓' });
}
```

Junta estos dos creando un archivo `commands/ping.js` para tu primer comando. Dentro de este archivo, vas a definir y exportar dos elementos.

- La propiedad `data`, que proporcionará la definición del comando que se muestra arriba para registrarse en Discord.
- El método `execute`, que contendrá la funcionalidad a ejecutar desde nuestro manejador de eventos cuando se utilice el comando.

Estos se colocan dentro de `module.exports` (CommonJS) para que puedan ser leídos por otros archivos; a saber, el cargador de comandos y los scripts de despliegue de comandos mencionados anteriormente.

:::: code-group
::: code-group-item commands/ping.js

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responde con Pong! 🏓'),
	async execute(interaction) {
		await interaction.reply('Pong! 🏓');
	},
};
```

:::
::::

::: tip CONSEJO
[`module.exports`](https://nodejs.org/api/modules.html#modules_module_exports) es la forma por defecto de exportar datos en Node.js para que puedas [`require()`](https://nodejs.org/api/modules.html#modules_require_id) en otros archivos.

Si necesitas acceder a tu instancia de cliente desde dentro de un fichero de comandos, puedes hacerlo a través de `interaction.client`. Si necesita acceder a archivos externos, paquetes, etc., debe `require()` en la parte superior del archivo.
:::

Eso es todo para tu comando ping básico. A continuación hay ejemplos de dos comandos más que vamos a desarrollar a lo largo de la guía, así que crea dos archivos más para estos antes de continuar leyendo.

:::: code-group
::: code-group-item commands/user.js

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Proporciona información sobre el usuario.'),
	async execute(interaction) {
		// interaction.user es el objeto que representa al usuario que ejecutó el comando
		// interaction.member es el objeto GuildMember, que representa al usuario en el gremio específico
		const { user, member } = interaction;
		await interaction.reply(`This command was run by ${user.username}, who joined on ${member.joinedAt}.`);
	},
};
```

:::
::: code-group-item commands/server.js

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Proporciona información sobre el servidor.'),
	async execute(interaction) {
		// interaction.guild es el objeto que representa al servidor en el que se ejecutó el comando
		const { guild } = interaction;
		await interaction.reply(`This server is ${guild.name} and has ${guild.memberCount} members.`);
	},
};
```

:::
::::

#### Siguientes pasos

Puedes implementar comandos adicionales mediante la creación de archivos adicionales en la carpeta `commands`, pero estos tres son los que vamos a utilizar para los ejemplos a medida que avanzamos. Por ahora vamos a pasar al código que necesitarás para el manejo de comandos, para cargar los archivos y responder a las interacciones entrantes.

#### Resultado final

<ResultingCode path="creating-your-bot/slash-commands" />
