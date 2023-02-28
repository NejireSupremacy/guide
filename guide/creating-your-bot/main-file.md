# Creando el archivo principal

::: tip
Esta página asume que ya has preparado los [archivos de configuración](/creating-your-bot/#creating-configuration-files) de la página anterior. Estamos utilizando el método `config.json`, sin embargo, ¡siéntete libre de sustituirlo por el tuyo propio!
:::

Abra su editor de código y cree un nuevo archivo. Te sugerimos que guardes el archivo como `index.js`, pero puedes ponerle el nombre que desees.

Aquí tienes el código base para empezar:

```js
// Requiere las clases discord.js necesarias
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Crea una nueva instancia del cliente
const client = new Client({ 
	intents: [GatewayIntentBits.Guilds] 
});

// Cuando el cliente esté listo, ejecute este código (sólo una vez)
// Utilizamos "c" para el parámetro de evento para mantenerlo separado del ya definido "cliente".
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Conéctate a Discord con el token de tu cliente
client.login(token);
```

Así es como creas una instancia del cliente para tu bot de Discord e inicias sesión en Discord. El opcion de `GatewayIntentBits.Guilds` para los intents es necesaria para que el cliente discord.js funcione como esperas, ya que garantiza que las cachés de guilds, canales y roles se rellenen y estén disponibles para uso interno.

::: tip
El término "guild" es utilizado por la API de Discord y en discord.js para referirse a un servidor de Discord.
:::

Los intents también definen los eventos que Discord debe enviar a tu bot, y es posible que desees habilitar más que sólo el mínimo. Puedes leer más sobre los otros intentos en [Sobre los intents](/popular-topics/intents).

## Ejecutando tu aplicación

Abre tu terminal y ejecuta `node index.js` para iniciar el proceso. Si ves "¡Listo!" después de unos segundos, ¡estás listo! El siguiente paso es empezar a añadir [comandos de barra](/creando-tu-bot/slash-commands.md) para desarrollar la funcionalidad de tu bot.

::: tip
Puede abrir su archivo `package.json` y editar el campo `"main": "index.js"` para que apunte a tu archivo principal. A continuación, puedes ejecutar `node .` en tu terminal para iniciar el proceso.

Después de cerrar el proceso con `Ctrl + C`, puedes pulsar la flecha hacia arriba de tu teclado para que aparezcan los últimos comandos que has ejecutado. Pulsar arriba y luego enter después de cerrar el proceso es una forma rápida de iniciarlo de nuevo.
:::

#### Resultado final

<ResultingCode path="creating-your-bot/initial-files" />
