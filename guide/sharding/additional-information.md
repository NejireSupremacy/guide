# Información adicional

::: tip CONSEJO
Esta página es una continuación y basa su código en [la página anterior](/guide/sharding/).
:::

Estos son algunos de los temas adicionales tratados sobre sharding que podrían haber despertado inquietudes.

## Aspectos

* `manager` es una instancia de `ShardingManager`, p.ej. `const manager = new ShardingManager(file, options);`
* `client.shard` se refiere al shard actual.

## Mensajes de shards

Para que los shards se comuniquen, tienen que enviarse mensajes entre ellos, ya que cada uno tiene otro proceso. Debes esperar a que cada fragmento termine de generarse para poder escuchar sus eventos, de lo contrario `ShardingManager#shards` será una `Collection` vacía. Puedes escuchar estos mensajes en las shards individuales añadiendo las siguientes líneas en tu archivo `index.js`:

```js
manager.spawn()
	.then(shards => {
		shards.forEach(shard => {
			shard.on('message', message => {
				console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
			});
		});
	})
	.catch(console.error);
```

Como los nombres de las propiedades implican, la propiedad `_eval` es lo que el fragmento está intentando evaluar, y la propiedad `_result` es el resultado de dicha evaluación. Sin embargo, estas propiedades sólo están garantizadas si un _shard_ está enviando un mensaje. También habrá una propiedad `_error`, en caso de que la evaluación haya arrojado un error.

También puede enviar mensajes a través de `process.send('hola')`, que no contendría la misma información. Esta es la razón por la que el tipo de la propiedad `.message` se declara como `*` en la documentación <DocsLink path="class/Shard?scrollTo=e-message" />.

## Shards específicas

Puede haber ocasiones en las que quieras centrarte en una shard específica. Un ejemplo sería matar una shard en específico que no está funcionando según lo previsto. Puede conseguirlo tomando el siguiente fragmento de código (en un comando, preferiblemente):

::: tip CONSEJO
En discord.js v13, <DocsLink path="class/ShardClientUtil?scrollTo=ids">`Client#shard`</DocsLink> puede contener múltiples ids. Si utilizas el gestor de fragmentación por defecto, el array `.ids` sólo tendrá una entrada.
:::

```js
client.shard.broadcastEval(c => {
	if (c.shard.ids.includes(0)) process.exit();
});
```

Si estás usando algo como [PM2](http://pm2.keymetrics.io/) o [Forever](https://github.com/foreverjs/forever), esta es una forma fácil de reiniciar un shard específico. Recuerda, <DocsLink path="class/ShardClientUtil?scrollTo=broadcastEval" type="method" /> envía un mensaje a **todos** los shards, así que tienes que comprobar si está en el shard que quieres.

## `ShardingManager#shardArgs` y `ShardingManager#execArgv`

Considera el siguiente ejemplo de creación de una nueva instancia de `ShardingManager`:

```js
const manager = new ShardingManager('./bot.js', {
	execArgv: ['--trace-warnings'],
	shardArgs: ['--ansi', '--color'],
	token: 'tu-token-va-aquí',
});
```

La propiedad `execArgv` es la que normalmente pasarías a Node sin sharding, p.ej:

```sh:no-line-numbers
node --trace-warnings bot.js
```

Puede encontrar una lista de opciones de línea de comandos para Node [aquí](https://nodejs.org/api/cli.html).

La propiedad `shardArgs` es lo que normalmente pasarías a tu bot sin sharding, por ejemplo:

```sh:no-line-numbers
node bot.js --ansi --color
```

Puede acceder a ellos más tarde como de costumbre a través de `process.argv`, que contiene un array de ejecutables, su archivo principal, y los argumentos de línea de comandos utilizados para ejecutar el script.

## Argumentos para evaluación

Puede llegar un momento en el que quieras pasar argumentos del ámbito externo a una llamada `.broadcastEval()`.

```js
function funcName(c, { arg }) {
	// ...
}

client.shard.broadcastEval(funcName, { context: { arg: 'arg' } });
```

El <DocsLink path="typedef/BroadcastEvalOptions" /> typedef se introdujo en discord.js v13 como segundo parámetro en `.broadcastEval()`.
Acepta dos propiedades: `shard` y `context`. La propiedad `context` se enviará como segundo argumento a su función.

En este pequeño fragmento, se pasa un argumento a la función `funcName` a través de este parámetro.
La función recibirá los argumentos como un objeto como segundo parámetro.

::: warning ADVERTENCIA
La opción `context` sólo acepta propiedades que sean serializables en JSON. Esto significa que no puedes pasar tipos de datos complejos en el contexto directamente.
Por ejemplo, si enviara una instancia de `Usuario`, la función recibiría el objeto de datos sin procesar.
:::
