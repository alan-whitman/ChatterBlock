INSERT INTO channel_message
    (channel_id, user_id, content_text, content_image, time_stamp)
VALUES
    ($1, $2, $3, $4, $5)
RETURNING *;