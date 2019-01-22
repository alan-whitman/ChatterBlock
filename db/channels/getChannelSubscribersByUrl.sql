SELECT cu.user_id, c.channel_name, c.channel_url
FROM channel_users cu
INNER JOIN channel c
ON cu.channel_id = c.id
WHERE cu.channel_id = (
    SELECT id
    FROM channel
    WHERE channel_url = $1
);