# Actualizando de v13 a v14

## Antes de empezar

Discord.js v14 requiere de Node.js 16.9 o una versión mayor para su uso, entonces asegúrate de que estés actualizado. Para comprobar tu versión de Node.js, usa `node -v` en tu terminal o símbolo del sistema, y si no cumple con la versión mínima, ¡actualízala! Hay muchos recursos en línea para ayudarte en este paso.

### Ahora los Builders/Constructores se incluyen en v14

Si previamente tenías instalados manualmente los módulos `@discordjs/builders`, `@discordjs/rest`, o `discord-api-types`, es _muy recomendable_ que desinstales los paquetes para evitar conflictos de versiones.

:::: code-group
::: code-group-item npm

```sh:no-line-numbers
npm uninstall @discordjs/builders @discordjs/rest discord-api-types
```

:::
::: code-group-item yarn

```sh:no-line-numbers
yarn remove @discordjs/builders @discordjs/rest
```

:::
::: code-group-item pnpm

```sh:no-line-numbers
pnpm remove @discordjs/builders @discordjs/rest
```

:::
::::

## Cambios importantes

### Versión de la API

¡discord.js v14 hace el cambio a la versión 10 de la API de Discord!

### Errores comunes

### Valores de Enums

Todas las áreas que solían aceptar un tipo `string` o `number` para un parámetro de enumeración ahora sólo aceptarán exclusivamente `number`s.

