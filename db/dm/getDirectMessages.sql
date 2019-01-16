SELECT *
FROM private_message
WHERE sender_id = $1 AND receiver_id = $2
OR receiver_id = $1 AND sender_id = $2;