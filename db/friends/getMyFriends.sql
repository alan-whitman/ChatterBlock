SELECT u.username, u.id
FROM friends f
INNER JOIN users u
ON f.friend_id = u.id
WHERE f.user_id = $1