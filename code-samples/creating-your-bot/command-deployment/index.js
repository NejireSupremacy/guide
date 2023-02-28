const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
	console.log('Listo!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No se ha encontrado ningún comando que coincida con ${interaction.commandName}.`);
		return;
	}

	await command.execute(interaction).catch(async error => {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Se ha producido un error al ejecutar este comando!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'Se ha producido un error al ejecutar este comando.', ephemeral: true });
		}
	});
});

client.login(token);
