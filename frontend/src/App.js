import React, { useState, useEffect } from 'react';
import './App.css';
import Clock from './components/Clock';
import Weather from './components/Weather';
import TodoList from './components/TodoList';
import NewsFeed from './components/NewsFeed';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="app-title">Personal Dashboard</h1>
        <nav className="app-nav">
          <button 
            className={currentView === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('dashboard')}
          >
            <span className="nav-icon">📊</span> Dashboard
          </button>
          <button 
            className={currentView === 'todos' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('todos')}
          >
            <span className="nav-icon">✅</span> Todos
          </button>
          <button 
            className={currentView === 'news' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('news')}
          >
            <span className="nav-icon">📰</span> News
          </button>
        </nav>
      </header>
      
      <main className="dashboard-container">
        {currentView === 'dashboard' && (
          <div className="dashboard-grid">
            <div className="widget-container clock-widget">
              <Clock />
            </div>
            <div className="widget-container weather-widget">
              <Weather />
            </div>
            <div className="widget-container todos-widget">
              <TodoList preview={true} />
            </div>
            <div className="widget-container news-widget">
              <NewsFeed preview={true} />
            </div>
          </div>
        )}
        
        {currentView === 'todos' && (
          <div className="full-view">
            <TodoList preview={false} />
          </div>
        )}
        
        {currentView === 'news' && (
          <div className="full-view">
            <NewsFeed preview={false} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;