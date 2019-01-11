INSERT INTO friends (user_id, friend_id)
VALUES ($1,$2),($2,$1)
RETURNING *;