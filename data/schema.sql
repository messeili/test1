DROP TABLE test1;
CREATE TABLE
IF NOT EXISTS test1
(
    idp SERIAL PRIMARY KEY,
    id VARCHAR
(255),
    type VARCHAR
(255),
    setup VARCHAR
(255),
    punchline VARCHAR
(255)
);