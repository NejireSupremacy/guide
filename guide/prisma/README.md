# Almacenando datos con Prisma

Prisma es un mapeador de objetos-relacionales, lo que significa que puede escribir una consulta usando objetos y que se ejecute en casi cualquier otro sistema de base de datos que Prisma admita.

### ¿Por qué usar un ORM?

El principal beneficio de usar un ORM como Prisma es que le permite escribir código que prácticamente se vea como JavaScript nativo. Como beneficio secundario, un ORM le permitirá escribir código que se pueda ejecutar en casi todos los sistemas de bases de datos. Aunque las bases de datos generalmente se adhieren muy de cerca a SQL, cada una tiene sus sutiles diferencias y diferencias. Puede crear una consulta de base de datos agnóstica usando un ORM que funcione en varios sistemas de bases de datos.

### Instalando y usando Prisma

Crea una nueva carpeta de proyecto y ejecuta lo siguiente

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install discord.js prisma @prisma/client
npx prisma init
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add discord.js prisma @prisma/client
yarn prisma init
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add discord.js prisma @prisma/client
pnpx prisma init
```
:::
::::

Despues de ejecutar los comandos, se creará una carpeta llamada `prisma` con un archivo llamado `schema.prisma` dentro de ella. Este archivo es donde se define la estructura de la base de datos. Prisma usa un lenguaje de definición de esquema (DSL) para definir la estructura de la base de datos. El DSL de Prisma se parece mucho a SQL, pero tiene algunas diferencias. Por ejemplo, en lugar de usar `VARCHAR` para definir una cadena, usa `String`. También usa `Int` en lugar de `INTEGER` para definir un número entero.

El archivo `schema.prisma` se ve así:

```prisma:no-line-numbers
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

```

El archivo `schema.prisma` contiene dos bloques principales: `generator` y `datasource`. El bloque `generator` define el cliente de Prisma que se utilizará para interactuar con la base de datos. El bloque `datasource` define la fuente de datos que se utilizará para almacenar los datos. Por predeterminado esta configurado para usar PostgreSQL, pero puede cambiarlo a MySQL o SQLite o cualquier otro sistema de base de datos que admita Prisma, en url se define la url de la base de datos y admite variables de entorno.

Para caso de ejemplo utilizaremos sqlite y creamos un modelo de usuario basico

```prisma:no-line-numbers
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id        Int      @id
  balance   Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Se puede observar que para definir un modelo se usa la palabra clave `model` seguida del nombre del modelo. Luego, se definen los campos del modelo. Cada campo tiene un nombre, un tipo y una serie de modificadores. Los modificadores se utilizan para especificar restricciones en los campos, como si un campo es único o si se puede establecer en `null`. Los modificadores también se utilizan para especificar si un campo es una clave primaria o una clave foránea.

::: tip
Para obtener más información sobre el DSL de Prisma, consulte la [documentación de Prisma](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model).
:::
 
Por último, para poder usar la base de datos, debemos generar el cliente de Prisma y pushear los cambios a la base de datos con el siguiente comando

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npx prisma migrate dev --name init
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn prisma migrate dev --name init
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpx prisma migrate dev --name init
```
:::
::::

### Usando Prisma en el bot

<!-- eslint-disable require-await -->
```js
// Requiere el cliente de Prisma
const { PrismaClient } = require('@prisma/client');

// Requiere las clases necesarias de discord.js
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create una nueva instancia de un cliente de Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Crea una nueva instancia de un cliente de Prisma
const prisma = new PrismaClient();

// Cuando el cliente está listo, ejecuta este código
// Esto solo sucederá una vez después de que se haya iniciado el bot
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

`PrismaClient` es una clase que se utiliza para crear una instancia de un cliente de Prisma, la conexión a la base de datos se establece cuando se hace la primer consulta a la base de datos. Pero también se puede establecer la conexión manualmente con el método `connect` de la clase `PrismaClient`.

