SELECT *
FROM channel c
FULL JOIN (
    SELECT *
    FROM channel_users 
    WHERE user_id = $1
) cu
ON c.id = cu.channel_id
ORDER BY channel_name;