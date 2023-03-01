# Creación de comandos avanzados

Los ejemplos que hemos cubierto hasta ahora han sido comandos bastante simples, como "ping", "server" y "user", que tienen respuestas estáticas estándar. Sin embargo, hay mucho más que puede hacer con el conjunto completo de herramientas de comando de barra.

## Agregar opciones

Los comandos de la aplicación pueden tener `options` adicionales. Piense en estas opciones como argumentos para una función y como una forma para que el usuario proporcione la información adicional que requiere el comando.

::: tip CONSEJO
Si ya agregó opciones a sus comandos y necesita saber cómo recibirlos y analizarlos, consulte la página [Opciones de análisis](/slash-commands/parsing-options.md) en esta sección de la guía.
:::

Las opciones requieren como mínimo un nombre y una descripción. Se aplican las mismas restricciones a los nombres de las opciones que a los nombres de los comandos de barra: de 1 a 32 caracteres que no contengan letras mayúsculas, espacios ni símbolos que no sean `-` y `_`. Puede especificarlos como se muestra en el comando `say` a continuación, que solicita al usuario que ingrese una cadena para la opción `input`.

```js {6-8}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('say')
	.setDescription('¡Responde con tu input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('La entrada para decir'));
```

## Tipos de opciones

Al especificar el `type` de una `ApplicationCommandOption` utilizando el método correspondiente, puede restringir lo que el usuario puede proporcionar como entrada y, para algunas opciones, aprovechar el análisis automático de opciones en objetos adecuados por parte de Discord.

El ejemplo anterior usa `addStringOption`, la forma más simple de entrada de texto estándar sin validación adicional. Al aprovechar los tipos de opciones adicionales, puede cambiar el comportamiento de este comando de muchas maneras, como usar una opción de `Channel` para dirigir la respuesta a un canal específico:

```js {9-11}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('say')
	.setDescription('¡Responde con tu input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('La entrada para decir'))
	.addChannelOption(option =>
		option.setName('channel')
			.setDescription('El canal donde se dirá'));
```

O una opción booleana para darle al usuario control sobre hacer que la respuesta sea efímera.

```js {9-11}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('say')
	.setDescription('¡Responde con tu input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('La entrada para decir'))
	.addBooleanOption(option =>
		option.setName('ephemeral')
			.setDescription('Si debería o no decirlo de forma efímera'));
```

A continuación se incluye una breve descripción de los diferentes tipos de opciones que se pueden agregar. Para obtener más información, consulte los métodos `add_____Option` en la documentación de <DocsLink section="builders" path="class/SlashCommandBuilder" />.

* Las opciones `String`, `Integer`, `Number` y `Boolean` aceptan valores primitivos de su tipo asociado.
   * `Integer` solo acepta números enteros.
   * `Number` acepta tanto números enteros como decimales.
* Las opciones `User`, `Channel`, `Role` y `Mentionable` mostrarán una lista de selección en la interfaz de Discord para su tipo asociado, o aceptarán un Snowflake (id) como entrada.
* Las opciones de `Attachment` solicitan al usuario que adjunte un archivo al comando de barra.
* Las opciones `Subcommand` y `SubcommandGroup` le permiten tener vías de bifurcación de opciones subsiguientes para sus comandos; más sobre eso más adelante en esta página.

::: tip CONSEJO
Consulte la documentación de la API de Discord para obtener explicaciones detalladas sobre [los tipos de opción `SUB_COMMAND` y `SUB_COMMAND_GROUP`](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups).

:::

## Opciones requeridas

Con los tipos de opciones cubiertos, puede comenzar a buscar formas adicionales de validación para asegurarse de que los datos que recibe su bot sean completos y precisos. La adición más simple es hacer que las opciones sean requeridas, para garantizar que el comando no se pueda ejecutar sin un valor requerido. Esta validación se puede aplicar a opciones de cualquier tipo.

Revise el ejemplo `say` nuevamente y use `setRequired(true)` para marcar la opción `input` como requerida.

```js {9}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('say')
	.setDescription('¡Responde con tu input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('La entrada para decir'))
			.setRequired(true));
```

## Opciones

Los tipos de opción `String`, `Number` y `Integer` pueden tener `choices`. Si prefiere que los usuarios seleccionen entre valores predeterminados en lugar de una entrada libre, `choices` puede ayudarlo a hacer cumplir esto. Esto es particularmente útil cuando se trata de conjuntos de datos externos, API y similares, donde se requieren formatos de entrada específicos.

::: warning ADVERTENCIA
Si especifica `choices` para una opción, ¡serán los **únicos** valores válidos que los usuarios pueden elegir!
:::

Especifique las opciones mediante el método `addChoices()` desde el generador de opciones, como <DocsLink section="builders" path="class/SlashCommandBuilder?scrollTo=addStringOption" type="method" />. Las opciones requieren un "nombre" que se muestra al usuario para la selección, y un "valor" que su bot recibirá cuando se seleccione esa opción, como si el usuario la hubiera ingresado en la opción manualmente.

