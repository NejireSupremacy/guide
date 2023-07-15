# Ejemplos de sintaxis ES6

Si has usado JavaScript durante un período de tiempo (relativamente) corto o no tienes mucha experiencia con él, es posible que no sepas qué es ES6 y qué características y beneficios incluye. Dado que esta es una guía principalmente para bots de Discord, usaremos algo de código de discord.js como ejemplo de lo que podrías tener frente a lo que puedes hacer para beneficiarte de ES6.

Este es el código de inicio que utilizaremos:

<!-- eslint-disable prefer-template -->
<!-- eslint-disable prefer-destructuring -->

```js
const { Client, Events, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
	console.log('¡Encendido!');
});

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		interaction.reply('Pong.');
	} else if (commandName === 'beep') {
		interaction.reply('Boop.');
	} else if (commandName === 'server') {
		interaction.reply('Nombre del servidor: ' + interaction.guild.name + '\nTotal de miembros: ' + interaction.guild.memberCount);
	} else if (commandName === 'user-info') {
		interaction.reply('Tu nombre de usuario: ' + interaction.user.username + '\nTu ID: ' + interaction.user.id);
	}
});

client.login(config.token);
```

Por si no te has dado cuenta, ¡este trozo de código ya está utilizando un poco de sintaxis ES6 aquí! La palabra clave `const` y la declaración de función de flecha (`() => ...`) es sintaxis ES6, y recomendamos usarla siempre que sea posible

En cuanto al código anterior, hay algunos lugares donde las cosas se pueden hacer mejor. Veámoslos.

## Plantillas literarias

Si compruebas el código anterior, actualmente está haciendo cosas como `'Nombre del servidor: ' + interaction.guild.name` y `'Tu nombre de usuario: ' + interaction.user.username`, que es perfectamente válido. Sin embargo, es un poco difícil de leer y no es demasiado divertido teclearlo constantemente. Afortunadamente, hay una alternativa mejor

<!-- eslint-skip -->

```js
// Versión ES5, tal como la tenemos actualmente
else if (commandName === 'server') {
	interaction.reply('Nombre del servidor: ' + interaction.guild.name + '\nTotal de miembros: ' + interaction.guild.memberCount);
}
else if (commandName === 'user-info') {
	interaction.reply('Tu nombre de usuario: ' + interaction.user.username + '\nTu ID: ' + interaction.user.id);
}
```

<!-- eslint-skip -->

```js
// Versión ES6, utilizando plantillas literarias
else if (commandName === 'server') {
	interaction.reply(`Nombre del servidor: ${interaction.guild.name}\nTotal de miembros: ${interaction.guild.memberCount}`);
}
else if (commandName === 'user-info') {
	interaction.reply(`Tu nombre de usuario: ${interaction.user.username}\nTu ID: ${interaction.user.id}`);
}
```

Más fácil de leer y escribir. Lo mejor de ambos mundos.

### Plantillas literarias vs concatenación de strings

Si has utilizado otros lenguajes de programación, puede que estés familiarizado con el término "interpolación de strings". Las plantillas literarias serían la implementación de JavaScript de la interpolación de cadenas. Si está familiarizado con la sintaxis heredoc, es muy parecida; permite la interpolación de cadenas, así como las cadenas multilínea.

El ejemplo que sigue no entra en demasiados detalles al respecto, pero si le interesa leer más, puedes [leer sobre ellos en MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Template_literals).

```js
// variables/function used throughout the examples
const username = 'Sanctuary';
const password = 'porfavornomehackees';

function letsPretendThisDoesSomething() {
	return 'Viva los datos de muestra.';
}
```

<!-- eslint-disable prefer-template -->

```js
// concatenación regular de string
console.log('Tu nombre de usuario es: **' + username + '**.');
console.log('Tu contraseña es: **' + password + '**.');

console.log('1 + 1 = ' + (1 + 1));

console.log('Y aquí hay una función de llamada: ' + letsPretendThisDoesSomething());

console.log(
	'Poner strings a las nuevas líneas\n'
	+ 'puede ser un poco doloroso\n'
	+ 'con una concatenación de string :(',
);
```

