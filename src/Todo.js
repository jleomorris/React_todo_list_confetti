import React from 'react'

export default function Todo({ task, toggleTodo }) {
  function handleTodoClick() {
    toggleTodo(task.id)
  }
  
  return (
      <label className="to-do-item m-2">
        <input className="m-2" type="checkbox" checked={task.complete} onChange={handleTodoClick} />
        {/* {task.name} <br /> <span>Added - {task.dateAdded}</span> | <span>Completed - {task.dateCompleted}</span> */}
        {task.name} <br /> <span>Added - {task.dateAdded}</span> <span>{task.dateCompleted ? `| Completed - ${task.dateCompleted}` : ''}</span>
        <hr />
      </label>
  )
}
