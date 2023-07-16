const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Proporciona información sobre el usuario.'),
	async execute(interaction) {
		// interaction.user es el objeto que representa al usuario que ejecutó el comando
		// interaction.member es el objeto GuildMember, que representa al usuario en el servidor específico
		const { user, member } = interaction;
		await interaction.reply(`This command was run by ${user.username}, who joined on ${member.joinedAt}.`);
	},
};
