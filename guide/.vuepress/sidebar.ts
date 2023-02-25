export default {
	'/voice/': [
		{
			text: 'Inicio',
			children: [
				'/',
				'/requesting-more-content.md',
				'/whats-new.md',
			],
		},
		{
			text: 'Primeros pasos',
			children: [
				'/voice/',
			],
		},
		{
			text: 'Librería',
			children: [
				'/voice/life-cycles.md',
				'/voice/voice-connections.md',
				'/voice/audio-player.md',
				'/voice/audio-resources.md',
			],
		},
	],
	'/': [
		{
			text: 'Inicio',
			children: [
				'/',
				'/requesting-more-content.md',
				'/whats-new.md',
			],
		},
		{
			text: 'Instalaciones y preparativos',
			children: [
				'/preparations/',
				'/preparations/setting-up-a-linter.md',
				'/preparations/setting-up-a-bot-application.md',
				'/preparations/adding-your-bot-to-servers.md',
			],
		},
		{
			text: 'Creando tu bot',
			children: [
				'/creating-your-bot/',
				'/creating-your-bot/main-file.md',
				'/creating-your-bot/slash-commands.md',
				'/creating-your-bot/command-handling.md',
				'/creating-your-bot/command-deployment.md',
				'/creating-your-bot/event-handling.md',
			],
		},
		{
			text: 'Comandos de barra',
			children: [
				'/slash-commands/response-methods.md',
				'/slash-commands/advanced-creation.md',
				'/slash-commands/parsing-options.md',
				'/slash-commands/permissions.md',
				'/slash-commands/autocomplete.md',
				'/slash-commands/deleting-commands.md'
			]
		},
		{
			text: 'Interacciones',
			children: [
				'/interactions/buttons.md',
				'/interactions/select-menus.md',
				'/interactions/modals.md',
				'/interactions/context-menus.md',
			]
		},
		{
			text: 'Temas populares',
			children: [
				'/popular-topics/faq.md',
				'/popular-topics/threads.md',
				'/popular-topics/embeds.md',
				'/popular-topics/builders.md',
				'/popular-topics/reactions.md',
				'/popular-topics/collectors.md',
				'/popular-topics/permissions.md',
				'/popular-topics/permissions-extended.md',
				'/popular-topics/intents.md',
				'/popular-topics/partials.md',
				'/popular-topics/webhooks.md',
				'/popular-topics/errors.md',
				'/popular-topics/audit-logs.md',
				'/popular-topics/canvas.md',
			],
		},
		{
			text: 'Misc',
			children: [
				'/miscellaneous/cache-customization.md',
				'/miscellaneous/useful-packages.md',
			],
		},
		{
			text: 'Bases de datos',
			children: [
				'/sequelize/',
				'/sequelize/currency.md',
				'/keyv/',
			],
		},
		{
			text: 'Sharding',
			children: [
				'/sharding/',
				'/sharding/additional-information.md',
				'/sharding/extended.md',
			],
		},
		{
			text: 'OAuth2',
			children: [
				'/oauth2/',
			],
		},
		{
			text: 'Mejorar el entorno de desarrollo',
			children: [
				'/improving-dev-environment/pm2.md',
				'/improving-dev-environment/package-json-scripts.md',
			],
		},
		{
			text: 'Información adicional',
			children: [
				'/additional-info/notation.md',
				'/additional-info/es6-syntax.md',
				'/additional-info/collections.md',
				'/additional-info/async-await.md',
				'/additional-info/rest-api.md',
				'/additional-info/changes-in-v13.md',
				'/additional-info/changes-in-v14.md',
			],
		},
	],
};
