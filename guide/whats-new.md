<style scoped>
.emoji-container {
	display: inline-block;
}

.emoji-container .emoji-image {
	width: 1.375rem;
	height: 1.375rem;
	vertical-align: bottom;
}
</style>

# Qué hay de nuevo

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				author="discord.js"
				:command="true"
			>upgrade</DiscordInteraction>
		</template>
		discord.js v14 ya está disponible y la guía ha sido actualizada y traducida.
		<span class="emoji-container">
			<img class="emoji-image" title="tada" alt=":tada:" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@v14.0.2/assets/72x72/1f389.png" />
		</span>
		<br />
		Esto incluye adiciones y cambios realizados en Discord, como comandos de barra y componentes de mensajes.
	</DiscordMessage>
</DiscordMessages>

## Sitio

- Actualizado a [VuePress v2](https://v2.vuepress.vuejs.org/)
- Nuevo tema adaptado a [discord.js documentation site](https://discord.js.org/)
- Componentes de mensajes de Discord actualizados a [@discord-message-components/vue](https://github.com/Danktuary/discord-message-components/blob/main/packages/vue/README.md)
- Muchas correcciones en bloques de código, gramática, consistencia, etc.

## Paginas

Todo el contenido se ha actualizado para utilizar la sintaxis de discord.js v14. La versión v13 de la guía se puede encontrar en [este link](https://v13.discordjs.guide). (sin traducir)

### Novedades

- [Actualización de v13 a v14](/additional-info/changes-in-v14.md): Una lista de los cambios de discord.js v13 a v14
- [Comandos de barra](/slash-commands/advanced-creation.md): Registro, respuesta a comandos slash y permisos
- [Botones](/interactions/buttons.md): Construcción, envío y recepción de botones
- [Menús de selección](/interactions/select-menus.md): Creación, envío y recepción de menús de selección
- [Hilos](/popular-topics/threads.md): Creación y gestión de hilos
- [Constructores](/popular-topics/builders.md): Una colección de constructores para usar con tu bot

### Actualizado

- Comando: Sustituido por [Sapphire](https://sapphirejs.dev/docs/Guide/getting-started/getting-started-with-sapphire)
- [Voz](/voz/): Reescrito para usar el paquete [`@discordjs/voice`](https://github.com/discordjs/discord.js/tree/main/packages/voice)
- [Manejo de comandos](/creating-your-bot/command-handling.md/): Actualizado para usar comandos de barra oblicua
  - Secciones obsoletas eliminadas
- Fragmentos de `client.on('message')` actualizados a `client.on('interactionCreate')`.
  - [El contenido de los mensajes se convertirá en un nuevo intent privilegiado el 31 de agosto de 2022](https://support-dev.discord.com/hc/articles/4404772028055)

<DiscordMessages>
	<DiscordMessage profile="bot">
		Gracias a todos los que han contribuido al desarrollo de discord.js y traducción de la guía.
		<span class="emoji-container">
			<img class="emoji-image" title="heart" alt=":heart:" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@v14.0.2/assets/72x72/2764.png" />
			<img class="emoji-image" title="pat" alt=":pats:" src="https://cdn.discordapp.com/emojis/929127508933242912.gif?size=96&quality=lossless">
		</span>
	</DiscordMessage>
</DiscordMessages>
