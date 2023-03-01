# Almacenando datos con Sequelize

Sequelize es un mapeador de objetos-relacionales, lo que significa que puede escribir una consulta usando objetos y que se ejecute en casi cualquier otro sistema de base de datos que Sequelize admita.

### ¿Por qué usar un ORM?

El principal beneficio de usar un ORM como Sequelize es que le permite escribir código que prácticamente se vea como JavaScript nativo. Como beneficio secundario, un ORM le permitirá escribir código que se pueda ejecutar en casi todos los sistemas de bases de datos. Aunque las bases de datos generalmente se adhieren muy de cerca a SQL, cada una tiene sus sutiles diferencias y diferencias. Puede crear una consulta de base de datos agnóstica usando un ORM que funcione en varios sistemas de bases de datos.

## Un sistema de etiquetas simple

Para este tutorial, crearemos un sistema de etiquetas simple que le permitirá agregar una etiqueta, mostrar una etiqueta, editar una etiqueta, mostrar información de la etiqueta, listar etiquetas y eliminar una etiqueta.
Para comenzar, debe instalar Sequelize en su proyecto de discord.js. Explicaremos SQlite como el primer motor de almacenamiento y mostraremos cómo usar otras bases de datos más tarde. Tenga en cuenta que necesitará Node 7.6 o superior para utilizar los operadores `async/await`.

### Instalando y usando Sequelize

Crea una nueva carpeta de proyecto y ejecuta lo siguiente:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install discord.js sequelize sqlite3
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add discord.js sequelize sqlite3
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm install discord.js sequelize sqlite3
```
:::
::::

::: danger CUIDADO
Asegúrese de usar la versión 5 o posterior de Sequelize! La versión 4, como se usa en esta guía, plantea una amenaza de seguridad. Puede leer más sobre este problema en el [Seguimiento de problemas de Sequelize](https://github.com/sequelize/sequelize/issues/7310).
:::

Después de instalar discord.js y Sequelize, puede comenzar con el siguiente código esqueleto. Las etiquetas de comentarios le indicarán dónde insertar el código más adelante.

<!-- eslint-disable require-await -->
```js
// Requiere Sequelize
const Sequelize = require('sequelize');
// Requiere las clases necesarias de discord.js
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create una nueva instancia de un cliente de Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Cuando el cliente esté listo, se ejecutará este código (esto solo sucederá una vez)
client.once(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	// ...
});

