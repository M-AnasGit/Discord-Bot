import { getUserSummoner, getUserInfo } from './database.js'
import { items } from './items.js'

const getSummoner = async (puuid) => {
	try {
		const response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${process.env.API}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (response.ok) {
			const data = await response.json()
			return data.id
		}
	} catch (error) {
		console.log(error)
		return null
	}
}

const calculateReward = (summoner, data) => {
	const index = data.info.participants.findIndex((p) => p.summonerId === summoner)
	const participant = data.info.participants[index]
	//@Stats
	const kills = participant.kills
	const deaths = participant.deaths
	const assists = participant.assists
	const firstBlood = participant.firstBloodKill
	const win = participant.win
	const visionScore = participant.visionScore
	return kills * 10 + assists * 5 + deaths * -10 + (firstBlood ? 20 : 0) + (win ? 50 : -50) + visionScore
}

export const handleRegister = async (interaction, registerUser) => {
	const [name, tagline] = interaction.options.getString('summoner').split('#')
	try {
		const response = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagline}?api_key=${process.env.API}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (response.ok) {
			const data = await response.json()
			const summoner_id = await getSummoner(data.puuid)
			if (data) {
				const res = await registerUser({
					discord_id: interaction.user.id,
					summoner_id: summoner_id,
					account_id: data.puuid,
					name: interaction.user.globalName,
					game_name: data.gameName,
				})
				interaction.reply({
					content: res ? `${name} is now linked to ${interaction.user.username}` : `Account already registered to another account.`,
					ephemeral: true,
				})
			} else interaction.reply({ content: 'Summoner not found', ephemeral: true })
		}
	} catch (error) {
		console.log(error)
		interaction.reply({ content: 'Something went wrong! Try again later', ephemeral: true })
	}
}

export const handleUnregister = async (interaction, unregisterUser) => {
	try {
		const res = await unregisterUser(interaction.user.id)
		interaction.reply({
			content: res ? `Your account is no longer registered` : `Internal server error! Try again later`,
			ephemeral: true,
		})
	} catch (error) {
		console.log(error)
		interaction.reply({ content: 'Something went wrong! Try again later', ephemeral: true })
	}
}

export const handleLiveGame = async (interaction, addGame) => {
	try {
		const res = await getUserSummoner(interaction.user.id)
		if (res) {
			const response = await fetch(`https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${res}?api_key=${process.env.API}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (response.ok) {
				const data = await response.json()
				if (data) {
					const res = await addGame({
						discord_id: interaction.user.id,
						game_id: 'EUW1_' + data.gameId,
					})
					interaction.reply({
						content: res ? `Game added to your active games` : `Game already added to your active games`,
						ephemeral: true,
					})
				} else {
					interaction.reply({ content: 'No active game found', ephemeral: true })
				}
			} else {
				interaction.reply({ content: 'No active game found', ephemeral: true })
			}
		}
	} catch (error) {
		console.log(error)
		interaction.reply({ content: 'Something went wrong! Try again later', ephemeral: true })
	}
}

export const handleGameRewards = async (game, giveRewards, deleteGame) => {
	try {
		const response = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${game.game_id}?api_key=${process.env.API}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (response.ok) {
			const data = await response.json()
			if (data) {
				const summoner = await getUserSummoner(game.discord_id)
				if (summoner) {
					const reward = calculateReward(summoner, data)
					await giveRewards({
						discord_id: game.discord_id,
						reward,
					})
				} else {
					await deleteGame(game.game_id)
					console.log('No summoner found')
				}
			}
		}
	} catch (error) {
		console.log(error)
	}
}

export const handleLeaderboard = async (interaction, getLeaderboard, embed) => {
	try {
		const res = await getLeaderboard()
		if (res) {
			interaction.reply({
				embeds: [
					embed
						.setTitle('Leaderboard')
						.setDescription(
							res
								.map((r, i) => {
									console.log(r)
									return `${i + 1}. <@${r.discord_id}> - ${r.total_balance} 7loupies`
								})
								.join('\n')
						)
						.setColor('#0099ff'),
				],
			})
		} else {
			interaction.reply({ content: 'Internal server error! Try again later', ephemeral: true })
		}
	} catch (error) {
		console.log(error)
		interaction.reply({ content: 'Something went wrong! Try again later', ephemeral: true })
	}
}

export const handleProfile = async (interaction, embed) => {
	try {
		const res = await getUserInfo(interaction.user.id)
		if (res) {
			interaction.reply({
				embeds: [
					embed
						.setTitle('Profile')
						.setDescription(`<@${interaction.user.id}> has ${res.balance} 7loupies`)
						.setColor('#0099ff')
						.setThumbnail(interaction.user.avatarURL()),
				],
			})
		} else {
			interaction.reply({ content: 'Internal server error! Try again later', ephemeral: true })
		}
	} catch (error) {
		console.log(error)
		interaction.reply({ content: 'Something went wrong! Try again later', ephemeral: true })
	}
}

export const handleShop = async (interaction, embed) => {
	interaction.reply({
		embeds: [
			embed
				.setTitle('Shop')
				.setDescription(`1. Name Change - 100 7loupies\n2. Timeout a user - 200 7loupies\n3. Ban user - 250 7loupies`)
				.setColor('#0099ff'),
		],
	})
}

export const handleBuy = async (interaction, buyItem) => {
	const discord_id = interaction.user.id
	const item = items.find((i) => i.name === interaction.options._hoistedOptions[0].value)
	try {
		const res = await buyItem(discord_id, item.id, item.price)
		if (res) {
			interaction.reply({ content: `Item bought`, ephemeral: true })
		} else {
			interaction.reply({ content: `Not enough 7loupies`, ephemeral: true })
		}
	} catch (error) {
		console.log(error)
		interaction.reply({ content: 'Something went wrong! Try again later', ephemeral: true })
	}
}

export const handleUse = async (interaction, embed) => {
	try {
		const item = items.find((i) => i.name === interaction.options._hoistedOptions[0].value)
		switch (item.id) {
			case 1:
				interaction.reply({ content: `Name change`, ephemeral: true })
				break
			case 2:
				interaction.reply({ content: `Timeout a user`, ephemeral: true })
				break
			case 3:
				interaction.reply({ content: `Ban user`, ephemeral: true })
				break
			default:
				interaction.reply({ content: `Item not found`, ephemeral: true })
		}
	} catch (error) {
		console.log(error)
		interaction.reply({ content: 'Something went wrong! Try again later', ephemeral: true })
	}
}

export const handleInventory = async (interaction, embed) => {
	try {
		const user = await getUserInfo(interaction.user.id)
		if (user) {
			interaction.reply({
				embeds: [
					embed
						.setTitle('Inventory')
						.setDescription(
							user.inventory.length > 0
								? user.inventory
										.map((i) => {
											const item = items.find((it) => it.id === i.item_id)
											return `${item.name} - ${i.quantity}`
										})
										.join('\n')
								: 'No items'
						)
						.setColor('#0099ff'),
				],
			})
		} else {
			interaction.reply({ content: 'Internal server error! Try again later', ephemeral: true })
		}
	} catch (error) {
		console.log(error)
		interaction.reply({ content: 'Something went wrong! Try again later', ephemeral: true })
	}
}
