package database

import (
	"bufio"
	"database/sql"
	"errors"
	"fmt"
	"os"
	"strings"

	_ "modernc.org/sqlite"
)

func Initialize() (*sql.DB, error) {

	err := os.Remove("database/db.db")
	if err != nil {
		fmt.Println(err, "error removing db.db")
	}

	db, err := sql.Open("sqlite", "database/db.db")
	if err != nil {
		return nil, errors.New("error init db")
	}
	err = FullfillDataBase(db, "create.sql")
	if err != nil {
		return nil, err
	}

	err = FullfillDataBase(db, "subject.sql")
	if err != nil {
		return nil, err
	}

	err = FullfillDataBase(db, "lecture.sql")
	if err != nil {
		return nil, err
	}

	err = FullfillDataBase(db, "practice.sql")
	if err != nil {
		return nil, err
	}
	return db, nil
}

func FullfillDataBase(db *sql.DB, script string) error {
	file, err := os.Open("database/scripts/" + script)
	if err != nil {
		return errors.New("error opening a file")
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	var q strings.Builder
	for scanner.Scan() {
		q.WriteString(scanner.Text())
	}

	statements := strings.Split(q.String(), ";")

	for i := 0; i < len(statements); i++ {
		ExecuteScript(statements[i], db)
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading file:", err)
	}
	return nil
}

func ExecuteScript(script string, db *sql.DB) {
	_, err := db.Exec(script)
	if err != nil {
		fmt.Println()
		fmt.Println("error", err)
		fmt.Println(script)
	}
}
