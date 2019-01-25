SELECT *
FROM channel_users
WHERE user_id = $1 AND channel_id = $2;