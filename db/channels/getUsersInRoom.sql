SELECT id, username
FROM users
WHERE id IN ($1);