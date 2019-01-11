DELETE FROM friend_requests
WHERE requester_id = $1 AND requestee_id = $2;
INSERT INTO friends
    (user_id, friend_id)
VALUES
    ($1, $2),
    ($2, $1);