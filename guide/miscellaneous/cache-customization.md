# Personalización del caché

A veces es posible que desees personalizar el comportamiento de caché de discord.js para reducir el uso de memoria.
Para ello, discord.js te proporciona dos formas de hacerlo:

1. Limitando el tamaño de los cachés.
2. Eliminando periódicamente los elementos antiguos de los cachés.

::: danger CUIDADO
La personalización del comportamiento de caché es un tema avanzado.
Es muy fácil introducir errores si su caché personalizado no funciona como se espera.
:::

## Limitando cachés

Cuando creas un nuevo <DocsLink path="class/Client">`Client`</DocsLink>, puedes limitar el tamaño de los cachés, los cuales son específicos para ciertos managers, usando la opción `makeCache`.
Generalmente hablando, casi todas tus personalizaciones pueden ser hechas utilizando las funciones de ayuda del módulo <DocsLink path="class/Options">`Options`</DocsLink>.

Debajo están las configuraciones por defecto, las cuales limitaran el caché de los mensajes.

```js
const { Client, Options } = require('discord.js');

const client = new Client({
	makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
});
```

Para cambiar el comportamiento de caché de un tipo de manager, añádelo debajo de las configuraciones por defecto. Por ejemplo, puedes hacer que los cachés de las reacciones sean limitados a 0 elementos, es decir, que el cliente no almacene en caché las reacciones:

```js
const client = new Client({
	makeCache: Options.cacheWithLimits({
		...Options.DefaultMakeCacheSettings,
		ReactionManager: 0,
	}),
});
```

::: danger CUIDADO
Como se indica en la documentación, ¡personalizar `GuildManager`, `ChannelManager`, `GuildChannelManager`, `RoleManager` o `PermissionOverwriteManager` no es compatible! La funcionalidad se romperá con cualquier tipo de personalización.
:::

Podemos personalizar esto aún más pasando opciones a <DocsLink path="class/LimitedCollection">`LimitedCollection`</DocsLink>, una colección especial que limita el número de elementos. En el ejemplo de abajo, el cliente está configurado de tal manera que:

1. Solo se almacenen 200 miembros del servidor en caché por `GuildMemberManager` (esencialmente, por servidor).
2. Nunca hay que eliminar un miembro si este es el cliente. Esto es especialmente importante para que el cliente pueda funcionar correctamente en servidores

```js
const client = new Client({
	makeCache: Options.cacheWithLimits({
		...Options.DefaultMakeCacheSettings,
		ReactionManager: 0,
		GuildMemberManager: {
			maxSize: 200,
			keepOverLimit: member => member.id === client.user.id,
		},
	}),
});
```

## Eliminando cachés

En adición a los cachés limitados, también puedes eliminar periódicamente los elementos antiguos de los cachés. Cuando creas un nuevo <DocsLink path="class/Client">`Client`</DocsLink>, puedes personalizar la opción `sweepers`.

Debajo están los ajustes por defecto, los cuales eliminarán periódicamente los hilos.

```js
const { Client, Options } = require('discord.js');

const client = new Client({
	sweepers: Options.DefaultSweeperSettings,
});
```

Para cambiar el comportamiento de esta limpieza, puedes especificar el tipo de caché a limpiar (<DocsLink path="typedef/SweeperKey">`SweeperKey`</DocsLink>) y las opciones de limpieza (<DocsLink path="typedef/SweepOptions">`SweepOptions`</DocsLink>). Si el tipo de caché tiene un tiempo de vida asociado, como las invitaciones, mensajes o hilos, puedes establecer la opcion `lifetime` para eliminar elementos antiguos al tiempo especificado. En caso contrario, puedes establecer la opción `filter` para cualquier tipo de caché, la cual seleccionará los elementos a eliminar.

```js
const client = new Client({
	sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 3600, // Cada hora...
			lifetime: 1800,	// Eliminar mensajes antiguos con más de 30 minutos de creación.
		},
		users: {
			interval: 3600, // Cada hora...
			filter: user => user.bot && user.id !== client.user.id, // Eliminar todos los bots
		},
	},
});
```

::: tip CONSEJO
Échale un ojo a la documentación para ver qué tipos de caché puedes limpiar.
¡También revisa qué significa exactamente "lifetime" para invitaciones, mensajes y hilos!
:::
