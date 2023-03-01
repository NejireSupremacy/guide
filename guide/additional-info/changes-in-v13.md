# Actualizando de v12 a v13

::: danger CUIDADO
La versión v13 de Discord.js se considera antigua y no se recomienda seguir utilizándola en producción, considera adaptarte a la v14 utilizando [nuestra guía de cambios para la v14](additional-info/changes-in-v14.html) lo antes posible.
:::

## Antes de empezar

Discord.js v13 necesita Node.js v16.6.0 como mínimo para que funcione, así que asegúrate de tener la versión correcta. Para ver la versión de Node.js en la máquina, usa `node -v` en tu terminal, si es inferior a v16.6.0 significa que primero debes actualizar.

Una vez tengas Node.js actualizado, podrás instalar discord.js v13 usando `npm install discord.js` en tu terminal (o `npm install discord.js @discordjs/voice` para soporte de voz).

Puedes verificar tu versión de discord.js usando `npm list discord.js`. Si sigue en v12.x, desinstálalo (`npm uninstall discord.js`) y reinstálalo (`npm install discord.js`).

## Versión de la API

Discord.js v13 usa la versión 9 de la API de Discord. Adicionalmente, esta versión trae características nuevas.

## Comandos de barra diagonal

¡Discord.js tiene soporte para los comandos de barra diagonal!
Visita la sección de los [comandos de barra diagonal](/interacciones/registrando-comandos-de-barra.html) para empezar a usarlos.

Dicha sección de la guía explica el evento `interactionCreate`. En esta versión también existen los eventos `applicationCommandCreate`, `applicationCommandDelete`, y `applicationCommandUpdate`.

## Componentes

¡Discord.js tiene soporte para los componentes de un mensaje!

Se han introducido las clases `MessageActionRow`, `MessageButton` y `MessageSelectMenu`, al igual que las interacciones y colectores asociados a estos.

Revisa la sección de [componentes](/interacciones/botones.html) en esta guía para empezar a usarlos.

## Hilos

¡Discord.js tiene soporte para hilos! Los hilos son nuevos sub-canales que pueden ser usados para separar conversaciones.

Esto introduce la clase `ThreadManager`, la cual puede ser encontrada como `TextChannel#threads`, en adición a `ThreadChannel`, `ThreadMemberManager`, y `ThreadMember`. También hay cinco eventos nuevos: `threadCreate`, `threadDelete`, `threadListSync`, `threadMemberUpdate` y `threadMembersUpdate`.

Revisa la sección de [hilos](/temas-populares/hilos.html) en esta guía para empezar a usarlos.

## Voz

