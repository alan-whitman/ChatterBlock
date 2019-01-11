SELECT u.id, u.username
FROM friend_requests r
INNER JOIN users u
ON u.id = r.requester_id
WHERE r.requestee_id = $1;