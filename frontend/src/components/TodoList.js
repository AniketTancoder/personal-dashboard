import React, { useState, useEffect } from 'react';
import './Widget.css';

const TodoList = ({ preview }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error('Todo fetch error:', err);
      // Fallback to mock data
      const mockTodos = [
        { id: 1, text: 'Complete dashboard project', completed: true },
        { id: 2, text: 'Add animations to UI', completed: false },
        { id: 3, text: 'Test CI/CD pipeline', completed: false },
        { id: 4, text: 'Deploy to production', completed: false }
      ];
      setTodos(mockTodos);
      setError('Using mock data - Backend unavailable');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: newTodo.trim(),
            completed: false
          }),
        });

        if (response.ok) {
          const newTodoItem = await response.json();
          setTodos([...todos, newTodoItem]);
          setNewTodo('');
        } else {
          throw new Error('Failed to add todo');
        }
      } catch (err) {
        console.error('Add todo error:', err);
        // Fallback to local state update
        const newTodoItem = {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false
        };
        setTodos([...todos, newTodoItem]);
        setNewTodo('');
      }
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo.completed
        }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map(t => t.id === id ? updatedTodo : t));
      } else {
        throw new Error('Failed to update todo');
      }
    } catch (err) {
      console.error('Toggle todo error:', err);
      // Fallback to local state update
      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      } else {
        throw new Error('Failed to delete todo');
      }
    } catch (err) {
      console.error('Delete todo error:', err);
      // Fallback to local state update
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const displayedTodos = preview ? todos.slice(0, 4) : todos;

  return (
    <div className={`widget ${preview ? 'preview' : ''}`}>
      <div className="widget-header">
        <span className="widget-icon">✅</span>
        <h2>Todo List {preview && '(Recent)'}</h2>
        {error && <span className="error-badge">Mock</span>}
      </div>
      <div className="widget-content">
        {loading ? (
          <div className="loading">Loading todos...</div>
        ) : (
          <>
            {error && <div className="warning-message">{error}</div>}
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