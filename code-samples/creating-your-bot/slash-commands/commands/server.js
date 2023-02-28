const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Proporciona información sobre el servidor.'),
	async execute(interaction) {
		// interaction.guild es el objeto que representa al servidor en el que se ejecutó el comando
		const { guild } = interaction;
		await interaction.reply(`This server is ${guild.name} and has ${guild.memberCount} members.`);
	},
};
