const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info-opciones')
		.setDescription('Información sobre las opciones ofrecidas.')
		.addStringOption(option => option.setName('argumento').setDescription('El argumento a devolver')),
	async execute(interaction) {
		const value = interaction.options.getString('argumento');
		if (value) return interaction.reply(`El valor de las opciones es: \`${value}\``);
		return interaction.reply('¡No se proporcionó ninguna opción!');
	},
};
