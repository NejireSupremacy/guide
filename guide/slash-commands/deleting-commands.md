# Borrar comandos

::: tip CONSEJO
Esta página es una continuación de [subiendo tus comandos](/creating-your-bot/command-deployment.md). Para eliminar comandos, es necesario registrarlos en primer lugar.
:::

Puede que hayas decidido que ya no necesitas un comando y no quieres que tus usuarios se confundan cuando se encuentren con un comando eliminado.

## Borrar comandos específicos

Para eliminar un comando específico, necesitarás su id. Ve a **Configuración del servidor -> Integraciones -> Bots y aplicaciones** y elige tu bot. A continuación, haz clic con el botón derecho en un comando y haz clic en **Copiar ID**.

::: tip CONSEJO
Necesitas tener activado el [Modo Desarrollador](https://support.discord.com/hc/articles/206346498) para que aparezca.
:::

![bots-and-apps](./images/bots-and-apps.png)

![commands-copy-id](./images/commands-copy-id.png)

Edite su `deploy-commands.js` como se muestra a continuación, o póngalo en su propio archivo para discernirlo claramente del flujo de trabajo de despliegue:

```js{9-17}
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

// ...

// para comandos basados en servidores
rest.delete(Routes.applicationGuildCommand(clientId, guildId, 'commandId'))
	.then(() => console.log('Comando de servidor eliminado con éxito'))
	.catch(console.error);

// para comandos globales
rest.delete(Routes.applicationCommand(clientId, 'commandId'))
	.then(() => console.log('Se ha eliminado correctamente el comando de aplicación'))
	.catch(console.error);
```

Donde `'commandId'` es el id del comando que quieres borrar. Ejecute el script de despliegue y se eliminará el comando.

## Borrar todos los comandos

Para eliminar todos los comandos en el ámbito respectivo (un servidor, todos los comandos globales) puedes pasar un array vacío al establecer los comandos.

```js{9-18}
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

// ...

// para comandos basados en servidores
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Eliminados con éxito todos los comandos del servidor.'))
	.catch(console.error);

// para comandos globales
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Eliminados con éxito todos los comandos de la aplicación.'))
	.catch(console.error);
```

La API de Discord no ofrece actualmente una forma sencilla de eliminar comandos basados en servidores que se producen en varios clanes desde todos los lugares a la vez. Cada uno necesitará una llamada al punto final anterior, especificando el servidor respectivo y el id del comando. Ten en cuenta que el mismo comando tendrá un id diferente si se despliega en un clan distinto.
