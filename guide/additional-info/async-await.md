# Entendiendo async/await

:::tip
En esta parte de la guía se le hará referencia a las Promises como "promesas".
:::

Si no estás muy familiarizado con el estándar ECMAScript 2017, es posible que no sepas acerca de async/await. Es una forma útil de manejar promesas de una manera izada. También es ligeramente rápido y aumenta legibilidad general.

## ¿Cómo funcionan las promesas?

Antes de introducirnos a async/await, deberías saber qué son las Promises y cómo es que funcionan, porque async/await es sólo una forma de manejar las promesas. Si ya sabes qué son las Promises y cómo funcionan, puedes saltarte esta parte.

Las promesas son una manera de manejar tareas asíncronas en JavaScript; son una nueva alternativa a las callbacks. Una promesa tiene algunas similitudes a una barra de progreso; representan un proceso inacabado y continuo. Un excelente ejemplo de ello es una petición a un servidor (p. ej. discord.js envía peticiones a la API de Discord).

Una promesa puede tener tres estados; pendiente, resuelta y rechazada.

El estado **pendiente** (pending) significa que la promesa sigue en curso y ni se resuelve ni se rechaza.
El estado **resuelta** (resolved) significa que la promesa se realiza y se ejecuta sin errores.
El estado **rechazada** (rejected) significa que la promesa encontró un error y no se puede ejecutar correctamente.

Una cosa importante que hay que saber es que una promesa sólo puede tener un estado simultáneamente; nunca puede estar pendiente y resuelta, rechazada y resuelta o pendiente y rechazada. Te preguntarás, "¿Cómo se vería eso en código?". Aquí hay un pequeño ejemplo

::: tip CONSEJO
Este ejemplo usa código ES6. Si quieres saber qué es eso, deberías leer sobr ello [aquí](/guide/additional-info/es6-syntax.md)
:::

```js
function deleteMessages(amount) {
	return new Promise(resolve => {
		if (amount > 10) throw new Error('No puedes eliminar más de 10 mensajes a la vez');
		setTimeout(() => resolve('10 mensajes eliminados.'), 2000);
	});
}

deleteMessages(5).then(value => {
	// `deleteMessages` está completa y no ha encontrado ningún error.
	// el valor resuelto será la string "10 mensajes eliminados".
}).catch(error => {
	// `deleteMessages` encontró un error.
	// el error será un Error Object.
});
```

En este escenario, la función `deleteMessages` devuelve una promesa. El métofo `.then()` se activará si la promesa se resyelve, y el método `.catch()` si la promesa es rechazada. En la función `deleteMessages`, la promesa es resuelta después de 2 segundos con la string "10 mensajes eliminados.", así que el método `.catch()` nunca será ejecutado. También puedes pasar la función `.catch()` como segundo parámetro de `.then()`.
## Cómo implementar async/await

### Teoría

Es escencial conocer la siguiente información antes de trabajar con async/await. Sólo puedes usar la palabra clave `await` dentro de una función declarada como `async` (ponga la palabra clave `async` antes de la palabra clave `function` o antes de los parámetros cuando utilice una función callback).

Un ejemplo simple podría ser:

```js
async function declaredAsAsync() {
	// ...
}
```

o

```js 
const declaredAsAsync = async () => {
	// ...
};
```

También puedes usar eso si usas la función de flecha como oyente de eventos.


```js
client.on('event', async (primero, último) => {
	// ...
});
```

Una cosa importante a conocer es que una función declarada como `async` siempre devolvera una promesa. En adición a esto, si devuelves algo, la promesa se resolverá con ese valor, y si produce un error, rechazará la promesa con ese error.

### Ejecución con código de discord.js

Ahora que sabes cómo funcionan las promesas y para qué son utilizadas, veamos un ejemplo que maneja múltiples promesas. Digamos que quieres reaccionar con letras (indicadores regionales) en un orden específico. Para este ejemplo, aquí hay una plantilla básica para un bot de discord.js con algunos ajustes ES6.

