# Colecciones

discord.js viene con una clase de utilidad conocida como `Collection`.
Extiende la clase nativa `Map` de JavaScript, por lo que tiene todas las características de `Map` y más.

::: warning ADVERTENCIA
Si no estás familiarizado con `Map`, lee [su página en MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Map) antes de continuar. También deberías estar familiarizado con los `métodos` de [Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array). También usaremos algunas características de ES6, así que lee [aquí](/guide/additional-info/es6-syntax.md) si no sabes lo que son.
:::

Un `Mapa` permite una asociación entre claves únicas y sus valores.
Por ejemplo, ¿cómo transformar fácilmente cada valor o filtrar las entradas de un `Map`?
Este es el objetivo de la clase `Collection`.

## Métodos tipo array

Muchos de los métodos de `Collection` se corresponden con sus homónimos de `Array`. Uno de ellos es `find`:

```js
// Supongamos que tenemos un array de usuarios y una colección de los mismos usuarios.
array.find(u => u.discriminator === '1000');
collection.find(u => u.discriminator === '1000');
```

La interfaz de la función de devolución de llamada (callback) es muy similar entre los dos.
Para los arrays, las retrollamadas suelen pasar los parámetros `(value, index, array)`, donde `value` es el valor iterado,
`index` es el índice actual, y `array` es el array. Para colecciones, tendrías `(value, key, collection)`.
Aquí, `value` es lo mismo, pero `key` es la clave del valor, y `collection` es la colección en sí.

Los métodos que siguen esta filosofía de permanecer cerca de la interfaz `Array` son los siguientes:

- `find`
- `filter` - Ten en cuenta que devuelve una `Collection` en lugar de un `Array`.
- `map` - Devuelve un `Array` de valores en lugar de una `Collection`.
- `every`
- `some`
- `reduce`
- `concat`
- `sort`

## Convirtiendo a Array

Dado que `Collection` extiende `Map`, es un [iterable](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Iteration_protocols), y puede convertirse en un `Array` mediante `Array.from()` o la sintaxis spread (`...collection`).

```js
// Para valores.
Array.from(collection.values());
[...collection.values()];

// Para claves.
Array.from(collection.keys());
[...collection.keys()];

// Para pares [clave, valor].
Array.from(collection);
[...collection];
```

::: warning ADVERTENCIA
Mucha gente convierte colecciones en arrays con demasiada frecuencia. Esto puede dar lugar a código innecesario y confuso. Antes de utilizar `Array.from()` o similar, pregúntate si lo que estás intentando hacer no se puede hacer con los métodos `Map` o `Collection` o con un bucle for-of.
:::

## Utilidades extra

Algunos métodos no proceden de `Array`, sino que son completamente nuevos en JavaScript estándar.

```js
// Un valor aleatorio.
collection.random();

// El primer valor.
collection.first();

// Los primeros cinco valores.
collection.first(5);

// Similar a `first`, pero desde el fin.
collection.last();
collection.last(2);

// Elimina de la colección todo lo que cumpla la condición.
// Algo así como `filter`, pero en el lugar.
collection.sweep(user => user.username === 'Bob');
```

Un método más complicado es `partition`, que divide una única Colección en dos nuevas Colecciones basándose en la función proporcionada.
Se puede pensar que son dos `filtros`, pero hechos al mismo tiempo:

```js
// `bots` es una colección de usuarios cuya propiedad `bot` es verdadera.
// `humans` es una Colección donde la propiedad era falsa en su lugar.
const [bots, humans] = collection.partition(u => u.bot);

// Ambos devuelven verdadero.
bots.every(b => b.bot);
humans.every(h => !h.bot);
```
