INSERT INTO friend_requests(requester_id, requestee_id)
VALUES(${requester_id},${requestee_id})
RETURNING *;

-- Going to need to return something diff here