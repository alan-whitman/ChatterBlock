INSERT INTO channel (channel_name, creator_id, channel_description)
VALUES (${channel_name}, ${creator_id}, ${channel_description})
RETURNING *;