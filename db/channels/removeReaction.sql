DELETE FROM channel_message_reactions
WHERE channel_message_id = $1 AND user_id = $2 AND reaction_name = $3;