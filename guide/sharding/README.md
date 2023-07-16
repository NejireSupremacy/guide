# Primeros pasos

## ¿Cuándo hacer sharding?

Antes de sumergirte en esta sección, ten en cuenta que es posible que no necesites el sharding. El sharding sólo es necesario a partir de los 2,500 servidores; a partir de ese momento, Discord no permitirá que tu bot inicie sesión sin sharding. Teniendo esto en cuenta, deberías considerar esta opción cuando tu bot tenga alrededor de 2,000 servidores, lo que debería ser tiempo suficiente para que funcione. Contrariamente a la creencia popular, el sharding en sí es muy sencillo. Sin embargo, puede ser complicado dependiendo de las necesidades de tu bot. Si tu bot está en un total de 2.000 o más servidores, entonces por favor continúa con esta guía. De lo contrario, puede ser una buena idea esperar hasta entonces.

## ¿Cómo funciona el sharding?

A medida que una aplicación crece, un desarrollador puede encontrar necesario dividir su proceso para ejecutarlo en paralelo y maximizar la eficiencia. A mayor escala, el desarrollador puede notar que su proceso se ralentiza, entre otros problemas.
[Consulta la documentación oficial de Discord sobre el tema.](https://discord.com/developers/docs/topics/gateway#sharding)

::: warning ADVERTENCIA
Esta guía sólo explica los fundamentos del sharding utilizando el ShardingManager incorporado, que puede ejecutar shards como procesos separados o hilos en una sola máquina. Si necesitas escalar más allá de eso (por ejemplo, ejecutar shards en múltiples máquinas/contenedores), puedes hacerlo con discord.js pasando las opciones apropiadas al constructor Client. Sin embargo, estarás por tu cuenta en lo que respecta a la gestión de shards y el intercambio de información entre ellos.
:::

::: tip CONSEJO
Apart from ShardingManager, discord.js also supports a sharding mode known as Internal sharding. Internal sharding creates multiple websocket connections from the same process, and does not require major code changes. To enable it, simply pass `shards: 'auto'` as ClientOptions to the Client constructor. However, internal sharding is not ideal for bigger bots due to high memory usage of the single main process and will not be further discussed in this guide.
Aparte de ShardingManager, discord.js también soporta un modo de sharding conocido como sharding interno. El sharding interno crea múltiples conexiones websocket desde el mismo proceso, y no requiere grandes cambios de código. Para activarlo, simplemente pasa `shards: 'auto'` como ClientOptions al constructor del Cliente. Sin embargo, el sharding interno no es ideal para bots grandes debido al alto uso de memoria del único proceso principal y no será discutido en esta guía.
:::

## Archivo de sharding

En primer lugar, necesitarás tener un archivo que ejecutarás a partir de ahora, en lugar de tu archivo original `index.js`. Es muy recomendable renombrarlo a `bot.js` y nombrar este nuevo archivo como `index.js` en su lugar. Copia y pega el siguiente fragmento en tu nuevo archivo `index.js`.

```js
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./bot.js', { token: 'tu-token-va-aquí' });

manager.on('shardCreate', shard => console.log(`Shard ${shard.id} desplegada.`));

manager.spawn();
```

El código anterior utiliza el gestor de shards de discord.js para generar la cantidad recomendada de shards para tu bot. La cantidad recomendada debería ser de aproximadamente 1.000 servidores por shard. Ten en cuenta que tienes que adjuntar el oyente de eventos a `shardCreate` antes de llamar a `.spawn()` para evitar una condición de carrera que posiblemente impida que el shard 0 registre el arranque exitoso. Aunque proporciones el token aquí, necesitarás enviarlo al archivo principal del bot en `client.login()`, así que no olvides hacerlo.

::: tip CONSEJO
Puedes encontrar los métodos disponibles para la clase <DocsLink path="class/ShardingManager">aquí</DocsLink>. Aunque, puede que no hagas mucho uso de esta sección, a diferencia de la siguiente característica que exploraremos, la cual puedes conocer haciendo clic en [este enlace](/guide/sharding/additional-information.md).
:::

## Primeros pasos

Lo más probable es que tengas que cambiar algo de código para que tu nuevo bot sharded funcione. Si tu bot es muy básico, ¡estás de suerte! Asumimos que probablemente tienes algún tipo de comando `stats`, mediante el cual puedes ver rápidamente las estadísticas de tu bot, como su recuento de servidores. Lo usaremos como un ejemplo que necesita adaptarse a funcionar con shards.

En este código, es probable que tengas el fragmento `client.guilds.cache.size`, que cuenta el número de servidores *cacheados* adjuntos a ese cliente. Dado que el sharding lanzará múltiples procesos, cada proceso (cada shard) tendrá su propio subconjunto de guilds del que será responsable. Esto significa que tu código original no funcionará como cabría esperar.

A continuación se muestra un ejemplo de código para un comando `stats`, sin tener en cuenta el sharding:

```js
// bot.js
const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'stats') {
		return interaction.reply(`Servidores totales: ${client.guilds.cache.size}.`);
	}
});

client.login('tu-token-va-aquí');
```

Digamos que tu bot está en un total de 3.600 servidores. Utilizando el recuento de shards recomendado, podrías acabar en cuatro shards, cada uno de los cuales contendría aproximadamente 900 servidores. Si un servidor está en un shard específico (shard #2, por ejemplo) y recibe este comando, el recuento de servidores será cercano a 900, que no es el número "correcto" de servidores para tu bot. Veamos cómo solucionarlo.

## FetchClientValues

Uno de los métodos de utilidad del sharding más comun es <DocsLink path="class/ShardClientUtil?scrollTo=fetchClientValues" type="method" />. Este método recupera una propiedad en el objeto Cliente de todos los shards.

Toma el siguiente fragmento de código:

```js
client.shard.fetchClientValues('guilds.cache.size').then(console.log);
```

Si lo ejecutas, verás un resultado como `[898, 901, 900, 901]`. Estarás en lo cierto al asumir que ese es el número total de servidores por fragmento almacenado en un array en la Promise. Probablemente no sea la salida ideal para el recuento de servidores, así que utilicemos [Array.reduce()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) para obtener un resultado mejor.

::: tip CONSEJO
Es muy recomendable que visites [la documentación](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) para entender cómo funciona el método `reduce()`, ya que probablemente le encuentres un gran uso en el sharding.
:::

En este caso, este método itera a través del array y añade cada valor actual a la cantidad total:

```js
client.shard.fetchClientValues('guilds.cache.size')
	.then(results => {
		console.log(`${results.reduce((acc, guildCount) => acc + guildCount, 0)} servidores totales`);
	})
	.catch(console.error);
```

Si bien es un poco poco atractivo tener más anidamiento en tus comandos, es necesario cuando no se utiliza `async`/`await`. Ahora, el código en la parte superior debe ser algo como lo siguiente:

```js {4-8}
client.on(Events.InteractionCreate, interaction => {
	// ...
	if (commandName === 'stats') {
		return client.shard.fetchClientValues('guilds.cache.size')
			.then(results => {
				return interaction.reply(`Servidores totales: ${results.reduce((acc, guildCount) => acc + guildCount, 0)}`);
			})
			.catch(console.error);
	}
});
```

## BroadcastEval

A continuación, echa un vistazo a otro método práctico del sharding conocido como <DocsLink path="class/ShardClientUtil?scrollTo=broadcastEval" type="method" />. Este método hace que todas los shards evalúen un método dado, que recibe un argumento `client` y un argumento `context`. El argumento `client` se refiere al objeto Client del shard que lo evalúa. Puedes leer sobre el argumento `context` [aquí](/guide/sharding/additional-information.md#eval-arguments).

```js
client.shard
	.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
	.then(console.log);
```

This will run the code given to `broadcastEval` on each shard and return the results to the Promise as an array, once again. You should see something like `[9001, 16658, 13337, 15687]` logged. The code sent to each shard adds up the `memberCount` property of every guild that shard is handling and returns it, so each shard's total guild member count. Of course, if you want to total up the member count of *every* shard, you can do the same thing again on the Promise results.
Esto ejecutará el código dado a `broadcastEval` en cada shard y devolverá los resultados a la Promise como un array, una vez más. Deberías ver algo como `[9001, 16658, 13337, 15687]` registrado. El código enviado a cada shard suma la propiedad `memberCount` de cada servidor que esa shard está manejando y lo devuelve, o sea el recuento total de miembros de servidor de cada shard. Por supuesto, si quieres sumar el número de miembros de *cada* shard, puedes hacer lo mismo en los resultados de Promise.

```js
client.shard
	.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
	.then(results => {
		return interaction.reply(`Miembros totales: ${results.reduce((acc, memberCount) => acc + memberCount, 0)}`);
	})
	.catch(console.error);
```

## Poniéndolos juntos

Lo más probable es que desee mostrar ambas informaciones en el comando stats. Puede combinar estos dos resultados con [Promise.all()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/all):

```js
const promises = [
	client.shard.fetchClientValues('guilds.cache.size'),
	client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
];

Promise.all(promises)
	.then(results => {
		const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
		const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
		return interaction.reply(`Servidores totales: ${totalGuilds}\nMiembros totales: ${totalMembers}`);
	})
	.catch(console.error);
```

`Promise.all()` ejecuta cada Promise que pases dentro de un array en paralelo y espera a que cada una termine antes de devolver sus resultados simultáneamente. El resultado es un array que se corresponde con el array de promesas que pases, de modo que el primer elemento resultante será el de la primera promesa. Con esto, tu comando stats debería tener este aspecto:

```js {4-15}
client.on(Events.InteractionCreate, interaction => {
	// ...
	if (commandName === 'stats') {
		const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
		];

		return Promise.all(promises)
			.then(results => {
				const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
				const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
				return interaction.reply(`Servidores totales: ${totalGuilds}\nMiembros totales: ${totalMembers}`);
			})
			.catch(console.error);
	}
});
```

La siguiente sección contiene cambios adicionales que podrías considerar, y que puede conocer haciendo clic en [este enlace](/guide/sharding/additional-information.md).

## Resultado final

<ResultingCode path="sharding/getting-started" />