::: tip
Para obtener más información sobre el cliente de Prisma, consulte la [documentación de Prisma](https://www.prisma.io/docs/concepts/components/prisma-client).
:::

Con esto ya podemos usar el cliente de Prisma en nuestro bot, para crear un nuevo usuario en la base de datos podemos hacer lo siguiente

::: tip
Para obtener más información sobre el cliente de Prisma, consulte la [documentación de Prisma](https://www.prisma.io/docs/concepts/components/prisma-client).
:::

<!-- eslint-skip -->

```js {7-26}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'register') {
		// Crea un nuevo usuario en la base de datos
		try {
			const newUser = await prisma.user.create({
				data: {
					id: interaction.user.id,
					balance: 0,
				},
			});

			// Envía un mensaje al usuario
			await interaction.reply(`Se ha registrado con el ID ${newUser.id}`);
	}
	} catch (error) {
		// Si el usuario ya existe, envía un mensaje de error
		if (error.code === 'P2002') {
			await interaction.reply('Ya estás registrado');
		} else {
			console.error(error);
		}
	}
});
```

`prisma.user.create` es una función asincrónica que devuelve una promesa que resuelve a un objeto que contiene los datos del usuario recién creado. En este caso, solo estamos interesados en el ID del usuario, pero también podemos acceder a otros datos, como el saldo y la fecha de creación. Si el usuario ya existe, la función `prisma.user.create` arrojará un error con el código `P2002`. Podemos usar este código para enviar un mensaje de error al usuario.

::: tip
Para obtener más información sobre los errores de Prisma, consulte la [documentación de Prisma](https://www.prisma.io/docs/concepts/components/prisma-client/crud#handling-exceptions--errors).
:::

### Obtener datos de la base de datos

```js {7-26}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'balance') {
		// Obtiene el usuario de la base de datos
		const user = await prisma.user.findUnique({
			where: {
				id: interaction.user.id,
			},
		});

		// Si el usuario no existe, envía un mensaje de error
		if (!user) {
			return interaction.reply('No estás registrado');
		}

		// Envía un mensaje con el saldo del usuario
		await interaction.reply(`Tu saldo es de ${user.balance}`);
	}
});
```

`prisma.user.findUnique` es una función asincrónica que devuelve una promesa que resuelve a un objeto que contiene los datos del usuario. Si el usuario no existe, la función `prisma.user.findUnique` devolverá `null`. Podemos usar esto para enviar un mensaje de error al usuario.

### Actualizar datos de la base de datos

```js {7-26}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'add') {
		// Actualiza el saldo del usuario
		const updatedUser = await prisma.user.update({
			where: {
				id: interaction.user.id,
			},
			data: {
				balance: user.balance + 100,
			},
		});

		// Envía un mensaje con el nuevo saldo del usuario
		await interaction.reply(`Tu nuevo saldo es de ${updatedUser.balance}`);
	}
});
```

`prisma.user.update` es una función asincrónica que devuelve una promesa que resuelve a un objeto que contiene los datos del usuario actualizado. En este caso, solo estamos interesados en el saldo del usuario, pero también podemos acceder a otros datos, como el ID y la fecha de creación.
Usamos .findUnique para obtener al usuario y saber si	existe, y luego usamos .update para actualizar el saldo del usuario.

### Eliminar datos de la base de datos

```js {7-26}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'unregister') {
		// Elimina el usuario de la base de datos
		const deletedUser = await prisma.user.delete({
			where: {
				id: interaction.user.id,
			},
		});

		// Envía un mensaje al usuario
		await interaction.reply(`Se ha eliminado el usuario con el ID ${deletedUser.id}`);
	}
});
```

`prisma.user.delete` es una función asincrónica que devuelve una promesa que resuelve a un objeto que contiene los datos del usuario eliminado. En este caso, solo estamos interesados en el ID del usuario, pero también podemos acceder a otros datos, como el saldo y la fecha de creación.

### Resulting Code
