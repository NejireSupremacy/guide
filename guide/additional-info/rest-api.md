# Usando una REST API

Las API REST son extremadamente populares en la web, pues permiten obtener libremente los datos de un sitio si éste dispone de una API a través de una conexión HTTP.

## Haciendo peticiones HTTP con Node

En estos ejemplos, estaremos usando [undici](https://www.npmjs.com/package/undici), una librería excelente para hacer peticiones HTTP.

Para instalar undici, ejecuta el siguiente comando:

:::: code-group
::: code-group-item npm

```sh:no-line-numbers
npm install undici
```

:::
::: code-group-item yarn

```sh:no-line-numbers
yarn add undici
```

:::
::: code-group-item pnpm

```sh:no-line-numbers
pnpm add undici
```

:::
::::

## Código base

Para empezar, utilizarás la siguiente estructura de código. Dado que los dos comandos que añadirás en esta sección requieren una interacción con APIs externas, diferirás la respuesta, por lo que tu aplicación responderá con un estado "pensando...". Luego podrás editar la respuesta una vez que tengas los datos que necesitas:

<!-- eslint-disable require-await -->

```js
const { Client, EmbedBuilder, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
	console.log('¡Encendido!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	await interaction.deferReply();
	// ...
});

client.login('tu-token-va-aquí');
```

::: tip CONSEJO
En este tutorial aprovechamos la [desestructuración](/guide/additional-info/es6-syntax.md#destructuring) para mantener la legibilidad.
:::

## Usando undici

Undici es un cliente HTTP/1.1 basado en promesas, escrito desde cero para Node.JS. Si no estás muy familiarizado con las promesas, deberías leer sobre ellas [aquí](/guide/additional-info/async-await.md)

En este tutorial, estarás haciendo un bot con dos comandos basados en APIs, usando [random.cat](https://aws.random.cat) y [Urban Dictionary](https://www.urbandictionary.com).

En la parte superior de tu archivo, importa la función de la librería que vas a utilizar:

```js
const { request } = require('undici');
```

### Recuperar la respuesta JSON procedente de una petición

Para obtener los datos desde dentro del "response object", puedes definir la siguiente función de ayuda (concatena todos los pedazos del código y los analiza como un objeto) sobre los eventos de tu cliente. Ten en cuenta que la función devuelve una Promise que debes manejar.

### Random Cat

La API de random.cat está disponible en [https://aws.random.cat/meow](https://aws.random.cat/meow) y devuelve una respuesta [JSON](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON). Para obtener datos de la API, debes hacer lo siguiente:

```js
const catResult = await request('https://aws.random.cat/meow');
const { file } = await catResult.body.json();
```

Si solo añades este código, parecerá que no pasa nada. Lo que no ves, es que estás lanzando una petición al servidor random.cat, que te devuelve unos datos JSON. La función helper parsea los datos de respuesta a un objeto JavaScript con el que se puede trabajar. El objeto tendrá una propiedad `file` con el valor de un enlace a una imagen de random.cat.

A continuación, implementarás este enfoque en un comando de barra:

```js {3-7}
client.on(Events.InteractionCreate, async interaction => {
	// ...
	if (commandName === 'gato') {
		const catResult = await request('https://aws.random.cat/meow');
		const { file } = await catResult.body.json();
		interaction.editReply({ files: [file] });
	}
});
```

Esto es lo que ocurre en este código:

1. Tu aplicación envía una peticion `GET` a random.cat
2. random.cat recibe la solicitud y obtiene una url de archivo cualquiera de su base de datos.
3. random.cat envía entonces la URL de ese archivo como un objeto JSON en forma de string que contiene un enlace a la imagen.
4. undici recibe la respuesta y parsea el contenido a un objeto JSON.
5. A continuación, tu aplicación adjunta la imagen y la envía en Discord.

### Urban Dictionary

La API de Urban Dictionary está disponible en [https://api.urbandictionary.com/v0/define](https://api.urbandictionary.com/v0/define). Acepta un parámetro `term` y devuelve una respuesta JSON.

El siguiente código obtendrá datos de esta api: 

```js {1,5-11}
// ...
client.on(Events.InteractionCreate, async interaction => {
	// ...
	if (commandName === 'urban') {
		const term = interaction.options.getString('term');
		const query = new URLSearchParams({ term });

		const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
		const { list } = await dictResult.body.json();
	}
});
```

En este caso, se está utilizando la clase nativa [URLSearchParams](https://developer.mozilla.org/es/docs/Web/API/URLSearchParams) de JavaScript para crear una string de consulta (o [query string](https://es.wikipedia.org/wiki/Query_string)) para la URL, de modo que el servidor de Urban Dictionary pueda analizarla y saber lo que se desea buscar.

Si hiciera `/urban hello world`, la URL pasaría a ser https://api.urbandictionary.com/v0/define?term=hello%20world, ya que la string `"hello world"` está codificada.

Puede obtener las propiedades respectivas del JSON devuelto. Si lo vieras en tu navegador, normalmente parecería un montón de tonterías. Si no es así, ¡genial! Si lo hace, entonces deberías conseguir un formateador/visualizador JSON. Si usas Chrome, [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) es una de las extensiones más populares. Si no usas Chrome, busca "JSON formatter/viewer &lt;tu navegador&gt;" y consigue uno.

Ahora, si miras el JSON, puedes ver que tiene una propiedad `list`, que es un array de objetos que contienen varias definiciones para el término (máximo 10). Algo que siempre hay que hacer cuando se crean comandos basados en la API es manejar el caso de que no haya resultados disponibles. Así, si introduces un término aleatorio (por ejemplo, `njaksdcas`) y luego miras la respuesta, la array `list` debería estar vacía. ¡Ahora ya puedes empezar a escribir!

Como se explicó anteriormente, querrás comprobar si la API devolvió alguna respuesta para tu consulta, y devolver la definición si ese es el caso:

```js {3-5,7}
if (commandName === 'urban') {
	// ...
	if (!list.length) {
		return interaction.editReply(`No se encontraron resultados para **${term}**.`);
	}

	interaction.editReply(`**${term}**: ${list[0].definition}`);
}
```

Aquí solo se obtiene el primer objeto del array de objetos llamado `list` y se toma la propiedad `definition`.

Si has seguido el tutorial, deberías tener algo así:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>urban</DiscordInteraction>
		</template>
		<DiscordMention :highlight="true" profile="user" />, No se encontraron resultados para <strong>njaksdcas</strong>
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>urban</DiscordInteraction>
		</template>
		<strong>hello world</strong>: The easiest, and first program any newbie would write. Applies for any language. Also what you would see in the first chapter of most programming books.
	</DiscordMessage>
</DiscordMessages>

Ahora, puedes hacerlo en un [embed](/guide/popular-topics/embeds.md) para un formateo sencillo.

Puedes definir la siguiente función de ayuda en la parte superior de tu archivo. En el siguiente código, puedes utilizar esta función para truncar los datos devueltos y asegurarte de que el embed no da error, porque los valores de los campos superan los 1024 caracteres.

```js
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
```

Y así es como se puede construir el embed a partir de los datos de la API:

```js
const [answer] = list;

const embed = new EmbedBuilder()
	.setColor(0xEFFF00)
	.setTitle(answer.word)
	.setURL(answer.permalink)
	.addFields({ name: 'Definición', value: trim(answer.definition, 1024) }, { name: 'Ejemplo', value: trim(answer.example, 1024) }, { name: 'Valoración', value: `${answer.thumbs_up} 👍. ${answer.thumbs_down} 👎.` });

interaction.editReply({ embeds: [embed] });
```

Ahora, si ejecutas el comando nuevamente, deberías obtener algo así:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>urban</DiscordInteraction>
		</template>
		<template #embeds>
			<DiscordEmbed border-color="#EFFF00" embed-title="hello world" url="https://www.urbandictionary.com/define.php?term=hello%20world">
				<template #fields>
					<DiscordEmbedFields>
						<DiscordEmbedField field-title="Definición">
							The easiest, and first program any newbie would write. Applies for any language. Also what you would see in the first chapter of most programming books. 
						</DiscordEmbedField>
						<DiscordEmbedField field-title="Ejemplo">
							programming noob: Hey I just attended my first programming lesson earlier! <br>
							.NET Veteran: Oh? What can you do? <br>
							programming noob: I could make a dialog box pop up which says "Hello World!" !!! <br>
							.NET Veteran: lmao.. hey guys! look.. check out this "hello world" programmer <br><br>
							Console.WriteLine("Hello World")
						</DiscordEmbedField>
						<DiscordEmbedField field-title="Valoración">
							122 👍. <br>
							42 👎.
						</DiscordEmbedField>
					</DiscordEmbedFields>
				</template>
			</DiscordEmbed>
		</template>
	</DiscordMessage>
</DiscordMessages>

## Resultado final

<ResultingCode />