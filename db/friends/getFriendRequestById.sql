SELECT *
FROM friend_requests
WHERE requester_id = $1 AND requestee_id = $2 OR requester_id = $2 AND requestee_id = $1;