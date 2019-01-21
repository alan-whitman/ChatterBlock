DELETE FROM active_private_messages
WHERE user_id = $1 AND partner_id = $2
OR user_id = $2 AND partner_id = $1;

INSERT INTO active_private_messages
    (user_id, partner_id)
VALUES
    ($1, $2),
    ($2, $1);

INSERT INTO private_message
    (sender_id, receiver_id, content_text, time_stamp)
VALUES
    ($1, $2, $3, $4)
RETURNING *;