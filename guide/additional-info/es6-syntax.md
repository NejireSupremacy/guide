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

If you check the code above, it's currently doing things like `'Guild name: ' + interaction.guild.name` and `'Your username: ' + interaction.user.username`, which is perfectly valid. It is a bit hard to read, though, and it's not too fun to constantly type out. Fortunately, there's a better alternative.
Si compruebas el código anterior, actualmente está haciendo cosas como `'Nombre del servidor: ' + interaction.guild.name` y `'Tu nombre de usuario: ' + interaction.user.username`, que es perfectamente válido. Sin embargo, es un poco difícil de leer y no es demasiado divertido teclearlo constantemente. Afortunadamente, hay una alternativa mejor

<!-- eslint-skip -->

```js
// Versión ES5, tal como la tenemos actualmente
else if (commandName === 'server') {
	interaction.reply('Nombre del servidor: ' + interaction.guild.name + '\nMiembros totales: ' + interaction.guild.memberCount);
}
else if (commandName === 'user-info') {
	interaction.reply('Your username: ' + interaction.user.username + '\nYour ID: ' + interaction.user.id);
}
```

<!-- eslint-skip -->

```js
// ES6 version, using template literals
else if (commandName === 'server') {
	interaction.reply(`Guild name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
}
else if (commandName === 'user-info') {
	interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
}
```

Easier to read and write! The best of both worlds.

### Template literals vs string concatenation

If you've used other programming languages, you might be familiar with the term "string interpolation". Template literals would be JavaScript's implementation of string interpolation. If you're familiar with the heredoc syntax, it's very much like that; it allows for string interpolation, as well as multiline strings.

The example below won't go too much into detail about it, but if you're interested in reading more, you can [read about them on MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals).

```js
// variables/function used throughout the examples
const username = 'Sanctuary';
const password = 'pleasedonthackme';

function letsPretendThisDoesSomething() {
	return 'Yay for sample data.';
}
```

<!-- eslint-disable prefer-template -->

```js
// regular string concatenation
console.log('Your username is: **' + username + '**.');
console.log('Your password is: **' + password + '**.');

console.log('1 + 1 = ' + (1 + 1));

console.log('And here\'s a function call: ' + letsPretendThisDoesSomething());

console.log(
	'Putting strings on new lines\n'
	+ 'can be a bit painful\n'
	+ 'with string concatenation. :(',
);
```

```js
// template literals
console.log(`Your password is: **${password}**.`);
console.log(`Your username is: **${username}**.`);

console.log(`1 + 1 = ${1 + 1}`);

console.log(`And here's a function call: ${letsPretendThisDoesSomething()}`);

console.log(`
	Putting strings on new lines
	is a breeze
	with template literals! :)
`);

// NOTE: template literals will also render the indentation inside them
// there are ways around that, which we'll discuss in another section.
```

You can see how it makes things easier and more readable. In some cases, it can even make your code shorter! This one is something you'll want to take advantage of as much as possible.

## Arrow functions

Arrow functions are shorthand for regular functions, with the addition that they use a lexical `this` context inside of their own. If you don't know what the `this` keyword is referring to, don't worry about it; you'll learn more about it as you advance.

Here are some examples of ways you can benefit from arrow functions over regular functions:

<!-- eslint-disable func-names, no-var, prefer-arrow-callback, prefer-template -->

```js
// regular functions, full ES5
client.once(Events.ClientReady, function() {
	console.log('Ready!');
});

client.on(Events.TypingStart, function(typing) {
	console.log(typing.user.tag + ' started typing in #' + typing.channel.name);
});

client.on(Events.MessageCreate, function(message) {
	console.log(message.author.tag + ' sent: ' + message.content);
});

var doubleAge = function(age) {
	return 'Your age doubled is: ' + (age * 2);
};

// inside a message collector command
var filter = function(m) {
	return m.content === 'I agree' && !m.author.bot;
};

var collector = message.createMessageCollector({ filter, time: 15000 });
```

```js
// arrow functions, full ES6
client.once(Events.ClientReady, () => console.log('Ready!'));

client.on(Events.TypingStart, typing => console.log(`${typing.user.tag} started typing in #${typing.channel.name}`));

client.on(Events.MessageCreate, message => console.log(`${message.author.tag} sent: ${message.content}`));

