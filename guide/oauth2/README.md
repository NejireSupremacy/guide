# Empezando con OAuth2

OAuth2 le permite a los desarrolladores crear aplicaciones que utilicen autenticación y datos de la API de Discord. Los desarrolladores pueden utilizar estos para crear cosas tales como dashboards en la web para mostrar información del usuario, obtener cuentas vinculadas de terceros como Twitch o Steam, acceder a la información del servidor de los usuarios sin estar realmente en el servidor, y mucho más. OAuth2 puede ampliar significativamente la funcionalidad de tu bot si se utiliza correctamente.

## Un rápido ejemplo

### Configurando un servidor web báscio

La mayoría de las veces, los sitios web utilizan OAuth2 para obtener información sobre sus usuarios de un servicio externo. En este ejemplo, usaremos [`express`](https://expressjs.com/) para crear un servidor web que use la información de Discord de un usuario para saludarlo. Empieza creando tres archivos: `config.json`, `index.js`, y `index.html`.

El archivo `config.json` se utilizará para almacenar el ID del cliente, el secreto del cliente y el puerto del servidor.

```json
{
	"clientId": "",
	"clientSecret": "",
	"port": 53134
}
```

Se utilizará `index.js` para iniciar el servidor y gestionar las peticiones. Cuando alguien visite la página índice (`/`), se enviará un archivo HTML como respuesta.

```js
const express = require('express');
const { port } = require('./config.json');

const app = express();

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.listen(port, () => console.log(`App desplegada en http://localhost:${port}`));
```

El archivo `index.html` se utilizará para mostrar la interfaz de usuario y los datos OAuth una vez iniciada la sesión.

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Mi aplicación de Discord OAuth2</title>
	</head>
	<body>
		<div id="info">¡Hola!</div>
	</body>
</html>
```

Después de ejecutar `npm i express`, puedes iniciar tu servidor con `node index.js`. Una vez iniciado, ingresa a `http://localhost:53134`, y deberías ver "¡Hola!".

::: tip CONSEJO
Aunque estamos usando express, hay muchas otras alternativas para manejar un servidor web, tales como: [fastify](https://www.fastify.io/), [koa](https://koajs.com/), y el [módulo nativo de Node.js, htpp](https://nodejs.org/api/http.html).
:::

### Obteniendo una URL OAuth2

Ahora que tienes un servidor web en funcionamiento, es hora de obtener información de Discord. Abre [tus aplicaciones de Discord](https://discord.com/developers/applications/), crea o selecciona una aplicación y dirígete a la página "OAuth2".

![Página de la aplicación OAuth2](./images/oauth2-app-page.png)

Fíjate en los campos `client id` y `client secret`. Copia estos valores en tu archivo `config.json`; los necesitarás más adelante. Por ahora, añade una URL de redirección a `http://localhost:53134` de esta forma:

![Añadir redirecciones](./images/add-redirects.png)

Una vez que hayas añadido tu URL de redirección, querrás generar una URL OAuth2. Más abajo en la página, puedes encontrar un generador de URL OAuth2 proporcionado por Discord. Utilízalo para crear una URL para ti con el ámbito `identify`.

![Generar una URL OAuth2](./images/generate-url.png)

El ámbito `identify` permitirá a tu aplicación obtener información básica del usuario de Discord. Puedes encontrar una lista de todos los ámbitos [aquí](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes).

### Flujo `implicit grant`

Tienes tu sitio web, y tienes una URL. Ahora necesitas usar esas dos cosas para obtener un token de acceso. Para aplicaciones básicas como [SPAs](https://es.wikipedia.org/wiki/Single-page_application), obtener un token de acceso directamente es suficiente. Puedes hacerlo cambiando el `response_type` en la URL a `token`. Sin embargo, esto significa que no obtendrás un token de refresco, lo que significa que el usuario tendrá que volver a autorizarse explícitamente cuando este token de acceso haya expirado.

Después de cambiar el `response_type`, puedes probar la URL inmediatamente. Al visitarla en su navegador, se te dirigirá a una página con el siguiente aspecto:

![Página de autorización](./images/authorize-app-page.png)

Puedes ver que haciendo clic en `Autorizar`, permites a la aplicación acceder a tu nombre de usuario y avatar. Una vez que hagas clic, te redirigirá a tu URL de redirección con un [identificador de fragmento (EN-US)](https://en.wikipedia.org/wiki/Fragment_identifier) añadido. Ahora tienes un token de acceso y puedes hacer peticiones a la API de Discord para obtener información sobre el usuario.

Modifica `index.html` para añadir tu URL OAuth2 y aprovechar el token de acceso si existe. Aunque [`URLSearchParams`](https://developer.mozilla.org/es/docs/Web/API/URLSearchParams) es para trabajar con cadenas de consulta, puede funcionar aquí porque la estructura del fragmento sigue la de una cadena de consulta después de eliminar el "#" inicial.

```html {4-26}
<div id="info">¡Hola!</div>
<a id="login" style="display: none;" href="tu-URL-OAuth2-aquí">¡Identificate!</a>
<script>
	window.onload = () => {
		const fragment = new URLSearchParams(window.location.hash.slice(1));
		const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

		if (!accessToken) {
			return (document.getElementById('login').style.display = 'block');
		}

		fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${tokenType} ${accessToken}`,
			},
		})
			.then(result => result.json())
			.then(response => {
				const { username, discriminator } = response;
				document.getElementById('info').innerText += ` ${username}#${discriminator}`;
			})
			.catch(console.error);
	};
</script>
```

Aquí coges el token de acceso y el tipo de la URL si está ahí y lo usas para obtener información sobre el usuario, que luego se usa para saludarle. La respuesta que obtienes del [enpoint `/api/users/@me`](https://discord.com/developers/docs/resources/user#get-current-user) es un [user object](https://discord.com/developers/docs/resources/user#user-object) y debería ser algo como esto:

```json
{
	"id": "123456789012345678",
	"username": "Usuario",
	"discriminator": "0001",
	"avatar": "1cc0a3b14aec3499632225c708451d67",
	...
}
```

En las siguientes secciones, repasaremos varios detalles de Discord y OAuth2.

## Más detalles

### El parámetro de estado

Los protocolos de OAuth2 proporcionan un parámetro `state`, que Discord admite. Este parámetro ayuda a prevenir ataques [CSRF](https://es.wikipedia.org/wiki/Cross-site_request_forgery) y representa el estado de tu aplicación. El estado debe generarse por el usuario y añadirse a la URL OAuth2. Para un ejemplo básico, puedes utilizar una string generada aleatoriamente y codificada en Base64 como parámetro de estado.

```js {1-10,15-18}
function generateRandomString() {
	let randomString = '';
	const randomNumber = Math.floor(Math.random() * 10);

	for (let i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}

	return randomString;
}

window.onload = () => {
	// ...
	if (!accessToken) {
		const randomString = generateRandomString();
		localStorage.setItem('oauth-state', randomString);

		document.getElementById('login').href += `&state=${btoa(randomString)}`;
		return (document.getElementById('login').style.display = 'block');
	}
};
```

Cuando visites una URL con un parámetro `state` añadido y hagas clic en `Authorize`, te darás cuenta de que después de ser redirigido, la URL también tendrá el parámetro `state` añadido, que deberás comprobar con lo que estaba almacenado. Puedes modificar el script en tu archivo `index.html` para manejar esto.

```js {2,8-10}
const fragment = new URLSearchParams(window.location.hash.slice(1));
const [accessToken, tokenType, state] = [fragment.get('access_token'), fragment.get('token_type'), fragment.get('state')];

if (!accessToken) {
	// ...
}

if (localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
	return console.log('¡Es posible que te hayan robado el clic!');
}
```

::: tip CONSEJO
¡No sacrifiques la seguridad por un poco de comodidad!
:::

### Flujo `authorization code grant`

Lo que hiciste en el ejemplo rápido fue ir a través del flujo `implicit grant`, que pasó el token de acceso directamente al navegador del usuario. Este flujo es genial y simple, pero no consigues refrescar el token sin el usuario, y es menos seguro que ir a través del flujo `authorization code grant`. Este flujo implica recibir un código de acceso, que tu servidor intercambia por un token de acceso. Ten en cuenta que de esta forma, el código de acceso nunca llega al usuario a lo largo del proceso.

A diferencia del [flujo `implicit grant`](/guide/oauth2/#implicit-grant-flow), necesitas una URL OAuth2 donde el `response_type` sea `code`. Después de cambiar el `response_type`, intenta visitar el enlace y autorizar tu aplicación. Deberías notar que en lugar de un hash, la URL de redirección tiene ahora un único parámetro de consulta añadido, por ejemplo `?code=ACCESS_CODE`. Modifica tu archivo `index.js` para acceder al parámetro desde la URL si existe. En express, puedes utilizar la propiedad `query` del parámetro `request`.

```js {2}
app.get('/', (request, response) => {
	console.log(`El código de acceso es: ${request.query.code}`);
	return response.sendFile('index.html', { root: '.' });
});
```

Ahora tienes que intercambiar este código con Discord por un token de acceso. Para ello, necesitas tu `client_id` y `client_secret`. Si los has olvidado, dirígete a [tus aplicaciones](https://discord.com/developers/applications) y consíguelos. Puedes usar [`undici`](https://www.npmjs.com/package/undici) para hacer peticiones a Discord.

Para instalar undici, ejecuta el siguiente comando:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install undici
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add undici
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add undici
```
:::
::::

Importa `undici` y haz tu solicitud.
:::tip
Si estás acostumbrado a la API Fetch y quieres usarla en lugar de como lo hace `undici`, en lugar de usar `undici#request`, usa `undici#fetch` con los mismos parámetros que node-fetch.
:::

```js {1,3,5-14,18-19,21-46}
const { request } = require('undici');
const express = require('express');
const { clientId, clientSecret, port } = require('./config.json');

const app = express();

app.get('/', async ({ query }, response) => {
	const { code } = query;

	if (code) {
		try {
			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:${port}`,
					scope: 'identify',
				}).toString(),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await tokenResponseData.body.json();
			console.log(oauthData);
		} catch (error) {
			// NOTA: Un token no autorizado no arrojará un error
			// tokenResponseData.statusCode será 401
			console.error(error);
		}
	}

	return response.sendFile('index.html', { root: '.' });
});
```

::: warning ADVERTENCIA
El tipo de contenido de la URL del token debe ser `application/x-www-form-urlencoded`, por lo que se utiliza `URLSearchParams`.
:::

Ahora intenta visitar tu URL OAuth2 y autorizar tu aplicación. Una vez redirigido, deberías ver una [respuesta de token de acceso](https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-access-token-response) en tu consola.

```json
{
	"access_token": "un código de acceso",
	"token_type": "Bearer",
	"expires_in": 604800,
	"refresh_token": "un token de actualización",
	"scope": "identify"
}
```

Con un token de acceso y un token de actualización, puedes volver a utilizar el [endpoint `/api/users/@me`](https://discord.com/developers/docs/resources/user#get-current-user) para obtener el [user object](https://discord.com/developers/docs/resources/user#user-object).

<!-- eslint-skip -->

```js {1-5,7}
const userResult = await request('https://discord.com/api/users/@me', {
	headers: {
		authorization: `${oauthData.token_type} ${oauthData.access_token}`,
	},
});

console.log(await userResult.body.json());
```

::: tip CONSEJO
Para mantener la seguridad, almacene el token de acceso en el servidor pero asócielo a un identificador de sesión que genere para el usuario.
:::

## Lecturas complementarias

[RFC 6759](https://tools.ietf.org/html/rfc6749)  
[Documentación de Discord para OAuth2](https://discord.com/developers/docs/topics/oauth2)

## Resultado final

<ResultingCode path="oauth/simple-oauth-webserver" />
