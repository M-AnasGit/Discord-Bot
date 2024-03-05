DROP TABLE IF EXISTS user_games;
DROP TABLE IF EXISTS user_items;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS item;


CREATE TABLE user (
    discord_id VARCHAR(255) PRIMARY KEY,
    summoner_id VARCHAR(255),
    account_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    game_name VARCHAR(255),
    balance INT DEFAULT 0
);

ALTER TABLE user
ADD CONSTRAINT unique_summoner_id UNIQUE (summoner_id);

CREATE TABLE item (
	item_id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL
);

CREATE TABLE user_items (
	discord_id VARCHAR(255),
    item_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (discord_id) REFERENCES user (discord_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item (item_id) ON DELETE SET NULL
);

CREATE TABLE user_games (
	discord_id VARCHAR(255),
    game_id VARCHAR(255),
    FOREIGN KEY (discord_id) REFERENCES user (discord_id) ON DELETE CASCADE
);

ALTER TABLE user_games
ADD CONSTRAINT unique_user UNIQUE (discord_id);

CREATE OR REPLACE VIEW UserView AS
SELECT 
	u.*,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', i.item_id,
            'name', i.name,
            'quantity', ui.quantity
        )
    ) AS inventory
FROM 
	user u
LEFT JOIN
	user_items ui ON ui.discord_id = u.discord_id
LEFT JOIN
	item i ON i.item_id = ui.item_id
GROUP BY
	u.discord_id;
    

CREATE OR REPLACE VIEW Leaderboard AS
SELECT 
    U.discord_id,
    U.name,
    SUM(U.balance) AS total_balance
FROM 
    user U
GROUP BY 
    U.discord_id,
    U.name
ORDER BY 
    total_balance DESC;
