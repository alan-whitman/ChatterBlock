SELECT u.username, u.id
FROM channel_users cu
INNER JOIN users u
ON cu.user_id = u.id
WHERE cu.channel_id = $1;