# Agregando tu bot a servidores

Después de [Configurar una aplicación](/preparations/setting-up-a-bot-application.md), te darás cuenta de que aún no está en ningún servidor. ¿Cómo funciona eso?

Antes de que puedas ver tu bot en tu propio servidor (o en otros), tendrás que añadirlo creando y utilizando un enlace de invitación único con el identificador de cliente de tu aplicación de bot.

## Links de invitación de bots

La versión simple de uno de estos enlaces es la siguiente:

```:no-line-numbers
https://discord.com/api/oauth2/authorize?client_id=123456789012345678&permissions=0&scope=bot%20applications.commands
```

La estructura del URL es bastante simple:

* `https://discord.com/api/oauth2/authorize` es la estructura estándar de Discord para autorizar una aplicación OAuth2 (como tu aplicación bot) para la entrada a un servidor de Discord.
* `client_id=...` es para especificar _qué_ aplicación quieres autorizar. Necesitarás reemplazar esta parte con el id de tu cliente para crear un enlace de invitación válido.
* `permissions=...` describe qué permisos tendrá tu bot en el servidor al que lo estás añadiendo.
* `scope=bot%20applications.commands` especifica que quieres añadir esta aplicación como un bot de Discord, con la capacidad de crear comandos de barra.

::: warning ADVERTENCIA
Si recibes un mensaje de error que dice "Bot requires a code grant", dirígete a la configuración de tu aplicación y desactiva la opción "Require OAuth2 Code Grant". No deberías activar esta opción a menos que sepas por qué lo necesitas.
:::

## Creando y utilizando tu link de invitación

Para crear un enlace de invitación, vuelve a la página [Mis aplicaciones](https://discord.com/developers/applications/me) en la sección "Applications", haz clic en tu aplicación bot y abre la página OAuth2.

En la barra lateral, encontrarás el generador de URL OAuth2. Selecciona las opciones `bot` y `applications.commands`. Una vez que selecciones la opción `bot`, aparecerá una lista de permisos, permitiéndote configurar los permisos que tu bot necesita.

Selecciona el enlace mediante el botón "Copiar" e introdúcelo en tu navegador. Deberías ver algo como esto (con el nombre de usuario y el avatar de tu bot):

![Bot Authorization page](./images/bot-auth-page.png)

Elige el servidor al que quieres añadirlo y haz clic en "Autorizar". Ten en cuenta que necesitarás el permiso "Gestionar servidor" en un servidor para añadir tu bot allí. A continuación debería aparecer un bonito mensaje de confirmación:

![Bot authorized](./images/bot-authorized.png)

¡Enhorabuena! Has añadido con éxito tu bot a tu servidor de Discord. Debería aparecer en la lista de miembros de tu servidor más o menos así:

![Bot in server's member list](./images/bot-in-memberlist.png)