Además, las antiguas enums exportadas por discord.js v13 e inferiores se sustituyen por las nuevas enums de la librería [discord-api-types](https://discord-api-types.dev/api/discord-api-types-v10/enum/ActivityFlags).

#### Nuevas diferencias de enums

La mayor parte de la diferencia entre las enums de discord.js y discord-api-types puede resumirse así:

1. Las enums son singulares, por ejemplo, `ApplicationCommandOptionTypes` pasa a ser `ApplicationCommandOptionType`.
2. Las enums relacionadas con `Message` ya no tienen el prefijo `Message`, por ejemplo, `MessageButtonStyles` pasa a ser `ButtonStyle`.
3. Los valores de las enums son `PascalCase` en lugar de `SCREAMING_SNAKE_CASE`, por ejemplo, `.CHAT_INPUT` pasa a ser `.ChatInput`.

::: warning
Es posible que te acostumbres a usar `number`s (más comúnmente conocidos como [números mágicos/magic numbers](<https://es.wikipedia.org/wiki/N%C3%BAmero_m%C3%A1gico_(inform%C3%A1tica)>)) en lugar de valores de enums. Esto debería cambiar. Las enums son más legibles y más resistentes a los cambios en la API. Los números mágicos pueden oscurecer el significado de tu código de muchas maneras, echa un vistazo a este [blog post](https://blog.webdevsimplified.com/2020-02/magic-numbers/) si deseas más información sobre por qué no deben ser utilizados.
:::

#### Errores comunes con los enums

Es probable que áreas como la inicialización del `Client`, los comandos de barra diagonal en JSON y los componentes de mensajes en JSON deban modificarse para adaptarse a estos cambios:

##### Cambios comunes en la inicialización de un cliente (`Client`)

```diff
- const { Client, Intents } = require('discord.js');
+ const { Client, GatewayIntentBits, Partials } = require('discord.js');

- const client = new Client({ intents: [Intents.FLAGS.GUILDS], partials: ['CHANNEL'] });
+ const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });
```

##### Cambios comunes en la información de Comandos de Aplicación

```diff
+ const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

const command = {
  name: 'ping',
- type: 'CHAT_INPUT',
+ type: ApplicationCommandType.ChatInput,
  options: [{
    name: 'opción',
    description: 'Una opción de ejemplo',
-   type: 'STRING',
+   type: ApplicationCommandOptionType.String,
  }],
};
```

##### Cambios comunes en la información de Botones

```diff
+ const { ButtonStyle } = require('discord.js');

const button = {
  label: 'prueba',
- style: 'PRIMARY',
+ style: ButtonStyle.Primary,
  customId: '1234'
}
```

### Eliminación de las comprobaciones de tipo basadas en métodos

#### Canales

Se han eliminado algunos métodos de comprobación/verificación de tipo de canal que se limitaban a un solo tipo de canal. En su lugar, se debería comparar la propiedad `type` con un miembro de la enumeración [ChannelType](https://discord-api-types.dev/api/discord-api-types-v10/enum/ChannelType) para restringir los canales.

```diff
-channel.isText()
+channel.type === ChannelType.GuildText

-channel.isVoice()
+channel.type === ChannelType.GuildVoice

-channel.isDM()
+channel.type === ChannelType.DM
```

### Builders/Constructores

Los constructores ya no son devueltos por la API como antes. Por ejemplo, si tu envías a la API un `EmbedBuilder`, recibirás de la API un `Embed` con los mismos datos. Esto puede afectar al modo en que tu código gestiona las estructuras recibidas, como los componentes. Consulta la sección de [cambios en los componentes de mensajes](#componentes-de-mensaje) para obtener más detalles.

Se han añadido `disableValidators()` y `enableValidators()` como métodos exportados que desactivan o activan la validación (activada por defecto).

### Consolidación de los parámetros `create()` y `edit()`.

Se han consolidado los parámetros de varios métodos `create()` y `edit()` de administradores (Managers) y objetos. Los cambios son los siguientes:

-   `Guild#edit()` ahora toma `reason` en el parámetro `data`
-   `GuildChannel#edit()` ahora toma `reason` en el parámetro `data`
-   `GuildEmoji#edit()` ahora toma `reason` en el parámetro `data`
-   `Role#edit()` acepta ahora `reason` en el parámetro `data`
-   `Sticker#edit()` toma ahora `reason` en el parámetro `data`
-   `ThreadChannel#edit()` ahora toma `reason` en el parámetro `data`
-   `GuildChannelManager#create()` ahora toma `name` en el parámetro `options`
-   `GuildChannelManager#createWebhook()` ahora toma `channel` y `name` en el parámetro `options` (junto a otros canales basados en texto)
-   `GuildChannelManager#edit()` ahora toma `reason` como parte de `data`
-   `GuildEmojiManager#edit()` ahora toma `reason` como parte de `data`
-   `GuildManager#create()` ahora toma `name` como parte de `options`
-   `GuildMemberManager#edit()` ahora toma `reason` como parte de `data`
-   Ahora `GuildMember#edit()` toma `reason` como parte de `data`
-   `GuildStickerManager#edit()` ahora toma `reason` como parte de `data`
-   `RoleManager#edit()` ahora toma `reason` como parte de `options`
-   `Webhook#edit()` ahora toma `reason` como parte de `options`
-   `GuildEmojiManager#create()` ahora toma `attachment` y `name` como parte de `options`
-   `GuildStickerManager#create()`toma ahora `file`, `name` y `tags` como parte de `options`

### Actividad

Las siguientes propiedades han sido eliminadas ya que no están documentadas por Discord:

-   `Activity#id`
-   `Activity#platform`
-   `Activity#sessionId`
-   `Activity#syncId`

### Aplicación

Se ha eliminado el método `Application#fetchAssets()` porque ya no es compatible con la API.

### BitField

-   Los campos de bits (BitField) tienen ahora un sufijo `BitField` para evitar conflictos de nombres con las enums:

```diff
- new Permissions()
+ new PermissionsBitField()

- new MessageFlags()
+ new MessageFlagsBitField()

- new ThreadMemberFlags()
+ new ThreadMemberFlagsBitField()

- new UserFlags()
+ new UserFlagsBitField()

- new SystemChannelFlags()
+ new SystemChannelFlagsBitField()

- new ApplicationFlags()
+ new ApplicationFlagsBitField()

- new Intents()
+ new IntentsBitField()

- new ActivityFlags()
+ new ActivityFlagsBitField()
```

-   `#FLAGS` ha sido renombrado a `#Flags`.

### CDN

Los métodos que devuelven URLs de la CDN ahora devolverán por defecto una URL de imagen dinámica (que incluye movimiento), si está disponible. Este comportamiento puede modificarse estableciendo la propiedad `forceStatic` en `true` en el parámetro `ImageURLOptions`.

### CategoryChannel

`CategoryChannel#children` ya no es una `Collection` de canales que contiene la categoría. Ahora es un administrador/manager (`CategoryChannelChildManager`). Esto también significa que `CategoryChannel#createChannel()` ha sido trasladado dentro de `CategoryChannelChildManager`.

### Channel

Los siguientes métodos de comprobaciones de tipo de canal han sido removidos:

-   `Channel#isText()`
-   `Channel#isVoice()`
-   `Channel#isDirectory()`
-   `Channel#isDM()`
-   `Channel#isGroupDM()`
-   `Channel#isCategory()`
-   `Channel#isNews()`

Consulta a [esta sección](#canales) para más información.

### Client

Se ha eliminado la opción del cliente `restWsBridgeTimeout`.

### CommandInteractionOptionResolver

`CommandInteractionOptionResolver#getMember()` ya no tiene un parámetro para la opción `required`. Mira [este pull request en GitHub](https://github.com/discordjs/discord.js/pull/7188) para más información.

### `Constants`

-   Muchos objetos constantes y arrays son ahora exportados, puedes utilizarlos así:

```diff
- const { Constants } = require('discord.js');
- const { Colors } = Constants;
+ const { Colors } = require('discord.js');
```

-   Las estructuras constantes tienen nombres de tipo `PascalCase` en lugar de `SCREAMING_SNAKE_CASE`.

-   Se han sustituido y renombrado muchas de las estructuras constantes exportadas:

```diff
- Opcodes
+ GatewayOpcodes

- WSEvents
+ GatewayDispatchEvents

- WSCodes
+ GatewayCloseCodes

- InviteScopes
+ OAuth2Scopes
```

### Eventos

Los eventos `message` e `interaction` han sido eliminados. Utiliza `messageCreate` e `interactionCreate` en su lugar.

Se han eliminado los eventos `applicationCommandCreate`, `applicationCommandDelete` y `applicationCommandUpdate`. Consulta [este pull request en GitHub](https://github.com/discordjs/discord.js/pull/6492) para obtener más información.

El evento `threadMembersUpdate` ahora emite información acerca de los usuarios que fueron añadidos, los usuarios que fueron eliminados, y del hilo respectivamente.

### GuildBanManager

A partir de la versión 14.4.0, los desarrolladores deberán utilizar `deleteMessageSeconds` en lugar de `days` y `deleteMessageDays`:

```diff
<GuildBanManager>.create('123456789', {
-  days: 3
-  deleteMessageDays: 3
+  deleteMessageSeconds: 3 * 24 * 60 * 60
});
```

Tanto `deleteMessageDays` (introducido en la versión 14) como `days` están obsoletos y se eliminarán en el futuro.

### Guild

Se han eliminado los métodos `Guild#setRolePositions()` y `Guild#setChannelPositions()`. En su lugar, utiliza `RoleManager#setPositions()` y `GuildChannelManager#setPositions()` respectivamente.

`Guild#maximumPresences` ya no tiene un valor por defecto de 25.000.

`Guild#me` ha sido trasladado a `GuildMemberManager#me`. Consulta [este pull request en GitHub](https://github.com/discordjs/discord.js/pull/7669) para obtener más información.

### GuildAuditLogs & GuildAuditLogsEntry

Se ha eliminado el método `GuildAuditLogs.build()` por considerarse obsoleto. No hay alternativa.

Las siguientes propiedades y métodos se han trasladado a la clase `GuildAuditLogsEntry`:

-   `GuildAuditLogs.Targets`
-   `GuildAuditLogs.actionType()`
-   `GuildAuditLogs.targetType()`

### GuildMember

`GuildMember#pending` es ahora anulable (`null`) para tener en cuenta a los miembros parciales del servidor. Consulta [este issue en GitHub](https://github.com/discordjs/discord.js/issues/6546) para obtener más información.

### IntegrationApplication

Se ha eliminado la propiedad `IntegrationApplication#summary` porque ya no es compatible con la API.

### Interaction

Cada vez que se responde a una interacción y se obtiene la respuesta, podía devolver un `APIMessage` si el servidor (`Guild`) no estaba en caché. Sin embargo, ahora las respuestas de interacción siempre devuelven un objeto `Message` (de discord.js) con `fetchReply` como `true`.

### Invite

`Invite#channel` e `Invite#inviter` resuelven estructuras de la caché.

### MessageAttachment

-   `MessageAttachment` ha sido renombrado a `AttachmentBuilder`.

```diff
- new MessageAttachment(buffer, 'imagen.png');

+ new AttachmentBuilder(buffer, { name: 'imagen.png' });
```

### Componentes de Mensaje

-   Los Componentes de Mensaje (MessageComponents) también han cambiado de nombre. Ya no tienen el prefijo `Message`, y ahora tienen un sufijo `Builder`:

```diff
- const button = new MessageButton();
+ const button = new ButtonBuilder();

- const selectMenu = new MessageSelectMenu();
+ const selectMenu = new StringSelectMenuBuilder();

- const actionRow = new MessageActionRow();
+ const actionRow = new ActionRowBuilder();

- const textInput = new TextInputComponent();
+ const textInput = new TextInputBuilder();
```

-   Los componentes recibidos de la API ya no son directamente modificables. Si deseas modificar un componente, utiliza `ComponentBuilder#from`. Por ejemplo, si deseas modificar un botón:

```diff
- const botónEditado = botónRecibido
-   .setDisabled(true);

+ const { ButtonBuilder } = require('discord.js');
+ const botónEditado = ButtonBuilder.from(botónRecibido)
+   .setDisabled(true);
```

### MessageManager

Se ha eliminado el segundo parámetro de `MessageManager#fetch()`. El segundo parámetro, `BaseFetchOptions`, se ha fusionado con el primer parámetro.

```diff
- messageManager.fetch('1234567890', { cache: false, force: true });
+ messageManager.fetch({ message: '1234567890', cache: false, force: true });
```

### MessageSelectMenu

-   `MessageSelectMenu` ha sido renombrado a `StringSelectMenuBuilder`

-   `StringSelectMenuBuilder#addOption()` ha sido removido. Usa `StringSelectMenuBuilder#addOptions()` en su lugar.

### MessageEmbed

-   `MessageEmbed` ha sido renombrado a `EmbedBuilder`.

-   `EmbedBuilder#setAuthor()` acepta ahora un único objeto [`EmbedAuthorOptions`](https://discord.js.org/#/docs/builders/main/typedef/EmbedAuthorData).

-   `EmbedBuilder#setFooter()` acepta ahora un único objeto [`FooterOptions`](https://discord.js.org/#/docs/builders/main/typedef/EmbedFooterOptions) object.

-   El método `EmbedBuilder#addField()` ha sido removido. Usa `EmbedBuilder#addFields()` en su lugar.

```diff
- new MessageEmbed().addField('Título del field', 'Algún valor aquí', true);

+ new EmbedBuilder().addFields([
+  { name: 'uno', value: 'uno' },
+  { name: 'dos', value: 'dos' },
+]);
```

### Modal

-   También se ha cambiado el nombre de `Modal`, que ahora tiene el sufijo `Builder`:

```diff
- const modal = new Modal();
+ const modal = new ModalBuilder();
```

### PartialTypes

El array de cadenas de texto `PartialTypes` ha sido eliminada. En su lugar, utilice la enumeración `Partials`.

Además, ahora hay un nuevo partial: `Partials.ThreadMember`.

### Permissions

Los permisos `USE_PUBLIC_THREADS` y `USE_PRIVATE_THREADS` han sido eliminados por estar obsoletos en la API. Utiliza `CREATE_PUBLIC_THREADS` y `CREATE_PRIVATE_THREADS` respectivamente.

### PermissionOverwritesManager

Las sobrescrituras de permisos (Overwrites) se realizan ahora con el permiso en una cadena de texto del tipo `PascalCase` en lugar de una de tipo `SCREAMING_SNAKE_CASE`.

### Eventos REST

#### apiRequest

Este evento REST se ha eliminado ya que discord.js utiliza ahora [Undici](https://github.com/nodejs/undici) como gestor de peticiones. Ahora debe utilizar un [diagnostics channel](https://undici.nodejs.org/#/docs/api/DiagnosticsChannel). Mira este ejemplo sencillo:

```js
import diagnosticsChannel from "node:diagnostics_channel";

diagnosticsChannel.channel("undici:request:create").subscribe((data) => {
	// Si usas TypeScript, `data` puede ser interpretado como
	// `DiagnosticsChannel.RequestCreateMessage`
	// de Undici para recibir definiciones de tipos.
	const { request } = data;
	console.log(request.method); // Registra el método (method)
	console.log(request.path); // Registra el camino (path)
	console.log(request.headers); // Registra los headers
	console.log(request); // ¡O solo registra todo!
});
```

Encontrará más ejemplos en la [Documentación del diagnostics channel de Undici](https://undici.nodejs.org/#/docs/api/DiagnosticsChannel).

#### apiResponse

Este evento REST ha sido renombrado a `response` y trasladado a `Client#rest`:

```diff
- client.on('apiResponse', ...);
+ client.rest.on('response', ...);
```

#### invalidRequestWarning

Este evento REST se ha trasladado a `Client#rest`:

```diff
- client.on('invalidRequestWarning', ...);
+ client.rest.on('invalidRequestWarning', ...);
```

#### rateLimit

Este evento REST ha sido renombrado a `rateLimited` y trasladado a `Client#rest`:

```diff
- client.on('rateLimit', ...);
+ client.rest.on('rateLimited', ...);
```

### RoleManager

Se ha eliminado `Role.comparePositions()`. Utiliza `RoleManager#comparePositions()` en su lugar.

### Sticker

`Sticker#tags` es ahora una cadena anulable (`string | null`). Anteriormente, era un array anulable de cadenas de texto (`string[] | null`). Mira [este pull request en GitHub](https://github.com/discordjs/discord.js/pull/8010/files) para más información.

### ThreadChannel

El ayudante `MAX` utilizado en `ThreadAutoArchiveDuration` ha sido eliminado. Discord ha permitido a cualquier servidor utilizar cualquier tiempo de archivo de hilos automático, lo que hace que este ayudante sea redundante.

### ThreadMemberManager

Se ha eliminado el segundo parámetro de `ThreadMemberManager#fetch()`. El `BaseFetchOptions` que era el segundo parámetro se ha fusionado con el primer parámetro. Además, se ha eliminado la ayuda tipo `boolean` para especificar la opción de `cache`.

El uso es ahora el siguiente:

```diff
// El segundo parámetro se fusiona con el primero.
- threadMemberManager.fetch('1234567890', { cache: false, force: true });
+ threadMemberManager.fetch({ member: '1234567890', cache: false, force: true });

// Se ha eliminado el único boolean. Aquí hay que ser explícito.
- threadMemberManager.fetch(false);
+ threadMemberManager.fetch({ cache: false });
```

### Util

Se ha eliminado `Util.removeMentions()`. Para controlar las menciones, utiliza `allowedMentions` en `MessageOptions`.

Se ha eliminado `Util.splitMessage()`. Este método de utilidad es algo que debe hacer el propio desarrollador.

Se ha eliminado `Util.resolveAutoArchiveMaxLimit()`. Desde entonces, Discord permite a cualquier servidor utilizar cualquier tiempo de archivado de hilo automático, lo que hace que este método sea redundante.

Otras funciones de `Util` se han exportado para que puedas importarlas directamente desde `discord.js`.

```diff
- import { Util } from 'discord.js';
- Util.escapeMarkdown(message);
+ import { escapeMarkdown } from 'discord.js';
+ escapeMarkdown(message);
```

### Campos `.deleted` han sido removidos

Ya no se puede utilizar la propiedad `deleted` para comprobar si se ha borrado una estructura. Consulte [este issue en GitHub](https://github.com/discordjs/discord.js/issues/7091) para obtener más información.

### VoiceChannel

Se ha eliminado `VoiceChannel#editable`. En su lugar, utiliza `GuildChannel#manageable`.

Muchas de las enums se pueden encontrar en la documentación de discord-api-types. [discord-api-types](https://discord-api-types.dev/api/discord-api-types-v10/enum/ActivityFlags)

### VoiceRegion

Se ha eliminado `VoiceRegion#vip` porque ya no forma parte de la API.

### Webhook

`Webhook#fetchMessage()` ahora sólo toma un argumento de tipo `WebhookFetchMessageOptions`.

## Características

### AutocompleteInteraction

Se ha añadido `AutocompleteInteraction#commandGuildId` que es el id del servidor al que está registrado el comando de aplicación invocado.

### Channel

Se ha añadido `Channel#flags` a partir de la versión 14.4.0.

Los canales de tienda (Store) se han eliminado porque ya no forman parte de la API.

Se ha añadido `Channel#url` que es un enlace a un canal, igual que en el cliente.

Adicionalmente, nuevos métodos de comprobación de tipos de canal han sido añadidos:

-   `Channel#isDMBased()`
-   `Channel#isTextBased()`
-   `Channel#isVoiceBased()`

### Collection

-   Añadidas funciones `Collection#merge()` y `Collection#combineEntries()`.
-   Nuevo tipo: `ReadonlyCollection` que indica una `Collection` no modificable.

### Collector

Se ha añadido un nuevo evento `ignore` que se emite cada vez que un elemento no es recogido por el `Collector`.

Las opciones del recolector de componentes ahora utilizan los valores de la enumeración `ComponentType`:

```diff
+ const { ComponentType } = require('discord.js');

const collector = interaction.channel.createMessageComponentCollector({
	filter,
-	componentType: 'BUTTON',
+	componentType: ComponentType.Button,
	time: 20000
});
```

### CommandInteraction

Se ha añadido `CommandInteraction#commandGuildId` que es el id del servidor al que está registrado el comando de aplicación invocado.

### ForumChannel

Se añadió soporte para los canales de foros a partir de la versión 14.4.0.

### Guild

Añadido `Guild#setMFALevel()` que establece el nivel 2FA para la moderación del servidor.

Se ha añadido `Guild#maxVideoChannelUsers` a partir de la versión 14.2.0, que indica el número máximo de usuarios del canal de voz con vídeo.

### GuildChannelManager

Se puede utilizar `videoQualityMode` al crear un canal para establecer inicialmente el modo de calidad de vídeo de la cámara.

### GuildEmojiManager

Se añadió `GuildEmojiManager#delete()` y `GuildEmojiManager#edit()` para gestionar los emojis de servidor existentes.

### GuildForumThreadManager

Se añadió `GuildForumThreadManager` como administrador (Manager) de hilos en canales de foros a partir de la versión 14.4.0.

### GuildMemberManager

Se añadió el método `GuildMemberManager#fetchMe()` para buscar el usuario cliente en el servidor.
se añadieron los métodos `GuildMemberManager#addRole()` y `GuildMemberManager#removeRole()` a partir de la versión 14.3.0. Estos métodos permiten una única adición o eliminación de un rol respectivamente a un miembro del servidor, incluso si no está almacenado en caché.

### GuildTextThreadManager

Se añadió `GuildTextThreadManager` como administrador (Manager) de hilos en canales de texto y canales de anuncios a partir de la versión 14.4.0.

### Interaction

Se añadió el método `Interaction#isRepliable()` para comprobar si se puede responder a una interacción dada.

### Message

Se ha añadido `Message#position` como una posición aproximada del mensaje en un hilo a partir de la versión 14.4.0.

### MessageReaction

Se añadió `MessageReaction#react()` para hacer que el usuario cliente reaccione con la reacción a la que pertenece la clase.

### Webhook

Se añadió la propiedad `Webhook#applicationId`.

Se añadió la propiedad `threadName` en las opciones de `Webhook#send()` a partir de la versión 14.4.0 que permite a un webhook crear un post en un canal del foro.
