SELECT *
FROM channel
WHERE channel_name = $1 OR channel_url = $2;