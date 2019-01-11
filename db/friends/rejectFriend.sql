DELETE FROM friend_requests
WHERE requester_id = $1 AND requestee_id = $2;