El siguiente ejemplo de comando `gif` permite a los usuarios seleccionar entre categorías predeterminadas de gifs para enviar:

```js {10-14}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('gif')
	.setDescription('¡Envía un gif al azar!')
	.addStringOption(option =>
		option.setName('category')
			.setDescription('La categoría del gif')
			.setRequired(true)
			.addChoices(

				{ name: 'Funny', value: 'gif_funny' },
				{ name: 'Meme', value: 'gif_meme' },
				{ name: 'Movie', value: 'gif_movie' },
			));
```

Si tiene demasiadas opciones para mostrar (el máximo es 25), es posible que prefiera proporcionar opciones dinámicas basadas en lo que el usuario ha escrito hasta el momento. Esto se puede lograr usando [autocomplete](/slash-commands/autocomplete.md).

## Validación adicional

Incluso sin opciones predeterminadas, aún se pueden aplicar restricciones adicionales en entradas que de otro modo serían libres.

* Para las opciones `String`, `setMaxLength()` y `setMinLength()` pueden imponer limitaciones de longitud.
* Para las opciones `Integer` y `Number`, `setMaxValue()` y `setMinValue()` pueden imponer limitaciones de rango en el valor.
* Para las opciones de `Channel`, `addChannelTypes()` puede restringir la selección a tipos de canales específicos, p. `ChannelType.GuildText` para solo recibir canales de texto.

Los usaremos para mostrarle cómo mejorar su comando `say` anterior con una validación adicional para garantizar que no se rompa (o al menos no debería) cuando se usa:

```js {9-10, 14-15}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('say')
	.setDescription('¡Responde con tu input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('La entrada para decir'))
			// Asegúrese de que el texto se ajuste a un embed description, si el usuario elige esa opción
			.setMaxLength(2000))
	.addChannelOption(option =>
		option.setName('channel')
			.setDescription('El canal donde se dirá')
			// Asegúrese de que el usuario solo pueda seleccionar un TextChannel para la salida
			.addChannelTypes(ChannelType.GuildText))
	.addBooleanOption(option =>
		option.setName('embed')
			.setDescription('Si el eco debe estar en un embed o no'));
```

## SubComandos

Los subcomandos están disponibles con el método `.addSubcommand()`. Esto le permite bifurcar un solo comando para requerir diferentes opciones según el subcomando elegido.

Con este enfoque, puede fusionar los comandos de información `user` y `server` de la sección anterior en un solo comando `info` con dos subcomandos. Además, el subcomando `user` tiene una opción de tipo `User` para apuntar a otros usuarios, mientras que el subcomando `server` no necesita esto, y solo mostraría información para el servidor actual.

```js {6-14}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('info')
	.setDescription('¡Obtenga información sobre un usuario o un servidor!')
	.addSubcommand(subcommand =>
		subcommand
			.setName('user')
			.setDescription('Información sobre un usuario')
			.addUserOption(option => option.setName('target').setDescription('El usuario')))
	.addSubcommand(subcommand =>
		subcommand
			.setName('server')
			.setDescription('Información sobre el servidor'));
```

## Localizaciones

Los nombres y las descripciones de los comandos de barra se pueden localizar en el idioma seleccionado por el usuario. Puede encontrar la lista de locales aceptados en la [documentación de la API de discord](https://discord.com/developers/docs/reference#locales).

Establecer localizaciones con `setNameLocalizations()` y `setDescriptionLocalizations()` toma el formato de un objeto, asignando códigos de ubicación (por ejemplo, `pl`, `de` y `en`) a sus cadenas localizadas.

<!-- eslint-skip -->
```js {5-8,10-12,18-25}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('perro')
	.setNameLocalizations({

		pl: 'pies',
		de: 'hund',
		en: 'dog',
	})
	.setDescription('¡Consigue una linda foto de un perro!')
	.setDescriptionLocalizations({

		pl: 'Słodkie zdjęcie pieska!',
		de: 'Poste ein niedliches Hundebild!',
		en: 'Get a cute picture of a dog!',
	})
	.addStringOption(option =>
		option
			.setName('raza')
			.setDescription('Raza de perro')
			.setNameLocalizations({

				pl: 'rasa',
				de: 'rasse',
				en: 'breed',
			})
			.setDescriptionLocalizations({

				pl: 'Rasa psa',
				de: 'Hunderasse',
				en: 'Breed of dog',
			}),
	);
```

#### Próximos pasos

Para obtener más información sobre cómo recibir y analizar los diferentes tipos de opciones cubiertas en esta página, consulte [analizando opciones](/slash-commands/parsing-options.md), o para obtener información más general sobre cómo puede responder a los comandos de barra, consulte [Métodos de respuesta](/slash-commands/response-methods.md).
