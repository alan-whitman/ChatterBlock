SELECT COUNT(*) FROM channel_message
where time_stamp > $1 AND channel_id = $2 AND user_id = $3;