// Requiere las clases discord.js necesarias
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Crea una nueva instancia del cliente
const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});

// Cuando el cliente esté listo, ejecute este código (sólo una vez)
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Conéctate a Discord con el token de tu cliente
client.login(token);