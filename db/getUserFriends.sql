-- SELECT * FROM friends f
SELECT f.friend_id, u.username, u.about_text, u.user_image  FROM friends f

-- join on users table to get information about friends
JOIN users u ON u.id = f.friend_id
-- return the id username pofile image and about text
WHERE user_id = $1;