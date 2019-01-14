SELECT cm.content_text, cm.content_image, cm.time_stamp, u.username, u.user_image, cmr.reaction_name, cmr.reaction_count
FROM channel_message cm
INNER JOIN users u
ON u.id = cm.user_id
FULL JOIN channel_message_reactions cmr
ON cmr.id = cm.id
WHERE channel_id = $1
ORDER BY cm.time_stamp;