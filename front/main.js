// Код крайне неоптимизирован, полон костылей и дублирующегося участка кода.
// При каждом нажатии происходит перебор всей таблицы. Однако в данный момент
// я жду открытия регистрации для использования API университетского портала так как заполнять
// базу данных вручную крайне неудобно и сервис отображает только те данные которые я туда залил
// Насчет вложенных циклов - в будущем обязательно вернусь и реализую более оптимальное решение с хэш-таблицами
// fatherOfCEOs кормесын мынаны

var currentSubject;
var theSet = new Set();
function createButton(text) {
  const buttonElement = document.createElement('button');
  buttonElement.textContent = text;
  buttonElement.style.display = 'block';
  return buttonElement;
}


function createRow(lecturer, time, duration){

  const tr = document.createElement('tr');
  const tdL = document.createElement('td');
  const tdT = document.createElement('td');
  const tdD = document.createElement('td');
  tdL.textContent = lecturer;
  tdT.textContent = time;
  tdD.textContent = duration;
  tr.append(tdL, tdT, tdD);
  return tr;
}

    fetch('http://localhost:7070/subjects')
    .then(response => response.json())
    .then(subjects => {

      subjects.forEach(subject => {
        var id = subject.id;
        var code = subject.code;
        var subject_name = subject.subject_name;
        const subjectElement = createButton(`${code} ${subject_name}`);
        subjectElement.onclick = function (){
          currentSubject = code + " " + subject_name;
          clearBlue();
        };
        subjectElement.addEventListener('click', function () {
          fetchAndDisplayPractices()
          fetchAndDisplayLectures(id, code, subject_name);
        });
        subjectsList.appendChild(subjectElement);
      });
    })
    .catch(error => console.error('Error fetching subjects:', error));


const subjectsList = document.getElementById('subjectsList');
const lecturesList = document.getElementById('lecturesList');
const practicesList = document.getElementById('practicesList');



function fetchAndDisplayLectures(id, code, subject_name) {
  const trHeader = document.createElement('tr');
  const trCode = document.createElement('tr')
  const trH1 = document.createElement('td');
  const trH2 = document.createElement('td');
  const trH3 = document.createElement('td');

  trCode.innerHTML = `<td colspan="3">${code + " " + subject_name}</td>`;
  trCode.style.backgroundColor = 'rgb(138,211,116)';
  trH1.textContent = 'Teacher';
  trH2.textContent = 'Start';
  trH3.textContent = 'Duration';
  trHeader.append(trH1, trH2, trH3);
  trHeader.style.backgroundColor = "rgb(255,228,196)";
  fetch(`http://localhost:7070/lectures/${id}`)
    .then(response => response.json())
    .then(lectures => {
      lecturesList.innerHTML = '';
      lecturesList.append(trCode, trHeader);
      lectures.forEach(lecture => {
        var id = lecture.id;
        var day = lecture.day;
        var duration = lecture.duration;
        var lecturer = lecture.lecturer;
        var time = lecture.time;
        var subject_id = lecture.subject_id;
        const lectureElement = createRow(lecturer, day + ". " + time + ":00", duration);
        lectureElement.addEventListener('click', function () {
          lecturesList.childNodes.forEach((child, index) =>{
            if (index >= 2){
              child.style.backgroundColor = 'white';
            }
          })
          fetchAndDisplayPractices(id, code);
          setLecture(id,time, day, subject_id, duration, code, lecturer);
          lectureElement.style.backgroundColor = 'rgb(150,120,200)';
        });
        lecturesList.appendChild(lectureElement);
      });
    });
}

