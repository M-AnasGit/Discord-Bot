import { ApplicationCommandOptionType } from 'discord.js'

export const commands = [
	{
		name: 'register',
		description: 'register a riot acocunt',
		options: [
			{
				name: 'summoner',
				description: 'Summoner name',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},
	{
		name: 'unregister',
		description: 'unregister a riot account',
		options: [],
	},
	{
		name: 'profile',
		description: 'get the profile of a user',
		options: [
			{
				name: 'user',
				description: 'User to get the profile of',
				type: ApplicationCommandOptionType.User,
				required: false,
			},
		],
	},
	{
		name: 'live',
		description: 'get the live game of a user',
		options: [
			{
				name: 'user',
				description: 'User to get the game of',
				type: ApplicationCommandOptionType.User,
				required: false,
			},
		],
	},
	{
		name: 'link',
		description: 'get the match history of a user',
		options: [],
	},
	{
		name: 'shop',
		description: 'open shop',
		options: [],
	},
	{
		name: 'leaderboard',
		description: 'get the leaderboard',
		options: [],
	},
	{
		name: 'inventory',
		description: 'get the inventory',
		options: [],
	},
	{
		name: 'buy',
		description: 'buy an item',
		options: [
			{
				name: 'item',
				description: 'Item to buy',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},
	{
		name: 'use',
		description: 'use an item',
		options: [
			{
				name: 'item',
				description: 'Item to use',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},
]