El soporte para voz ha sido separado a un nuevo módulo. Ahora tienes que instalar [@discordjs/voice](https://github.com/discordjs/voice) para interactuar con la gateway especial de voz de Discord.

Revisa la sección de [voz](/voz/) en esta guía para empezar a usarlos.

## Nuevo administrador de caché

Una solicitud muy popular ha sido escuchada: La clase `Client` ahora tiene una nueva opción, `makeCache`. El argumento que recibe es un `CacheFactory`.

Combinandolo con el método `Options.cacheWithLimits` puedes definir los limites de caché para cada `*Manager` y discord.js se encargará del resto.

```js
const client = new Client({
	makeCache: Options.cacheWithLimits({
		MessageManager: 200, // Por defecto
		PresenceManager: 0,
		// Añadir más clases aquí
	}),
});
```

Se puede conseguir más flexibilidad declarando una función que retorna una implementación de caché personalizada. Ten en cuenta que debe mantener una interfaz parecida a `Collection`/`Map` para mantener compatibilidad interna.

```js
const client = new Client({
	makeCache: manager => {
		if (manager.name === 'MessageManager') return new LimitedCollection({ maxSize: 0 });
		return new Collection();
	},
});
```

## Métodos comunes que han cambiado

### Enviando mensajes, incrustaciones, archivos, etc.

Con la introducción de las interacciones y el hecho de que es muy común que los usuarios quieran enviar incrustaciones con  `MessageOptions`, los métodos que envían mensajes ahora imponen un único parámetro.

Este puede ser entre una cadena de texto, un `MessagePayload`, o la variante de `MessageOptions` de ese método.

Adicionalmente, todos los mensajes enviados por bots ahora soportan hasta 10 incrustaciones. Como resultado de esto, la opción `embed` ha sido removida y reemplazada con `embeds`, la cual toma como valor un array de objetos de incrustaciones.

```diff
- channel.send(embed);
+ channel.send({ embeds: [embed, embed2] });

- channel.send('¡Hola!', { embed });
+ channel.send({ content: '¡Hola!', embeds: [embed, embed2] });

- interaction.reply('¡Hola!', { ephemeral: true });
+ interaction.reply({ content: '¡Hola!', ephemeral: true });
```

`MessageEmbed#attachFiles` ha sido removido; los archivos ahora deberán ser adjuntados directamente al mensaje en lugar de al embed.

```diff
- const embed = new Discord.MessageEmbed().setTitle('Archivos adjuntos').attachFiles(['./imagen1.png', './imagen2.jpg']);
- channel.send(embed);
+ const embed = new Discord.MessageEmbed().setTitle('Archivos adjuntos');
+ channel.send({ embeds: [embed], files: ['./imagen1.png', './imagen2.jpg'] });
```

Las opciones `code` y `split` también han sido removidas. Esta característica ahora tendrá que ser gestionada manualmente, vía los ayudantes `Formatters.codeBlock` y `Util.splitMessage`.

### Cadenas de texto

Muchos métodos en discord.js que se documentaron aceptando cadenas de texto, también aceptaban otros tipos y se resolvía como una cadena. Los resultados de este comportamiento eran a menudo indeseables, produciendo resultados como `[object Object]`.

Discord.js ahora aplica y valida la entrada de cadenas de texto en todos los métodos que la esperan. Los usuarios necesitaran llamar manualmente a `.toString()`  o utilizar `template string` para todas las entradas de cadenas de texto según correspondan.

Las áreas más comunes donde se encuentra este cambio son: `MessageOptions#content`, las propiedades de un `MessageEmbed`, y pasando objetos como usuarios o roles, esperando que sean una cadena.

```diff
- message.channel.send(user);
+ message.channel.send(user.toString());

let count = 5;
- embed.addField('Cantidad', count);
+ embed.addField('Cantidad', count.toString());
```

### Gateway Intents
Discord.js v13 hace el cambio a Discord API v9, donde ahora es **obligatorio** especificar todos los `Intents` que usa su bot en el constructor `Client`. La opción `intents` también se ha movido de `ClientOptions#ws#intents` a `ClientOptions#intents`.

Los atajos `Intents.ALL`, `Intents.NON_PRIVILEGED`, y `Intents.PRIVILEGED` han sido removidos para evitar que el usuario establezca `Intents` innecesarios.

Consulte nuestro [artículo más detallado sobre el tema](/temas-populares/intents.md).

```diff
- const client = new Client({ ws: { intents: [Intents.FLAGS.GUILDS] } });
+ const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
```

### Structures#extend

El concepto de estructuras extendidas ha sido removido completamente de discord.js.
Para más información sobre el por qué de esta decisión, puedes ver [este Pull Request](https://github.com/discordjs/discord.js/pull/6027).

No hay ningún reemplazo para esto, ya que su intención es cambiar el diseño del código, en lugar de activar algo igualmente malo.

Para algún ejemplo del mundo real de las alternativas proporcionadas en el Pull Request, podrías haber estado extendiendo la clase `Guild` con ajustes específicos del guild:

```js
Structures.extend('Guild', Guild => {
	return class MyGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.settings = {
				prefix: '!',
			};
		}
	};
});
```

Esta característica puede ser replicada añadiendo `WeakMap` o `Collection` al cliente si es necesario:

```js
client.guildSettings = new Collection();
client.guildSettings.set(guildId, { prefix: '!' });
// En práctica, rellenarías esta Collection con datos obtenidos de una base de datos

const { prefix } = message.client.guildSettings.get(message.guild.id);
```

### Colectores

Todas las clases y métodos relacionados con / devuelven `Collector` (tanto `.create*()` y `.await*()`) ahora tomarán un único parámetro de objeto que también incluye la función que se usa de filtro.

```diff
- const collector = message.createReactionCollector(filter, { time: 15000 });
+ const collector = message.createReactionCollector({ filter, time: 15000 });

- const reactions = await message.awaitReactions(filter, { time: 15000 });
+ const reactions = await message.awaitReactions({ filter, time: 15000 });
```

### Costumbre con los nombres

Algunos nombres de uso común en discord.js han cambiado.

#### Algo#algoId

El nombre de las propiedades con el formato `algoID` han cambiado a `algoId`. discord.js ahora usa [camelCase o 'letra de caja camello'](https://es.wikipedia.org/wiki/Camel_case) ya que `Id` es una abreviación de 'identificador', no un acrónimo.

Esto incluye: `afkChannelId`, `applicationId`, `channelId`, `creatorId`, `guildId`, `lastMessageId`, `ownerId`, `parentId`, `partyId`, `processId`, `publicUpdatesChannelId`, `resolveId`, `rulesChannelId`, `sessionId`, `shardId`, `systemChannelId`, `webhookId`, `widgetChannelId` y `workerId`.

```diff
- console.log(guild.ownerID);
+ console.log(guild.ownerId);

- console.log(interaction.channelID);
+ console.log(interaction.channelId);
```

#### Client#message

El evento `message` ha sido renombrado a `messageCreate` para igualar la librería con las nomenclaturas de Discord.
El uso de `message` seguirá funcionando, pero recibirás una advertencia de característica obsoleta hasta que lo cambies.

```diff
- client.on("message", message => { ... });
+ client.on("messageCreate", message => { ... });
```

### Menciones permitidas

¡`clientOptions#disableMentions` ha sido removido y reemplazado por `clientOptions#allowedMentions`!
La API de Discord ahora permite un control mucho más granular a los bots sobre el análisis de menciones.

Si quieres saber más sobre esto, mira la [documentación de la API de Discord (en inglés)](https://discord.com/developers/docs/resources/channel#allowed-mentions-object).

```diff
- const client = new Discord.Client({ disableMentions: 'everyone' });
+ const client = new Discord.Client({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true } });
```

### Respuestas / Message#reply

El comportamiento de `Message#reply` ha cambiado: en vez de agregar una mención al usuario, usará la función de respuesta de Discord.

`MessageOptions#reply` ahora espera un objeto de tipo `ReplyOptions`. `MessageOptions#reply#messageReference` recibe la ID del mensaje.

```diff
- channel.send('content', { reply: '123456789012345678' }); // ID del usuario
+ channel.send({ content: 'content', reply: { messageReference: '765432109876543219' }}); // ID del mensaje
```

La opción `MessageOptions.allowedMentions.repliedUser` determina si la respuesta notifica al autor del mensaje original.

```diff
- message.reply('¡Hola!')
+ message.reply({ content: '¡Hola!', allowedMentions: { repliedUser: false }})
```

Tenga en cuenta que esto deshabilitará todas las demás menciones en este mensaje. Para habilitar otras menciones, necesitará incluir otros valores en `allowedMentions`. Consulte la sección `Menciones permitidas` para obtener mas infomación.

### Campos de bits (bitfields)
<!-- No tienen nada que ver los permisos con los bitfields -->
Estos campos ahora son `BigInt`s en lugar de `Number`s. Esto puede ser gestionado usando la clase `BigInt()`, o agregando la `n` como sufijo. Para más información sobre `BigInt`s, revisa la [documentación (en inglés)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).

Usando permisos:
```diff
- const p = new Permissions(104324673);
+ const p = new Permissions(BigInt(104324673));
+ const p = new Permissions(104324673n);
```
Evita usar cadenas como `Permissions` y `UserFlags`, hay "flags" en su lugar.

```diff
- permissions.has('SEND_MESSAGES')
+ permissions.has(Permissions.FLAGS.SEND_MESSAGES)
```

### Canales de mensajes directos

En la API de Discord v8 y superior, los canales de mensajes directos no emiten el evento `CHANNEL_CREATE`, lo que significa que discord.js no puede añadirlos en caché automáticamente. Para que tu bot pueda recibir mensajes directos debes activar el [parcial (partial)](/temas-populares/parciales.md) llamado `CHANNEL`.

### Versión para navegadores (Webpack builds)

La versión para navegadores ya no es soportada por discord.js

## Cambios y eliminaciones

### ActivityType

El tipo `CUSTOM_STATUS` ha sido renombrado a `CUSTOM`.

### APIMessage

La clase `APIMessage` ha sido renombrada a `MessagePayload`, resolviendo un conflicto de nombres con una interfaz en la librería `discord-api-types` que representa el objeto de un mensaje en bruto.

### Channel

#### Channel#type

Los tipos de canales ahora son en mayúsculas y se igualan con la nomenclatura de Discord.

```diff
- if(channel.type === 'text') channel.send('Contenido');
+ if(channel.type === 'GUILD_TEXT') channel.send('Contenido');
```

### Client

#### Client#emojis

El administrador de emojis del cliente ahora es un `BaseGuildEmojiManager`, que solo proprociona resolución de caché y elimina métodos que no podian crear emojis ya que no habia contexto de `Guild`.

#### Client#fetchApplication

El método `Client#fetchApplication` ha sido removido y reemplazado con la propiedad `Client#application`.

```diff
- client.fetchApplication().then(application => console.log(application.name))
+ console.log(client.application.name);
```

#### Client#fetchWidget

Este método ha sido renombrado a `fetchGuildWidget` para representar mejor qué es lo que hace.

#### Client#generateInvite

`Client#generateInvite` ahora recibe `InviteGenerationOptions` en vez de `PermissionsResolvable` como argumento. `InviteGenerationOptions` necesita al menos un "scope", `bot` o `applications.commands`, para generar una URL de invitación válida.

Para generar una invitación con permisos de comandos de barra diagonal:

```js
client.generateInvite({ scopes: ['applications.commands'] });
```

Tambien puedes definir los permisos necesarios:

```diff
- client.generateInvite([Permissions.FLAGS.SEND_MESSAGES]);
+ client.generateInvite({ scopes: ['bot'], permissions: [Permissions.FLAGS.SEND_MESSAGES] })
```

#### Client#login

Cuando tu token se reiniciaba por llegar al límite de 1000 inicios de sesión en 1 día, discord.js lo consideraba un ratelimit y esperaba a que pueda iniciar sesión sin avisar al usuario. Ahora tira un `Error` si esto ocurre.

#### Client#setInterval
#### Client#setTimeout
#### Client#setImmediate

Los métodos `Client#setInterval`, `Client#setTimeout` y `Client#setImmediate` han sido removidos. Estos métodos existían para almacenar "relojes" en caché de manera interna para que se eliminen una vez el cliente sea destruido.
Ya que ahora esos "relojes" tienen el método `unref` en Node.js, esto no es necesario.

### ClientOptions

#### ClientOptions#fetchAllMembers

La opción `ClientOptions#fetchAllMembers` ha sido removida.

Con la introducción de los Gateway Intents, la opción `fetchAllMembers` del cliente puede fallar y causar significantes retrasos en el inicio del bot o causar un error de tiempo de espera agotado.
Como su propósito contradice las intenciones de Discord de reducir el acceso a datos de usuarios y de presencia, esta opción se ha eliminado.

#### ClientOptions#messageCacheMaxSize

La opción `ClientOptions#messageCacheMaxSize` ha sido removida. En su lugar, usa [`ClientOptions#makeCache`](#customizable-manager-caches) para personalizar la caché del `MessageManager`.

#### ClientOptions#messageEditHistoryMaxSize

La opción `ClientOptions#messageEditHistoryMaxSize` ha sido removida.

Para reducir el caché, discord.js no almacenará un historial de ediciones. Ahora tendrás que implementar esto por tí mismo si lo necesitas.

### ClientUser

#### ClientUser#setActivity

El método `ClientUser#setActivity` ya no devuelve una promesa.

#### ClientUser#setAFK

El método `ClientUser#setAFK` ya no devuelve una promesa.

#### ClientUser#setPresence

El método `ClientUser#setPresence` ya no devuelve una promesa.

`PresenceData#activity` fue reemplazado por `PresenceData#activities`, el cual ahora necesita un `Array<ActivitiesOptions>`.

```diff
- client.user.setPresence({ activity: { name: 'The Game' } });
+ client.user.setPresence({ activities: [{ name: 'The Game' }] });
```

#### ClientUser#setStatus

El método `ClientUser#setStatus` ya no devuelve una promesa.

### Collection

#### Collection#array()
#### Collection#keyArray()

Estos métodos existían para proporcionar acceso a un array en caché de valores y claves de `Collection` respectivamente, en el que se basaban internamente otros métodos de `Collection`.
Esos otros métodos han sido renombrados para dejar de depender del caché, así que esos arrays y esos métodos han sido removidos.

En su lugar podrías hacer un array esparciendo los iteradores retornados por los métodos de la clase base `Map`:

```diff
- collection.array();
+ [...collection.values()];

- collection.keyArray();
+ [...collection.keys()];
```

### ColorResolvable

Los colores fueron actualizados para igualarlo con los nuevos colores de Discord.

### Guild

#### Guild#addMember

Este método fue removido, su funcionalidad fue reemplazada por el nuevo `GuildMemberManager#add`.

```diff
- guild.addMember(user, { accessToken: token });
+ guild.members.add(user, { accessToken: token });
```

#### Guild#fetchBan
#### Guild#fetchBans

Estos métodos se han removido, con su funcionalidad remplazada por el nuevo `GuildBanManager`.

```diff
- guild.fetchBan(user);
+ guild.bans.fetch(user);

- guild.fetchBans();
+ guild.bans.fetch();
```

#### Guild#fetchInvites

Este método se ha removido, con su funcionalidad remplazada por el nuevo `GuildInviteManager`.

```diff
- guild.fetchInvites();
+ guild.invites.fetch();
```

#### Guild#fetchVanityCode

El método `Guild#fetchVanityCode` se ha removido.

```diff
- Guild.fetchVanityCode().then(code => console.log(`Vanity URL: https://discord.gg/${code}`));
+ Guild.fetchVanityData().then(res => console.log(`Vanity URL: https://discord.gg/${res.code} with ${res.uses} uses`));
```

#### Guild#fetchWidget

El método `Guild#fetchWidget()` ahora recupera los datos del widget del servidor en vez de configurarlo. Ver `Client#fetchGuildWidget()`.
La funcionalidad original ha sido movida al nuevo método `Guild#fetchWidgetSettings()`

#### Guild#member

El método de ayuda/atajo `Guild#member()` se ha removido.

```diff
- guild.member(user);
+ guild.members.cache.get(user.id)
```

### Guild#mfaLevel

La propiedad `Guild#mfaLevel` ahora es una enumeración.

### Guild#nsfw

La propiedad `Guild#nsfw` ha sido removida, remplazada por `Guild#nsfwLevel`.

#### Guild#owner

La propiedad `Guild#owner` ha sido removida ya que no era confiable debido al almacenamiento en caché, remplazada por `Guild#fetchOwner`.

```diff
- console.log(guild.owner);
+ guild.fetchOwner().then(console.log);
```

#### Guild#setWidget

El método `Guild#setWidget()` ha sido renombrado a `Guild#setWidgetSettings()`.

#### Guild#voice

La propiedad `Guild#voice` ha sido removida, aún puedes usar `Guild#me#voice`.

```diff
- guild.voice
+ guild.me.voice
```

### GuildChannel

#### GuildChannel#createOverwrite

Este método ha sido removido. Su funcionalidad fue reemplazada por el nuevo `PermissionOverwriteManager`.

```diff
- channel.createOverwrite(user, { VIEW_CHANNEL: false });
+ channel.permissionOverwrites.create(user, { VIEW_CHANNEL: false });
```

#### GuildChannel#createInvite
#### GuildChannel#fetchInvites

Estos métodos fueron removidos de `GuildChannel` y colocados únicamente en sub-clases para las cuales se puedan crear invitaciones. Estos son `TextChannel`, `NewsChannel`, `VoiceChannel`, `StageChannel`, y `StoreChannel`.

En estas subclases, el método ahora soporta opciones adicionales:

- `targetUser` para definir la invitación a unirse a un usuario de transmisión en particular
- `targetApplication` para definir la invitación a una actividad de Discord particular
- `targetType` define el tipo de objetivo para esta invitación; usuario o aplicación

#### GuildChannel#overwritePermissions

Este método fue removido, con su funcionalidad reemplazada por el nuevo `PermissionOverwriteManager`.

```diff
- channel.overwritePermissions([{ id: user.id , allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES'] }]);
+ channel.permissionOverwrites.set([{ id: user.id , allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES'] }]);
```

#### GuildChannel#permissionOverwrites

Este método ya no devuelve una `Collection` de `PermissionOverwrites`, este ahora proporciona acceso a `PermissionOverwriteManager`.

#### GuildChannel#setTopic

El método `GuildChannel#setTopic` fue removido y puesto únicamente en sub-clases para las cuales se puedan establecer el tema del canal. Estas son `TextChannel`, `NewsChannel`, y `StageChannel`.

#### GuildChannel#updateOverwrite

Este método fue removido, con su funcionalidad reemplazada por el nuevo `PermissionOverwriteManager`.

```diff
- channel.updateOverwrite(user, { VIEW_CHANNEL: false });
+ channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: false });
```

### GuildMember

#### GuildMember#ban

El método `GuildMember#ban()` devolverá un `TypeError` cuando se proporciona una cadena de texto en lugar de un objeto de opciones.

```diff
- member.ban('Razón')
+ member.ban({ reason: 'Razón' })
```

#### GuildMember#hasPermission

El método auxiliar/acortador `GuildMember#hasPermission` fue removido.

```diff
- member.hasPermission(Permissions.FLAGS.SEND_MESSAGES);
+ member.permissions.has(Permissions.FLAGS.SEND_MESSAGES);
```

#### GuildMember#lastMessage

#### GuildMember#lastMessageChannelId

Ninguna de estas propiedades fue proporcionada por Discord, sino que se basó en una caché potencialmente inexacta, y fue eliminado.

#### GuildMember#presence

La propiedad `GuildMember#presence` ahora puede ser `null` en lugar del objeto genérico con `offline`, por ejemplo, cuando el `Intent` `GUILD_PRESENCES` no está activado.

### GuildMemberManager

#### GuildMemberManager#ban

El método `GuildMemberManager#ban` devolverá un `TypeError` cuando se proporciona una cadena de texto en lugar de un objeto de opciones.

```diff
- guild.members.ban('123456789012345678', 'Razón')
+ guild.members.ban('123456789012345678', { reason: 'Razón' })
```

### Message / MessageManager

#### Message#delete

El método `Message.delete()` no aceptara ningún tipo de opción adicional; si necesitas programar la eliminación de un mensaje, lo deberás hacer manualmente.

```diff
- message.delete({ timeout: 10000 });
+ setTimeout(() => message.delete(), 10000);
```

El parámetro `reason` no lo usa la API de Discord en dicha acción.

#### MessageManager#delete

El método `MessageManager.delete()` no aceptara ningún tipo de opción adicional; si necesitas programar la eliminación de un mensaje, lo deberás hacer manualmente.

```diff
- channel.messages.delete('123456789012345678', { timeout: 10000 });
+ setTimeout(() => channel.messages.delete('123456789012345678'), 10000);
```

El parámetro `reason` no lo usa la API de Discord en dicha acción.

#### Message#edits

La propiedad `Message#edits` ha sido removida.

### MessageEmbed

#### MessageEmbed#attachFiles

El método `MessageEmbed#attachFiles` fue removido. Ahora, los archivos deben adjuntarse al mensaje directamente a través de `MessageOptions`.

```diff
- channel.send({ embeds: [new MessageEmbed().setTitle("Archivos").attachFiles(file)] })
+ channel.send({ embeds: [new MessageEmbed().setTitle("Archivos")], files: [file] })
```

### Permissions

#### Permissions#FLAGS.MANAGE_EMOJIS

`Permissions.FLAGS.MANAGE_EMOJIS` ahora es `Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS`.

### ReactionUserManager

#### ReactionUserManager#fetch

La opción `before` fue removida ya que no era compatible con la API.

### RoleManager

#### RoleManager#create

Las opciones pasadas a `RoleManager#create` ya no necesitan un objeto `data`.
Adicionalmente, `reason` es ahora parte de las opciones, no un segundo parámetro.

```diff
- guild.roles.create({ data: { name: "Nuevo rol" } }, "Creando un nuevo rol");
+ guild.roles.create({ name: "Nuevo rol", reason: "Creando un nuevo rol"})
```

#### RoleManager#fetch

El método `RoleManager#fetch()` ahora devuelve una `Collection` en vez de un `RoleManager` cuando es llamado sin parámetros.

### Shard

#### Shard#respawn

Las opciones para el método `Shard#respawn` son ahora un objeto en vez de varios parámetros.
En adición, el parámetro `spawnTimeout` fue renombrado a `timeout`.
Esto significa que el usuario ya no necesita escribir valores por defecto para completar (posicionalmente) los parámetros.

```diff
- shard.respawn(500, 30000);
+ shard.respawn({ delay: 500, timeout: 30000 });
```

#### Shard#spawn

El parámetro `spawnTimeout` fue renombrado a `timeout`.

### ShardClientUtil

#### ShardClientUtil#broadcastEval

El método `ShardClientUtil#broadcastEval` ya no acepta una cadena de texto, sino que espera una función.

```diff
- client.shard.broadcastEval('this.guilds.cache.size')
+ client.shard.broadcastEval(client => client.guilds.cache.size)
		.then(results => console.log(`${results.reduce((prev, val) => prev + val, 0)} guilds totales`))
		.catch(console.error);
```

#### ShardClientUtil#respawnAll

Las opciones para el método `ShardClientUtil#respawnAll` son ahora un objeto en vez de varios parámetros.
En adición, el parámetro `spawnTimeout` fue renombrado a `timeout`.
Esto significa que el usuario ya no necesita escribir valores predeterminados para completar cada parámetro posicional.

```diff
- client.shard.respawnAll(5000, 500, 30000);
+ client.shard.respawnAll({ shardDelay: 5000, respawnDelay: 500, timeout: 30000 });
```

### ShardingManager

#### ShardingManager#broadcastEval

El método `ShardingManager#broadcastEval` ya no acepta una cadena de texto, sino que espera una función. Ve `ShardClientUtil#broadcastEval`.

#### ShardingManager#spawn

Las opciones para el método `ShardingManager#spawn` son ahora un objeto en vez de varios parámetros.
En adición, el parámetro `spawnTimeout` fue renombrado a `timeout`.
Esto significa que el usuario ya no necesita escribir valores por defecto para completar (posicionalmente) los parámetros.

```diff
- manager.spawn('auto', 5500, 30000);
+ manager.spawn({ amount: 'auto', delay: 5500, timeout: 30000 });
```

#### ShardingManager#respawnAll

Las opciones para el método `ShardingManager#respawnAll` son ahora un objeto en vez de varios parámetros.
En adición, el parámetro `spawnTimeout` fue renombrado a `timeout`.
Esto significa que el usuario ya no necesita escribir valores por defecto para completar (posicionalmente) los parámetros.

```diff
- manager.respawnAll(5000, 500, 30000);
+ manager.respawnAll({ shardDelay: 5000, respawnDelay: 500, timeout: 30000 });
```

### TextChannel

#### TextChannel#startTyping

#### TextChannel#stopTyping

Ambos métodos han sido reemplazados por uno solo `TextChannel.sendTyping()`. Este método deja de escribir automáticamente después de 10 segundos o cuando se envia un mensaje.

### User

#### User#lastMessage

#### User#lastMessageId

Ninguna de estas propiedades fue proporcionada por Discord, sino que se basó en una caché potencialmente inexacta y fue eliminado.

#### User#locale

La propiedad `User.locale` fue removida, ya que esta propiedad no está expuesta a bots.

#### User#presence

La propiedad `User.presence` fue removida. Las presencias ahora solo se encuentran en `GuildMember`.

#### User#typingIn

Como Discord.js ya no almacena en caché los datos de eventos de escritura, el metodo `User.typingIn()` fue removido.

#### User#typingSinceIn

Como Discord.js ya no almacena en caché los datos de eventos de escritura, el metodo `User.typingSinceIn()` fue removido.

#### User#typingDurationIn

Como Discord.js ya no almacena en caché los datos de eventos de escritura, el metodo `User.typingDurationIn()` fue removido.

### UserFlags

Las `UserFlags` obsoletas `DISCORD_PARTNER` y `VERIFIED_DEVELOPER` / `EARLY_VERIFIED_DEVELOPER` fueron removidas a favor de sus versiones renombradas.

```diff
- user.flags.has(UserFlags.FLAGS.DISCORD_PARTNER)
+ user.flags.has(UserFlags.FLAGS.PARTNERED_SERVER_OWNER)

- user.flags.has(UserFlags.FLAGS.VERIFIED_DEVELOPER)
+ user.flags.has(UserFlags.FLAGS.EARLY_VERIFIED_BOT_DEVELOPER)
```

La nueva "flag" `DISCORD_CERTIFIED_MODERATOR` fue agregada.

### Util

Los accesos directos del nivel superior, que redirigian a los métodos de esta clase, fueron eliminados.

#### Util#convertToBuffer

#### Util#str2ab

Ambos fueron eliminados a favor de los métodos de búfer integrados de Node.js.

#### Util#fetchRecommendedShards

El método `Util#fetchRecommendedShards()` ahora soporta opciones adicionales `multipleOf` para calcular el número a redondear, p. ej. un múltiplo de 16 para los `shards` de bot grandes.

#### Util#resolveString

El método `Util#resolveString` fue removido. Discord.js obliga a los usuarios a colocar o definir cadenas donde sea pedido, en vez de intentar resolver la cadena de un objeto diferente.

### VoiceState

#### VoiceState#kick

El método `VoiceState#kick` fue renombrado a `VoiceState#disconnect`.

### WebhookClient

El constructor `WebhookClient` ya no acepta `id, token` como los primeros parámetros, ahora este acepta un objeto `data`. Este objeto admite una opción adicional `url`, que permite la creación de un `WebhookClient` a partir de la URL de un webhook.

```diff
- new WebhookClient(id, token, options);
+ new WebhookClient({ id, token }, options);

+ new WebhookClient({ url }, options);
```

## Additions

### ActivityTypes

Se ha añadido un nuevo tipo de actividad `COMPETING` (la traducción oficial es: "Compitiendo en").

### ApplicationCommand

Proporciona compatibilidad con API para los comandos de barra diagonal.

### ApplicationCommandManager

Proporciona soporte de la API para crear, editar y eliminar comandos de barra diagonal.

### ApplicationCommandPermissionsManager

Proporciona compatibilidad con la API para crear, editar y eliminar sobrescrituras de permisos en los comandos de barra diagonal.

### ApplicationFlags

Proporciona campos de bits enumerados para los "flags" de `ClientApplication`.

### BaseGuild

La nueva clase `BaseGuild` se extiende por `Guild` y `OAuth2Guild`.

### BaseGuildTextChannel

La nueva clase `BaseGuildTextChannel` se extiende por `TextChannel` y `NewsChannel`.

### BaseGuildVoiceChannel

La nueva clase `BaseGuildVoiceChannel` se extiende por `VoiceChannel` y `StageChannel`.

### ButtonInteraction

Proporciona soporte de `gateway` para `MessageComponentInteraction` viniendo de un botón.

### Channel

#### Channel#isText()

Revisa y comprueba si un canal está basado en texto (implementa `TextBasedChannel`); uno de `TextChannel`, `DMChannel`, `NewsChannel` o `ThreadChannel`.

#### Channel#isThread()

Revisa y comprueba si un canal es un `ThreadChannel`.

#### Channel#isVoice()

Revisa y comprueba si un canal basado en voz (extiende `BaseGuildVoiceChannel`); `VoiceChannel` o `StageChannel`.

### Client

#### Client#applicationCommandCreate

Emitido cuando un comando de la aplicación a nivel de servidor es creado.

#### Client#applicationCommandDelete

Emitido cuando un comando de la aplicación a nivel de servidor es eliminado.

#### Client#applicationCommandUpdate

Emitido cuando un comando de la aplicación a nivel de servidor es actualizado.

#### Client#interactionCreate

Emitido cuando una interacción es creada.

#### Client#stageInstanceCreate

Emitido cuando una instancia de escenario es creada.

#### Client#stageInstanceDelete

Emitido cuando una instancia de escenario es eliminada.

#### Client#stageInstanceUpdate

Emitido cuando una instancia de escenario es actualizada, ej. cambio de tema o nivel de privacidad.

#### Client#stickerCreate

Emitido cuando una pegatina personalizada es creada en un servidor.

#### Client#stickerDelete

Emitido cuando una pegatina personalizada es borrada en un servidor.

#### Client#stickerUpdate

Emitido cuando una pegatina personalizada es actualizada en un servidor.

#### Client#threadCreate

Emitido cuando un hilo es creado o si el bot es añadido a uno.

#### Client#threadDelete

Emitido cuando un hilo es eliminado.

#### Client#threadListSync

Emitido cuando el cliente obtiene acceso a un canal de texto o de noticias que contiene hilos.

#### Client#threadMembersUpdate

Emitido cuando se agregan o eliminan miembros de un hilo. Requiere el `Intent` privilegiado `GUILD_MEMBERS`.

#### Client#threadMemberUpdate

Emitido cuando se actualiza el miembro de un hilo.

#### Client#threadUpdate

Emitido cuando un hilo es actualizado, por ejemplo: cambia de nombre, o estado a archivado o cerrado.

### ClientOptions

#### ClientOptions#failIfNotExists

El parámetro establece el comportamiento por defecto para `ReplyMessageOptions#failIfNotExists`, tirando un error o ignorando silenciosamente cuando se responde a un mensaje desconocido.

### CollectorOptions

#### CollectorOptions#filter

Este parámetro es opcional y recurrirá a una función que siempre devuelve `true` si no se otorga ningún parámetro.

### CommandInteraction

Proporciona soporte de la gateway para las interacciones de los comandos de barra diagonal.
Para más información, visita la sección para los [comandos de barra diagonal](/interacciones/registrando-comandos-de-barra.html) de esta guía.

### Guild

#### Guild#bans

Proporciona acceso al `GuildBanManager` del servidor.

#### Guild#create

`Guild#systemChannelFlags` ahora puede establecerse en el método `Guild#create`.

#### Guild#edit

Las propiedades `Guild#description` y `Guild#features` ahora pueden ser editadas.

#### Guild#editWelcomeScreen

Proporciona soporte de la API para que los bots editen el `WelcomeScreen` del servidor.

#### Guild#emojis

La clase `GuildEmojiManager` ahora extiende `BaseGuildEmojiManager`.
En adición a los métodos existentes, ahora soporta `GuildEmojiManager#fetch`.

#### Guild#fetchWelcomeScreen

Proporciona soporte de la API para buscar el `WelcomeScreen` de los servidores.

#### Guild#fetchWidget

Proporciona soporte de la API para el Widget del servidor, conteniendo información sobre el servidor y sus miembros.

#### Guild#invites

Proporciona acceso al nuevo `GuildInviteManager`.

#### Guild#nsfwLevel

La propiedad `Guild#nsfwLevel` ahora se representa con la enumeración `NSFWLevel`.

#### Guild#premiumTier

La propiedad `Guild#premiumTier` ahora se representa con la enumeración `PremiumTier`.

#### Guild#setChannelPositions

Ahora soporta establecer la categoría para múltiples canales, y bloquea sus permisos vía las opciones `ChannelPosition#parent` y `ChannelPosition#lockPermissions`.

### GuildBanManager

Proporciona soporte improvisado a la API para manejar y obtener bans.

### GuildChannel

#### GuildChannel#clone

Ahora soporta establecer la propiedad `position`.

### GuildChannelManager

#### GuildChannelManager#fetch

Ahora soporta la consulta de varios canales de un servidor.

#### GuildChannelManager#fetchActiveThreads

Obtiene una lista de los hilos activos en el servidor.

### GuildInviteManager

Podrás crear y consultar invitaciones con el nuevo formato del administrador.
Esto reemplaza `Guild#fetchInvites`.

### GuildManager

#### GuildManager#create

Ahora funciona especificando los canales de AFK y sistema cuando se crea un servidor.

#### GuildManager#fetch

Ahora soporta el poder consultar múltiples servidores, devolviendo una `Promise<Collection<Snowflake, OAuth2Guild>>` si se usa de esta manera.

### GuildEmojiManager

#### GuildEmojiManager#fetch

Proporciona soporte de la API para el endpoint `GET /guilds/{guild.id}/emojis`.

### GuildMember

#### GuildMember#pending

Define si el miembro pasó la pantalla de bienvenida del servidor.
Devuelve `true` si no ha aceptado y emite el evento `guildMemberUpdate` cuando la acepta.

### GuildMemberManager

Se agregaron varios métodos a `GuildMemberManager` para proporcionar compatibilidad con API para miembros no almacenados en caché.

#### GuildMemberManager#edit

`guild.members.edit('123456789012345678', data, reason)` es equivalente a `GuildMember#edit(data, reason)`.

#### GuildMemberManager#kick

`guild.members.kick('123456789012345678', reason)` es equivalente a `GuildMember#kick(reason)`.

#### GuildMemberManager#search

Proporciona soporte de la API para consultar `GuildMember`s.
`GuildMemberManager#fetch` usa el gateway para recibir información.

### GuildMemberRoleManager

#### GuildMemberRoleManager#botRole

Obtiene el rol administrado que el miembro creó al unirse al servidor, si lo hay

#### GuildMemberRoleManager#premiumSubscriberRole

Obtiene el rol de suscriptor premium (booster) si el miembro lo presenta.

### GuildPreview

#### GuildPreview#createdAt

#### GuildPreview#createdTimestamp

La fecha en la que se creó el `GuildPreview`

### GuildTemplate

Proporciona soporte de la API para [plantillas de servidores](https://discord.com/developers/docs/resources/guild-template).

### Integration

#### Integration#roles

Una `Collection` de roles los cuales son administrados por una integración.

### Interaction

Proporciona soporte del gateway para los comandos de barra diagonal e interacciones con componentes.

Para más información consulta las páginas para los [comandos de barra diagonal](/interacciones/respondiendo-a-comandos-de-barra.md) y los [componentes](/interacciones/botones.html#respondiendo-a-botones) de esta guía.

### InteractionCollector

Proporciona una forma para que los usuarios recopilen cualquier tipo de interacción.
Esta clase tiene un diseño más flexible que otros `Collectors`, pudiendo estar vinculado a cualquier servidor, canal o mensaje según corresponda.
Los desarrolladores de TypeScript pueden aprovechar el tipado genérico para definir las sub-clases de interacciones que serán devueltas.

### InteractionWebhook

Proporciona soporte de webhook específicamente para interaciones debido a sus cualidades únicas.

### InviteGuild

Proporciona soporte de la API para un `Guild` parcial de un `Invite`.

### InviteStageInstance

Proporciona soporte de la API para invitar usuarios a escenarios.

### Message

#### Message#awaitMessageComponent

Un acceso directo para crear un `InteractionCollector` en forma de promesa que se resuelve en un solo `MessageComponentInteraction`.

#### Message#createMessageComponentCollector

Un acceso directo para crear `InteractionCollector` para componentes de un mensaje en específico.

#### Message#crosspostable

Verifica permisos para ver si puede publicar un mensaje.

#### Message#edit

Editar y/o eliminar los archivos adjuntos cuando editas un `Message` ahora es posible.

#### Message#fetchReference

Proporciona soporte para buscar el `Message` respondido con `Message#reference`, si el cliente tiene acceso para hacerlo.

#### Message#react

Ahora soporta `<:name:id>` y `<a:name:id>` como parámetros válidos.

#### Message#removeAttachments

Elimina los archivos adjuntos de un mensaje. Se necesita el permiso `MANAGE_MESSAGES` para eliminar los archivos adjuntos de mensajes de otros miembros.

#### Message#startThread

Comienza un hilo (`ThreadChannel`) usando este mensaje como primer mensaje.

#### Message#stickers

Una `Collection` de pegatinas en un `Message`.

### MessageActionRow

Una clase constructora que hace la construcción de filas de acción (componente tipo `MessageActionRow`) más fácil.

### MessageAttachment

#### MessageAttachment#contentType

El tipo de contenido multimedia de un `MessageAttachment`.

### MessageButton

Una clase constructora que hace la construcción de botones (componente tipo `MessageButton`) más fácil.

### MessageComponentInteraction

Proporciona soporte del gateway para recibir interacciones de componentes. Sub-clase de `Interaction`.

### MessageEmbed

#### MessageEmbed#setFields

Reemplaza todos los campos de un embed con un nuevo array de campos proporcionado.

`embed.setFields(newFields)` es equivalente a `embed.spliceFields(0, embed.fields.length, newFields)`.

### MessageManager

Se añadieron métodos a `MessageManager` para dar soporte de la API para mensajes fuera del caché.

#### MessageManager#crosspost

`channel.messages.crosspost('876543210987654321')` es equivalente a `message.crosspost()`.

#### MessageManager#edit

`channel.messages.edit('876543210987654321', content, options)` es equivalente a `message.edit(content, options)`.

#### MessageManager#pin

`channel.messages.pin('876543210987654321', options)` no resuelve `Message`, `message.pin(options)` si.

#### MessageManager#react

`channel.messages.react('876543210987654321', emoji)` no resuelve `MessageReaction`, `message.react(emoji)` si.

#### MessageManager#unpin

`channel.messages.unpin('876543210987654321', options)` no resuelve `Message`, `message.unpin(options)` si.

### MessageMentions

#### MessageMentions#repliedUser

Revisa si el autor del mensaje respondido fue mencionado.

### MessagePayload

Esta clase fue renombrada de `APIMessage`.
Headers globales ahora pueden ser establecidos en las opciones HTTP.

### MessageSelectMenu

Una clase constructora que hace la construcción de menús selectivos (componente tipo `MessageSelectMenu`) más fácil.

### NewsChannel

#### NewsChannel#addFollower

Proporciona soporte de API para seguir anuncios de otros canales.

#### NewsChannel#setType

Permite convertir entre `TextChannel` y `NewsChannel`.

### Permissions

#### Permissions#STAGE_MODERATOR

Campo de bits estático que representa los permisos requeridos para ser un moderador de escenario.

### PermissionOverwriteManager

Los métodos `createOverwrite`, `updateOverwrite` y `overwritePermissions` de `GuildChannel` ahora son accesibles desde `PermissionOverwriteManager`.

### Role

#### Role#tags

Contiene los etiquetas de un rol (si es de un bot, integración o suscripción premium)

### RoleManager

#### RoleManager#botRoleFor

Consigue el rol de un bot que se crea al unirse al servidor, si existe.

#### RoleManager#edit

`guild.roles.edit('123456789098765432', options)` es equivalente a `role.edit(options)`.

#### RoleManager#premiumSubscriberRole

Consigue el rol que se les da a los usuarios por mejorar el servidor, si existe.

### SelectMenuInteraction

Proporciona soporte de gateway para `MessageComponentInteraction` los cuales provienen de un menú selectivo.

### StageChannel

Proporciona soporte de la API para los canales de escenario.

### StageInstance

Proporciona soporte de la API para las instancias de escenarios. Las instancias de eventos contienen información de eventos en vivo.

### StageInstanceManager

Proporciona soporte de la API para crear, editar y borrar canales de escenario, al igual que almacenarlos en caché.

### Sticker

Proporciona soporte de la API para las pegatinas.

### StickerPack

Proporciona soporte de la API para los paquetes de pegatinas.

### TextChannel

#### TextChannel#awaitMessageComponent

Un acceso directo para crear un `InteractionCollector` en forma de promesa que se resuelve en un solo `MessageComponentInteraction`.

#### TextChannel#createMessageComponentCollector

Un método de acceso directo para crear un `InteractionCollector` para componentes en un canal especifico.

#### TextChannel#setType

Permite convertir entre `TextChannel` y `NewsChannel`.

#### TextChannel#threads

Proporciona acceso al `ThreadManager` para este canal.

### ThreadChannel

Proporciona soporte de la API para `hilos`.

### ThreadChannelManager

Proporciona soporte de la API para que el bot cree, edite y elimine `hilos`, y almacene caché de `ThreadChannels`.

### ThreadMember

Rperesenta un miembro de un `hilo` y  sus metadatos específicos del `hilo`

### ThreadMemberManager

Proporciona soporte de API para que el bot agregue y elimine miembros de un `hilo`, y almacena caché de `ThreadMembers`.

### Webhook

#### Webhook#deleteMessage

Los Webhooks ahora pueden borrar mensajes enviados por el Webhook.

#### Webhook#editMessage

Los Webhooks ahora pueden editar mensajes que fueron enviados por el Webhook.

#### Webhook#fetchMessage

Los Webhooks ahora pueden buscar los mensajes enviados por el Webhook.

#### Webhook#sourceChannel

#### Webhook#sourceGuild

Los webhooks ahora pueden tener `sourceGuild` y `sourceChannel` si el mensaje es difundido (crossposted).

### WelcomeChannel

Representa los canales que se pueden ver en una `Guild#WelcomeScreen`.

### WelcomeScreen

Proporciona soporte de API para la pantalla de bienvenida de un `Guild`

### Widget

Representa un `Widget` de un `Guild`.

### WidgetMember

Información parcial sobre los miembros de un `Guild` almacenados en un widget.

### Util

#### Métodos para el formato

Se proporcionan varias funciones para el formato, nuevas en la clase `Util`, para administrar la adición de Markdown en cadenas de texto.

#### Util#resolvePartialEmoji

Un método auxiliar que intenta resolver las propiedades de un objeto emoji en bruto a partir de datos de entrada, sin el uso de la clase `Client` de discord.js o el `EmojiManager` del mismo.

#### Util#verifyString

Un método auxiliar que se utiliza para validar internamente los argumentos de cadena de texto proporcionados a los métodos en Discord.js.
