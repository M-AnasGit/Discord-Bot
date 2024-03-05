# Discord bot made using DISCORDJS, RIOT API and an SQL database

## A fully functional DISCORD BOT example showcasing how to MAKE A BOT from scratch

This project was built for a **private discord server** and I have got the permission to showcase a prototype of how to make it without getting into a lot of _details_.

Following this project will showcase you how to:

-   Setup a discord bot
-   Handle registering users with their **Riot games** account
-   Implement a **reward system** based on their in-game performance
-   Handle embeds (basics only)
-   Implement a shop

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

```javascript
"dependencies": {
    "discord.js": "^14.14.1",
    "dotenv": "^16.3.1",
    "mysql2": "^3.9.2"
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
	console.log(`Logged in as ${c.user.tag}`)
})

client.login(process.env.TOKEN)
```

9. It is finally ready you can now

```
node index.js
```
