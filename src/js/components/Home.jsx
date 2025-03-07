import React, { useState, useEffect } from "react";
const API_URL_BASE = "https://playground.4geeks.com/todo/"
const USER = "jsanchof";
//This requires first the creation of the user on the endpoint
//then needs to update the USER to fetch the task for the user
//the best option is a create user as Home, then route to the task component
//this is not requested at this point
const Home = () => {
	const [todos, setTodos] = useState([]);
	const [inputValue, setInputValue] = useState([]);;

	const getTodos = async () => {
		try {
			const response = await fetch(API_URL_BASE + 'users/' + USER, {
				method: "GET"
			}
			);
			if (!response.ok) {
				throw new Error("Error al consultar el endpoint");
			}

			const data = await response.json();
			setTodos(data.todos)

		} catch (error) {
			console.log(error);
		}
	};

	const createTodos = async () => {
		try {
			let task = {
				"label": inputValue,
				"is_done": false
			};
			const response = await fetch(API_URL_BASE + 'todos/' + USER, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(task)
			})
			if (!response) {
				throw new Error("Error al crear la tarea");
			}
			
			setInputValue("");
			getTodos();

		} catch (error) {
			console.log(error)
		}

	};

	const deleteTodo = async (todo_id) => {
		console.log(todo_id);
		try {
			const response = await fetch(API_URL_BASE + 'todos/' + todo_id, {
				method: 'DELETE'
			})
			if (!response.ok)
				throw new Error("La tarea no fue borrada, el id es: " + todo_id);
		} catch (error) {
			console.log(error);
		}
		getTodos();
	}

	const toggleTodo = async (todo_id) => {
		try {
			const updatedTodos = todos.map(todo => 
				todo.id === todo_id ? { ...todo, is_done: !todo.is_done } : todo
			);
			setTodos(updatedTodos);
	
			await fetch(API_URL_BASE + 'todos/' + todo_id, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ is_done: updatedTodos.find(todo => todo.id === todo_id).is_done })
			});
	
		} catch (error) {
			console.log("Error al actualizar la tarea:", error);
		}
	};

	useEffect(() => {
		getTodos();
	}, []);

	return (
		<div className="container">
			<div className="row">
				<div className="col">
					<h2>Lista de tareas</h2>
					<input type="text" className="form-control form-control-sm" 
						placeholder="Escribe la tarea"
						value={inputValue} 
						onChange={(e) => {
							setInputValue(e.target.value)
						}}
						onKeyDown={(e) => {
							if (e.key == 'Enter')
								createTodos()
						}} />
				</div>

			</div>

			<div className="task-container">
				{todos.map((todo, index) => {
					return (
						<div key={todo.id} className="item-list">
							<input
								id={`checkbox-${todo.id}`}
								className="form-check-input"
								type="checkbox"
								checked={todo.is_done}
								onChange={() => toggleTodo(todo.id)}
							/>
							<label htmlFor={`checkbox-${todo.id}`} className="li-item">{todo.label}</label>
							<i className="fas fa-trash-alt" onClick={() => {
								deleteTodo(todo.id);
							}}></i>
							
						</div>
					)
				})}
			</div>
			<small className="taskCounter">Task pending: {todos.length}</small>
		</div>
	);
};

export default Home;