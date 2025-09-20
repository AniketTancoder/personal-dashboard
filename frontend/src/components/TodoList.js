import React, { useState, useEffect } from 'react';
import './Widget.css';

const TodoList = ({ preview }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTodos = [
        { id: 1, text: 'Complete dashboard project', completed: true },
        { id: 2, text: 'Add animations to UI', completed: false },
        { id: 3, text: 'Test CI/CD pipeline', completed: false },
        { id: 4, text: 'Deploy to production', completed: false }
      ];
      setTodos(mockTodos);
      setLoading(false);
    }, 800);
  }, []);

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const displayedTodos = preview ? todos.slice(0, 4) : todos;

  return (
    <div className={`widget ${preview ? 'preview' : ''}`}>
      <div className="widget-header">
        <span className="widget-icon">✅</span>
        <h2>Todo List {preview && '(Recent)'}</h2>
      </div>
      <div className="widget-content">
        {loading ? (
          <div className="loading">Loading todos...</div>
        ) : (
          <>
            <ul className="todo-list">
              {displayedTodos.map(todo => (
                <li key={todo.id} className="todo-item">
                  <label className="todo-label">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                      {todo.text}
                    </span>
                  </label>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="todo-delete"
                    aria-label="Delete todo"
                  >
                    ×
                  </button>
                </li>
              ))}
              
              {todos.length === 0 && (
                <li className="todo-empty">No todos yet. Add one below!</li>
              )}
            </ul>
            
            <div className="todo-add">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="Add a new task..."
                className="todo-input"
              />
              <button onClick={addTodo} className="todo-add-btn">
                Add
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoList;