create table subject(
id INTEGER primary key AUTOINCREMENT,
code varchar(255),
subject_name varchar(255)
);

create table lecture(
id INTEGER primary key AUTOINCREMENT,
day integer,
duration integer,
lecturer varchar(255),
time integer,
subject_id integer,
FOREIGN KEY (subject_id) REFERENCES subject(id)
);

create table practice(
id INTEGER primary key AUTOINCREMENT,
day integer,
duration integer,
practice_teacher varchar(255),
time integer,
lecture_id integer,
FOREIGN KEY (lecture_id) REFERENCES lecture(id)
);