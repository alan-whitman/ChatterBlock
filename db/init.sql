CREATE TABLE active_private_messages (
    id                      SERIAL PRIMARY KEY,
    user_id                 INTEGER NOT NULL,
    partner_id              INTEGER NOT NULL
);
CREATE TABLE channel (
    id                      SERIAL PRIMARY KEY,
    channel_name            VARCHAR(40) NOT NULL,
    creator_id              INTEGER,
    channel_url             VARCHAR(40) NOT NULL,
    channel_description     VARCHAR(100)

);
CREATE TABLE channel_message (
    id                      SERIAL PRIMARY KEY,
    channel_id              INTEGER NOT NULL,
    user_id                 INTEGER NOT NULL,
    content_text            TEXT NOT NULL,
    content_image           TEXT,
    time_stamp              BIGINT

);
CREATE TABLE channel_message_reactions (
    id                      SERIAL PRIMARY KEY,
    channel_message_id      INTEGER NOT NULL,
    channel_id              INTEGER NOT NULL,
    user_id                 INTEGER NOT NULL,
    reaction_name           VARCHAR(20) NOT NULL
);
CREATE TABLE channel_users (
    id                      SERIAL PRIMARY KEY,
    channel_id              INTEGER NOT NULL,
    user_id                 INTEGER NOT NULL,
    last_view_time          BIGINT
);
CREATE TABLE friend_requests (
    id                      SERIAL PRIMARY KEY,
    requester_id            INTEGER NOT NULL,
    requestee_id            INTEGER NOT NULL
);
CREATE TABLE friends (
    id                      SERIAL PRIMARY KEY,
    user_id                 INTEGER NOT NULL,
    friend_id               INTEGER NOT NULL
);
CREATE TABLE private_message (
    id                      SERIAL PRIMARY KEY,
    sender_id               INTEGER NOT NULL,
    receiver_id             INTEGER NOT NULL,
    content_text            TEXT NOT NULL,
    content_image           TEXT,
    time_stamp              BIGINT
);
CREATE TABLE private_message_reactions (
    id                      SERIAL PRIMARY KEY,
    private_message_id      INTEGER NOT NULL,
    user_id                 INTEGER NOT NULL,
    reaction_name           VARCHAR(20)
);
CREATE TABLE users (
    id                      SERIAL PRIMARY KEY,
    username                VARCHAR(40) NOT NULL,
    email                   TEXT NOT NULL,
    pw                      VARCHAR(60) NOT NULL,
    is_active               BOOLEAN DEFAULT TRUE,
    about_text              TEXT,
    user_image              TEXT,
    verified                BOOLEAN DEFAULT FALSE,
    verification_code       TEXT
);