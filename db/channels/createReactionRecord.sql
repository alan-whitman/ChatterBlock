INSERT INTO channel_message_reactions
    (channel_message_id, channel_id, reaction_name, reaction_count)
VALUES
    ($1, $2, $3, 1);