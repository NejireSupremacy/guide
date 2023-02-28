# Manejo de comandos

A menos que tu proyecto bot sea pequeño, no es muy buena idea tener un único archivo con una cadena gigante `if`/`else if` o `switch` para los comandos. Si quieres implementar características en tu bot y hacer tu proceso de desarrollo mucho menos doloroso, querrás implementar un manejador de comandos. ¡Empecemos con ello!

## Cargando archivos de comando

Ahora que tus archivos de comandos han sido creados, tu bot necesita cargar estos archivos al inicio.

En tu archivo `index.js`, haz estas adiciones a la plantilla base:

```js
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ 
	intents: [GatewayIntentBits.Guilds] 
});

client.commands = new Collection();
```

Recomendamos adjuntar una propiedad `.commands` a su instancia de cliente para que pueda acceder a sus comandos en otros archivos. El resto de los ejemplos de esta guía seguirán esta convención. Para los usuarios de TypeScript, recomendamos extender la clase Client base para añadir esta propiedad, [casting](https://midu.dev/type-casting-typescript/), o [expandir los types de cierto módulo](https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules).

::: tip

- El módulo [`fs`](https://nodejs.org/api/fs.html) es el módulo nativo del sistema de archivos de Node. `fs` se utiliza para leer el directorio `commands` e identificar nuestros archivos de comandos.
- El módulo [`path`](https://nodejs.org/api/path.html) es el módulo nativo de utilidad de rutas de Node. `path` ayuda a construir rutas para acceder a archivos y directorios. Una de las ventajas del módulo `path` es que detecta automáticamente el sistema operativo y utiliza los joiners apropiados.
- La clase `<DocsLink section="collection" path="class/Collection" />` extiende la clase nativa de JavaScript [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), e incluye una funcionalidad más extensa y útil. La clase `Collection` se utiliza para almacenar y recuperar eficientemente comandos para su ejecución.
  :::

A continuación, utilizando los módulos importados anteriormente, recupera dinámicamente tus archivos de comandos con algunas adiciones más al archivo `index.js`:

```js
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Establecer un nuevo elemento en la colección, siendo la llave el nombre del comando y el valor el módulo exportado.
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[ADVERTENCIA] El comando en ${filePath} le falta una propiedad "data" o "execute".`);
	}
}
```

Primero, [`path.join()`](https://nodejs.org/api/path.html) ayuda a construir una ruta al directorio `commands`. A continuación, el método [`fs.readdirSync()`](https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options) lee la ruta al directorio y devuelve una lista con todos los nombres de archivos que contiene, actualmente `['ping.js', 'server.js', 'user.js']`. Para garantizar que sólo se procesan los archivos de comandos, `Array.filter()` elimina cualquier archivo no JavaScript de la matriz.

Una vez identificados los archivos correctos, el último paso es recorrer la matriz y colocar dinámicamente cada comando en la colección `client.commands`. Para cada archivo que se carga, comprueba que tiene al menos las propiedades `data` y `execute`. Esto ayuda a prevenir errores resultantes de la carga de archivos de comandos vacíos, inacabados o incorrectos mientras aún estás desarrollando.

## Recibiendo comandos

Cada comando de barra es una `interacción`, así que para responder a un comando, necesitas crear un listener para el evento `<DocsLink path="class/Client?scrollTo=e-interactionCreate" />` que ejecutará código cuando tu aplicación reciba una interacción. Coloca el siguiente código en el archivo `index.js` que creaste anteriormente.

```js
client.on(Events.InteractionCreate, interaction => {
	console.log(interaction);
});
```

No todas las interacciones son comandos de barra (por ejemplo, las interacciones `MessageComponent`). Asegúrate de manejar sólo comandos de barra en esta función haciendo uso del método `<DocsLink path="class/BaseInteraction?scrollTo=isChatInputCommand" />` para salir del manejador si se encuentra otro tipo. Este método también proporciona protección tipográfica para los usuarios de TypeScript, reduciendo el tipo de `BaseInteraction` a `<DocsLink path="class/ChatInputCommandInteraction" />`.

```js
client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
});
```

## Ejecutando comandos

Cuando tu bot recibe un evento `<DocsLink path="class/Client?scrollTo=e-interactionCreate" />`, el objeto de interacción contiene toda la información que necesitas para recuperar y ejecutar dinámicamente tus comandos.

Veamos de nuevo el comando `ping`. Observa la función `execute()` que responderá a la interacción con "¡Pong!".

```js
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responde con Pong! 🏓'),
	async execute(interaction) {
		await interaction.reply('Pong! 🏓');
	},
};

```

En primer lugar, debe obtener el comando correspondiente de la colección `client.commands` basándose en `interaction.commandName`. Su instancia `<DocsLink path="class/Client">Client``</DocsLink>` está siempre disponible a través de `interaction.client`. Si no se encuentra ningún comando que coincida, registra un error en la consola e ignora el evento.

Con el comando correcto identificado, todo lo que queda por hacer es llamar al método `.execute()` del comando y pasar la variable `interaction` como parametro. En caso de que algo vaya mal, captura y registra cualquier error en la consola.

```js
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No se ha encontrado ningún comando que coincida con ${interaction.commandName}.`);
		return;
	}

	await command.execute(interaction).catch(async error => {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Se ha producido un error al ejecutar este comando!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'Se ha producido un error al ejecutar este comando.', ephemeral: true });
		}
	});
});
```

#### Siguientes pasos

Tus archivos de comandos ya están cargados en tu bot, y el receptor de eventos está preparado y listo para responder. En la siguiente sección, cubriremos el paso final: un script de despliegue de comandos que necesitarás para registrar tus comandos y que aparezcan en el cliente de Discord.

#### Resultado final

<ResultingCode path="creating-your-bot/command-handling" />

También incluye algunos comandos adicionales.
