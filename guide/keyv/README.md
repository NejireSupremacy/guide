# Almacenando datos con Keyv

[Keyv](https://www.npmjs.com/package/keyv) es un almacén simple de tipo key-value (clave-valor) que funciona con múltiples backends. Es completamente escalable para el [sharding](/guide/sharding/) y soporta almacenamiento con JSON.

## Instalación

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install keyv
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add keyv
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add keyv
```
:::
::::

Keyv requiere una dependencia adicional en función del backend que quieras utilizar. Si quieres guardarlo todo en tu computadora, puedes saltarte esta parte. De lo contrario, instala uno de los siguientes:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install @keyv/redis
npm install @keyv/mongo
npm install @keyv/sqlite
npm install @keyv/postgres
npm install @keyv/mysql
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add @keyv/redis
yarn add @keyv/mongo
yarn add @keyv/sqlite
yarn add @keyv/postgres
yarn add @keyv/mysql
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add @keyv/redis
pnpm add @keyv/mongo
pnpm add @keyv/sqlite
pnpm add @keyv/postgres
pnpm add @keyv/mysql
```
:::
::::

Crea una instancia de Keyv una vez que hayas instalado Keyv y los controladores necesarios.

<!-- eslint-skip -->
```js
const Keyv = require('keyv');

// Uno de los siguientes
const keyv = new Keyv(); // para almacenamiento en tu computador
const keyv = new Keyv('redis://user:pass@localhost:6379');
const keyv = new Keyv('mongodb://user:pass@localhost:27017/dbname');
const keyv = new Keyv('sqlite://path/to/database.sqlite');
const keyv = new Keyv('postgresql://user:pass@localhost:5432/dbname');
const keyv = new Keyv('mysql://user:pass@localhost:3306/dbname');
```

Asegurate de gestionar errores de conexión.

```js
keyv.on('error', err => console.error('[Keyv] Error de conexión:', err));
```

Para una configuración más detallada, consulta el archivo [Keyv readme](https://github.com/jaredwray/keyv/tree/main/packages/keyv).

## Uso

Keyv ofrece una API similar a la de Map. Sin embargo, sólo cuenta con los métodos `set`, `get`, `delete` y `clear`. Además, en lugar de devolver datos inmediatamente, estos métodos devuelven [promesas](/guide/additional-info/async-await.md) que se resuelven con los datos.

```js
(async () => {
	// true
	await keyv.set('foo', 'bar');

	// bar
	await keyv.get('foo');

	// undefined
	await keyv.clear();

	// undefined
	await keyv.get('foo');
})();
```

## Aplicación

Aunque Keyv puede ayudarte en cualquier escenario en el que se necesiten datos clave-valor, nos centramos en la configuración de un prefijo por servidor utilizando Sqlite.

::: tip CONSEJO
Esta sección seguirá funcionando con cualquier proveedor compatible con Keyv. Recomendamos PostgreSQL para aplicaciones más grandes.
:::

### Configuración

```js
const Keyv = require('keyv');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { globalPrefix, token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const prefixes = new Keyv('sqlite://path/to.sqlite');
```

### Controlador de eventos

Esta guía usa un controlador de comandos muy básico con cierta complejidad añadida para permitir múltiples prefijos. Mira la guía de [manejo de comandos](/guide/creating-your-bot/command-handling.md) para un controlador de comandos más sólido.

```js
client.on(Events.MessageCreate, async message => {
	if (message.author.bot) return;

	let args;
	// gestor de mensajes en un servidor
	if (message.guild) {
		let prefix;

		if (message.content.startsWith(globalPrefix)) {
			prefix = globalPrefix;
		} else {
			// comprueba el prefijo de nivel del servidor
			const guildPrefix = await prefixes.get(message.guild.id);
			if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
		}

		// si encontramos un prefijo, configura args; de lo contrario, no es un comando
		if (!prefix) return;
		args = message.content.slice(prefix.length).trim().split(/\s+/);
	} else {
		// gestiona mensajes directos
		const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
		args = message.content.slice(slice).split(/\s+/);
	}

	// obtiene el primer argumento delimitado por espacios después del prefijo del comando
	const command = args.shift().toLowerCase();
});
```

### Comando con prefijo

Ahora que tienes un manejador de comandos, puedes hacer un comando para permitir que la gente use tu sistema de prefijos.

```js {3-11}
client.on(Events.MessageCreate, async message => {
	// ...
	if (command === 'prefix') {
		// si hay al menos un argumento, establece el prefijo
		if (args.length) {
			await prefixes.set(message.guild.id, args[0]);
			return message.channel.send(`Establecido con éxito el prefijo a \`${args[0]}\``);
		}

		return message.channel.send(`El prefijo es \`${await prefixes.get(message.guild.id) || globalPrefix}\``);
	}
});
```

Es probable que desee configurar una validación adicional, como los permisos requeridos y la longitud máxima del prefijo.

### Usage

<DiscordMessages>
	<DiscordMessage profile="user">
		.prefix
	</DiscordMessage>
	<DiscordMessage profile="bot">
		El prefijo es <DiscordMarkdown>`.`</DiscordMarkdown>
	</DiscordMessage>
	<DiscordMessage profile="user">
		.prefix $
	</DiscordMessage>
	<DiscordMessage profile="bot">
		Establecido con éxito el prefijo a <DiscordMarkdown>`$`</DiscordMarkdown>
	</DiscordMessage>
	<DiscordMessage profile="user">
		$prefix
	</DiscordMessage>
	<DiscordMessage profile="bot">
		El prefijo es <DiscordMarkdown>`$`</DiscordMarkdown>
	</DiscordMessage>
</DiscordMessages>

## Siguientes pasos

Muchas otras aplicaciones pueden usar Keyv, como la configuración de servidores; crea otra instancia con un [namepace](https://github.com/jaredwray/keyv/tree/main/packages/keyv#namespaces) diferente para cada configuración. Además, puede [extenderse](https://github.com/jaredwray/keyv/tree/main/packages/keyv#third-party-storage-adapters) para trabajar con cualquier backend de almacenamiento que prefieras.

Dale un vistazo al repositorio de [Keyv](https://github.com/jaredwray/keyv/tree/main/packages/keyv)) para más información

## Resultado final

<ResultingCode />
