SELECT cu.last_view_time, c.channel_name, c.id
FROM channel c
JOIN channel_users cu ON cu.channel_id = c.id
WHERE cu.user_id = $1;
-- order by c.id desc;