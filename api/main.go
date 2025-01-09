// @title schedule-maker-api
// @version 1.0
// @contact.name Sanzhar
// @contact.url https://t.me/svnzh1k
// @host localhost:7070

package main

import (
	"database/sql"
	"log"
	"sanzhar/scheduler/database"
	_ "sanzhar/scheduler/docs"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Subject struct {
	Id          int    `json:"id"`
	Code        string `json:"code"`
	SubjectName string `json:"subject_name"`
}

type Lecture struct {
	Id        int    `json:"id"`
	Day       int    `json:"day"`
	Duration  int    `json:"duration"`
	Lecturer  string `json:"lecturer"`
	Time      int    `json:"time"`
	SubjectId int    `json:"subject_id"`
}

type Practice struct {
	Id              int    `json:"id"`
	Day             int    `json:"day"`
	Duration        int    `json:"duration"`
	PracticeTeacher string `json:"practice_teacher"`
	Time            int    `json:"time"`
	LectureId       int    `json:"lecture_id"`
}

// @Summary Получить список предметов
// @Tags Subjects
// @Accept json
// @Produce json
// @Success 200 {array} Subject
// @Router /subjects [get]
func handleSubjects(c *gin.Context) {
	var subject Subject
	rows, err := db.Query("SELECT * FROM subject")
	if err != nil {
		log.Fatal(err)
	}
	var arr []Subject
	for rows.Next() {
		rows.Scan(&subject.Id, &subject.Code, &subject.SubjectName)
		arr = append(arr, subject)
	}
	c.JSON(200, arr)
}

// @Summary Получить список лекций
// @Tags Lectures
// @Accept json
// @Produce json
// @Param subjectId path int true "Subject ID"
// @Success 200 {array} Lecture
// @Router /lectures/{subjectId} [get]
func handleLectures(c *gin.Context) {
	var lecture Lecture
	id := c.Param("subjectId")
	rows, err := db.Query("SELECT * FROM lecture WHERE subject_id = $1", id)
	if err != nil {
		log.Fatal(err)
	}
	var arr []Lecture
	for rows.Next() {
		rows.Scan(&lecture.Id, &lecture.Day, &lecture.Duration, &lecture.Lecturer, &lecture.Time, &lecture.SubjectId)
		arr = append(arr, lecture)
	}
	c.JSON(200, arr)
}

// @Summary Получить список практисов
// @Tags Practices
// @Accept json
// @Produce json
// @Param lectureId path int true "Lecture ID"
// @Success 200 {array} Practice
// @Router /practices/{lectureId} [get]
func handlePractices(c *gin.Context) {
	var practice Practice
	id := c.Param("lectureId")
	rows, err := db.Query("SELECT * FROM practice WHERE lecture_id = $1", id)
	if err != nil {
		log.Fatal(err)
	}
	var arr []Practice
	for rows.Next() {
		rows.Scan(&practice.Id, &practice.Day, &practice.Duration, &practice.PracticeTeacher, &practice.Time, &practice.LectureId)
		arr = append(arr, practice)
	}
	c.JSON(200, arr)
}

var db *sql.DB

func main() {
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET"}
	db, _ = database.Initialize()
	defer db.Close()
	router := gin.Default()
	router.Use(cors.New(config))
	router.GET("/subjects", handleSubjects)
	router.GET("/lectures/:subjectId", handleLectures)
	router.GET("/practices/:lectureId", handlePractices)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	router.Run(":7070")
}
