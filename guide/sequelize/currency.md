# Creando un sistema de moneda

Una característica común de los bots de Discord es un sistema de moneda. Es posible hacer todo en un objeto, pero también podemos abstraer eso en términos de *relaciones* entre objetos. Es aquí donde brilla el poder de un RDBMS (Sistema de Gestión de Bases de Datos Relacional). Sequelize llama a estas *asociaciones*, por lo que usaremos ese término a partir de ahora.

# Archivos

Habrá varios archivos: un script de inicialización de DB, sus modelos y su script de bot. En [la guía anterior de Sequelize](/sequelize/), colocamos todo esto en el mismo archivo. Tener todo en un archivo no es una práctica ideal, así que lo corregiremos.

Esta vez tendremos seis archivos.

* `app.js` es donde mantendremos el código principal del bot.
* `dbInit.js` es el archivo de inicialización de la base de datos. Ejecutamos esto una vez y lo olvidamos.
* `dbObjects.js` es donde importaremos los modelos y crearemos asociaciones aquí.
* `models/Users.js` es el modelo de Usuarios. Los usuarios tendrán un atributo de moneda en él.
* `models/CurrencyShop.js` es el modelo de la tienda. La tienda tendrá un nombre y un precio para cada artículo.
* `models/UserItems.js` es la tabla de unión entre los usuarios y la tienda. Una tabla de unión conecta dos tablas. Nuestra tabla de unión tendrá un campo adicional para la cantidad de ese artículo que tiene el usuario.

## Crear modelos

Aca está un diagrama de relación de entidades de los modelos que haremos:

![Diagrama de estructura de base de datos de moneda](./images/currency_er_diagram.svg)

Los `Usuarios` tienen un `user_id`, y un `balance`. Cada `user_id` puede tener múltiples enlaces a la tabla `UserItems`, y cada entrada en la tabla se conecta a uno de los artículos en la `CurrencyShop`, que tendrá un `name` y un `cost` asociado con él.

Para implementar esto, comience creando una carpeta `models` y cree un archivo `Users.js` dentro de él que contenga lo siguiente:

```js
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};
```

Como puede ver en el diagrama anterior, el modelo de usuarios solo tendrá dos atributos: un `user_id` clave primaria y un `balance`. Una clave primaria es un atributo particular que se convierte en la columna predeterminada utilizada al unir tablas, y se genera automáticamente de forma única y no `null`.

El balance también establece `allowNull` en `false`, lo que significa que ambos valores deben establecerse conjuntamente con la creación de una clave primaria; de lo contrario, la base de datos arrojaría un error. Esta restricción garantiza la corrección en el almacenamiento de sus datos. Nunca tendrá valores `null` o vacíos, lo que garantiza que si por alguna razón olvida validar en la aplicación que ambos valores no sean `null`, la base de datos realizaría una validación final.

Observe que el objeto de opciones establece `timestamps` en `false`. Esta opción deshabilita las columnas `createdAt` y `updatedAt` que sequelize generalmente crea para usted. Establecer `user_id` como primario también elimina la clave primaria `id` que Sequelize generalmente genera para usted, ya que solo puede haber una clave primaria en una tabla.

A continuación, todavía en la misma carpeta `models`, cree un archivo `CurrencyShop.js` que contenga lo siguiente:

```js
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('currency_shop', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};
```

Como en el modelo de Usuarios, los `timestamps` no son necesarios aquí, por lo que puede deshabilitarlos. Sin embargo, a diferencia del modelo de Usuarios, el campo `unique` se establece en `true` aquí, lo que le permite cambiar el nombre sin afectar la clave primaria que une esto con el siguiente objeto. Esto se genera automáticamente por sequelize ya que no se establece una clave primaria.

El siguiente archivo será `UserItems.js`, la tabla de unión.

```js
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_item', {
		user_id: DataTypes.STRING,
		item_id: DataTypes.INTEGER,
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
	}, {
		timestamps: false,
	});
};
```

La tabla de unión vinculará `user_id` y el `id` de la tienda de monedas. También contiene un número `amount`, que indica cuántos de esos artículos tiene un usuario.

## Inicializar la base de datos

Ahora que los modelos están definidos, debe crearlos en su base de datos para acceder a ellos en el archivo del bot. Ejecutamos el sync dentro del evento `ready` en el tutorial anterior, que es completamente innecesario ya que solo necesita ejecutarse una vez. Puede crear un archivo para inicializar la base de datos y nunca tocarlo de nuevo a menos que quiera recrear toda la base de datos.

Cree un archivo llamado `dbInit.js` en el directorio base (*no* en la carpeta `models`).

