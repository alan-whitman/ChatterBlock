SELECT cm.*
FROM channel c
JOIN channel_message cm ON cm.channel_id = c.id
WHERE c.id = $1
order by cm.id desc;