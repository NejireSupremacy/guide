# Menús contextuales

Los menús contextuales son comandos de aplicación que aparecen al hacer clic con el botón derecho del ratón al pulsar sobre un usuario o mensaje, en el submenú Aplicaciones.

::: tip CONSEJO
Esta página es una continuación de la sección de [comandos de barra](/guide/slash-commands/advanced-creation.md). Por favor, lee cuidadosamente esas páginas primero para que puedas comprender los métodos utilizados en esta sección.
:::

## Registro de comandos de menú contextual

Para crear un comando de menú contextual, utiliza la clase <DocsLink section="builders" path="class/ContextMenuCommandBuilder" />. Luego puedes establecer el tipo de menú contextual (usuario o mensaje) utilizando el método `setType()`.

```js
const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

const data = new ContextMenuCommandBuilder()
	.setName('Información de Usuario')
	.setType(ApplicationCommandType.User);
```

## Recibiendo interacciones de menús contextuales

Los comandos de menú contextual, al igual que los comandos de barra, se reciben a través de una interacción. Puedes verificar si una interacción dada es un comando de menú contextual usando el método `isContextMenuCommand()`, o los métodos `isMessageContextMenuCommand()` y `isUserContextMenuCommand()` para verificar el tipo específico de interacción.

```js {2}
client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isUserContextMenuCommand()) return;
	console.log(interaction);
});
```

## Extrayendo información de menús contextuales

Para los menús contextuales de usuario, puedes obtener el usuario accediendo a la propiedad `targetUser` o `targetMember` desde <DocsLink path="class/UserContextMenuCommandInteraction" />.

Para los menús contextuales de mensajes, puedes obtener el mensaje accediendo a la propiedad `targetMessage` desde <DocsLink path="class/MessageContextMenuCommandInteraction" />.

```js {4}
client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isUserContextMenuCommand()) return;
	// Obtener el nombre de usuario del menú contextual de usuario.
	const { username } = interaction.targetUser;
	console.log(username);
});
```

## Notas

- Los comandos de menú contextual no pueden tener subcomandos ni opciones adicionales.
- Responder a las funciones de los comandos de menú contextual se realiza de la misma manera que con los comandos de barra. Consulta nuestra guía de [métodos de respuesta de comandos de barra](/guide/slash-commands/response-methods)  para obtener más información al respecto.
- Los permisos de los comandos de menú contextual también funcionan de la misma manera que los permisos de los comandos de barra. Consulta muestra guía de [permisos de comando de barra](/guide/slash-commands/permissions) para obtener más información al respecto.
