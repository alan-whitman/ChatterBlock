DELETE FROM friends
WHERE user_id = $1 AND friend_id = $2;
DELETE FROM friends
WHERE user_id = $2 AND friend_id = $1;