```js
const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
	console.log('¡Estoy listo!');
});

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'reaccionar') {
		// ...
	}
});

client.login('tu-token-va-aquí');
```

Si no sabes cómo funciona la ejecución asíncrona de Node.JS, probablemente inentarías algo como esto:

```js {4-7}
client.on(Events.InteractionCreate, interaction => {
	// ...
	if (commandName === 'reaccionar') {
		const message = interaction.reply({ content: '¡Reaccionando!', fetchReply: true });
		message.react('🇦');
		message.react('🇧');
		message.react('🇨');
	}
});
```

Pero como todos estos métodos se ejecutan a la vez, sólo sería una carrera para ver cuál solicitud del servidor temrina primero, por lo que no habría ninguna garantía de que reaccionara (si el mensaje no se obtiene) o en el orden que usted quería que lo hiciera. Para asegurarte de que reacciona después de enviar el mensaje y según el orden, tendrías que usar el callback `.then()` de las promesas que devuelven éstos métodos. El código se vería algo así:

```js {4-12}
client.on(Events.InteractionCreate, interaction => {
	// ...
	if (commandName === 'reaccionar') {
		interaction.reply({ content: '¡Reaccionando!', fetchReply: true })
			.then(message => {
				message.react('🇦')
					.then(() => message.react('🇧'))
					.then(() => message.react('🇨'))
					.catch(error => {
						// manejar el fallo de cualquier rechazo de Promise aquí dentro
					});
			});
	}
});
```

En este fragmento de código, la promesa es una [cadena resuelta](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#Chaining) con cada una, y si una de las promesas es rechazada, la función `.catch()` es ejecutada. Aquí está el mismo código pero con async/await:

```js {1,4-7}
client.on(Events.InteractionCreate, async interaction => {
	// ...
	if (commandName === 'reaccionar') {
		const message = await interaction.reply({ content: '¡Reaccionando!', fetchReply: true });
		await message.react('🇦');
		await message.react('🇧');
		await message.react('🇨');
	}
});
```

Es mayormente el mismo código, pero ¿cómo detectarías los rechazos de promesas ahora que `.catch()` ya no existe? Esa es también una característica útil con async/await; el error será lanzado si esperas para que puedas envolver las promesas esperadas dentro de un try/catch, y listo.

```js {1,4-11}
client.on(Events.InteractionCreate, async interaction => {
	if (commandName === 'reaccionar') {
		try {
			const message = await interaction.reply({ content: '¡Reaccionando!', fetchReply: true });
			await message.react('🇦');
			await message.react('🇧');
			await message.react('🇨');
		} catch (error) {
			// manejar el fallo de cualquier rechazo de Promise aquí dentro
		}
	}
});
```

Este código se ve limpio y muy fácil de leer.

Te estarás preguntnado "¿Cómo obtendría el valor con el que se resolvió la promesa?"

Veamos un ejemplo en el que desea eliminar una respuesta enviada.

```js {3-9}
client.on(Events.InteractionCreate, interaction => {
	// ...
	if (commandName === 'eliminar') {
		interaction.reply({ content: 'Este mensaje se eliminará.', fetchReply: true })
			.then(replyMessage => setTimeout(() => replyMessage.delete(), 10000))
			.catch(error => {
				// manejar el error
			});
	}
});
```

El retorno de un método `.reply()` con la opción `fetchReply` establecida en `true` es una promesa que se resuelve con la respuesta cuando se ha enviado, pero ¿cómo sería el mismo código con async/await?

```js {1,4-10}
client.on(Events.InteractionCreate, async interaction => {
	if (commandName === 'eliminar') {
		try {
			const replyMessage = await interaction.reply({ content: 'Este mensaje será eliminado.', fetchReply: true });
			setTimeout(() => replyMessage.delete(), 10000);
		} catch (error) {
			// manejar el error
		}
	}
});
```

Con async/await, puedes asignar la función esperada a una variable que represente el valor devuelto. Ahora saber cómo usar async/await.