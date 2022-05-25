# db 생성
DROP DATABASE IF EXISTS todoapp_2022_05_25;
CREATE DATABASE todoapp_2022_05_25;
USE todoapp_2022_05_25;

# 테이블 생성
CREATE TABLE todo (
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    reg_date DATETIME NOT NULL,
    update_date DATETIME NOT NULL,
    user_code CHAR(50) NOT NULL,
    `no` INT UNSIGNED NOT NULL,
    content VARCHAR(200) NOT NULL,
    perform_date DATETIME NOT NULL,
    is_completed TINYINT UNSIGNED NOT NULL DEFAULT 0
);

# 테스트 데이터 생성
INSERT INTO todo
SET reg_date = NOW(),
update_date = NOW(),
user_code = 'localhost',
`no` = 1,
content = '기상',
perform_date = NOW();

INSERT INTO todo
SET reg_date = NOW(),
update_date = NOW(),
user_code = 'localhost',
`no` = 2,
content = '조깅',
perform_date = NOW();

INSERT INTO todo
SET reg_date = NOW(),
update_date = NOW(),
user_code = 'localhost',
`no` = 3,
content = '아침식사',
perform_date = NOW();

ALTER TABLE todo ADD UNIQUE INDEX(user_code, `no`);

SELECT * FROM todo;