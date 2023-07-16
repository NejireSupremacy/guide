# Subiendo tus comandos

::: tip CONSEJO
Esta página asume que usted usa la misma estructura de archivos que nuestra sección [Comandos de barra](./slash-commands.md), y que lo previsto está hecho para funcionar con esa configuración. Por favor, lea atentamente esa sección primero para que pueda entender los métodos utilizados en esta sección.

Si ya tienes comandos slash configurados y desplegados para tu aplicación y quieres aprender cómo responder a ellos, consulta la siguiente sección sobre [Métodos de respuesta a comandos](/slash-commands/response-methods.md).
:::

En esta sección, veremos cómo registrar tus comandos en Discord utilizando discord.js.

## Registro de comandos

Los comandos Slash se pueden registrar de dos formas: en un servidor específico o para todos los servidores en los que esté el bot. Vamos a ver primero el registro en un solo servidor, ya que es una buena manera de desarrollar y probar tus comandos antes de un despliegue global.

Tu aplicación necesitará el ámbito `applications.commands` autorizado en un servidor para que cualquiera de sus comandos de barra aparezca, y para poder registrarlos en un servidor específico sin error.

Los comandos de barra sólo deben registrarse una vez y actualizarse cuando se modifique su definición (descripción, opciones, etc.). Como hay un límite diario en la creación de comandos, no es necesario ni deseable conectar un cliente entero a la pasarela o hacer esto en cada evento `ready`. Por ello, es preferible un script independiente que utilice el gestor REST más ligero.

Este script está pensado para ser ejecutado por separado, sólo cuando necesites hacer cambios en las **definiciones** de tu comando slash - eres libre de modificar partes como la función de ejecución tanto como quieras sin necesidad de volver a desplegarlo.

### Comandos de servidor

Crea un archivo `deploy-commands.js` en el directorio de tu proyecto. Este archivo se utilizará para registrar y actualizar los comandos de barra para tu aplicación bot.

Añade dos propiedades más a tu archivo `config.json`, que necesitaremos en el script de despliegue:

- `clientId`: El id de cliente de tu aplicación ([Portal Discord para desarrolladore](https://discord.com/developers/applications)s > "General Information" > application id)
- `guildId`: El id de tu servidor de desarrollo ([Activar modo desarrollador](https://support.discord.com/hc/es/articles/206346498) > clic derecho en el título del servidor > "Copiar ID")

```json
{
	"token": "tu-token-va-aquí",
	"clientId": "tu-id-de-aplicación-va-aquí",
	"guildId": "tu-id-del-servidor-va-aquí"
}
```

Una vez definidos estos parámetros, puede utilizar el script de despliegue a continuación:

<!-- eslint-skip -->

```js
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Obtenga todos los archivos de comandos del directorio de comandos que creaste anteriormente
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Obtenga la salida SlashCommandBuilder#toJSON() de los datos de cada comando para su despliegue
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construir y preparar una instancia del módulo REST
const rest = new REST({ version: '10' }).setToken(token);

// ¡y despliega tus comandos!
(async () => {
	try {
		console.log(`Se comenzaron a actualizar ${commands.length} comandos de tu aplicación (/).`);

		// El método PUT se utiliza para actualizar completamente todos los comandos del servidor con el conjunto actual
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Se actualizaron con éxito ${data.length} comandos de tu aplicación (/).`);
	} catch (error) {
		// Y, por supuesto, asegúrate de detectar y registrar cualquier error.
		console.error(error);
	}
})();
```

Una vez rellenados estos valores, ejecuta `node deploy-commands.js` en el directorio de tu proyecto para registrar tus comandos en el servidor especificado. Si ves el mensaje de éxito, comprueba si los comandos están en el servidor escribiendo `/`. Si todo va bien, deberías poder ejecutarlos y ver la respuesta de tu bot en Discord.

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong! 🏓
	</DiscordMessage>
</DiscordMessages>

### Comandos globales

Los comandos globales de la aplicación estarán disponibles en todos los servidores en los que tu aplicación tenga autorizado el ámbito `applications.commands`, y en los mensajes directos por defecto.

Para desplegar comandos globales, puedes utilizar el mismo script de la sección [comandos de servidor](#guild-commands) y simplemente ajustar la ruta en el script a `.applicationCommands(clientId)`.

<!-- eslint-skip -->

```js
await rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);
```

### Dónde desplegar

::: tip CONSEJO
El despliegue de comandos basado en servidores es más adecuado para el desarrollo y las pruebas en propio servidor personal. Una vez que estés satisfecho, despliega el comando globalmente para publicarlo en todos los servidores en los que esté tu bot.

Es posible que desees tener una aplicación y un token separados en el portal de desarrollo de Discord para tu aplicación de desarrollo, para evitar la duplicación entre tus comandos basados en servidores y el despliegue global.
:::

#### Más información

¡Ha enviado con éxito una respuesta a un comando de barra! Sin embargo, esto es sólo lo más básico del evento de comando y la funcionalidad de respuesta. Hay mucho más disponible para mejorar la experiencia del usuario, incluyendo:

* Aplicando este mismo enfoque de gestión dinámica y modular a los eventos con un [Gestor de eventos](/creating-your-bot/event-handling.md).
* Utilizando los diferentes [Métodos de respuesta](/slash-commands/response-methods.md) que se pueden utilizar para los comandos slash.
* Ampliar estos ejemplos con tipos de opciones validadas adicionales en [Creación avanzada de comandos](/slash-commands/advanced-creation.md).
* Añadir formato [Embeds](/popular-topics/embeds.md) a sus respuestas.
* mejorando la funcionalidad de los comandos con [Buttons](/interactions/buttons) y [Select Menus](/interactions/select-menus.md).
* Pedir al usuario más información con [Modals](/interactions/modals.md).

#### Resultado final

<ResultingCode path="creating-your-bot/command-deployment" />
