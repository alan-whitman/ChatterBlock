SELECT c.id, c.channel_name, c.channel_url, c.channel_description, c.creator_id, cu.last_view_time, cu.user_id
FROM channel c
FULL JOIN (
    SELECT *
    FROM channel_users 
    WHERE user_id = $1
) cu
ON c.id = cu.channel_id
ORDER BY channel_name;