```js
// plantillas literarias
console.log(`Tu contraseña es: **${password}**.`);
console.log(`Tu nombre de usuario es: **${username}**.`);

console.log(`1 + 1 = ${1 + 1}`);

console.log(`Y aquí hay una función de llamada: ${letsPretendThisDoesSomething()}`);

console.log(`
	Poner strings a las nuevas líneas
	es pan comido
	¡con plantillas literarias! :)
`);

// NOTA: las plantillas literarias también mostrarán la sangría dentro de ellas
// Hay formas de evitarlo, de las que hablaremos en otra sección.
```

Puedes ver cómo facilita las cosas y las hace más legibles. En algunos casos, ¡incluso puede hacer que tu código sea más corto! Esto es algo que querrás aprovechar tanto como sea posible.

## Funciones de flecha

Las funciones de flecha son una abreviatura de las funciones normales, con el añadido de que utilizan un contexto léxico `this` dentro del contexto propio. Si no sabes a qué se refiere la palabra clave `this`, no te preocupes; aprenderás más sobre ella a medida que avances.

He aquí algunos ejemplos de cómo puede beneficiarse de las funciones de flecha frente a las funciones normales:
<!-- eslint-disable func-names, no-var, prefer-arrow-callback, prefer-template -->

```js
// funciones normales, sintaxis ES5
client.once(Events.ClientReady, function() {
	console.log('¡Encendido!');
});

client.on(Events.TypingStart, function(typing) {
	console.log(typing.user.tag + ' empezó a escribir en #' + typing.channel.name);
});

client.on(Events.MessageCreate, function(message) {
	console.log(message.author.tag + ' envió: ' + message.content);
});

var doubleAge = function(age) {
	return 'El doble de tu edad es: ' + (age * 2);
};

// dentro de un comando de colector de mensajes
var filter = function(m) {
	return m.content === 'Estoy de acuerdo' && !m.author.bot;
};

var collector = message.createMessageCollector({ filter, time: 15000 });
```

```js
// funciones de flecha, full ES6
client.once(Events.ClientReady, () => console.log('¡Encendido!'));

client.on(Events.TypingStart, typing => console.log(`${typing.user.tag} empezó a escribir en #${typing.channel.name}`));

client.on(Events.MessageCreate, message => console.log(`${message.author.tag} envió: ${message.content}`));

const doubleAge = age => `El doble de tu edad es: ${age * 2}`;

