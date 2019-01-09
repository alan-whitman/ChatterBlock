INSERT INTO channel_message (channel_id, user_id, content_text, content_image, time_stamp)
VALUES (${channel_id}, ${user_id}, ${content_text}, ${content_image}, ${time_stamp})
RETURNING *;