# Discord bot made using DISCORDJS, RIOT API and an SQL database

## A fully functional DISCORD BOT example showcasing how to MAKE A BOT from scratch

This project was built for a **private discord server** and I have got the permission to showcase a prototype of how to make it without getting into a lot of _details_.

Following this project will showcase you how to:

-   Setup a discord bot
-   Implement slash commands
-   Implement a **reward system** based on their in-game performance
-   Implement embeds (basics only)

## How to setup the bot

First things first we need to first create a discord bot and get its token, to do so.

1. Go to https://discord.com/developers/applications
2. If you are not signed, sign up with your account (or create an account only for development)
3. Click on the new application button in the top right of the screen

    ![Fig.1](/assets/new%20application.png)

4. Give your bot a name and agree to the terms and conditions

Congratulations :tada:! You have now created your discord bot, now it is time to invite it to your server and give it the necessary permissions.

1. Go to the bot tab
2. Click on the add bot button (if you are directly redirected to your bot's page you can skip this step)
3. If you want your bot to be public you need to leave the **Public Bot** section ticked on, but during development you will have to tick it off so nobody can add your bot to their server while you are working on it.
4. In the **Privileged Gateway Intents**, tick on all the sections on. _(Trust me)_
5. Go to **OAuth2**
6. In the **OAuth2 URL Generator**
7. Tick the following

    ![Fig.2](/assets/url_generator.png)

8. In the permissions, give your bot the permissions that he will need for your idea. _(In my case, I just game it admininistrator.)_
9. Now copy the link in **Generated URL** and paste it in your searchbar and press enter
10. You will then either prompted to allow the bot into one of your servers.

Now your bot is all setup but it does not do anything so lets configure it.

1. First we need to create our code directory,_(For the sake of simplicity we will do it the old way)_, create a folder in your pc and name it whatever you want.
2. Open your IDE of choice, _(I recommend Visual Studio Code for beginners)_, and open the folder you created.
3. Open the terminal and write

```
npm init -y
npm i discord.js dotenv mysql2
```

4. This will create a **package.json** file in your directory with the following dependencies

```JSON
{
    //@OTHER PACKAGE INFO
    "dependencies": {
        "discord.js": "^14.14.1",
        "dotenv": "^16.3.1",
        "mysql2": "^3.9.2"
    }
}
```

5. Add to your package.json the following, this will us to use es6 import syntax:

```JSON
{
    //OTHER PACKAGE INFO
    "type": "module",
    //OTHER INFO
}
```

Now we start coding:

1. Create an index.js file and import the following:

```javascript
import { Client, Events, GatewayIntentBits, EmbedBuilder } from 'discord.js'
```

2. Create a client, this client is basically our bot and we are giving giving it the parameters it will have access to. _(For example: GatewayIntentBits.GuildMessages allows the bot to have access to the messages sent in the server it is invited to)_

```javascript
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
```

3. Now for your code to recognize your bot you created previously you need to use **your bot's token** that is unique and that you **HAVE** to keep secret. and to get it you need to go back to https://discord.com/developers/applications, choose the bot you want, navigate to the bot section and click on reset token

    ![Fig.3](/assets/gettoken.png)

4. Once you have reset the token, copy it

5. To safely store your token so it cannot be accessed you need to use an **environement file**, to do so first create a file named .env

6. In that file create a token variable and give it your token

```.env
TOKEN=/*yourtokengohere*/
```

7. To access your token from your environement file, you need to use the dotenv library that we installed previously

```javascript
import dotenv from 'dotenv'
dotenv.config()
```

8. Now you can login and start your bot

```javascript
client.on(Events.ClientReady, (c) => {
	console.log(`Logged in`)
})

client.login(process.env.TOKEN)
```

9. It is finally ready you can now

```
node index.js
```

To see if your bot is correctly working once you node index.js you will have a "Logged in" message in your terminal, if not it means that you need to review your code and follow the steps again.

## How to implement slash commands

Now that everything is functional it is time to focus on the bread and butter of discord bots, **SLASH COMMANDS**.

To register a slash command we need to first...make it!

1. Create a commands.js file in your directory

2. In that file, import the following from discordjs and create an array and export it

```javascript
import { ApplicationCommandOptionType } from 'discord.js'

export const commands = []
```

That array will contain the all the command objects that we will need. According to the discord documentation (https://discord.js.org/docs/packages/builders/1.7.0/SlashCommandSubcommandBuilder:Class) the slash command object has 3 main properties:

1. The command name that will be used after the / _(e.g, for /test test is the command name)_.

2. The command description which will display on discord under the name to explain what the command does.

3. The options which will be for example which user are you using the command on or what music are you trying to play in music bots. These options can be optional for commands that do not require it.

With that in mind lets create our first command objects and append it to our array

```javascript
export const commands = [
	{
		name: 'testwithoutoptions',
		description: 'testing if the command works without options',
	},
	{
		name: 'testwithoptions',
		description: 'testing if the command works with options',
		options: [
			{
				name: 'name',
				description: 'username',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},
]
```

Now that our commands are created we need to deploy them so that our bot can recognize them.

1. Create a deploy.js file in your directory

2. Import the following, Rest and Routes from discordjs and the commands array from our commands.js file

```javascript
import { REST, Routes } from 'discord.js'
import { commands } from './commands.js'
```

3. Import and configure our environement file

```javascript
import dotenv from 'dotenv'
dotenv.config()
```

4. Create a rest instance from the Rest class and give it the bot's token

```javascript
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)
```

Now in order to register the slash commands we will need to get the client_id meaning the id of our bot and the guild_id meaning the id of our server.

This video will explain to you the process of doing this.
https://www.youtube.com/watch?v=NLWtSHWKbAI

Once you extract the ids store them in the .env file because we will use them to deploy our commands.

1. In deploy.js create a deploy function, this function will be asynchronous and will have a trycatch block inside

```javascript
const deploy = async () => {
	try {
	} catch (error) {
		console.log('Error deploying commands ', error)
	}
}
```

2. In the try block we will use the rest instance we created alongside the Routes object to deploy our commands in our server and a log at the end to verify if everything worked

```javascript
const deploy = async () => {
	try {
		await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
		console.log('Commands deployed')
	} catch (error) {
		console.log('Error deploying commands ', error)
	}
}
```

Now you can

```
node deploy.js
```

If you get "Commands deployed" or whatever message you set in the log, it means that you can now node your index file and go to your server and type your command name and you will get this.

![Fig.5](/assets/test%20commands.png)

Now that the commands are deployed we need to tell our bot how he can interacte with every command to do so we go back to our index file and

1. Create an event listener for interactions

```javascript
client.on(Events.InteractionCreate, async (interaction) => {})
```

2. In the event listener we need to filter out the interactions when they are not commands. So that our bot only responds when another user purposefully calls it.

```javascript
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return
})
```

3. Now we need to handle every command on its own and to do so, I personally like to use a **switch**. It is a great method to handle the different commands you might have.

```javascript
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return
	switch (interaction.commandName) {
		case 'testwithoutoptions':
			interaction.reply({ content: 'Test without options is working!', ephemeral: true })
			break
		case 'testwithoptions':
			interaction.reply({ content: 'Test with options is working!', ephemeral: true })
			break
		default:
			interaction.reply({ content: 'Unknown command', ephemeral: true })
	}
})
```

Now when noding the index and and using one of the commands we will get the following.

![Fig.6](/assets/test%20command%20live.png)

**_NOTE:_** The note content.
