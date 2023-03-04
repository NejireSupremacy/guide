# Paquetes útiles

## Day.js

::: tip CONSEJO
Documentaciín oficial: [https://day.js.org/](https://day.js.org/en)
:::

Day.js es un poderoso paquete que analiza, valida, manipula y muestra fechas y horas en JavaScript.
Te permite dar formato a las fechas de la forma que se desee o convertir string en objetos Date de JavaScript de forma rápida y sencilla.
Hay muchos plugins para él que le permiten trabajar con duraciones y más.

Por ejemplo, si quieres pedir a tus usarios que te den una fecha,
puedes utilizar Day.js para convertirlo en un objeto Date que puedas utilizar en tu código:

<!-- eslint-skip -->
```js
const input = await interaction.channel.awaitMessages({ 
	filter: m => m.author.id === interaction.user.id, 
	max: 1,
	time: 10e3,
	errors: ['time'],
});
const date = dayjs(input.first().content).toDate();
```

Uso del plugin [duration](https://day.js.org/docs/en/durations/durations), podría indicar al usuario si la fecha es del pasado o del futuro:

```js
if (date.isValid()) {
	const now = dayjs();
	const duration = date - now;
	const formatted = dayjs.duration(duration, 'ms').format();

	if (duration > 0) {
		interaction.reply(`La fecha que me diste es ${formatted} en el futuro.`);
	} else {
		interaction.reply(`La fecha que me dist ees ${formatted} en el pasado.`);
	}
} else {
	interaction.reply('No me diste una fecha válida.');
}
```

## ms

::: tip CONSEJO
Documentación oficial: [https://github.com/vercel/ms](https://github.com/vercel/ms)
:::

Ms es otra herramienta para trabajar con tiempos en JavaScript. Sin embargo, ms se especializa en duraciones.
Permite convertir tiempos en milisegundos en formatos legibles por humanos y viceversa.

Ejemplo:

<!-- eslint-skip -->
```js
await interaction.reply('Envía dos mensajes y te diré con qué diferencia de tiempo los has enviado.');
const messages = await interaction.channel.awaitMessages({
	filter: m => m.author.id === interaction.user.id,
	max: 2,
	time: 30e3,
	errors: ['time'],
});

const difference = messages.last().createdTimestamp - messages.first().createdTimestamp;
const formatted = ms(difference);

await interaction.followUp(`Enviaste los dos mensajes con una diferencia de ${formatted}.`);
```

## Etiquetas comunes

::: tip CONSEJO
Documentación oficial: [https://github.com/zspecza/common-tags](https://github.com/zspecza/common-tags)
:::

Common-tags es una biblioteca que trabaja con literales de plantilla.  
Hasta ahora, probablemente sólo los has usado para interpolar variables en tus strings, pero pueden hacer mucho más.
Si tienes tiempo, deberías echar un vistazo a [la documentación de MDN sobre *literales etiquetados*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates).

¿Alguna vez te ha molestado que tus strings multi-línea tuvieran desagradables trozos de sangría en ellas,
pero no quería eliminar la sangría en su código fuente?  
common-tags es la solución:

```js
const packageName = 'common-tags';

if (someCondition) {
	const poem = stripIndents`
		Me gusta ${packageName}.
		Hace que mis strings sean tan bonitas,
		tú también deberías usarlo.
	`;

	console.log(poem);
}
```

Esto imprimirá tu pequeño poema como se espera, pero no tendrá ningún tabulador u otro espacio en blanco a la izquierda.

Pero esto es sólo el principio. Otro conjunto de funciones útiles son las relacionadas con las listas:
`inlineLists`, `commaLists`, etc.  
Con ellos, puedes interpolar fácilmente arrats en tus strings sin que se vean feos:

```js
const options = ['añada', 'elimine', 'edite'];

// -> ¿Quieres que añada, elimine o edite el canal?
interaction.reply(oneLineCommaListsOr`
	¿Quieres que ${options} el canal?
`);
```

Consulte la documentación para encontrar más funciones útiles.

## chalk

::: tip
Documentación oficial: [https://www.npmjs.com/package/chalk](https://www.npmjs.com/package/chalk)
:::

Chalk no es exactamente útil para los bots de Discord, pero hará que la salida de tu terminal sea mucho más bonita y organizada.
Este paquete le permite colorear y dar estilo a su `console.log` de muchas maneras diferentes; No más simple blanco sobre negro.

Digamos que quieres que tus mensajes de error sean fácilmente visibles; démosles un bonito color rojo:

```js
console.error(chalk.redBright('FATAL ERROR'), '¡Algo muy malo sucedió!');
```

![image of code above](./images/chalk-red.png)

También puedes encadenar varios multiplicadores diferentes.
Si quiere que el texto sea verde, el fondo gris y todo subrayado, es posible:

```js
console.log(chalk.green.bgBrightBlack.underline('Esto es muy hermoso.'));
```

![image of code above](./images/chalk-ugly.png)

## pino

::: tip
Documentación oficial: [getpino.io](https://getpino.io)
:::

Pino es un "logger" de Node.js con una sobrecarga muy baja. ¿Pero por qué importa eso, si `console.log()` existe? Bueno, `console.log()` es bastante lento y poco versátil. Cada vez que haces una llamada a `console.log()` tu programa se detiene y no puede hacer nada hasta que el registro haya terminado.

Para empezar, instala el paquete:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install pino@next
npm install -g pino-pretty
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add pino@next
yarn global add pino-pretty
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add pino@next
pnpm add --global pino-pretty
```
:::
::::

Pino es altamente configurable, por lo que te recomendamos encarecidamente que eches un vistazo a su documentación por ti mismo.

Para usar el mismo "logger" en todo el proyecto puedes poner el siguiente código en tu propio archivo, por ejemplo `logger.js` e importarlo cuando sea necesario:

```js
const pino = require('pino');
const logger = pino();
module.exports = logger;
```

```js
const { Client, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const logger = require('./logger');

client.on(Events.ClientReady, () => logger.info('El bot está en línea.'));
client.on(Events.Debug, m => logger.debug(m));
client.on(Events.Warn, m => logger.warn(m));
client.on(Events.Error, m => logger.error(m));

client.login('tu-token-va-aquí');
```

Pino registra en un formato json, por lo que otros programas y servicios como agregadores de registro pueden fácilmente analizar y trabajar con la salida. Esto es muy útil para los sistemas en producción, pero bastante tedioso de leer durante el desarrollo. Esta es la razón por la que instalaste `pino-pretty` antes. En lugar de formatear la salida del registro por sí mismo, los desarrolladores recomiendan [pipe](https://en.wikipedia.org/wiki/Pipeline_(Unix)). `pino-pretty` es un formateador que puedes usar para facilitar la lectura de los "logs" durante el desarrollo.

Te recomendamos que configures `pino-pretty` en un script de paquete en tu archivo `package.json`, en lugar de escribir el pipeline cada vez. Por favor, lee nuestra [sección de la guía sobre mejorar el entorno de desarrollo](/improving-dev-environment/package-json-scripts) si no estás seguro de lo que estamos hablando aquí.

```json {10}
{
	"name": "my-bot",
	"version": "1.0.0",
	"description": "¡Un bot de Discord!",
	"main": "index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1",
		"start": "node .",
		"lint": "eslint .",
		"dev": "node . | pino-pretty -i pid,hostname -t 'yyyy-mm-dd HH:MM:ss'"
	},
	"keywords": [],
	"author": "",
	"license": "ISC"
}
```

:::warning
Si está utilizando powershell, tendrás que utilizar un script de paquete para `pino-pretty`. Powershell maneja las canalizaciones de una manera que impide el registro. La interfaz de línea de comandos cmd no se ve afectada.
:::

En el ejemplo anterior, se pasan más argumentos a `pino-pretty` para modificar la salida generada. `-i pid,hostname` oculta estos dos elementos de las líneas registradas y `-t yyyy-mm-dd HH:MM:ss` formatea la marca de tiempo en un formato fácil de usar. Pruebe lo que más le convenga. La documentación oficial [pino-pretty documentation](https://github.com/pinojs/pino-pretty) explica todos los argumentos posibles.

Para iniciar tu bot con la entrada preconfigurada, ejecuta el script `dev` a través del gestor de paquetes que prefieras:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm run dev
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn run dev
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm run dev
```
:::
::::

Pino es muy flexible, soporta niveles de registro personalizados, hilos de trabajo y muchas más características. Por favor, echa un vistazo a la [documentación oficial](https://getpino.io) si quieres mejorar Pino. A continuación mostramos una alternativa para una configuración de producción. Usando este código, estarás registrando los objetos json sin procesar en un archivo, en lugar de imprimirlos en tu consola:

```js {2-6}
const pino = require('pino');
const transport = pino.transport({
	target: 'pino/file',
	options: { destination: './log.json' },
});
const logger = pino(transport);
module.exports = logger;
```

## i18next

::: tip CONSEJO
Documentación oficial: [https://www.i18next.com](https://www.i18next.com)
:::

i18next es un marco de internacionalización para JavaScript. Es ideal para traducir los mensajes de tu bot a varios idiomas en base al servidor en el que se utiliza.

Explicar en detalle un caso práctico de internacionalización quedaría fuera del alcance de esta guía y requeriría más explicaciones sobre el funcionamiento del sistema. Consulte la documentación oficial enlazada más arriba para obtener una guía de uso más detallada.