::: cuidado
Asegúrese de usar la versión 5 o posterior de Sequelize! La versión 4, como se usa en esta guía, representará una amenaza de seguridad. Puede leer más sobre este problema en el [rastreador de problemas de Sequelize](https://github.com/sequelize/sequelize/issues/7310)
:::

```js
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
require('./models/Users.js')(sequelize, Sequelize.DataTypes);
require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'Tea', cost: 1 }),
		CurrencyShop.upsert({ name: 'Coffee', cost: 2 }),
		CurrencyShop.upsert({ name: 'Cake', cost: 5 }),
	];

	await Promise.all(shop);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);
```

Aca se extraen los dos modelos y la tabla de unión de las respectivas declaraciones de modelo, se sincronizan y se agregan elementos a la tienda.

Una nueva función aquí es la función `.upsert()`. Es una palabra hibrida para **up**date or in**sert**. `upsert` se usa aquí para evitar crear duplicados si ejecuta este archivo varias veces. Eso no debería suceder porque `name` se define como *unique*, pero no hay daño en ser seguro. Upsert también tiene un bono agradable: si ajusta el costo, el elemento respectivo también debe tener su costo actualizado.

::: consejo
Ejecute `node dbInit.js` para crear las tablas de la base de datos. A menos que haga un cambio en los modelos, nunca necesitará tocar el archivo nuevamente. Si cambia un modelo, puede ejecutar `node dbInit.js --force` o `node dbInit.js -f` para sincronizar forzadamente sus tablas. Es importante tener en cuenta que esto **vaciará** y **recreará** sus tablas de modelos.
:::

## Crear asociaciones

A continuación, agregue las asociaciones a los modelos. Cree un archivo llamado `dbObjects.js` en el directorio base, junto a `dbInit.js`.

```js
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

Reflect.defineProperty(Users.prototype, 'addItem', {
	value: async item => {
		const userItem = await UserItems.findOne({
			where: { user_id: this.user_id, item_id: item.id },
		});

		if (userItem) {
			userItem.amount += 1;
			return userItem.save();
		}

		return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
	},
});

Reflect.defineProperty(Users.prototype, 'getItems', {
	value: () => {
		return UserItems.findAll({
			where: { user_id: this.user_id },
			include: ['item'],
		});
	},
});

module.exports = { Users, CurrencyShop, UserItems };
```

Note that the connection object could be abstracted in another file and had both `dbInit.js` and `dbObjects.js` use that connection file, but it's not necessary to overly abstract things.

Another new method here is the `.belongsTo()` method. Using this method, you add `CurrencyShop` as a property of `UserItem` so that when you do `userItem.item`, you get the respectively attached item. You use `item_id` as the foreign key so that it knows which item to reference.

You then add some methods to the `Users` object to finish up the junction: add items to users, and get their current inventory. The code inside should be somewhat familiar from the last tutorial. `.findOne()` is used to get the item if it exists in the user's inventory. If it does, increment it; otherwise, create it.

Getting items is similar; use `.findAll()` with the user's id as the key. The `include` key is for associating the CurrencyShop with the item. You must explicitly tell Sequelize to honor the `.belongsTo()` association; otherwise, it will take the path of the least effort.

## Application code

Create an `app.js` file in the base directory with the following skeleton code to put it together.

<!-- eslint-disable require-await -->

```js
const { Op } = require('sequelize');
const { Client, codeBlock, Collection, Events, GatewayIntentBits } = require('discord.js');
const { Users, CurrencyShop } = require('./dbObjects.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const currency = new Collection();

client.once(Events.ClientReady, async () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async message => {
	if (message.author.bot) return;
	addBalance(message.author.id, 1);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	// ...
});

client.login('your-token-goes-here');
```

Nada especial sobre este esqueleto. Importa los modelos Users y CurrencyShop de nuestro archivo `dbObjects.js` y agrega una colección de moneda. Cada vez que alguien habla, agregue 1 a su recuento de moneda. El resto es solo código estándar de discord.js y un simple manejador de comandos if/else. Se usa una colección para la variable `currency` para almacenar en caché la moneda individual de los usuarios, para que no tenga que golpear la base de datos para cada búsqueda. Un manejador if/else se usa aquí, pero puede ponerlo en un marco o un manejador de comandos siempre que mantenga una referencia a los modelos y la colección de moneda.

### Métodos auxiliares

```js {4-25}
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const currency = new Collection();

async function addBalance(id, amount) {
	const user = currency.get(id);

	if (user) {
		user.balance += Number(amount);
		return user.save();
	}

	const newUser = await Users.create({ user_id: id, balance: amount });
	currency.set(id, newUser);

	return newUser;
}

function getBalance(id) {
	const user = currency.get(id);
	return user ? user.balance : 0;
}
```

Esto define la función auxiliar `addBalance()`, ya que se usará con bastante frecuencia. También se define una función `getBalance()`, para asegurarse de que siempre se devuelva un número.

### Sincronización de datos en el evento ready

```js {2-3}
client.once(Events.ClientReady, async () => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));

	console.log(`Logged in as ${client.user.tag}!`);
});
```

En el evento ready, sincronice la colección de moneda con la base de datos para un acceso fácil más adelante.

### Mostrar el saldo del usuario

```js {7-9}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'balance') {
		const target = interaction.options.getUser('user') ?? interaction.user;

		return interaction.reply(`${target.tag} has ${getBalance(target.id)}💰`);
	}
});
```

Nada complicado aquí. La función `getBalance()` se usa para mostrar el saldo del autor o del usuario mencionado.

### Muestra el inventario del usuario

<!-- eslint-skip -->

```js {5-11}
if (commandName === 'balance') {
	// ...
}
else if (commandName === 'inventory') {
	const target = interaction.options.getUser('user') ?? interaction.user;
	const user = await Users.findOne({ where: { user_id: target.id } });
	const items = await user.getItems();

	if (!items.length) return interaction.reply(`${target.tag} has nothing!`);

	return interaction.reply(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
}
```

Aca es donde comienza a ver el poder de las asociaciones. Incluso si los usuarios y la tienda son diferentes tablas y los datos se almacenan por separado, puede obtener el inventario de un usuario mirando la tabla de unión y unirla con la tienda; ¡no hay nombres de elementos duplicados que desperdician espacio!

### Transferir moneda a otro usuario

<!-- eslint-skip -->

```js {2-12}
else if (commandName === 'transfer') {
	const currentAmount = getBalance(interaction.user.id);
	const transferAmount = interaction.options.getInteger('amount');
	const transferTarget = interaction.options.getUser('user');

	if (transferAmount > currentAmount) return interaction.reply(`Sorry ${interaction.user}, you only have ${currentAmount}.`);
	if (transferAmount <= 0) return interaction.reply(`Please enter an amount greater than zero, ${interaction.user}.`);

	addBalance(interaction.user.id, -transferAmount);
	addBalance(transferTarget.id, transferAmount);

	return interaction.reply(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${getBalance(interaction.user.id)}💰`);
}
```

Como creador de bots, siempre debes pensar en cómo mejorar la experiencia del usuario. Una buena UX hace que los usuarios tengan menos frustración con tus comandos. Si tus entradas son de diferentes tipos, no los obligues a memorizar qué parámetros vienen antes que otros.

Idealmente, querrías permitir que los usuarios hagan tanto `!transfer 5 @user` como `!transfer @user 5`. Para obtener la cantidad, puedes obtener el primer texto que no sea una mención en el comando. En la segunda línea del código anterior: divida el comando por espacios y busque cualquier cosa que no coincida con una mención; puede asumir que es la cantidad de transferencia. Luego, realice algunas verificaciones para asegurarse de que sea una entrada válida. También puede verificar los errores en el objetivo de la transferencia, pero no lo incluiremos aquí debido a su trivialidad.

`addBalance()` se usa para eliminar y agregar moneda. Dado que las cantidades de transferencia por debajo de cero están prohibidas, es seguro aplicar el inverso aditivo de la cantidad de transferencia a su saldo.

### Comprando artículos de la tienda

<!-- eslint-skip -->

```js {2-14}
else if (commandName === 'buy') {
	const itemName = interaction.options.getString('item');
	const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });

	if (!item) return interaction.reply(`That item doesn't exist.`);
	if (item.cost > getBalance(interaction.user.id)) {
		return interaction.reply(`You currently have ${getBalance(interaction.user.id)}, but the ${item.name} costs ${item.cost}!`);
	}

	const user = await Users.findOne({ where: { user_id: interaction.user.id } });
	addBalance(interaction.user.id, -item.cost);
	await user.addItem(item);

	return interaction.reply(`You've bought: ${item.name}.`);
}
```

Para que los usuarios busquen un artículo sin importar el caso de las letras, puede usar el modificador `$iLike` al buscar el nombre. Tenga en cuenta que esto puede ser lento si tiene millones de artículos, así que no ponga un millón de artículos en su tienda.

### Muestra la tienda

<!-- eslint-skip -->

```js {2-3}
else if (commandName === 'shop') {
	const items = await CurrencyShop.findAll();
	return interaction.reply(codeBlock(items.map(i => `${i.name}: ${i.cost}💰`).join('\n')));
}
```

Nada especial aquí; solo un `.findAll()` regular para obtener todos los artículos de la tienda y `.map()` para transformar esos datos en algo que se vea bien.

### Muestra la tabla de clasificación

<!-- eslint-skip -->

```js {2-10}
else if (commandName === 'leaderboard') {
	return interaction.reply(
		codeBlock(
			currency.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.cache.has(user.user_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
				.join('\n'),
		),
	);
}
```

Nada extraordinario aquí. Podría consultar la base de datos para obtener los diez principales usuarios con mas monedas, pero como ya tiene acceso a ellos localmente dentro de la variable `currency`, puede ordenar la colección y usar `.map()` para mostrarlo en un formato amigable. El filtro está en caso de que los usuarios ya no existan en la caché del bot.

## Resulting code

<ResultingCode />
