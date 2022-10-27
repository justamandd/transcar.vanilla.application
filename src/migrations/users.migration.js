require('../../db.connection');

runQuery(`
CREATE TABLE users (
    id int PRIMARY KEY,
    name varchar2(50)
)
`)