const doubleAge = age => `Your age doubled is: ${age * 2}`;

// inside a message collector command
const filter = m => m.content === 'I agree' && !m.author.bot;
const collector = message.createMessageCollector({ filter, time: 15000 });
```

There are a few important things you should note here:

* The parentheses around function parameters are optional when you have only one parameter but are required otherwise. If you feel like this will confuse you, it may be a good idea to use parentheses.
* You can cleanly put what you need on a single line without curly braces.
* Omitting curly braces will make arrow functions use **implicit return**, but only if you have a single-line expression. The `doubleAge` and `filter` variables are a good example of this.
* Unlike the `function someFunc() { ... }` declaration, arrow functions cannot be used to create functions with such syntax. You can create a variable and give it an anonymous arrow function as the value, though (as seen with the `doubleAge` and `filter` variables).

We won't be covering the lexical `this` scope with arrow functions in here, but you can Google around if you're still curious. Again, if you aren't sure what `this` is or when you need it, reading about lexical `this` first may only confuse you. 

## Destructuring

Destructuring is an easy way to extract items from an object or array. If you've never seen the syntax for it before, it can be a bit confusing, but it's straightforward to understand once explained!

### Object destructuring

Here's a common example where object destructuring would come in handy:

<!-- eslint-skip -->

```js
const config = require('./config.json');
const prefix = config.prefix;
const token = config.token;
```

This code is a bit verbose and not the most fun to write out each time. Object destructuring simplifies this, making it easier to both read and write. Take a look:

```js
const { prefix, token } = require('./config.json');
```

Object destructuring takes those properties from the object and stores them in variables. If the property doesn't exist, it'll still create a variable but with the value of `undefined`. So instead of using `config.token` in your `client.login()` method, you'd simply use `token`. And since destructuring creates a variable for each item, you don't even need that `const prefix = config.prefix` line. Pretty cool!

Additionally, you could do this for your commands.

```js
client.on(Events.InteractionCreate, interaction => {
	const { commandName } = interaction;

	if (commandName === 'ping') {
		// ping command here...
	} else if (commandName === 'beep') {
		// beep command here...
	}
	// other commands here...
});
```

The code is shorter and looks cleaner, but it shouldn't be necessary if you follow along with the [command handler](/creating-your-bot/command-handling.md) part of the guide.

You can also rename variables when destructuring, if necessary. A good example is when you're extracting a property with a name already being used or conflicts with a reserved keyword. The syntax is as follows:

```js
// `default` is a reserved keyword
const { 'default': defaultValue } = someObject;

console.log(defaultValue);
// 'Some default value here'
```

### Array destructuring

Array destructuring syntax is very similar to object destructuring, except that you use brackets instead of curly braces. In addition, since you're using it on an array, you destructure the items in the same order the array is. Without array destructuring, this is how you'd extract items from an array:

```js
// assuming we're in a `profile` command and have an `args` variable
const name = args[0];
const age = args[1];
const location = args[2];
```

Like the first example with object destructuring, this is a bit verbose and not fun to write out. Array destructuring eases this pain.

```js
const [name, age, location] = args;
```

A single line of code that makes things much cleaner! In some cases, you may not even need all the array's items (e.g., when using `string.match(regex)`). Array destructuring still allows you to operate in the same sense.

```js
const [, username, id] = message.content.match(someRegex);
```

In this snippet, we use a comma without providing a name for the item in the array we don't need. You can also give it a placeholder name if you prefer, of course; it's entirely preference at that point.

## var, let, and const

Since there are many, many articles out there that can explain this part more in-depth, we'll only be giving you a TL;DR and an article link if you choose to read more about it.

1. The `var` keyword is what was (and can still be) used in JavaScript before `let` and `const` came to surface. There are many issues with `var`, though, such as it being function-scoped, hoisting related issues, and allowing redeclaration.
2. The `let` keyword is essentially the new `var`; it addresses many of the issues `var` has, but its most significant factor would be that it's block-scoped and disallows redeclaration (*not* reassignment).
3. The `const` keyword is for giving variables a constant value that is unable to be reassigned. `const`, like `let`, is also block-scoped.

The general rule of thumb recommended by this guide is to use `const` wherever possible, `let` otherwise, and avoid using `var`. Here's a [helpful article](https://madhatted.com/2016/1/25/let-it-be) if you want to read more about this subject.
