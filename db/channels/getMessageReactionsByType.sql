SELECT channel_message_id, reaction_name, reaction_count
FROM channel_message_reactions
WHERE channel_message_id = $1 AND reaction_name = $2
ORDER BY reaction_name;