DELETE FROM active_private_messages
WHERE user_id = $1 AND partner_id = $2;