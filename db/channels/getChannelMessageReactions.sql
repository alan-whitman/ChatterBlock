SELECT cmr.channel_message_id, cmr.reaction_name, u.username
FROM channel_message_reactions cmr
INNER JOIN users u 
ON cmr.user_id = u.id
WHERE channel_id = $1;