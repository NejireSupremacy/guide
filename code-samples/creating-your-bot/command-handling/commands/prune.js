const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('Elimina hasta 99 mensajes.')
		.addIntegerOption(option => option.setName('cantidad').setDescription('Número de mensajes a eliminar')),
	async execute(interaction) {
		const amount = interaction.options.getInteger('cantidad');

		if (amount < 1 || amount > 99) {
			return interaction.reply({ content: 'Debe introducir un número entre 1 y 99.', ephemeral: true });
		}
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: 'Se ha producido un error al intentar podar los mensajes de este canal.', ephemeral: true });
		});

		return interaction.reply({ content: `Se eliminaron con exito \`${amount}\` mensajes.`, ephemeral: true });
	},
};