function fetchAndDisplayPractices(id, code) {
  const trHeader = document.createElement('tr');
  const trH1 = document.createElement('td');
  const trH2 = document.createElement('td');
  const trH3 = document.createElement('td');

  trH1.textContent = 'Teacher';
  trH2.textContent = 'Start';
  trH3.textContent = 'Duration';
  trHeader.append(trH1, trH2, trH3);
  trHeader.style.backgroundColor = "rgb(255,228,196)";
  fetch(`http://localhost:7070/practices/${id}`)
    .then(response => response.json())
    .then(practices => {
      practicesList.innerHTML = '';
      practicesList.append(trHeader);
      if (practices !== null){
        practices.forEach(practice => {
          var id = practice.id;
          var day = practice.day;
          var duration = practice.duration;
          var practice_teacher = practice.practice_teacher;
          var time = practice.time;
          var lecture_id = practice.lecture_id;
          const practiceElement = createRow(practice_teacher, day + ". " + time +":00", duration);
          practiceElement.addEventListener('click', function(){
            practicesList.childNodes.forEach((child, index) =>{
              if (index != 0){
                child.style.backgroundColor = 'white';
              }
            })
            practiceElement.style.backgroundColor = 'rgb(150, 120, 200)';
            setPractice(id, time , day, lecture_id, duration, code, practice_teacher);
          });
  
          practicesList.appendChild(practiceElement);
        });
      }
    });
    document.getElementById('addButton').style.display = 'none';
}

function setLecture(id, time, day, subject_id, duration, code, lecturer) {
  clearBlue();
  content = code + " " + lecturer + " [L]";
  while (duration > 0){
    var div = document.createElement('div');
    div.textContent = content;
    div.style.color = 'blue';
    document.getElementById(day + "-" + time).appendChild(div);
    time++;
    duration--;
  }
  document.getElementById('addButton').style.display = 'none';
}


function setPractice(id, time, day, lecture_id, duration, code, practice_teacher) {
  clearByCode();
  content = code + " " + practice_teacher + " [P]";
  while (duration > 0){
    var div = document.createElement('div');
    div.textContent = content;
    div.style.color = 'blue';
    document.getElementById(day + "-" + time).appendChild(div);
    time++;
    duration--;
  }
  document.getElementById('addButton').style.display = 'inline-block';
}


function clearBlue(){
  for (let day = 1; day <= 6; day++){
    for (let time = 9; time <= 22; time++){
      var td = document.getElementById(day + "-" + time);
      var divs = td.querySelectorAll('div');
      divs.forEach(div =>{
        if (div.style.color === "green"){  
        }else{
            td.removeChild(div);
        }
      })
    }
  }
}

function clearByCode(){
  for (let day = 1; day <= 6; day++){
    for (let time = 9; time <= 22; time++){
        var td = document.getElementById(day + "-" + time);
        var divs = td.querySelectorAll('div');
        divs.forEach(div =>{
            if (div.style.color === 'blue' && div.textContent.endsWith('[P]') || div.textContent === null){
                td.removeChild(div);
            }
        })
    }
  }
}


function addToBasket(){
  if (currentSubject === null || theSet.has(currentSubject.substring(0,7))){
    alert("Данный предмет уже есть в корзине");
    return;
  }
  var theBlue = new Set();
  for (let day = 1; day <= 6; day++){
    for (let time = 9; time <= 22; time++){
        var cells = document.getElementById(day + "-" + time).querySelectorAll('div');
        if (cells.length < 1){
            continue;
        }
        if (cells.length > 1){
            alert("Уберите пересечение");
            return;
        }
        if (cells[0].style.color === "blue"){
            theBlue.add(day + "-" + time);
        }
    }
  }

  theBlue.forEach(cell =>{
    document.getElementById(cell).querySelector('div').style.color = 'green';
  })
  var li = document.createElement('li');
  var deleteButton = document.createElement('button');
  deleteButton.textContent = "remove";
  li.textContent = currentSubject;
  document.getElementById('basket').appendChild(li);
  li.appendChild(deleteButton);
  deleteButton.addEventListener("click", function (){
    removeByCode(deleteButton.parentElement.textContent.substring(0,7));
    li.remove();
  });
  theBlue.clear();
  fetchAndDisplayPractices();
  theSet.add(currentSubject.substring(0,7));
  lecturesList.childNodes.forEach((child, index) =>{
    if (index != 0){
      child.style.backgroundColor = 'white';
    }
  })
}



function removeByCode(code){
  for (let day = 1; day <= 6; day++){
    for (let time = 9; time <= 22; time++){
        var td = document.getElementById(day + "-" + time);
        var divs = td.querySelectorAll('div');
        divs.forEach(div =>{
          if (div.textContent.startsWith(code) && div.style.color == "green"){
            td.removeChild(div);
          }
        })
    }
  }
  theSet.delete(code);
}
