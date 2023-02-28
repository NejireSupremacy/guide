const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Obtén la URL del avatar del usuario seleccionado, o tu propio avatar.')
		.addUserOption(option => option.setName('objetivo').setDescription('El avatar del usuario para mostrar')),
	async execute(interaction) {
		const user = interaction.options.getUser('objetivo');
		if (user) return interaction.reply(`El avatar de ${user.username}: ${user.displayAvatarURL({ dynamic: true })}`);
		return interaction.reply(`Tu avatar: ${interaction.user.displayAvatarURL()}`);
	},
};
