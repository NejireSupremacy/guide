# Actualizando de v12 a v13

::: danger
La versión v13 de Discord.js se considera antigua y no se recomienda seguir utilizándola en producción, considera adaptarte a la v14 utilizando [nuestra guía de cambios para la v14](additional-info/changes-in-v14.html) lo antes posible.
:::

## Antes de empezar

Discord.js v13 requiere de Node.js 16.6 o una versión mayor para su uso, entonces asegúrate de que estés actualizado. Para comprobar tu versión de Node, usa `node -v` en tu terminal or símbolo del sistema, y si no cumple con la versión mínima, ¡actualízala! Hay muchos recursos en línea para ayudarte en este paso.

Una vez que ya hayas actualizado Node.js, puedes instalar discord.js versión 13, ejecutando el comando apropiado en tu terminal o en tu símbolo del sistema.

:::: code-group
::: code-group-item npm

```sh:no-line-numbers
npm install discord.js # solo texto
npm install discord.js @discordjs/voice # soporte de voz
```

:::
::: code-group-item yarn

```sh:no-line-numbers
yarn add discord.js # solo texto
yarn add discord.js @discordjs/voice # soporte de voz
```

:::
::: code-group-item pnpm

```sh:no-line-numbers
pnpm add discord.js # solo texto
pnpm add discord.js @discordjs/voice # soporte de voz
```

:::
::::

