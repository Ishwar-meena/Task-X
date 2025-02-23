import React from "react"
import Navbar from "./Components/Navbar"
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([])
  const [showCompleted, setShowCompleted] = useState(true)

  // fetch data from database 
  const getTasks = async () => {
    let response = await fetch('https://task-x-six.vercel.app/');
    let tasks = await response.json();
    setTodos(tasks);
  }

  // add task in database 
  const addToDB = async (todo, id) => {
    await fetch( 'https://task-x-six.vercel.app/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ todo: todo, isCompleted: false, id })
    })
  }

  // Delete a task from database 
  const deleteToDB = async (id) => {
    await fetch( 'https://task-x-six.vercel.app/',
      {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })
  }
  // Load data from database when the app refresh
  useEffect(() => {
    getTasks();
  }, []);

  const handleChange = (e) => {
    setTodo(e.target.value);
  }

  // handle checkbox
  const handleCheck = (e) => {
    const id = e.target.id;
    const updatedTodos = todos.map((item) => {
      if (item.id == id) {
        return { ...item, isCompleted: !item.isCompleted };
      }
      return item;
    });
    setTodos(updatedTodos);
  };

  const addTodo = async () => {
    if (todo.length < 3) {
      return alert("Too short task")
    }
    const id = uuidv4();
    addToDB(todo, id);
    setTodos([...todos, { todo, isCompleted: false, id }]);
    setTodo('')
  }

  const deleteTodo = async (id) => {
    let confrm = confirm("Are you sure to delete this task?");
    if (confrm) {
      await deleteToDB();
      let updatedTodos = todos.filter(item => {
        return item.id != id;
      })
      setTodos(updatedTodos);
    }
  }
  const editTodo = async (id) => {
    // find edited todo and set in input 
    let editedTodo = todos.filter(item => {
      return item.id == id;
    })
    setTodo(editedTodo[0].todo);
    // delete task from database 
    await deleteToDB(id);
    // delete a task
    let updatedTodos = todos.filter(item => {
      return item.id != id;
    })
    setTodos(updatedTodos);

  }
  const toggleCompleted = () => {
    setShowCompleted(!showCompleted);
  }
  return (
    <>
      <Navbar />
      <div className="main h-full w-full flex justify-center items-center ">
        <div className="todo-container bg-red-300 md:w-1/2 w-11/12 min-h-[60vh]  mt-10 mb-2 rounded-md flex flex-col md:px-10 px-2">
          <div className="text-center text-2xl font-semibold my-6">Task X Personal Task Manager</div>
          <div className="flex gap-3 my-1">
            <input onChange={handleChange} name="todo" value={todo} type="text" placeholder="Enter your task" className="w-full rounded-sm px-2 outline-orange-300 border border-purple-500" />
            <button onClick={() => addTodo()} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg text-sm px-5 py-2.5 text-center ">Add</button>
          </div>
          <div className="todos my-1 py-1">
            <div onChange={toggleCompleted} className="font-medium"><input type="checkbox" name="" id="" checked={showCompleted} className="mr-3" />Show Completed</div>
            <p className="text-2xl font-medium">Your todos</p>
            <div className="bg-gray-500 h-[1px] my-1"></div>
            <div className="todo">
              {todos.length === 0 && <div className="font-medium">No task added</div>}
              {todos.map((items) => {
                return (showCompleted || !items.isCompleted) && <div key={items.id} className="flex justify-between items-center">
                  <div className={`flex items-center gap-5 text-lg font-medium my-1`}>
                    <div><input type="checkbox" name={items.todo} id={items.id} checked={items.isCompleted} onChange={handleCheck} /></div>
                    <div className={`${items.isCompleted ? 'line-through' : ''}`}>{items.todo}</div>
                  </div>
                  <div className="icon flex gap-1">
                    <img src="edit.svg" alt="edit" className="h-5 cursor-pointer" onClick={() => editTodo(items.id)} />
                    <img src="delete.gif" alt="delete" className="h-5 cursor-pointer" onClick={() => deleteTodo(items.id)} />
                  </div>
                </div>
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
