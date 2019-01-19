SELECT cm.content_text, cm.content_image, cm.time_stamp, cm.user_id, cm.id, u.username, u.user_image
FROM channel_message cm
INNER JOIN users u
ON u.id = cm.user_id
WHERE channel_id = $1
ORDER BY cm.time_stamp;