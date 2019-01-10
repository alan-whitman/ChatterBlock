INSERT INTO channel_users (channel_id, user_id, last_view_time)
VALUES (${channel_id}, ${user_id},${time_stamp})
RETURNING *;

-- Going to need to return something diff here