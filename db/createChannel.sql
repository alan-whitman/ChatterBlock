INSERT INTO channel (channel_name, creator_id)
VALUES (${channel_name}, ${creator_id})
RETURNING *;