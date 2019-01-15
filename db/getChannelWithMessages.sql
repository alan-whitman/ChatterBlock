-- SELECT cm.*
-- FROM channel c
-- JOIN channel_message cm ON cm.channel_id = c.id
-- WHERE c.id = $1
-- order by cm.id desc;
SELECT cm.*, u.user_image,u.username,c.id
FROM channel c
JOIN channel_message cm ON cm.channel_id = c.id
JOIN users u on cm.user_id = u.id
WHERE c.channel_name = $1
order by cm.id asc;