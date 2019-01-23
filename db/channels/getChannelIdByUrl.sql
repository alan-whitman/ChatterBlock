SELECT id, channel_name
FROM channel
WHERE channel_url = $1;