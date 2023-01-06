CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- add new column verify

ALTER TABLE users ADD verify BOOLEAN NOT NULL DEFAULT false;

-- create verify relate column
CREATE TABLE verify_code(
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) NOT NULL UNIQUE,
  userId BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT FK_Users FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

alter table verify_code ADD CONSTRAINT fk_users FOREIGN KEY(userId) REFERENCES users(id) on delete cascade;

-- if not verify account in1day ,then delete.
CREATE EVENT delete_user ON SCHEDULE EVERY 1 DAY
DO 
DELETE FROM users WHERE verify = 0 AND created_at < DATE_SUB(NOW(), INTERVAL 1 DAY);


-- message table

CREATE TABLE message (
  id SERIAL PRIMARY KEY,
  from_user BIGINT UNSIGNED NOT NULL,
  to_user BIGINT UNSIGNED NOT NULL,
  content VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_from FOREIGN KEY (from_user) REFERENCES users(id),
  CONSTRAINT fk_to FOREIGN KEY (to_user) REFERENCES users(id)
);

-- select message from and to
SELECT * FROM message WHERE (from_user=105 AND to_user=106) OR (from_user=106 AND to_user=105);

-- select users got message send to each other
SELECT u.* FROM users u LEFT JOIN message m ON u.id=m.from_user OR u.id=m.to_user WHERE m.to_user=? OR m.from_user=? GROUP BY u.id;

-- SELECT * FROM message m WHERE m.from_user=105 OR m.to_user=105;

-- create event 
CREATE EVENT delete_user
ON SCHEDULE EVERY 1 MINUTE
DO
DELETE FROM users WHERE verify=0 AND created_at< DATE_SUB(NOW(), INTERVAL 1 DAY);