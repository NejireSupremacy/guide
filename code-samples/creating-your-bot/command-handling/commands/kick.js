const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('expulsar')
		.setDescription('Selecciona un miembro y dale una patada (pero no de verdad).')
		.addUserOption(option => option.setName('objetivo').setDescription('El miembro a expulsar')),
	async execute(interaction) {
		const member = interaction.options.getMember('objetivo');
		return interaction.reply({ content: `Quisiste expulsar a: ${member.user.username}`, ephemeral: true });
	},
};
