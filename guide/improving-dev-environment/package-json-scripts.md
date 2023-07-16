# Configurando scripts en tu package.json

Una forma fácil de ejecutar scripts como el script para iniciar tu bot, un script para limpiar los archivos de tu bot, o cualquier otro script que utilices, es almacenándolos en tu archivo `package.json`. Después de almacenar estos scripts en tu archivo `package.json`, puedes ejecutar el script `start` para iniciar tu bot o el script `lint` para detectar errores en tu código.

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm run start
npm run lint
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn run start
yarn run lint
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm run start
pnpm run lint
```
:::
::::

## Primeros pasos

::: tip CONSEJO
Antes de empezar, necesitarás tener un archivo `package.json`. Si aún no tienes un archivo `package.json`, puedes ejecutar el siguiente comando en la consola para generar uno.

<CodeGroup>
  <CodeGroupItem title="npm">

```sh:no-line-numbers
npm init -y
```

  </CodeGroupItem>
  <CodeGroupItem title="yarn">

```sh:no-line-numbers
yarn init -y
```

  </CodeGroupItem>
  <CodeGroupItem title="pnpm">

```sh:no-line-numbers
pnpm init
```

  </CodeGroupItem>
</CodeGroup>
:::

Si aún no has tocado tu archivo `package.json` (excluyendo la instalación de dependencias), tu archivo `package.json` debería tener un aspecto similar al siguiente:

```json
{
	"name": "mi-bot",
	"version": "1.0.0",
	"description": "¡Un bot de Discord!",
	"main": "index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"keywords": [],
	"author": "",
	"license": "ISC"
}
```

Acerquémonos más. Debajo de `main`, verás `scripts`. Ahí puedes especificar tus scripts. En esta guía, vamos a mostrar cómo iniciar tu bot usando un script `package.json`.

## Añadiendo tu primer script

::: tip CONSEJO
Supondremos que has terminado la sección [crear tu primer bot](/guide/creating-your-bot) de la guía. Si no lo has hecho, ¡asegúrate de seguirla primero!
:::

En tu archivo `package.json`, añade la siguiente línea a `scripts`:

```json
"start": "node ."
```

::: tip CONSEJO
El script `node .` ejecutará el archivo que hayas especificado en la entrada `main` de tu archivo `package.json`. Si aún no lo tienes configurado, ¡asegúrate de seleccionar el archivo principal de tu bot como `main`!
:::

Ahora, cada vez que ejecutes el script `start` en el directorio de tu bot, se ejecutará el comando `node .`.

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm run start
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn run start
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm run start
```
:::
::::

Vamos a crear otro script para eliminar la pelusa de su código a través de la línea de comandos.

::: tip CONSEJO
Si no tienes ESLint instalado globalmente, puedes usar [npx](https://alligator.io/workflow/npx/) para ejecutar el script ESLint para tu directorio local. Para más información sobre cómo configurarlo, puedes leer el sitio [aquí](https://alligator.io/workflow/npx/).
:::

Añade la siguiente línea a tus scripts:

```json
"lint": "eslint ."
```

Ahora, cada vez que ejecutes el script `lint`, ESLint limpiará tu archivo `index.js`.

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm run lint
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn run lint
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm run lint
```
:::
::::

Su archivo `package.json` debería tener ahora un aspecto similar al siguiente:

```json
{
	"name": "mi-bot",
	"version": "1.0.0",
	"description": "¡Un bot de Discord!",
	"main": "index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1",
		"start": "node .",
		"lint": "eslint ."
	},
	"keywords": [],
	"author": "",
	"license": "ISC"
}
```

Y ya está. Siempre se puede añadir más secuencias de comandos ahora, ejecutándolos con:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm run <script-name>
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn run <script-name>
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm run <script-name>
```
:::
::::

::: tip CONSEJO
Los scripts de paquetes permiten algunas configuraciones más (como scripts de pre, post y ciclo de vida) de las que podemos cubrir en esta guía. Consulta la documentación oficial en [docs.npmjs.com](https://docs.npmjs.com/cli/v7/using-npm/scripts) para obtener más información.
:::
