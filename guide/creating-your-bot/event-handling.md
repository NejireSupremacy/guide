# Gestión de eventos

Node.js utiliza una arquitectura basada en eventos, lo que permite ejecutar código cuando se produce un evento específico. La librería discord.js saca el máximo partido de esto. Puedes visitar la documentación `<DocsLink path="class/Client" />` para ver la lista completa de eventos.

Si has seguido la guía hasta este punto, tu archivo `index.js` tendrá escuchas para dos eventos: `ClientReady` e `InteractionCreate`.

```js
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
	console.log(`¡Listo! Conectado como ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No se ha encontrado ningún comando que coincida con ${interaction.commandName}.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(`Error al ejecutar ${interaction.commandName}`);
		console.error(error);
	}
});

client.login(token);
```

Actualmente, los escuchadores de eventos están en el archivo `index.js`. `<DocsLink path="class/Client?scrollTo=e-ready" />` emite una vez cuando el `Client` está listo para su uso, y `<DocsLink path="class/Client?scrollTo=e-interactionCreate" />` emite cada vez que se recibe una interacción. Trasladar el código del receptor de eventos a archivos individuales es sencillo, y adoptaremos un enfoque similar al del [manejador de comandos](/creando-tu-bot/manejador-de-comandos.md).

## Archivos de eventos individuales

El directorio de tu proyecto debería tener este aspecto o parecido:

```:no-line-numbers
discord-bot/
├── commands
├── node_modules
├── config.json
├── deploy-commands.js
├── index.js
├── package-lock.json
└── package.json
```

Crea una carpeta `events` en el mismo directorio. A continuación, puede tomar su código de eventos existentes en `index.js` y moverlos a los archivos `events/ready.js` y `events/interactionCreate.js`.

:::: code-group
::: code-group-item events/ready.js

```js
const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`¡Listo! Conectado como ${c.user.tag}`);
	},
};
```

:::
::: code-group-item events/interactionCreate.js

```js
const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No se ha encontrado ningún comando que coincida con ${interaction.commandName}.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error al ejecutar ${interaction.commandName}`);
			console.error(error);
		}
	},
};
```

:::
::::

La propiedad `name` indica para qué evento es este archivo, y la propiedad `once` contiene un valor booleano que especifica si el evento debe ejecutarse sólo una vez. No necesitas especificar esto en `interactionCreate.js` ya que el comportamiento por defecto será ejecutarse en cada instancia del evento. La función `execute` contiene la lógica del evento, que será llamada por el manejador de eventos cada vez que el evento se emita.

## Leyendo archivos de eventos

A continuación, vamos a escribir el código para obtener dinámicamente todos los archivos de eventos en la carpeta `events`. Tomaremos un enfoque similar a nuestro [gestior de comandos](/creando-tu-bot/command-handling.md). Coloca el siguiente código en tu `index.js`.

`fs.readdirSync().filter()` devuelve una lista de todos los nombres de archivos en el directorio dado y filtra sólo los archivos `.js `, es decir, `['ready.js', 'interactionCreate.js']`.

```js
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
```

La clase `<DocsLink path="class/Client" />` en discord.js extiende la clase [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter). Por lo tanto, el objeto `client` expone los métodos [`.on()`](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener) y [`.once()`](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener) que puedes utilizar para registrar escuchadores de eventos. Estos métodos toman dos argumentos: el nombre del evento y una función callback.

La función callback pasada toma parametros devueltos por su respectivo evento, los recoge en un array `args` usando la `...` [sintaxis de parámetros de resto](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/rest_parameters), luego llama a `event.execute()` mientras pasa el array `args` usando la `...` [sintaxis de extensión](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax). Se utilizan aquí porque diferentes eventos en discord.js tienen diferentes números de argumentos. El parámetro rest recoge estos parametros en un único array, y el `spread operator` toma estos elementos y los pasa a la función  `execute`.

Después de esto, escuchar otros eventos es tan fácil como crear un nuevo archivo en la carpeta `events`. El manejador de eventos lo recuperará y registrará automáticamente cada vez que reinicies tu bot.

::: tip
En la mayoría de los casos, puedes acceder a tu instancia `client` en otros archivos obteniéndola de una de las otras estructuras de discord.js, por ejemplo `interaction.client` en el evento `interactionCreate`.
:::

## Resultado final

<ResultingCode />
