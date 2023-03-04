# Entendiendo la notación

En toda la documentación de discord.js y al solicitar ayuda en el servidor oficial, te encontrarás con diferentes tipos de notaciones. Para ayudarte a entender los textos que lees, vamos a ayudarte a entender algunas notaciones estándar.


::: tip
Ten siempre presente que la notación no siempre es rigurosa. Habrán erratas, malentendidos, o contextos que harán que la notación difiera de los significados habituales.
:::

## Clases

Algunas notaciones comunes se refieren a una clase o a las propiedades, métodos o eventos de una clase. Existen muchas variaciones de estas notaciones, y son muy flexibles dependiendo de la persona, así que usa tu mejor juicio al leerlas.

La notación `<Class>` hace referencia a la instancia de la clase `Class`. Por ejemplo, un snippet como `<BaseInteraction>.reply('Hola')` pide que sustituya `<BaseInteraction>` por algún valor que sea una instancia de `BaseInteraction`, p. ej. `interaction.reply('Hola')`. También podría ser sólo un placeholder, p. ej. `<id>` supondría un placeholder para alguna ID.

La notación `Class#foo` puede hacer referencia a la propiedad `foo`, método o evento de la clase `Class`. Hay que determinar por el contexto a qué se refiera el autor. Por ejemplo:

- `BaseInteraction#user` significa que debe referirse a la propiedad `user` en la clase `BaseInteraction`.
- `TextChannel#send` significa que debe referirse al método `send` en la clase `TextChannel`.
- `Client#interactionCreate` significa que debe referirse al evento `interactionCreate` en la clase `Client`.

::: tip
Recuerda que esta notación no es válida en JavaScript; es una forma abreviada de referirse a un fragmento específico de código.
:::

A veces, la notación se amplía, lo que puede ayudar a determinar a cuál se refería el escritor. Por ejemplo, `TextChannel#send(options)` es definitivamente un método de `TextChannel`, ya que utiliza la notación de una función. `Client#event:messageCreate` es un evento, ya que dice que es un evento.

Lo más importante de esta notación es que el símbolo `#` hace referencia a que sólo se puede acceder a la propiedad, método o evento a través de una instancia de la clase. Desafortunadamente, muchos abusan de esta notación, p. ej., `<Message>#send` o `Util#resolveColor`. `<Message>` ya es una instnacia, así que puede no tener sentido, y `resolveColor` es un método estático que deberás escribirlo como `Util.resolveColor`. Si tienes dudas, consulta siempre la documentación.

## Tipos

En la documentación de discord.js, hay firmas de tipo donde sea, como propiedades, parámetros o valores de retorno. Si no vienes de un lenguaje tipado estáticamente, es posible que no sepas qué significan determinadas notaciones.

El símbolo `*` significa cualquier tipo. Por ejemplo, los métodos que devuelven `*` significan que pueden devolver cualquier cosa, y el parámetro de tipo `*` puede ser cualquier cosa.

El símbolo `?` significa que el tipo es anulable. Puede aparecer antes o después del tipo (p. ej. `?T` o `T?`). Este símbolo significa que el valor puede ser del tipo `T` o `null`. Un ejemplo de esto es `GuildMember#nickname`; su tipo es `?string` ya que un miembro puede tener o no un apodo.

La expresión `T[]` significa un array de `T`. A veces pueden verse varios corchetes `[]`, indicando que el array es multidimensional, p. ej., `string[][]`

La expresión `...T` significa un parámetro rest de tipo `T`. Esto significa que la función puede tomar cualquier cantidad de argumentos, y todos esos argumentos deben ser del tipo `T`.

El operador `|`, que puede leerse como "o", crea un tipo de unión, p. ej. `A|B|C`. Simplemente significa que el valor puede ser de cualquiera de los tipos indicados.

The angle brackets `<>` are used for generic types or parameterized types, signifying a type that uses another type(s). The notation looks like `A<B>` where `A` is the type and `B` is a type parameter. If this is hard to follow, it is enough to keep in mind that whenever you see `A<B>`, you can think of an `A` containing `B`. Examples:
Los paréntesis angulares `<>` son usados para tipos genéricos o tipos parametrizados, significa que un tipo utiliza otro(s) tipo(s). La notación es `A<B>` donde `A` es el tipo y `B` es un parámetro de tipo.

- `Array<String>` significa un array de strings.
- `Promise<User>` significa una `Promise` que contiene `User`.
- `Array<Promise<User|GuildMember>>` significa un array de `Promise`, que cada uno contiene `User` o `GuildMember`.
- `Collection<Snowflake, User>` sería una `Collection`, que contiene pares clave-valor donde las claves son `Snowflake` y los valores son `User`.

![TextChannel#send on the docs](./images/send.png)

En esta parte de la documentación, puedes ver dos firmas de tipo, `string`, `MessagePayload`, o `MessageOptions` y `Promise<(Message|Array<Message>)>`.
El significado de la palabra "or" aquí es el mismo que `|`