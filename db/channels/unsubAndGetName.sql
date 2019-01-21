DELETE FROM channel_users
WHERE channel_id = $1 AND user_id = $2;
SELECT *
FROM channel
WHERE id = $1;