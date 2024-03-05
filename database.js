import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql
	.createPool({
		host: `${process.env.DB_HOST}`,
		user: `${process.env.DB_USER}`,
		port: `${process.env.DB_PORT}`,
		password: `${process.env.DB_PASS}`,
		database: `${process.env.DB_NAME}`,
		waitForConnections: true,
		connectionLimit: 75,
		queueLimit: 0,
	})
	.promise()

pool.query('SELECT 1 + 1 AS solution')
	.then(([rows]) => {
		console.log('The solution is: ', rows[0].solution)
	})
	.catch((err) => {
		console.log(err)
	})

export const registerUser = async (data) => {
	const sql = `SELECT * FROM user WHERE discord_id = ?`
	const sql2 = `INSERT INTO user (account_id, summoner_id, discord_id, name, game_name) VALUES (?, ?, ?, ?, ?)`
	const sql3 = `UPDATE user SET account_id = ?, summoner_id = ?, game_name = ? WHERE discord_id = ?`

	let rows2
	const connection = await pool.getConnection()
	try {
		connection.beginTransaction()

		const [rows] = await connection.query(sql, [data.discord_id])

		if (rows.length === 0) {
			rows2 = await connection.query(sql2, [data.account_id, data.summoner_id, data.discord_id, data.name, data.game_name])
		} else {
			rows2 = await connection.query(sql3, [data.account_id, data.summoner_id, data.game_name, data.discord_id])
		}

		connection.commit()
		return rows2[0].affectedRows === 1
	} catch (error) {
		console.log(error)
		return false
	} finally {
		connection.release()
	}
}

export const unregisterUser = async (discord_id) => {
	const connection = await pool.getConnection()
	try {
		const sql = `UPDATE user SET summoner_id = NULL, game_name = NULL WHERE discord_id = ?`
		const [rows] = await connection.query(sql, [discord_id])
		return rows.affectedRows === 1
	} catch (error) {
		console.log(error)
		return false
	} finally {
		connection.release()
	}
}

export const getUserSummoner = async (discord_id) => {
	const connection = await pool.getConnection()
	try {
		const sql = `SELECT summoner_id FROM user WHERE discord_id = ?`
		const [rows] = await connection.query(sql, [discord_id])
		return rows[0].summoner_id
	} catch (error) {
		console.log(error)
		return false
	} finally {
		connection.release()
	}
}

export const getUserInfo = async (discord_id) => {
	const connection = await pool.getConnection()
	try {
		const sql = `SELECT * FROM UserView WHERE discord_id = ?`
		const [rows] = await connection.query(sql, [discord_id])
		return rows[0]
	} catch (error) {
		console.log(error)
		return false
	} finally {
		connection.release()
	}
}

export const addGame = async (data) => {
	const sql = `INSERT INTO game (discord_id, game_id) VALUES (?, ?)`
	const connection = await pool.getConnection()
	try {
		const [rows] = await connection.query(sql, [data.discord_id, data.game_id])
		return rows.affectedRows === 1
	} catch (error) {
		console.log(error)
		return false
	} finally {
		connection.release()
	}
}

export const fetchGames = async () => {
	const connection = await pool.getConnection()
	try {
		const sql = `SELECT * FROM user_games`
		const [rows] = await connection.query(sql)
		return rows
	} catch (error) {
		console.log(error)
		return false
	} finally {
		connection.release()
	}
}

export const giveRewards = async (data) => {
	const sql = `UPDATE user SET balance = balance + ? WHERE discord_id = ?`
	const connection = await pool.getConnection()
	try {
		const [rows] = await connection.query(sql, [data.reward, data.discord_id])
		return rows.affectedRows === 1
	} catch (error) {
		console.log(error)
		return false
	} finally {
		connection.release()
	}
}

export const deleteGame = async (game_id) => {
	const sql = `DELETE FROM game WHERE game_id = ?`
	const connection = await pool.getConnection()
	try {
		const [rows] = await connection.query(sql, [game_id])
		return rows.affectedRows === 1
	} catch (error) {
		console.log(error)
		return false
	} finally {
		connection.release()
	}
}

export const getLeaderboard = async () => {
	const connection = await pool.getConnection()
	try {
		const sql = `SELECT * FROM Leaderboard`
		const [rows] = await connection.query(sql)
		return rows.length > 0 ? rows : false
	} catch (error) {
		console.log(error)
	} finally {
		connection.release()
	}
}

export const buyItem = async (data) => {
	const presql = `SELECT balance FROM user WHERE discord_id = ?`
	const sql = `SELECT * FROM user_items WHERE discord_id = ? AND item_id = ?`
	const sql2 = `INSERT INTO user_items (discord_id, item_id) VALUES (?, ?)`
	const sql3 = `UPDATE user_items SET quantity = quantity + 1 WHERE discord_id = ?`
	const sql4 = `UPDATE user SET balance = balance - ? WHERE discord_id = ?`

	const connection = await pool.getConnection()
	try {
		connection.beginTransaction()
		const [balance] = await connection.query(presql, [data.discord_id])
		if (balance[0].balance < data.price) {
			throw new Error('Not enough balance')
		}

		const [rows] = await connection.query(sql, [data.discord_id, data.item_id])
		if (rows.length > 0) {
			await connection.query(sql3, [data.discord_id])
		} else {
			await connection.query(sql2, [data.discord_id, data.item_id])
		}
		const [res] = await connection.query(sql4, [data.price, data.discord_id])

		connection.commit()
		return res.affectedRows === 1
	} catch (error) {
		console.log(error)
		return false
	} finally {
		connection.release()
	}
}
