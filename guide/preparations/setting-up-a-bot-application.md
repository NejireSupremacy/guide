# Configurar una aplicación

## Creando tu bot

Ahora que has instalado Node, discord.js y, con suerte, un linter, ¡estás casi listo para empezar a programar! El siguiente paso que debes dar es configurar una aplicación bot de Discord real a través del sitio web de Discord.

Crear uno no supone ningún esfuerzo. Los pasos a seguir son los siguientes:

1. Abre el [portal para desarrolladores de Discord](https://discord.com/developers/applications) e inicia sesión en tu cuenta.
2. Haz clic en el botón "New Application".
3. Introduce un nombre y confirma la ventana emergente haciendo clic en el botón "Create".

Debería ver una página como ésta:

![Successfully created application](./images/create-app.png)

Aquí puedes editar el nombre, la descripción y el avatar de tu aplicación. Una vez que hayas guardado los cambios, sigue adelante seleccionando la pestaña "Bot" en el panel izquierdo.

![Create a bot UI](./images/create-bot.png)

Haz clic en el botón "Add Bot" de la derecha y confirma la ventana emergente haciendo clic en "Yes, do it!". Enhorabuena, ya eres el orgulloso propietario de un nuevo y reluciente bot de Discord. Pero no has terminado del todo.

## El token de tu bot

::: danger CUIDADO
Esta sección es crítica, así que presta mucha atención. Explica qué es tu token bot, así como sus aspectos de seguridad.
:::

Después de crear un bot, verás una sección como esta:

![Bot application](./images/created-bot.png)

En este panel, puedes dar a tu bot un avatar elegante, establecer su nombre de usuario y hacerlo público o privado. El token de tu bot se revelará cuando pulses el botón "Reset Token" y confirmes. Cuando te pidamos que pegues el token de tu bot en algún sitio, este es el valor que tienes que poner. Si pierdes el token de tu bot en algún momento, tienes que volver a esta página y restablecer el token de tu bot de nuevo, lo que revelará el nuevo token, invalidando todos los antiguos.

### ¿Qué es un token?

Un token es esencialmente la contraseña de tu bot; es lo que tu bot utiliza para iniciar sesión en Discord. Dicho esto, **es vital que nunca compartas este token con nadie, ni a propósito ni accidentalmente**. Si alguien consigue hacerse con el token de tu bot, podrá utilizarlo como si fuera suyo, lo que significa que podrá realizar actos maliciosos con él.

Los tokens tienen este aspecto: `NzkyNzE1NDU0MTk2MDg4ODQy.X-hvzA.Ovy4MCQywSkoMRRclStW4xAYK7I` (no te preocupes, reseteamos este token inmediatamente antes de publicarlo aquí). Si es más corto y se parece más a esto `kxbsDRU5UfAaiO7ar9GFMHSlmTwYaIYn`, has copiado tu secreto de cliente en su lugar. Asegúrate de copiar el token si quieres que tu bot funcione.

### Escenario de perdida de token

Imaginemos que tienes un bot en más de 1.000 servidores, y que te ha llevado muchos, muchos meses de escribir código y paciencia conseguirlo en esa cantidad. El token de tu bot se filtra en algún sitio, y ahora lo tiene otra persona. Esa persona puede:

* Hacer spam en todos los servidores en los que esté tu bot;
* Hacer spam mediante MD a tantos usuarios como sea posible;
* Borrar tantos canales como sea posible;
* Expulsar o banear a tantos miembros del servidor como sea posible;
* Hacer que tu bot abandone todos los servidores a los que se ha unido;

Todo eso y mucho, mucho más. Suena bastante terrible, ¿verdad? Así que asegúrate de mantener el token de tu bot lo más seguro posible.

En la página [archivos iniciales](/creating-your-bot/) de la guía, cubrimos cómo almacenar de forma segura el token de tu bot en un archivo de configuración.

::: danger CUIDADO
Si el token de tu bot se ha visto comprometido al enviarlo a un repositorio público, publicarlo en el soporte de discord.js, etc., o ves que el token de tu bot está en peligro, vuelve a esta página y pulsa "Reset Token". Esto invalidará todos los tokens antiguos pertenecientes a tu bot. Ten en cuenta que tendrás que actualizar el token de tu bot donde lo usabas antes.
:::
