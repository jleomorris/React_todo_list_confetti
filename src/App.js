import React, { useState, useRef, useEffect } from 'react';
import TodoList from './TodoList';
import uuidv4 from 'uuid/v4';
import { Container, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import coolImages from 'cool-images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faUndoAlt, faCheckSquare, faAward } from '@fortawesome/free-solid-svg-icons'
import './main.css'
import ConfettiGenerator from "confetti-js";



const LOCAL_STORAGE_KEY = 'todoApp.todos';
const ALL_SELECTED = 'todoApp.allSelected'; 

let deletedTasks = null;
let allSelected = false;

function App() {
  console.info("allSelected on app render: ", allSelected);
  const [tasks, setTasks] = useState([]);
  const taskNameRef = useRef();

  function setBackgroundRandom(){
    document.getElementsByClassName("container-fluid")[0].style.background = `url(${coolImages.one(1080, 1920)})`;
  }

  // Render stored tasks if they exist
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const savedAllSelected = JSON.parse(localStorage.getItem(ALL_SELECTED));
    if (savedAllSelected) {
      allSelected = savedAllSelected;
    } 
    if (storedTasks) setTasks(storedTasks);

    setBackgroundRandom(); 

  }, []) // Using [] means the above only gets trigerred on initial render

  // Every time [tasks] change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    localStorage.setItem(ALL_SELECTED, (allSelected));
    applyDayStyling();
  }, [tasks])

  function toggleTodo(id) {
    const allTasks = [...tasks];
    const selectedTask = allTasks.find(task => task.id === id);
    selectedTask.complete = !selectedTask.complete;
    selectedTask.dateCompleted ? selectedTask.dateCompleted = null : selectedTask.dateCompleted = handleDateCalculation();
    setTasks(allTasks);
    if(tasks.filter(task => task.complete).length ===tasks.length){
      generateConfetti();
    }
  }

  function generateConfetti() {
    document.querySelector("#my-canvas").style.zIndex = 3;    
    let confettiSettings = { target: 'my-canvas', max : 1000};
    let confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    
    setTimeout(function(){
      document.querySelector("#my-canvas").style.zIndex = 1;    
      confetti.clear();
    }, 4000);
  }

  function handleAddTodo(e) {
    const name = taskNameRef.current.value
    if (name === '') return
    setTasks(prevTasks => {
      return [...prevTasks, { id: uuidv4(), name: name, complete: false, dateAdded: handleDateCalculation(), dateCompleted: null} ]
    })
    taskNameRef.current.value = null
  }

  function handleClearTodos() {
    const newTasks = tasks.filter(task => !task.complete);
    deletedTasks = tasks.filter(task => task.complete);
    setTasks(newTasks);
  }

  function restoreClearedTasks() {
    // alert("tasks restored")
    if(deletedTasks === null || deletedTasks.length === 0 ) return;
    const allTasks = [...deletedTasks, ...tasks]
    setTasks(allTasks);
    deletedTasks = [];
  }

  let containerStyle = {
    height: '100%',
    minHeight: '100vh',
    backgroundSize: 'cover !important'
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleAddTodo();
    }
  }

  function handleDateCalculation() {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1; 
    let day = today.getDate();
    let hours = today.getHours() < 10 ? `0${today.getHours()}` : today.getHours();
    let minutes = today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes();

    let date = `${day}/${(month)}/${year} - ${hours}:${minutes}`;

    return(date);
  }

  function handleCheckAll() {
    if(allSelected === true) {
      let unCheckedTasks = [...tasks];
      unCheckedTasks.forEach(task => {
        task.complete = false;
        task.dateCompleted = null;
      })
      setTasks(unCheckedTasks);
    } 
    
    if(allSelected === false) {
      let checkedTasks = [...tasks];
      checkedTasks.forEach(task => {
        task.complete = true;
        task.dateCompleted = handleDateCalculation();
      })
      setTasks(checkedTasks);
      generateConfetti();
    }

    allSelected = !allSelected;    
  }

  function date_diff_in_days(date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  function applyDayStyling() {    
    let day = new Date().getDay();

    switch(day) {
      case 1:
        styleDay('monday');
        break;
      case 2:
        styleDay('tuesday');
        break;
      case 3:
        styleDay('wednesday');
        break;
        case 4:
          styleDay('thursday');
        break;
        case 5:
          styleDay('friday');
        break;
      case 6:
        styleDay('saturday');
        break;
      case 7:
        styleDay('sunday');
        break;
      default:
        return;
    }
    
    function styleDay(day) {
      document.getElementById(day).style.border = '2px solid black';
      document.getElementById(day).style.paddingTop = '6px';
    }
    
  }

  return (
    <>
    <canvas id="my-canvas"></canvas>
    <Container fluid className="d-flex justify-content-center align-items-center" style = { containerStyle }>
      <div className="background-cover"></div>
      <Row className="w-100 d-flex justify-content-center">
      <Card className="to-do-list col-md-4 p-0 border-0" style = {{ margin: '5%' }}>
        <Card.Header className="d-flex justify-content-between">
          <div className="days d-flex justify-content-between">
          <p className="date-header" id="monday">M</p>
          <p className="date-header" id="tuesday">T</p>
          <p className="date-header" id="wednesday">W</p>
          <p className="date-header" id="thursday">T</p>
          <p className="date-header" id="friday">F</p>
          <p className="date-header" id="saturday">S</p>
          <p className="date-header" id="sunday">S</p>
          </div>
          <p className="date-header date">{handleDateCalculation()}</p>
        </Card.Header>
        <Container>
        <Row>
        <div className="buttons d-flex flex-column col-2" style={{ background: 'rgb(99 99 154)', position: 'relative', right: '1rem', borderRadius: '8px 0 0 8px' }}>
            <FontAwesomeIcon title="delete selected tasks" className="trash-icon" icon={faTrashAlt} size="2x" onClick={handleClearTodos} style={{ margin: '20px auto' }} />  
            <FontAwesomeIcon title="undo delete" className="trash-icon" icon={faUndoAlt} size="2x" onClick={restoreClearedTasks} style={{ margin: '20px auto' }} />  
            <FontAwesomeIcon title="select/unselect all tasks" className="trash-icon" icon={faCheckSquare} size="2x" onClick={handleCheckAll} style={{ margin: '20px auto' }} />  
        </div>
        <Card.Body className="col-10">
        <Card.Title className="display-4">React to-do list</Card.Title>
        <Card.Text className="">
        <input ref={taskNameRef} type="text" placeholder="Enter task" onKeyPress={handleKeyPress} />
        </Card.Text>
        <div className="d-flex flex-column w-100">
          <TodoList tasks={tasks} toggleTodo={toggleTodo} />
          {tasks.length === 0 ? <p id="empty_task_message">No tasks</p> : ''}
        </div>
        </Card.Body>
        </Row>
        </Container>
        <Card.Footer className="d-flex p-1 align-items-center justify-content-center">
          <FontAwesomeIcon className="trash-icon my-2 mx-0" icon={faAward} size="2x" style={{ color: 'rgb(212,175,55)' }} />  
          <p className="m-0 mx-3">
            <span>{tasks.filter(task => task.complete).length}/{tasks.length}</span> completed
            </p>
          {/* <p className="m-0 mx-2">Task last completed : {tasks.filter(task => !task.complete).length} days ago</p> */}
        </Card.Footer>
      </Card>
      </Row>
    </Container>
    </>
  )
}

export default App;