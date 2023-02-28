const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Obtenga todos los archivos de comandos del directorio de comandos que creaste anteriormente
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Obtenga la salida SlashCommandBuilder#toJSON() de los datos de cada comando para su despliegue
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construir y preparar una instancia del módulo REST
const rest = new REST({ version: '10' }).setToken(token);

// ¡y despliega tus comandos!
(async () => {
	try {
		console.log(`Se comenzaron a actualizar ${commands.length} comandos de tu aplicación (/).`);

		// El método put se utiliza para actualizar completamente todos los comandos del gremio con el conjunto actual
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Se actualizaron con éxito ${data.length} comandos de tu aplicación (/).`);
	} catch (error) {
		// Y, por supuesto, asegúrate de detectar y registrar cualquier error.
		console.error(error);
	}
})();
