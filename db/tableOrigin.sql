-- BELOW ARE THE TABLES CREATED FOR DB

-- create table users(
-- id serial PRIMARY Key,
-- username varchar(40),
-- email varchar(40),
-- pw varchar(60),
-- is_active BOOLEAN,
-- about_text varchar(500),
-- user_image varchar(140),
-- verified BOOLEAN,
-- verification_code TEXT
-- )

-- create table friend_requests(
-- id serial primary key,
-- requester_id INTEGER,
-- requestee_id INTEGER
-- )

-- create table friends(
-- id serial primary key,
-- user_id integer,
-- friend_id integer
-- )

-- create table channel(
-- id serial primary key,
-- channel_name varchar(40),
-- creator_id integer
-- )

-- create table channel_users(
-- id serial primary key,
-- channel_id integer,
-- user_id integer,
-- last_view_time integer
-- )

-- create table channel_message(
-- id serial primary key,
-- channel_id integer,
-- user_id integer,
-- content_text text,
-- content_image text,
-- time_stamp integer
-- )

-- create table private_message(
-- id serial PRIMARY KEY,
-- sender_id integer,
-- receiver_id integer,
-- content_text text,
-- content_image text,
-- time_stamp integer
-- )

-- create table channel_message_reactions(
-- id serial primary key,
-- channel_message_id integer,
-- user_id integer,
-- reaction_name varchar(30)
-- )

-- create table private_message_reactions(
-- id serial primary key,
-- private_message_id integer,
-- user_id integer,
-- reaction_name varchar(30)
-- )
