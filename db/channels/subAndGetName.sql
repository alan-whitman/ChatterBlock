DELETE FROM channel_users
WHERE channel_id = $1 AND user_id = $2;
INSERT INTO channel_users 
    (channel_id, user_id, last_view_time)
VALUES 
    ($1, $2, $3);
SELECT *
FROM channel
WHERE id = $1;