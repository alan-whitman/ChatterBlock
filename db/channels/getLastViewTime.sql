SELECT last_view_time
FROM channel_users
WHERE user_id = $1 AND channel_id = $2;
UPDATE channel_users
SET last_view_time = $3
WHERE user_id = $1 AND channel_id = $2;