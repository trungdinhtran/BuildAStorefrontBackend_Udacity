CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  username        VARCHAR(150) NOT NULL,
  firstname       VARCHAR(150) NOT NULL,
  lastname        VARCHAR(150) NOT NULL,
  password VARCHAR(150) NOT NULL
);