// dentro de un comando de colector de mensajes
const filter = m => m.content === 'Estoy de acuerdo' && !m.author.bot;
const collector = message.createMessageCollector({ filter, time: 15000 });
```

Hay algunas cosas importantes que debe tener en cuenta:

* Los paréntesis alrededor de los parámetros de una función son opcionales cuando sólo se tiene un parámetro, pero son obligatorios en caso contrario. Si crees que esto te va a confundir, puede ser una buena idea utilizar paréntesis.
* Puede poner limpiamente lo que necesita en una sola línea sin llaves.
* Omitir las llaves hará que las funciones de flecha utilicen el **retorno implícito**, pero sólo si tiene una expresión de una sola línea. Las variables `doubleAge` y `filter` son un buen ejemplo de ello.`filter` variables are a good example of this.
* A diferencia de la declaración `function someFunc() { ... }`, las funciones flecha no pueden usarse para crear funciones con esa sintaxis. Sin embargo, puedes crear una variable y darle una función de flecha anónima como valor (como se ve con las variables `doubleAge` y `filter`).

No cubriremos el ámbito léxico `this` con funciones de flecha aquí, pero puedes buscar en Google si sigues teniendo curiosidad. De nuevo, si no estás seguro de qué es `this` o cuándo lo necesitas, leer primero sobre `this` léxico puede confundirte.

## Desestructurando

La desestructuración es una forma sencilla de extraer elementos de un objeto o un array. Si nunca has visto su sintaxis, puede resultar un poco confusa, pero es fácil de entender una vez explicada.

### Desestructuración de objetos

He aquí un ejemplo común en el que la desestructuración de objetos resultaría útil:

<!-- eslint-skip -->

```js
const config = require('./config.json');
const prefix = config.prefix;
const token = config.token;
```

Este código es un poco verboso y no es muy divertido escribirlo cada vez. La desestructuración de objetos lo simplifica, facilitando tanto la lectura como la escritura. Echa un vistazo:

```js
const { prefix, token } = require('./config.json');
```

La desestructuración de objetos toma esas propiedades del objeto y las almacena en variables. Si la propiedad no existe, creará una variable pero con el valor `undefined`. Así que en vez de usar `config.token` en tu método `client.login()`, simplemente usarías `token`. Y como la desestructuración crea una variable para cada elemento, ni siquiera necesitas esa línea `const prefix = config.prefix`. ¡Genial!

Además, podrías hacer esto para tus comandos.

```js
client.on(Events.InteractionCreate, interaction => {
	const { commandName } = interaction;

	if (commandName === 'ping') {
		// comando ping aquí...
	} else if (commandName === 'beep') {
		// comando beep aquí...
	}
	// otros comandos aquí...
});
```

El código es más corto y parece más limpio, pero no debería ser necesario si sigues la parte de la guía de [manejo de comandos](/guide/creating-your-bot/command-handling.md).

También puede renombrar variables al desestructurar, si es necesario. Un buen ejemplo es cuando está extrayendo una propiedad con un nombre que ya se está utilizando o entra en conflicto con una palabra clave reservada. La sintaxis es la siguiente:

```js
// `default` es una palabra reservada
const { 'default': defaultValue } = someObject;

console.log(defaultValue);
// 'Algún valor predeterminado'
```

### Desestructuración de array

La sintaxis de la desestructuración de arrays es muy similar a la de la desestructuración de objetos, con la salvedad de que se utilizan corchetes en lugar de llaves. Además, como se utiliza en un array, los elementos se desestructuran en el mismo orden que el array. Sin desestructuración de arrays, así es como se extraen los elementos de un array:

```js
// asumiendo que estamos en un comando `profile` y tenemos una variable `args
const name = args[0];
const age = args[1];
const location = args[2];
```

Al igual que el primer ejemplo con la desestructuración de objetos, esto es un poco verboso y no es divertido de escribir. La desestructuración de arrays facilita esta tarea.

```js
const [name, age, location] = args;
```

Una sola línea de código que hace las cosas mucho más limpias. En algunos casos, puede que ni siquiera necesites todos los elementos del array (por ejemplo, al utilizar `string.match(regex)`). La desestructuración de arrays sigue permitiéndote operar en el mismo sentido.

```js
const [, username, id] = message.content.match(someRegex);
```

En este fragmento, utilizamos una coma sin proporcionar un nombre para el elemento de un array que no necesitamos. También puede darle un nombre de marcador de posición si lo prefiere, por supuesto, es totalmente preferencia en ese punto.

## var, let, y const

Dado que hay muchísimos artículos que pueden explicar esta parte con más detalle, sólo te daremos un resumen y un enlace al artículo por si quieres leer más sobre él.

1. La palabra clave `var` es la que se usaba (y todavía se puede usar) en JavaScript antes de que aparecieran `let` y `const`. Sin embargo, hay muchos problemas con `var`, como el hecho de que sea función-escopada, problemas relacionados con el hoisting, y que permita la redeclaración.
2. La palabra clave `let` es esencialmente la nueva `var`; aborda muchos de los problemas que tiene `var`, pero su factor más significativo sería que es de ámbito de bloque y no permite la redeclaración (*no* la reasignación).
3. La palabra clave `const` sirve para dar a las variables un valor constante que no puede ser reasignado. `const`, al igual que `let`, también tiene un ámbito de bloque.

La regla general recomendada por esta guía es utilizar `const` siempre que sea posible, `let` en caso contrario, y evitar el uso de `var`. Aquí tienes un [artículo útil](https://madhatted.com/2016/1/25/let-it-be) si quieres leer más sobre este tema.
