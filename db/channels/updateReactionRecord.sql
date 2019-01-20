UPDATE channel_message_reactions
SET reaction_count = reaction_count + 1
WHERE channel_message_id = $1 AND reaction_name = $2;