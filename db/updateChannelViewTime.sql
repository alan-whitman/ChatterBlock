UPDATE channel_users
SET last_view_time = ${time}
WHERE channel_users.channel_id = ${channel_id} 
AND channel_users.user_id = ${user_id} ;
-- channel_id,user_id,time