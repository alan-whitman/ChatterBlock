SELECT channel_message_id, reaction_name, reaction_count
FROM channel_message_reactions
WHERE channel_id = $1
ORDER BY reaction_name;