Puedes comprobar la versión de discord.js con el comando `list`. Este debería seguir mostrando v12.x, desinstala y re-instala discord.js y asegúrate de que la entrada en tu archivo package.json no impida una actualización de versión mayor. Consulta la [documentación de npm](https://docs.npmjs.com/files/package.json#dependencies) para esto.

:::: code-group
::: code-group-item npm

```sh:no-line-numbers
# verificar versión
npm list discord.js
# desinstalar y re-instalar
npm uninstall discord.js
npm install discord.js
```

:::
::: code-group-item yarn

```sh:no-line-numbers
# verificar versión
yarn list discord.js
# desinstalar y re-instalar
yarn remove discord.js
yarn add discord.js
```

:::
::: code-group-item pnpm

```sh:no-line-numbers
# verificar versión
pnpm list discord.js
# desinstalar y re-instalar
pnpm remove discord.js
pnpm add discord.js
```

:::
::::

## Versión de API

¡discord.js v13 hace el cambio a la versión 9 de la API de Discord! Además, la nueva versión principal incluye un montón de novedades interesantes.

## Comandos de barra diagonal

¡discord.js ahora tiene soporte para comandos de barra diagonal! Consulta la sección de [comandos de barra](/slash-commands/response-methods.html) en esta guía para comenzar.

Además del evento `interactionCreate` explicado en la guía anterior, esta versión también incluye los nuevos eventos de Client `applicationCommandCreate`, `applicationCommandDelete`, y `applicationCommandUpdate`.

## Componentes de mensaje

¡discord.js ahora tiene soporte para componentes de mensaje!
Esto introduce las clases `MessageActionRow`, `MessageButton`, y `MessageSelectMenu`, así como las interacciones y colectores asociados.

Consulta la sección de [componentes de mensaje](/interactions/buttons.html) en esta guía para comenzar.

## Hilos

¡discord.js ahora tiene soporte para hilos! Hilos son un nuevo tipo de sub-canal que puede ser usado para ayudar separando conversaciones en un flujo más significativo.

Esto introduce la clase `ThreadManager`, que puede ser encontrada como `TextChannel#threads`, además de `ThreadChannel`, `ThreadMemberManager`, y `ThreadMember`. También hay cinco nuevos eventos: `threadCreate`, `threadUpdate`, `threadDelete`, `threadListSync`, `threadMemberUpdate`, y `threadMembersUpdate`.

Consulta la sección de [hilos](/popular-topics/threads.html) en esta guía para comenzar.

## Voz

El soporte para voz ha sido separado en su propio módulo. Ahora necesitas instalar y usar [@discordjs/voice](https://github.com/discordjs/discord.js/tree/main/packages/voice) para interactuar con la API de Voz de Discord.

Consulta a la sección de [voz](/voice/) de esta guía para comenzar.

## Administrador de caché personalizado

Una solicitud muy popular que ha sido finalmente escuchada: La clase `Client` ahora tiene una nueva opción, `makeCache`. Este acepta como argumento a un `CacheFactory`.

Combinandolo con el método `Options.cacheWithLimits`, los usuarios pueden definir límites en cada caché de Manager y permitir que discord.js haga el resto.

```js
const client = new Client({
	makeCache: Options.cacheWithLimits({
		MessageManager: 200, // Esto viene por defecto
		PresenceManager: 0,
		// Puedes añadir más nombres de clases aquí
	}),
});
```

Se puede obtener flexibilidad adicional proporcionando una función que devuelva una implementación de caché personalizada. Ten en cuenta que debes mantener la interfaz `Collection`/`Map` por compatibilidad interna.

```js
const client = new Client({
	makeCache: (manager) => {
		if (manager.name === "MessageManager")
			return new LimitedCollection({ maxSize: 0 });
		return new Collection();
	},
});
```

## Métodos comunes que han cambiado

### Enviar mensajes, embeds, archivos, etc.

Con la introducción de las interacciones y el hecho de que es muy común que los usuarios quieran enviar embeds con `MessageOptions`, los métodos que envían mensajes ahora imponen un único parámetro.

Además, todos los mensajes enviados por los bots admiten ahora hasta 10 embeds. Como resultado, se ha eliminado la opción `embed` y se ha sustituido por un Array de `embeds`, que debe estar en el objeto de opciones.

```diff
- channel.send(embed);
+ channel.send({ embeds: [embed, embed2] });

- channel.send('¡Hola!', { embed });
+ channel.send({ content: '¡Hola!', embeds: [embed, embed2] });

- interaction.reply('¡Hola!', { ephemeral: true });
+ interaction.reply({ content: '¡Hola!', ephemeral: true });
```

`MessageEmbed#attachFiles` ha sido removido; los archivos ahora deben ser adjuntados directamente en el mensaje en lugar del embed.

```diff
- const embed = new Discord.MessageEmbed().setTitle('Archivos adjuntos').attachFiles(['./image1.png', './image2.jpg']);
- channel.send(embed);
+ const embed = new Discord.MessageEmbed().setTitle('Archivos adjuntos');
+ channel.send({ embeds: [embed], files: ['./image1.png', './image2.jpg'] });
```

También se han eliminado las opciones `code` y `split`. Esta funcionalidad ahora tendrá que ser manejada manualmente, por ejemplo a través de las funciones `Formatters.codeBlock` y `Util.splitMessage`.

### Cadenas de texto

Muchos métodos en discord.js que estaban documentados para aceptar cadenas también aceptaban otros tipos y los resolvían en una cadena. Los resultados de este comportamiento eran a menudo indeseables, produciendo salidas como `[object Object]`.

discord.js ahora aplica y valida la entrada de cadenas de texto en todos los métodos que la esperan. Los usuarios necesitaran llamar manualmente a `.toString()` o utilizar `template string` para todas las entradas de cadenas de texto según correspondan.

Las áreas más comunes en las que encontrarás este cambio son: `MessageOptions#content`, las propiedades de un `MessageEmbed`, y transformar objetos como usuarios o roles, esperando que sean cadenas de texto.

```diff
- message.channel.send(user);
+ message.channel.send(user.toString());

let contador = 5;
- embed.addField('Contador', contador);
+ embed.addField('Contador', contador.toString());
```

### Intents

Como discord.js v13 hace el cambio a la API de Discord v9, ahora es **requerido** especificar todos los intents que tu bot usa en el constructor del Client. La opción `intents` también ha pasado de `ClientOptions#ws#intents` a `ClientOptions#intents`.

Se han eliminado los atajos `Intents.ALL`, `Intents.NON_PRIVILEGED` e `Intents.PRIVILEGED` para no incentivar las malas prácticas de habilitar intents no utilizados.

Consulta a nuestro [artículo más detallado sobre este tema](/popular-topics/intents.html).

```diff
- const client = new Client({ ws: { intents: [Intents.FLAGS.GUILDS] } });
+ const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
```

### Structures#extend

El concepto de Estructuras extensibles ha sido completamente eliminado de discord.js. Para más información acerca de por qué esta desición fue tomada, consulta a [este pull request](https://github.com/discordjs/discord.js/pull/6027).

No hay un reemplazo para esto, ya que la intención es cambiar el diseño del código en lugar de habilitar algo igual de malo.

Para algún ejemplo del mundo real de las alternativas proporcionadas en el Pull Request, es posible que hayas estado extendiendo la clase `Guild` con configuraciones específicas del guild:

```js
Structures.extend("Guild", (Guild) => {
	return class MyGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.settings = {
				prefix: "!",
			};
		}
	};
});
```

Esta función puede ser replicada añadiendo `WeakMap` o `Collection` al client si es necesario:

```js
client.guildSettings = new Collection();
client.guildSettings.set(guildId, { prefix: "!" });
// En la práctica, esta colección se rellenaría con datos obtenidos de una base de datos

const { prefix } = message.client.guildSettings.get(message.guild.id);
```

### Colectores

Todas las clases y métodos relacionados con `Collector` (tanto `.create*()` como `.await*()`) ahora toman un único parámetro de objeto que también incluye el filtro.

```diff
- const collector = message.createReactionCollector(filter, { time: 15000 });
+ const collector = message.createReactionCollector({ filter, time: 15000 });

- const reacciones = await message.awaitReactions(filter, { time: 15000 });
+ const reacciones = await message.awaitReactions({ filter, time: 15000 });
```

### Costumbre con los nombres

Algunos nombres de uso común en discord.js han cambiado.

#### Algo#algoId

El nombre de las propiedades `thingID` ha cambiado a `thingId`. Se trata de una forma más correcta que la forma camelCase utilizada por discord.js, ya que `Id` es una abreviatura de Identificador, no un acrónimo.

Esto incluye: `afkChannelId`, `applicationId`, `channelId`, `creatorId`, `guildId`, `lastMessageId`, `ownerId`, `parentId`, `partyId`, `processId`, `publicUpdatesChannelId`, `resolveId`, `rulesChannelId`, `sessionId`, `shardId`, `systemChannelId`, `webhookId`, `widgetChannelId`, y `workerId`.

```diff
- console.log(guild.ownerID);
+ console.log(guild.ownerId);

- console.log(interaction.channelID);
+ console.log(interaction.channelId);
```

#### Client#message

El evento `message` ha sido renombrado a `messageCreate`, para alinear la librería con las convenciones de nomenclatura de Discord.
El evento `message` seguirá funcionando, pero recibirás una advertencia de obsoleto hasta que cambies.

```diff
- client.on("message", message => { ... });
+ client.on("messageCreate", message => { ... });
```

### Menciones Permitidas

Se ha eliminado `clientOptions.disableMentions` y se ha sustituido por `clientOptions.allowedMentions`.
La API de Discord ahora permite a los bots un control mucho más específico sobre el análisis de menciones, hasta la ID específica.

Consulta a la [Documentación de la API de Discord](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) para más información.

```diff
- const client = new Discord.Client({ disableMentions: 'everyone' });
+ const client = new Discord.Client({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true } });
```

### Respuestas / Message#reply

`Message#reply` ya no hará que el bot añada una mención al usuario, ahora usará la función de respuesta de Discord.

`MessageOptions#reply` toma ahora un tipo `ReplyOptions`. `MessageOptions#reply#messageReference` será una ID de mensaje.

```diff
- channel.send('content', { reply: '123456789012345678' }); // ID de usuario
+ channel.send({ content: 'content', reply: { messageReference: '765432109876543219' }}); // ID de mensaje
```

La nueva opción `MessageOptions.allowedMentions.repliedUser` (de tipo boolean) determina si la respuesta notificará al autor del mensaje original.

```diff
- message.reply('contenido')
+ message.reply({ content: 'contenido', allowedMentions: { repliedUser: false }})
```

Ten en cuenta que esto desactivará todas las demás menciones en este mensaje. Para habilitar otras menciones, deberá incluir otros campos `allowedMentions`. Consulta la sección anterior "Menciones Permitidas" para obtener más información.

### Campos de bits (Bitfield) / Permisos

Estos campos ahora son `BigInt`s en lugar de `Number`s. Esto puede ser gestionado usando la clase `BigInt()`, o agregando la `n` como sufijo. Para más información sobre BigInts, [revisa la documentación](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).

```diff
- const p = new Permissions(104324673);
+ const p = new Permissions(BigInt(104324673));
+ const p = new Permissions(104324673n);
```

Además, no se aconseja el uso de cadenas de texto para campos de bits como `Permissions` y `UserFlags`.

```diff
- permissions.has('SEND_MESSAGES')
+ permissions.has(Permissions.FLAGS.SEND_MESSAGES)
```

### Canales de Mensajes Directos

En la versión 8 de la API de Discord y posteriores, los canales DM no emiten el evento `CHANNEL_CREATE`, lo que significa que discord.js no puede almacenarlos en caché automáticamente. Para que tu bot reciba DMs, el partial `CHANNEL` debe estar habilitado.

### Versión para navegadores (Webpack builds)

La versión para navegadores ya no es soportada por discord.js

## Cambios y eliminaciones

### ActivityType

El tipo `CUSTOM_STATUS` ha sido renombrado a `CUSTOM`.

### APIMessage

La clase `APIMessage` se ha renombrado a `MessagePayload`, resolviendo un conflicto de nombres con una interfaz de la librería `discord-api-types` que representa objetos de datos de mensajes.

### Channel

#### Channel#type

Los tipos de canal ahora están en mayúsculas y se alinean con las convenciones de nomenclatura de Discord.

```diff
- if(channel.type === 'text') channel.send('Contenido');
+ if(channel.type === 'GUILD_TEXT') channel.send('Contenido');
```

### Client

#### Client#emojis

El administrador de emojis del client es ahora un `BaseGuildEmojiManager`, proporcionando únicamente resolución de caché y eliminando métodos que fallaban al crear emojis al no haber contexto de Guild.

#### Client#fetchApplication

Se ha eliminado el método `Client#fetchApplication` y se ha sustituido por la propiedad `Client#application`.

```diff
- client.fetchApplication().then(application => console.log(application.name))
+ console.log(client.application.name);
```

#### Client#fetchWidget

Este método ha sido renombrado a `fetchGuildWidget` para representar mejor su funcionalidad.

#### Client#generateInvite

`Client#generateInvite` ya no admite `PermissionsResolvable` como argumento, sino `InviteGenerationOptions`.
Esto también requiere que al menos uno de los dos scopes `bot` o `applications.commands` se proporcione para generar una URL de invitación válida.

Para generar un enlace de invitación con permisos de comandos de barra diagonal:

```js
client.generateInvite({ scopes: ["applications.commands"] });
```

Para generar un enlace de invitación para un bot y definir los permisos necesarios:

```diff
- client.generateInvite([Permissions.FLAGS.SEND_MESSAGES]);
+ client.generateInvite({ scopes: ['bot'], permissions: [Permissions.FLAGS.SEND_MESSAGES] })
```

#### Client#login

Anteriormente, cuando un token había alcanzado su límite de 1000 inicios de sesión por día, discord.js trataría esto como un rate limit y esperaría para iniciar sesión de nuevo, pero esto no se comunicaba al usuario. Esto ahora causará un error.

#### Client#typingStart

El evento `Client#typingStart` ahora sólo emite una estructura `Typing`. Anteriormente, se emitían `Channel` y `User`.

#### Client#setInterval

#### Client#setTimeout

Se han eliminado todos los métodos de tiempo de espera del Client. Estos métodos existían con el propósito de almacenar en caché los tiempos de espera internamente para poder borrarlos cuando se destruyera el Client.
Dado que los temporizadores ahora tienen un método `unref` en Node.js, esto ya no es necesario.

### ClientOptions

#### ClientOptions#fetchAllMembers

La opción `ClientOptions#fetchAllMembers` ha sido removida.

Con la introducción de gateway intents, la opción de client `fetchAllMembers` fallaba a menudo y causaba retrasos significativos en estados listos o incluso provocaba errores de tiempo de espera agotado.
Como su propósito es contradictorio con las intenciones de Discord de reducir el scraping de datos de usuarios y presencias, se ha eliminado.

#### ClientOptions#messageCacheMaxSize

Se ha eliminado la opción `ClientOptions#messageCacheMaxSize`. En su lugar, utiliza [`ClientOptions#makeCache`](#customizable-manager-caches) para personalizar la caché del `MessageManager`.

#### ClientOptions#messageEditHistoryMaxSize

Se ha eliminado la opción `ClientOptions#messageEditHistoryMaxSize`.

Para reducir el almacenamiento en caché, discord.js ya no almacenará un historial de edición. Tendrás que implementar esto tú mismo si es necesario.

### ClientUser

#### ClientUser#setActivity

El método `ClientUser#setActivity` ya no devuelve una Promesa.

#### ClientUser#setAFK

El método `ClientUser#setAFK` ya no devuelve una Promesa.

#### ClientUser#setPresence

El método `ClientUser#setPresence` ya no devuelve una Promesa.

Se ha sustituido `PresenceData#activity` por `PresenceData#activities`, que ahora requiere un `Array<ActivitiesOptions>`.

```diff
- client.user.setPresence({ activity: { name: 'con discord.js' } });
+ client.user.setPresence({ activities: [{ name: 'con discord.js' }] });
```

#### ClientUser#setStatus

El método `ClientUser#setStatus` ya no devuelve una Promesa.

### Collection

#### Collection#array()

#### Collection#keyArray()

Estos métodos existían para proporcionar acceso a una array en caché de valores y keys de Collection respectivamente, en la que se basaban internamente otros métodos de Collection. Esos otros métodos se han refactorizado para que ya no dependan de la caché, por lo que se han eliminado estos arrays y esos métodos.

En su lugar podrías hacer un array esparciendo los iteradores retornados por los métodos de la clase base `Map`:

```diff
- collection.array();
+ [...collection.values()];

- collection.keyArray();
+ [...collection.keys()];
```

### ColorResolvable

Los colores fueron actualizados para igualarlo con los nuevos colores de la marca de Discord.

### Guild

#### Guild#addMember

Este método ha sido eliminado, con la funcionalidad reemplazada por el nuevo `GuildMemberManager#add`.

```diff
- guild.addMember(user, { accessToken: token });
+ guild.members.add(user, { accessToken: token });
```

#### Guild#fetchBan

#### Guild#fetchBans

Estos métodos se han eliminado y su funcionalidad ha sido sustituida por el nuevo `GuildBanManager`.

```diff
- guild.fetchBan(user);
+ guild.bans.fetch(user);

- guild.fetchBans();
+ guild.bans.fetch();
```

#### Guild#fetchInvites

Este método ha sido eliminado, y su funcionalidad ha sido reemplazada por el nuevo `GuildInviteManager`.

```diff
- guild.fetchInvites();
+ guild.invites.fetch();
```

#### Guild#fetchVanityCode

Se ha eliminado el método `Guild#fetchVanityCode`.

```diff
- Guild.fetchVanityCode().then(code => console.log(`URL de invitación personalizada: https://discord.gg/${code}`));
+ Guild.fetchVanityData().then(res => console.log(`URL de invitación personalizada: https://discord.gg/${res.code} con ${res.uses} usos`));
```

#### Guild#fetchWidget

El método `Guild#fetchWidget()` ahora recupera los datos del widget para el servidor en lugar de la configuración del widget. Ver `Client#fetchGuildWidget()`.
La funcionalidad original se ha trasladado al nuevo método `Guild#fetchWidgetSettings()`.

#### Guild#member

Se ha eliminado el método de ayuda/acceso directo `Guild#member()`.

```diff
- guild.member(user);
+ guild.members.cache.get(user.id)
```

### Guild#mfaLevel

La propiedad `Guild#mfaLevel` es ahora una enumeración.

### Guild#nsfw

La propiedad `Guild#nsfw` ha sido reemplazada por `Guild#nsfwLevel`.

#### Guild#owner

Se ha eliminado la propiedad `Guild#owner`, ya que no era fiable debido al almacenamiento en caché, y se ha reemplazado por `Guild#fetchOwner`.

```diff
- console.log(guild.owner);
+ guild.fetchOwner().then(console.log);
```

#### Guild#setWidget

El método `Guild#setWidget()` ha sido renombrado a `Guild#setWidgetSettings()`.

#### Guild#voice

Se ha eliminado la propiedad `Guild#voice`. Sin embargo, ahora puedes usar `Guild#me#voice`.

```diff
- guild.voice
+ guild.me.voice
```

### GuildChannel

#### GuildChannel#createOverwrite

Este método ha sido eliminado, y su funcionalidad ha sido reemplazada por el nuevo `PermissionOverwriteManager`.

```diff
- channel.createOverwrite(user, { VIEW_CHANNEL: false });
+ channel.permissionOverwrites.create(user, { VIEW_CHANNEL: false });
```

#### GuildChannel#createInvite

#### GuildChannel#fetchInvites

Ambos métodos se han eliminado de `GuildChannel` y se han colocado sólo en las sub-clases en las que se pueden crear invitaciones. Se trata de `TextChannel`, `NewsChannel`, `VoiceChannel`, `StageChannel` y `StoreChannel`.

En estas sub-clases, el método admite ahora opciones adicionales:

- `targetUser` para que la invitación se dirija a un determinado usuario de streaming
- `targetApplication` para dirigir la invitación a una actividad particular de Discord
- `targetType` define el tipo de objetivo para esta invitación; usuario o aplicación

#### GuildChannel#overwritePermissions

Este método ha sido eliminado, y su funcionalidad ha sido reemplazada por el nuevo `PermissionOverwriteManager`.

```diff
- channel.overwritePermissions([{ id: user.id , allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES'] }]);
+ channel.permissionOverwrites.set([{ id: user.id , allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES'] }]);
```

#### GuildChannel#permissionOverwrites

Este método ya no devuelve un `Colection` de PermissionOverwrites, sino que proporciona acceso al `PermissionOverwriteManager`.

#### GuildChannel#setTopic

El método `GuildChannel#setTopic` ha sido eliminado y colocado sólo en las sub-clases en las que se pueden establecer temas. Se trata de `TextChannel`, `NewsChannel` y `StageChannel`.

#### GuildChannel#updateOverwrite

Este método ha sido eliminado, y su funcionalidad ha sido reemplazada por el nuevo `PermissionOverwriteManager`.

```diff
- channel.updateOverwrite(user, { VIEW_CHANNEL: false });
+ channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: false });
```

### GuildMember

#### GuildMember#ban

`GuildMember#ban()` lanzará un TypeError cuando se proporcione una cadena de texto en lugar de un objeto de opciones.

```diff
- member.ban('reason')
+ member.ban({ reason: 'reason' })
```

#### GuildMember#hasPermission

Se ha eliminado el método abreviado/ayudante `GuildMember#hasPermission`.

```diff
- member.hasPermission(Permissions.FLAGS.SEND_MESSAGES);
+ member.permissions.has(Permissions.FLAGS.SEND_MESSAGES);
```

#### GuildMember#lastMessage

#### GuildMember#lastMessageId

#### GuildMember#lastMessageChannelId

Discord no proporcionaba ninguna de estas propiedades, sino que se basaba en una caché de cliente potencialmente imprecisa, por lo que se han eliminado.

#### GuildMember#presence

La propiedad `GuildMember#presence` ahora puede ser `null`, en lugar de una presencia genérica sin conexión, como cuando el intent `GUILD_PRESENCES` no está activado.

### GuildMemberManager

#### GuildMemberManager#ban

El método `GuildMemberManager#ban` lanzará un TypeError cuando se proporcione una cadena de texto en lugar de un objeto de opciones.

```diff
- guild.members.ban('123456789012345678', 'reason')
+ guild.members.ban('123456789012345678', { reason: 'reason' })
```

### Message / MessageManager

#### Message#delete

El método `Message.delete()` ya no acepta ninguna opción, por lo que es necesario realizar un borrado temporizado manualmente.

```diff
- message.delete({ timeout: 10000 });
+ setTimeout(() => message.delete(), 10000);
```

`reason` ya no es un parámetro, ya que no es utilizado por la API.

#### MessageManager#delete

El método `MessageManager.delete()` ya no acepta opciones adicionales, por lo que es necesario realizar manualmente un borrado temporizado.

```diff
- channel.messages.delete('123456789012345678', { timeout: 10000 });
+ setTimeout(() => channel.messages.delete('123456789012345678'), 10000);
```

`reason` ya no es un parámetro, ya que no es utilizado por la API.

#### Message#edits

Se ha eliminado la propiedad `Message#edits`.

### MessageEmbed

#### MessageEmbed#attachFiles

Se ha eliminado el método `MessageEmbed#attachFiles`. En su lugar, los archivos deben adjuntarse al mensaje directamente a través de `MessageOptions`.

```diff
- channel.send({ embeds: [new MessageEmbed().setTitle("Archivos").attachFiles(file)] })
+ channel.send({ embeds: [new MessageEmbed().setTitle("Archivos")], files: [file] })
```

### Permissions

#### Permissions#FLAGS.MANAGE_EMOJIS

`Permissions.FLAGS.MANAGE_EMOJIS` es ahora `Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS`.

### ReactionUserManager

#### ReactionUserManager#fetch

Se ha eliminado la opción `before`, ya que no era compatible con la API.

### RoleManager

#### RoleManager#create

Las opciones pasadas a `RoleManager#create` ya no necesitan estar en un objeto `data`.
Además, `reason` es ahora parte de las opciones del objeto, no un segundo parámetro.

```diff
- guild.roles.create({ data: { name: "New role" } }, "Creating new role");
+ guild.roles.create({ name: "New role", reason: "Creating new role" })
```

#### RoleManager#fetch

El método `RoleManager#fetch()` devolverá ahora una `Collection` en lugar de un RoleManager cuando se llame sin parámetros.

### Shard

#### Shard#respawn

Las opciones del método `Shard#respawn` son ahora un objeto en lugar de parámetros separados.
Además, el parámetro `spawnTimeout` ha sido renombrado a `timeout`.
Esto significa que el usuario ya no necesita pasar valores por defecto para rellenar cada parámetro posicional.

```diff
- shard.respawn(500, 30000);
+ shard.respawn({ delay: 500, timeout: 30000 });
```

#### Shard#spawn

El parámetro `spawnTimeout` ha sido renombrado a `timeout`.

### ShardClientUtil

#### ShardClientUtil#broadcastEval

El método `ShardClientUtil#broadcastEval` ya no acepta una cadena de texto, en su lugar espera una función.

```diff
- client.shard.broadcastEval('this.guilds.cache.size')
+ client.shard.broadcastEval(client => client.guilds.cache.size)
		.then(results => console.log(`${results.reduce((prev, val) => prev + val, 0)} servidores en total`))
		.catch(console.error);
```

#### ShardClientUtil#respawnAll

Las opciones del método `ShardClientUtil#respawnAll` son ahora un objeto en lugar de parámetros separados.
Además, el parámetro `spawnTimeout` ha sido renombrado a `timeout`.
Esto significa que el usuario ya no necesita pasar valores por defecto para rellenar cada parámetro posicional.

```diff
- client.shard.respawnAll(5000, 500, 30000);
+ client.shard.respawnAll({ shardDelay: 5000, respawnDelay: 500, timeout: 30000 });
```

### ShardingManager

#### ShardingManager#broadcastEval

El método `ShardingManager#broadcastEval` ya no acepta una cadena de texto, en su lugar espera una función. Ver `ShardClientUtil#broadcastEval`.

#### ShardingManager#spawn

Las opciones del método `ShardingManager#spawn` son ahora un objeto en lugar de parámetros separados.
Además, el parámetro `spawnTimeout` ha sido renombrado a `timeout`.
Esto significa que el usuario ya no necesita pasar valores por defecto para rellenar cada parámetro posicional.

```diff
- manager.spawn('auto', 5500, 30000);
+ manager.spawn({ amount: 'auto', delay: 5500, timeout: 30000 });
```

#### ShardingManager#respawnAll

Las opciones del método `ShardingManager#respawnAll` son ahora un objeto en lugar de parámetros separados.
Además, el parámetro `spawnTimeout` ha sido renombrado a `timeout`.
Esto significa que el usuario ya no necesita pasar valores por defecto para rellenar cada parámetro posicional.

```diff
- manager.respawnAll(5000, 500, 30000);
+ manager.respawnAll({ shardDelay: 5000, respawnDelay: 500, timeout: 30000 });
```

### TextChannel

#### TextChannel#startTyping

#### TextChannel#stopTyping

Ambos métodos han sido sustituidos por el singular `TextChannel.sendTyping()`. Este método deja de escribir automáticamente después de 10 segundos, o cuando se envía un mensaje.

### User

#### User#lastMessage

#### User#lastMessageId

Discord no proporcionaba ninguna de estas propiedades, sino que se basaba en una caché de cliente potencialmente imprecisa, por lo que se han eliminado.

#### User#locale

La propiedad `User.locale` ha sido eliminada, ya que esta propiedad no está expuesta a los bots.

#### User#presence

La propiedad `User.presence` ha sido eliminada. Ahora las presencias sólo se encuentran en `GuildMember`.

#### User#typingIn

Como discord.js ya no almacena en caché los datos de eventos de escritura, se ha eliminado el método `User.typingIn()`.

#### User#typingSinceIn

Como discord.js ya no almacena en caché los datos de eventos de escritura, se ha eliminado el método `User.typingSinceIn()`.

#### User#typingDurationIn

Como discord.js ya no almacena en caché los datos de eventos de escritura, se ha eliminado el método `User.typingDurationIn()`.

### UserFlags

Los UserFlags obsoletos `DISCORD_PARTNER` y `VERIFIED_DEVELOPER` / `EARLY_VERIFIED_DEVELOPER` han sido reemplazados por sus versiones renombradas.

```diff
- user.flags.has(UserFlags.FLAGS.DISCORD_PARTNER)
+ user.flags.has(UserFlags.FLAGS.PARTNERED_SERVER_OWNER)

- user.flags.has(UserFlags.FLAGS.VERIFIED_DEVELOPER)
+ user.flags.has(UserFlags.FLAGS.EARLY_VERIFIED_BOT_DEVELOPER)
```

Se ha añadido el nuevo indicador `DISCORD_CERTIFIED_MODERATOR`.

### Util

Los accesos directos del nivel superior, que redirigian a los métodos de esta clase, fueron eliminados.

#### Util#convertToBuffer

#### Util#str2ab

Ambos fueron eliminados a favor de los métodos de búfer integrados de Node.js.

#### Util#fetchRecommendedShards

El método `Util#fetchRecommendedShards()` ahora admite una opción adicional `multipleOf` para calcular el número al que redondear, por ejemplo, un múltiplo de 16 para el `sharding` de bots grandes.

#### Util#resolveString

Se ha eliminado el método `Util#resolveString` Discord.js obliga a los usuarios a colocar o definir cadenas donde sea pedido, en vez de intentar resolver la cadena de un objeto diferente.

### VoiceState

#### VoiceState#kick

El método `VoiceState#kick` ha pasado a llamarse `VoiceState#disconnect`.

### WebhookClient

El constructor `WebhookClient` ya no acepta `id, token` como los dos primeros parámetros, en su lugar toma un objeto `data`. Este objeto admite una opción adicional `url`, permitiendo la creación de un `WebhookClient` desde una URL de webhook.

```diff
- new WebhookClient(id, token, options);
+ new WebhookClient({ id, token }, options);

+ new WebhookClient({ url }, options);
```

## Additions

### ActivityTypes

Se ha añadido un nuevo tipo de actividad `COMPETING`.

### ApplicationCommand

Proporciona soporte API para comandos de barra diagonal.

### ApplicationCommandManager

Proporciona soporte API para crear, editar y eliminar comandos de barra diagonal.

### ApplicationCommandPermissionsManager

Proporciona soporte de API para crear, editar y eliminar sobrescrituras de permisos en comandos de barra diagonal.

### ApplicationFlags

Proporciona un campo de bits enumerado para flags de `ClientApplication`.

### BaseGuild

La nueva clase `BaseGuild` es extendida tanto por `Guild` como por `OAuth2Guild`.

### BaseGuildTextChannel

La nueva clase `BaseGuildTextChannel` es extendida tanto por `TextChannel` como por `NewsChannel`.

### BaseGuildVoiceChannel

La nueva clase `BaseGuildVoiceChannel` es extendida tanto por `VoiceChannel` como por `StageChannel`.

### ButtonInteraction

Proporciona soporte de `gateway` para un `MessageComponentInteraction` procedente de un componente de botón.

### Channel

#### Channel#isText()

Revisa y comprueba si un canal está basado en texto (que implementa `TextBasedChannel`); uno de `TextChannel`, `DMChannel`, `NewsChannel` o `ThreadChannel`.

#### Channel#isThread()

Verifica/comprueba si un canal es un `ThreadChannel`.

#### Channel#isVoice()

Verifica/comprueba si un canal es basado en voz; `VoiceChannel` o `StageChannel`.

### Client

#### Client#applicationCommandCreate

Se emite cuando se crea un comando de aplicación de servidor.

#### Client#applicationCommandDelete

Se emite cuando se elimina un comando de aplicación de servidor.

#### Client#applicationCommandUpdate

Se emite cuando se actualiza un comando de aplicación de servidor.

#### Client#interactionCreate

Se emite cuando se crea una interacción.

#### Client#stageInstanceCreate

Se emite cuando se crea una instancia de escenario.

#### Client#stageInstanceDelete

Se emite cuando se elimina una instancia de escenario.

#### Client#stageInstanceUpdate

Se emite cuando se actualiza una instancia del escenario, por ejemplo, cuando cambia el tema o el nivel de privacidad.

#### Client#stickerCreate

Se emite cuando se crea un sticker personalizado en un servidor.

#### Client#stickerDelete

Se emite cuando se elimina un sticker personalizado en un servidor.

#### Client#stickerUpdate

Se emite cuando se actualiza un sticker personalizado en un servidor.

#### Client#threadCreate

Se emite cuando se crea un hilo o cuando el bot se añade a un hilo.

#### Client#threadDelete

Se emite cuando se borra un hilo.

#### Client#threadListSync

Se emite cuando el bot accede a un canal de texto o noticias que contiene hilos.

#### Client#threadMembersUpdate

Se emite cuando se añaden o eliminan miembros de un hilo. Requiere el intent privilegiado `GUILD_MEMBERS`.

#### Client#threadMemberUpdate

Se emite cuando se actualiza un miembro del hilo del bot.

#### Client#threadUpdate

Se emite cuando se actualiza un hilo, por ejemplo, cambio de nombre, cambio de estado de archivo, cambio de estado bloqueado.

### ClientOptions

#### ClientOptions#failIfNotExists

Este parámetro establece el comportamiento por defecto para `ReplyMessageOptions#failIfNotExists`, permitiendo o impidiendo un error al responder a un Mensaje desconocido.

### CollectorOptions

#### CollectorOptions#filter

This parameter is now optional and will fall back to a function that always returns true if not provided.

### CommandInteraction

Proporciona soporte de `gateway` para interacciones de comandos de barra diagonal.
Para más información consulta a la sección de [comandos de barra diagonal](/interactions/registering-slash-commands.html) en esta guía.

### Guild

#### Guild#bans

Proporciona acceso al `GuildBanManager` del servidor.

#### Guild#create

Ahora es posible establecer `Guild#systemChannelFlags` en el método `Guild#create`.

#### Guild#edit

Ahora se pueden editar las propiedades `Guild#description` y `Guild#features`.

#### Guild#editWelcomeScreen

Proporciona soporte API para que los bots editen la `WelcomeScreen` del servidor.

#### Guild#emojis

La clase `GuildEmojiManager` ahora extiende `BaseGuildEmojiManager`.
Además de los métodos existentes, ahora soporta `GuildEmojiManager#fetch`.

#### Guild#fetchWelcomeScreen

Provides API support for fetching the Guild's `WelcomeScreen`.

#### Guild#fetchWidget

Proporciona soporte de la API para que los bots obtengan la `WelcomeScreen` del servidor.

#### Guild#invites

Proporciona acceso al nuevo `GuildInviteManager`.

#### Guild#nsfwLevel

La propiedad `Guild#nsfwLevel` está ahora representada por la enumeración `NSFWLevel`.

#### Guild#premiumTier

La propiedad `Guild#premiumTier` está ahora representada por la enumeración `PremiumTier`.

#### Guild#setChannelPositions

Ahora es posible establecer la categoría de varios canales y bloquear sus permisos mediante las opciones `ChannelPosition#parent` y `ChannelPosition#lockPermissions`.

### GuildBanManager

Proporciona soporte mejorado de la API para el manejo y almacenamiento en caché de los baneos.

A partir de la versión 13.11, los desarrolladores deberán utilizar `deleteMessageSeconds` en lugar de `days`:

```diff
<GuildBanManager>.create('123456789', {
-  days: 3
+  deleteMessageSeconds: 3 * 24 * 60 * 60
});
```

`days` está obsoleto y se eliminará en el futuro.

### GuildChannel

#### GuildChannel#clone

Ahora permite establecer la propiedad `position`.

### GuildChannelManager

#### GuildChannelManager#fetch

Ahora es posible obtener los canales de un servidor.

#### GuildChannelManager#fetchActiveThreads

Obtiene una lista de los hilos activos en un servidor.

### GuildInviteManager

Alinea el soporte para la creación y obtención de invitaciones con el diseño de los administradores (managers).
Reemplaza a `Guild#fetchInvites`.

### GuildManager

#### GuildManager#create

Ahora es posible especificar los canales AFK y de sistema al crear un nuevo servidor.

#### GuildManager#fetch

Ahora soporta la obtención de múltiples servidores, devolviendo una `Promise<Collection<Snowflake, OAuth2Guild>>` si se utiliza de esta manera.

### GuildEmojiManager

#### GuildEmojiManager#fetch

Proporciona soporte de API para la ruta/endpoint `GET /guilds/{guild.id}/emojis`.

### GuildMember

#### GuildMember#pending

Marca si un miembro ha pasado la pantalla de bienvenida del servidor.
El valor es `true` antes de aceptar y emite el evento `guildMemberUpdate` cuando el miembro acepta.

### GuildMemberManager

Se han añadido varios métodos a `GuildMemberManager` para proporcionar soporte de la API para miembros no almacenados en caché.

#### GuildMemberManager#edit

`guild.members.edit('123456789012345678', data, reason)` es equivalente a `GuildMember#edit(data, reason)`.

#### GuildMemberManager#kick

`guild.members.kick('123456789012345678', reason)` es equivalente a `GuildMember#kick(reason)`.

#### GuildMemberManager#search

Proporciona soporte de la API para consultar `GuildMember`s a través de su respectiva ruta/endpoint.
`GuildMemberManager#fetch` utiliza el `gateway` para recibir datos.

### GuildMemberRoleManager

#### GuildMemberRoleManager#botRole

Obtiene el rol de bot gestionado que este miembro creó cuando se unió al servidor, si existe.

#### GuildMemberRoleManager#premiumSubscriberRole

Obtiene el rol de suscriptor premium (booster) si está presente en el miembro.

### GuildPreview

#### GuildPreview#createdAt

#### GuildPreview#createdTimestamp

Fecha de creación de la GuildPreview.

### GuildTemplate

Proporciona soporte de la API para [plantillas de servidor](https://discord.com/developers/docs/resources/guild-template).

### Integration

#### Integration#roles

Una `Collection` de roles gestionados por la integración.

### Interaction

Proporciona soporte de `gateway` para interacciones de comandos de barra diagonal y componentes de mensajes.

Para más información, consulta las secciones de [comandos de barra](/interactions/slash-commands.md#replying-to-slash-commands) y [componentes de mensaje](/interactions/buttons.html#responding-to-buttons.html) en esta guía.

### InteractionCollector

Proporciona a los usuarios una forma de recopilar cualquier tipo de Interacción.
Esta clase tiene un diseño más flexible que otros recopiladores, ya que puede vincularse a cualquier servidor, canal o mensaje, según corresponda.
Los desarrolladores de TypeScript también pueden aprovechar los genéricos para definir la sub-clase de Interaction que se devolverá.

### InteractionWebhook

Proporciona soporte webhook específicamente para interacciones, debido a sus cualidades únicas.

### InviteGuild

Proporciona soporte de la API para los datos parciales del servidor disponibles en una `Invite` (invitación).

### InviteStageInstance

Proporciona soporte de la API para que los bots inviten a los usuarios a las instancias del escenario.

### Message

#### Message#awaitMessageComponent

Un método abreviado para crear un `InteractionCollector` prometido que resuelva a un único `MessageComponentInteraction`.

#### Message#createMessageComponentCollector

Un método abreviado para crear un `InteractionCollector` para componentes en un mensaje específico.

#### Message#crosspostable

Comprueba los permisos para ver si un mensaje se puede publicar (crosspost).

#### Message#edit

Ahora es posible editar y/o eliminar archivos adjuntos al editar un mensaje.

#### Message#fetchReference

Proporciona soporte para obtener el Mensaje referenciado por `Message#reference`, si el cliente tiene acceso para hacerlo.

#### Message#react

Ahora admite tanto `<:name:id>` como `<a:name:id>` como argumentos válidos.

#### Message#removeAttachments

Elimina los archivos adjuntos de un mensaje. Requiere del permiso `MANAGE_MESSAGES` para eliminar los archivos adjuntos de los mensajes creados por otros usuarios.

#### Message#startThread

Inicia un `ThreadChannel` utilizando este mensaje como mensaje de inicio.

#### Message#stickers

Una `Collection` de Stickers en el mensaje.

### MessageActionRow

Una clase constructora que facilita la construcción de componentes de mensajes de tipo `MessageActionRow`.

### MessageAttachment

#### MessageAttachment#contentType

El tipo de contenido de un MessageAttachment.

### MessageButton

Una clase constructora que facilita la construcción de componentes de mensajes de tipo botón.

### MessageComponentInteraction

Proporciona soporte de `gateway` para recibir interacciones de componentes de mensajes. Sub-clase de `Interaction`.

### MessageEmbed

#### MessageEmbed#setFields

Sustituye todos los campos del embed por el nuevo array de fields proporcionada.

`embed.setFields(newFields)` es equivalente a `embed.spliceFields(0, embed.fields.length, newFields)`.

### MessageManager

Se han añadido métodos a `MessageManager` para que la API admita mensajes no almacenados en caché.

#### MessageManager#crosspost

`channel.messages.crosspost('876543210987654321')` es equivalente a `message.crosspost()`.

#### MessageManager#edit

`channel.messages.edit('876543210987654321', content, options)` es equivalente a `message.edit(content, options)`.

#### MessageManager#pin

`channel.messages.pin('876543210987654321', options)` es aproximadamente equivalente a `message.pin(options)`, solo que el primero no resuelve un `Message`.

#### MessageManager#react

`channel.messages.react('876543210987654321', emoji)` es aproximadamente equivalente a `message.react(emoji)`, solo que el primero no resuelve un `MessageReaction`.

#### MessageManager#unpin

`channel.messages.unpin('876543210987654321', options)` es aproximadamente equivalente a `message.unpin(options)`, solo que el primero no resuelve un `Message`.

### MessageMentions

#### MessageMentions#repliedUser

Comprueba si el autor del mensaje respondido fue mencionado.

### MessagePayload

Esta clase ha sido renombrada de APIMessage.
Headers globales ahora se pueden establecer en las opciones HTTP.

### MessageSelectMenu

Una clase constructora que facilita la construcción de componentes de mensajes de tipo de menús de selección.

### NewsChannel

#### NewsChannel#addFollower

Proporciona soporte de la API para que los bots sigan anuncios en otros canales.

#### NewsChannel#setType

Permite la conversión entre `NewsChannel` y `TextChannel`.

### Permissions

#### Permissions#STAGE_MODERATOR

Campo de bits estático que representa los permisos necesarios para moderar un canal de escenario.

### PermissionOverwriteManager

Reemplaza los métodos `createOverwrite`, `updateOverwrite`, y `overwritePermissions` de `GuildChannel`, alineando el diseño con otros Managers.

### Role

#### Role#tags

Etiquetas para roles pertenecientes a bots, integraciones o suscriptores premium.

### RoleManager

#### RoleManager#botRoleFor

Obtiene el rol gestionado que un bot creó al unirse al servidor, si existe.

#### RoleManager#edit

`guild.roles.edit('123456789098765432', options)` es equivalente a `role.edit(options)`.

#### RoleManager#premiumSubscriberRole

Obtiene el rol de suscriptor premium (booster) para el servidor, si existe.

### SelectMenuInteraction

Proporciona soporte de `gateway` para un `MessageComponentInteraction` procedente de un componente de menú de selección (`MessageSelectMenu`).

### StageChannel

Proporciona soporte de la API para canales de escenario.

### StageInstance

Proporciona soporte de la API para instancias de escenario. Las instancias de escenario contienen información sobre escenarios en directo.

### StageInstanceManager

Proporciona soporte de la API para que el bot cree, edite y elimine instancias de escenario en vivo, y almacena una caché de instancias de escenario.

### Sticker

Proporciona soporte de la API para Stickers/Pegatinas de Discord.

### StickerPack

Proporciona soporte de la API para Packs de Stickers/Pegatinas de Discord.

### TextChannel

#### TextChannel#awaitMessageComponent

Un acceso directo para crear un `InteractionCollector` en forma de promesa que se resuelve en un solo `MessageComponentInteraction`.

#### TextChannel#createMessageComponentCollector

Un método abreviado para crear un `InteractionCollector` para componentes en un canal específico.

#### TextChannel#setType

Permite la conversión entre `TextChannel` y `NewsChannel`.

#### TextChannel#threads

Proporciona acceso al `ThreadManager` de este canal.

### ThreadChannel

Proporciona soporte de la API para canales de hilos.

### ThreadChannelManager

Proporciona soporte de la API para que el bot cree, edite y elimine hilos, y almacena una caché de `ThreadChannel`s.

### ThreadMember

Representa a un miembro de un hilo y sus metadatos específicos.

### ThreadMemberManager

Proporciona soporte de la API para que el bot añada y elimine miembros de los hilos, y almacene una caché de `ThreadMember`s.

### Typing

Representa el estado de escritura de un usuario (si está escribiendo o no) en un canal.

### Webhook

#### Webhook#deleteMessage

Los Webhooks ahora pueden borrar los mensajes que fueron enviados por el mismo Webhook.

#### Webhook#editMessage

Los Webhooks ahora pueden editar los mensajes que fueron enviados por el mismo Webhook.

#### Webhook#fetchMessage

Los Webhooks ahora pueden obtener mensajes que fueron enviados por el mismo Webhook.

#### Webhook#sourceChannel

#### Webhook#sourceGuild

Los Webhooks ahora pueden tener un `sourceGuild` y un `sourceChannel` si el mensaje se está publicando (crossposted).

### WelcomeChannel

Representa los canales que pueden verse en la pantalla de bienvenida (`WelcomeScreen`) de un servidor.

### WelcomeScreen

Proporciona soporte de la API para la pantalla de bienvenida de un servidor.

### Widget

Representa un `Widget` de un servidor (`Guild`).

### WidgetMember

Información parcial sobre los miembros de un servidor (`Guild`) almacenada en un Widget.

### Util

#### Formatters

La clase `Util` incluye ahora una serie de nuevas funciones de formato que permiten añadir fácilmente Markdown a las cadenas de texto.

#### Util#resolvePartialEmoji

Un método de ayuda que intenta resolver las propiedades de un objeto emoji, sin utilizar la clase `Client` de discord.js o su `EmojiManager`.

#### Util#verifyString

Un método de ayuda que se utiliza para validar internamente los argumentos de cadena de texto proporcionados en los métodos de discord.js.
