## Instalando Node.js y discord.js

Para usar discord.js, necesitarás instalar [Node.js](https://nodejs.org/). discord.js v14 necesita de Node v16.9.0 o superior.

::: tip
Para comprobar si ya tienes Node instalado en tu máquina (por ejemplo, si estás usando un VPS), ejecuta `node -v` en tu terminal. Si el resultado es `v16.9.0` o superior, ¡entonces está listo! Si no, sigue leyendo.
:::

En Windows, es tan sencillo como instalar cualquier otro programa. Descarga la última versión desde [el sitio web de Node.js](https://nodejs.org/), abre el archivo descargado y sigue los pasos del instalador.

En macOS, por otro lado:

- Descargue la última versión desde [el sitio web de Node.js](https://nodejs.org/), abra el instalador del paquete y siga las instrucciones
- Utiliza un gestor de paquetes como [Homebrew](https://brew.sh/) con el comando `brew install node`

En Linux, puede consultar [esta página](https://nodejs.org/es/download/package-manager/) para determinar cómo debe instalar Node.

## Preparando lo esencial

Para usar discord.js, necesitarás instalarlo a través de npm (el gestor de paquetes de Node). npm viene con cada instalación de Node, así que no tienes que preocuparte de instalarlo. Sin embargo, antes de instalar nada, debes crear una nueva carpeta de proyecto.

Navega a un lugar adecuado en tu máquina y crea una nueva carpeta llamada `discord-bot` (o lo que quieras). A continuación tendrás que abrir tu terminal.

### Opening the terminal

::: tip
Si utilizas [Visual Studio Code](https://code.visualstudio.com/), puedes pulsar `<code>`Ctrl + `````</code>```` (comilla invertida) para abrir su terminal integrado.
:::

En Windows, por otro lado:

- Mayúsculas + Botón derecho del ratón dentro del directorio de su proyecto y elija la opción "Abrir en Terminal".
- Pulsa `Win + R` y ejecuta `cmd.exe`, y luego `cd` en el directorio de tu proyecto

En macOS, por otro lado:

- Abra Launchpad o Spotlight y busque "Terminal".
- En su carpeta "Aplicaciones", en "Utilidades", abra la aplicación Terminal

En Linux, puedes abrir rápidamente el terminal con `Ctrl + Alt + T`.

Con la terminal abierta, ejecuta el comando `node -v` para asegurarte de que has instalado correctamente Node.js. Si sale `v16.9.0` o superior, ¡genial!

### Iniciando el proyecto

:::: code-group
::: code-group-item npm

```sh:no-line-numbers
npm init
```

:::
::: code-group-item yarn

```sh:no-line-numbers
yarn init
```

:::
::: code-group-item pnpm

```sh:no-line-numbers
pnpm init
```

:::
::::

Ese es el siguiente comando que ejecutarás. Este comando crea un archivo `package.json` para ti, que mantendrá un registro de las dependencias que utiliza tu proyecto, así como otra información.

Ese comando te hará una secuencia de preguntas que deberás rellenar como mejor te parezca. Si no estás seguro de algo o quieres saltártelo entero, déjalo en blanco y pulsa enter.

::: tip
Para empezar rápidamente, puedes ejecutar el siguiente comando para que lo rellene todo por ti.

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

Una vez hecho esto, ¡ya puedes instalar discord.js!

## Instalando discord.js

Ahora que has instalado Node.js y sabes cómo abrir la consola y ejecutar comandos, ¡por fin puedes instalar discord.js! Ejecuta el siguiente comando en tu terminal:

:::: code-group
::: code-group-item npm

```sh:no-line-numbers
npm install discord.js
```

:::
::: code-group-item yarn

```sh:no-line-numbers
yarn add discord.js
```

:::
::: code-group-item pnpm

```sh:no-line-numbers
pnpm add discord.js
```

:::
::::

Y ya está. Con todo lo necesario instalado, estás casi listo para empezar a codificar tu bot.

## Instalando un linter

Mientras escribes tu código, es posible que te encuentres con numerosos errores de sintaxis o que escribas con un estilo incoherente. Deberías [instalar un linter](/preparations/setting-up-a-linter.md) para aliviar estos problemas. Mientras que los editores de código generalmente pueden señalar errores de sintaxis, los linters obligan a tu código a seguir un estilo específico definido por la configuración. Aunque esto no es obligatorio, es aconsejable.
