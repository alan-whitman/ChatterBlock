SELECT u.username
FROM active_private_messages apm
INNER JOIN users u
ON u.id = apm.partner_id
WHERE apm.user_id = $1;