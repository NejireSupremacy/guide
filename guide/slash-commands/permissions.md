# Permisos de comando de barra

Los comandos de barra tienen su propio sistema de permisos. Este sistema le permite establecer el nivel predeterminado de permisos necesarios para que un usuario ejecute un comando cuando se despliega por primera vez o su bot se añade a un nuevo servidor.

Los permisos del comando de barra para los servidores son sólo por defecto y pueden ser alterados por los administradores de los servidores, permitiéndoles configurar el acceso de la forma que mejor se adapte a sus roles de moderación y servidor. Tu código no debe tratar de imponer su propia gestión de permisos, ya que esto puede dar lugar a un conflicto entre los permisos configurados por el servidor y el código de tu bot.

::: warning ADVERTENCIA
No es posible impedir que los usuarios con permisos de administrador utilicen comandos desplegados globalmente o específicamente para su servidor. Piénselo dos veces antes de crear comandos "sólo para desarrolladores" como `eval`.
:::

## Permisos de los miembros

Puede utilizar <DocsLink section="builders" path="class/SlashCommandBuilder?scrollTo=setDefaultMemberPermissions" type="method" /> para establecer los permisos predeterminados necesarios para que un miembro ejecute el comando. Establecerlo a `0` prohibirá a cualquier miembro de un servidor utilizar el comando a menos que se configure una sobre escritura (overwrite) específica o que el usuario tenga el permiso de Administrador.

Para ello, vamos a introducir dos comandos de moderación comunes y simples: `ban` y `kick`. Para un comando de ban, un valor por defecto sensato es asegurarse de que los usuarios ya tienen el permiso Discord `BanMembers` con el fin de utilizarlo.

```js {11}
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Selecciona un miembro y banealo.')
	.addUserOption(option =>
		option
			.setName('target')
			.setDescription('El miembro a banear.')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
```

Para un comando kick sin embargo, podemos permitir a los miembros con el permiso `KickMembers` ejecutar el comando, así que listaremos esa bandera aquí.

::: tip CONSEJO
Puedes requerir que el usuario tenga todos los permisos combinándolos con el operador bitwise OR `|` (por ejemplo `PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers`).
No puedes requerir ninguno de los múltiples permisos. Discord evalúa el campo de bits de permiso combinado.

Si quieres saber más sobre el operador bitwise OR `|` puedes consultar los artículos de [Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#OR) y [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR) sobre el tema.
:::

```js {11}
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('kick')
	.setDescription('Selecciona un miembro y expúlsalo.')
	.addUserOption(option =>
		option
			.setName('target')
			.setDescription('El miembro a expulsar.')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);
```

En realidad, probablemente querrás tener un paso de confirmación adicional antes de que un ban se ejecute realmente. Echa un vistazo a la sección [botones](/interactions/buttons.html) de la guía para ver cómo añadir botones de confirmación a las respuestas de tus comandos y recibir los clics de los botones.

## Permiso DM

Por defecto, los comandos desplegados globalmente también están disponibles para su uso en DMs. Puedes utilizar <DocsLink section="builders" path="class/SlashCommandBuilder?scrollTo=setDMPermission" type="method" /> para desactivar este comportamiento. Los comandos desplegados a servidores específicos no están disponibles en los DM.

No tiene mucho sentido que tu comando `ban` esté disponible en los DMs, así que puedes añadir `setDMPermission(false)` al constructor para eliminarlo:

```js {11-12}
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Selecciona un miembro y banealo.')
	.addUserOption(option =>
		option
			.setName('target')
			.setDescription('El miembro a banear.')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.setDMPermission(false);
```

Y eso es todo lo que necesitas saber sobre los permisos de los comandos de barra.
