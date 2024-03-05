import { Client, Events, GatewayIntentBits, EmbedBuilder } from 'discord.js'
import dotenv from 'dotenv'

import { registerUser, unregisterUser, addGame, fetchGames, giveRewards, deleteGame, getLeaderboard, buyItem } from './database.js'
import {
	handleRegister,
	handleUnregister,
	handleLiveGame,
	handleGameRewards,
	handleLeaderboard,
	handleProfile,
	handleShop,
	handleUse,
	handleBuy,
	handleInventory,
} from './handlers.js'

dotenv.config()

setInterval(async () => {
	const games = await fetchGames()
	games.forEach(async (game) => {
		await handleGameRewards(game, giveRewards, deleteGame)
	})
}, 150000)

const embed = new EmbedBuilder()

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
	],
})

client.on(Events.ClientReady, (c) => {
	console.log(`Logged in as ${c.user.tag}`)
})

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return
	switch (interaction.commandName) {
		case 'register':
			handleRegister(interaction, registerUser)
			break
		case 'unregister':
			handleUnregister(interaction, unregisterUser)
			break
		case 'live':
			handleLiveGame(interaction, addGame)
			break
		case 'leaderboard':
			handleLeaderboard(interaction, getLeaderboard, embed)
			break
		case 'profile':
			handleProfile(interaction, embed)
			break
		case 'shop':
			handleShop(interaction, embed)
			break
		case 'buy':
			handleBuy(interaction, buyItem)
			break
		case 'use':
			handleUse(interaction, embed)
			break
		case 'inventory':
			handleInventory(interaction, embed)
			break
		default:
			interaction.reply('Unknown command')
			break
	}
})

client.login(process.env.TOKEN)
