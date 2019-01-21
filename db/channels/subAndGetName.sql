INSERT INTO channel_users 
    (channel_id, user_id, last_view_time)
VALUES 
    ($1, $2, $3);
SELECT *
FROM channel
WHERE id = $1;