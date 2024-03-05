import { REST, Routes } from 'discord.js'
import { commands } from './commands.js'
import dotenv from 'dotenv'

dotenv.config()

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

const desploy = async () => {
	try {
		await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
	} catch (error) {
		console.log('Error deploying commands:', error)
	}
}

desploy()