// Inicia sesión con tu token de bot
client.login('your-token-goes-here');
```

###  Información de conexión

El primer paso es definir la información de conexión. Debería verse algo así:

```js {3-9}
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// solo SQLite
	storage: 'database.sqlite',
});
```

`host` le dice a Sequelize dónde buscar la base de datos. Para la mayoría de los sistemas, el host será localhost, ya que la base de datos generalmente reside con la aplicación. Sin embargo, si tiene una base de datos remota, puede configurarla con esa dirección de conexión. De lo contrario, no toque esto a menos que sepa lo que está haciendo.
`dialect` se refiere al motor de base de datos que va a usar. Para este tutorial, será sqlite.
`logging` habilita una salida detallada de Sequelize, útil cuando está intentando depurar. Puede deshabilitarlo configurándolo en `false`.
`storage` es una configuración solo para sqlite porque sqlite es la única base de datos que almacena todos sus datos en un solo archivo.


### Creando el modelo

En cualquier base de datos relacional, debe crear tablas para almacenar sus datos. Este sistema de etiquetas simple usará cuatro campos. La tabla en la base de datos se verá algo así:

| name | description | username | usage_count |
| --- | --- | --- | --- |
| bob | is the best | bob | 0 |
| tableflip | (╯°□°）╯︵ ┻━┻ | joe | 8 |

Para hacer eso en Sequelize, defina un modelo basado en esta estructura debajo de la información de conexión, como se muestra a continuación.

```js
/*
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255) UNIQUE,
 * description TEXT,
 * username VARCHAR(255),
 * usage_count  INT NOT NULL DEFAULT 0
 * );
 */
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});
```

El modelo se asemeja muy de cerca a lo que la base de datos define. Habrá una tabla con cuatro campos llamados `name`, `description`, `username` y `usage_count`.
`sequelize.define()` toma dos parámetros. `'tags'` se pasan como el nombre de nuestra tabla, y un objeto que representa el esquema de la tabla en pares clave-valor. Las claves en el objeto se convierten en los atributos del modelo, y los valores describen los atributos.

`type` se refiere a qué tipo de datos debe contener este atributo. Los tipos de datos más comunes son número, cadena y fecha, pero otros tipos de datos están disponibles según la base de datos.
`unique: true` garantizará que este campo nunca tenga entradas duplicadas. Los nombres de etiqueta duplicados no están permitidos en esta base de datos.
`defaultValue` le permite establecer un valor de reserva si no hay un valor inicial durante la inserción.
`allowNull` no es tan importante, pero esto garantizará en la base de datos que el atributo nunca esté sin configurar. Podría configurarlo para que sea una cadena en blanco o vacía, pero debe ser _algo_.

::: tip CONSEJO
`Sequelize.STRING` vs. `Sequelize.TEXT`: En la mayoría de los sistemas de bases de datos, la longitud de la cadena es de longitud fija por razones de rendimiento. Sequelize establece esto predeterminado en 255. Use STRING si su entrada tiene una longitud máxima y use TEXT si no lo hace. Para sqlite, no hay un tipo de cadena sin límite, por lo que no importará cuál elija.
:::

### Sinchronizando el modelo

Ahora que su estructura está definida, debe asegurarse de que el modelo exista en la base de datos. Para asegurarse de que el bot esté listo y todos los datos que pueda necesitar hayan llegado, agregue esta línea en su código.

```js {3}
client.once(Events.ClientReady, () => {
	Tags.sync();
	console.log(`Logged in as ${client.user.tag}!`);
});
```

La tabla no se crea hasta que la sincroniza. El esquema que definió antes estaba construyendo el modelo que le permite a Sequelize saber cómo debe verse los datos. Para probar, puede usar `Tags.sync({ force: true })` para recrear la tabla cada vez que se inicia. De esta manera, puede obtener una tabla en blanco cada vez que lo haga.

### Agregando una etiqueta

Después de todo este preparativo, ¡ahora puede escribir su primer comando! Empecemos con la capacidad de agregar una etiqueta.

<!-- eslint-skip -->

```js {7-26}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'addtag') {
		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description');

		try {
			// equivalente a: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await Tags.create({
				name: tagName,
				description: tagDescription,
				username: interaction.user.username,
			});

			return interaction.reply(`Etiqueta ${tag.name} agregada.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('Esa etiqueta ya existe.');
			}

			return interaction.reply('Algo salió mal al añadir una etiqueta.');
		}
	}
});
```

`Tags.create()` usa los modelos que creó anteriormente. El método `.create()` inserta algunos datos en el modelo. Va a insertar un nombre de etiqueta, descripción y el nombre del autor en la base de datos.
La sección `catch (error)` es necesaria para la inserción porque desviará la comprobación de duplicados a la base de datos para notificarle si se produce un intento de crear una etiqueta que ya existe. La alternativa es consultar la base de datos antes de agregar datos y verificar si se devuelve un resultado. Si no hay errores o no se encuentra una etiqueta idéntica, solo entonces agregaría los datos. De los dos métodos, es claro que atrapar el error es menos trabajo para usted.
Aunque `if (error.name === 'SequelizeUniqueConstraintError')` fue principalmente para hacer menos trabajo, siempre es bueno manejar sus errores, especialmente si sabe qué tipos de errores recibirá. Este error aparece si se viola su restricción única, es decir, se insertan valores duplicados.


::: warning ADVERTENCIA
No use el catch para insertar nuevos datos. Úselo solo para manejar con gracia las cosas que salen mal en su código o registrar errores.
:::

### Fetching a tag

Ahora, obtengamos la etiqueta insertada.

<!-- eslint-skip -->

```js {5-17}
if (commandName === 'addtag') {
	// ...
}
else if (command === 'tag') {
	const tagName = interaction.options.getString('name');

	// equivalente a: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
	const tag = await Tags.findOne({ where: { name: tagName } });

	if (tag) {
		// equivalente a: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
		tag.increment('usage_count');

		return interaction.reply(tag.get('description'));
	}

	return interaction.reply(`No se encuentra la etiqueta: ${tagName}`);
}
```

Esta es su primera consulta. ¡Finalmente está haciendo algo con sus datos; yay!
`.findOne()` es cómo obtiene una sola fila de datos. El `where: { name: tagName }` se asegura de que solo obtenga la fila con la etiqueta deseada. Dado que las consultas son asincrónicas, necesitará usar `await` para obtenerla. Después de recibir los datos, puede usar `.get()` en ese objeto para obtener los datos. Si no se reciben datos, puede decirle al usuario que la consulta no devolvió datos.

### Editando una etiqueta

<!-- eslint-skip -->

```js {2-12}
else if (command === 'edittag') {
	const tagName = interaction.options.getString('name');
	const tagDescription = interaction.options.getString('description');

	// equivalente a: UPDATE tags (description) values (?) WHERE name='?';
	const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });

	if (affectedRows > 0) {
		return interaction.reply(`Se ha editado la etqieuta ${tagName}.`);
	}

	return interaction.reply(`No se encuentra la etiqueta ${tagName}.`);
}
```

Es posible editar un registro usando la función `.update()`. Una actualización devuelve el número de filas que el condición `where` cambió. Dado que solo puede tener etiquetas con nombres únicos, no tiene que preocuparse por cuántas filas pueden cambiar. Si obtiene que la consulta no alteró ninguna fila, puede concluir que la etiqueta no existía.

### Muestra la información de una etiqueta en particular

<!-- eslint-skip -->

```js {2-12}
else if (commandName == 'taginfo') {
	const tagName = interaction.options.getString('name');

	// equivalente a: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
	const tag = await Tags.findOne({ where: { name: tagName } });

	if (tag) {
		return interaction.reply(`${tagName} fue creada por ${tag.username} el ${tag.createdAt} y ha sido usada ${tag.usage_count} veces.`);
	}

	return interaction.reply(`No se encuentra la etiqueta: ${tagName}`);
}
```

Esta sección es muy similar a la anterior, excepto que mostrará los metadatos de la etiqueta. `tag` contiene el objeto de etiqueta. Observe dos cosas: en primer lugar, es posible acceder a las propiedades del objeto sin la función `.get()`. Esto se debe a que el objeto es una instancia de una etiqueta, que puede tratar como un objeto y no solo como una fila de datos. En segundo lugar, puede acceder a una propiedad que no se definió explícitamente, `createdAt`. Esto se debe a que Sequelize agrega automáticamente esa columna a todas las tablas. Pasar otro objeto al modelo con `{createdAt: false}` puede deshabilitar esta característica, pero en este caso, fue útil tenerla.

### Listar todas las etiquetas

El siguiente comando le permitirá obtener una lista de todas las etiquetas creadas.

<!-- eslint-skip -->

```js {2-6}
else if (command === 'showtags') {
	// equivalent to: SELECT name FROM tags;
	const tagList = await Tags.findAll({ attributes: ['name'] });
	const tagString = tagList.map(t => t.name).join(', ') || 'Ninguna etiqueta creada.';

	return interaction.reply(`Lista de etiquetas: ${tagString}`);
}
```

Aca puedes usar el método `.findAll()` para obtener todos los nombres de etiquetas. Observe que en lugar de tener `where`, el campo opcional, `attributes`, se establece. Establecer atributos en nombre le permitirá obtener *solo* los nombres de las etiquetas. Si intentó acceder a otros campos, como el autor de la etiqueta, obtendría un error. Si se deja en blanco, buscará *todos* los datos de columna asociados. No afectará los resultados devueltos, pero desde el punto de vista del rendimiento, solo debe obtener los datos necesarios. Si no hay resultados, `tagString` se establecerá en 'No se establecen etiquetas'.

### Eliminar una etiqueta

<!-- eslint-skip -->

```js {2-8}
else if (command === 'deletetag') {
	const tagName = interaction.options.getString('name');
	// equivalent to: DELETE from tags WHERE name = ?;
	const rowCount = await Tags.destroy({ where: { name: tagName } });

	if (!rowCount) return interaction.reply('Esa etiqueta no existe.');

	return interaction.reply('Etiqueta eliminada.');
}
```

`destroy()` ejecuta la operación de eliminación. La operación devuelve un recuento del número de filas afectadas. Si devuelve un valor de 0, entonces no se eliminó nada, y esa etiqueta no existía en la base de datos en primer lugar.


## Resulting code

<ResultingCode path="sequelize/tags" />
