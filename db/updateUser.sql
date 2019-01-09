UPDATE users
set (username, email, user_image, about_text) = (${username},${email},${user_image},${about_text})
where id = ${id};
select * from users
WHERE id = ${id};