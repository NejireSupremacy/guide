# Archivos de configuración

Una vez que hayas [añadido tu bot a un servidor](/preparations/adding-your-bot-to-servers.html#agregando-tu-bot-a-servidores), ¡el siguiente paso es empezar a escribir su código y ponerlo online! Empecemos creando un archivo de configuración para tu token de cliente y un archivo principal para tu aplicación bot.

Como se explica en la sección [&#34;¿Qué es un token?&#34;](/preparations/setting-up-a-bot-application.html#¿que-es-un-token), tu token es esencialmente la contraseña de tu bot, y deberías protegerlo lo mejor posible. Esto se puede hacer a través de un archivo config.json o mediante el uso de variables de entorno.

Abre tu aplicación en el [Portal del Desarrolladores de Discord](https://discord.com/developers/applications) y ve a la página "Bot" para copiar tu token.

## Uso de `config.json`

Almacenar datos en un archivo `config.json` es una forma común de mantener seguros tus valores sensibles. Crea un archivo `config.json` en el directorio de tu proyecto y pega tu token. Puedes acceder a tu token dentro de otros archivos usando `require()`.

:::: code-group
::: code-group-item config.json

```json
{
	"token": "tu-token-va-aquí"
}
```

:::
::: code-group-item Usage

```js
const { token } = require('./config.json');

console.log(token);
```

:::
::::

::: danger CUIDADO
Si estás usando Git, no deberías insertar este archivo y deberías [ignorarlo mediante `.gitignore`](/creating-your-bot/#git-y-gitignore).
:::

## Uso de variables de entorno

Las variables de entorno son valores especiales para tu entorno (por ejemplo, sesión de terminal, contenedor Docker o archivo de variables de entorno). Puedes pasar estos valores al ámbito de tu código para poder utilizarlos.

Una forma de pasar variables de entorno es a través de la interfaz de línea de comandos. Cuando inicies tu aplicación, en lugar de `node index.js`, utiliza `TOKEN=tu-token-va-aquí node index.js`. Puedes repetir este patrón para exponer también otros valores.

Puedes acceder a los valores establecidos en tu código a través de la variable global `process.env`, accesible en cualquier archivo. Ten en cuenta que los valores pasados de esta manera siempre serán cadenas y que puede que necesites parsearlos a un número, si los usas para hacer cálculos.

:::: code-group
::: code-group-item Command line

```sh:no-line-numbers
A=123 B=456 DISCORD_TOKEN=tu-token-va-aquí node index.js
```

:::
::: code-group-item Usage

```js
console.log(process.env.A);
console.log(process.env.B);
console.log(process.env.DISCORD_TOKEN);
```

:::
::::

### Uso de dotenv

Otro enfoque común es almacenar estos valores en un archivo `.env`. Esto evita tener que copiar siempre el token en la línea de comandos. Cada línea en un archivo `.env` debe contener un `KEY=value` (LLAVE=valor).

Para ello puedes utilizar el [módulo `dotenv`](https://www.npmjs.com/package/dotenv). Una vez instalado, requiere y utiliza el paquete para cargar tu archivo `.env` y adjuntar las variables a `process.env`:

:::: code-group
::: code-group-item npm

```sh:no-line-numbers
npm install dotenv
```

:::
::: code-group-item yarn

```sh:no-line-numbers
yarn add dotenv
```

:::
::: code-group-item pnpm

```sh:no-line-numbers
pnpm add dotenv
```

:::
::::

:::: code-group
::: code-group-item .env

```
A=123
B=456
DISCORD_TOKEN=tu-token-va-aquí
```

:::
::: code-group-item Usage

```js
const dotenv = require('dotenv');

dotenv.config();

console.log(process.env.A);
console.log(process.env.B);
console.log(process.env.DISCORD_TOKEN);
```

:::
::::

::: danger CUIDADO
Si estás usando Git, no deberías insertar este archivo y deberías [ignorarlo mediante `.gitignore`](/creating-your-bot/#git-y-gitignore).
:::

::: details Editores en línea (Glitch, Heroku, Replit, etc.)
Aunque por lo general no recomendamos utilizar editores en línea como soluciones de alojamiento, sino invertir en un servidor privado virtual adecuado, estos servicios también ofrecen formas de mantener a salvo tus credenciales. Consulte la documentación y los artículos de ayuda de cada servicio para obtener más información sobre cómo mantener a salvo los valores confidenciales:

- Glitch: [Storing secrets in .env](https://glitch.happyfox.com/kb/article/18)
- Heroku: [Configuration variables](https://devcenter.heroku.com/articles/config-vars)
- Replit: [Secrets and environment variables](https://docs.replit.com/repls/secrets-environment-variables)
  :::

## Git y `.gitignore`

Git es una herramienta fantástica para hacer un seguimiento de tus cambios de código y te permite subir el progreso a servicios como [GitHub](https://github.com/), [GitLab](https://about.gitlab.com/) o [Bitbucket](https://bitbucket.org/product). Aunque esto es super útil para compartir código con otros desarrolladores, ¡también conlleva el riesgo de subir tus archivos de configuración con valores sensibles!

Puedes especificar archivos que Git debería ignorar en sus sistemas de versionado con un archivo `.gitignore`. Crea un archivo `.gitignore` en el directorio de tu proyecto y añade los nombres de los archivos y carpetas que quieras ignorar:

```
node_modules
.env
config.json
```

::: tip CONSEJO
Aparte de mantener las credenciales seguras, `node_modules` debería incluirse aquí. Dado que este directorio se puede restaurar basándose en las entradas de los archivos `package.json` y `package-lock.json` ejecutando `npm install`, no es necesario incluirlo en Git.

Puedes especificar patrones bastante emredados en los archivos `.gitignore`, ¡consulta la [en la publicación en freecodecamp sobre `.gitignore`](https://www.freecodecamp.org/espanol/news/gitignore-explicado-que-es-y-como-agregar-a-tu-repositorio) para más información!
:::
