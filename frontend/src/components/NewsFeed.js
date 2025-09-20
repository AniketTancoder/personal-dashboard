import React, { useState, useEffect } from 'react';
import './Widget.css';

const NewsFeed = ({ preview }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const mockNews = [
          {
            title: "New AI Breakthrough Revolutionizes Healthcare",
            description: "Researchers have developed an AI system that can detect diseases with unprecedented accuracy.",
            url: "#",
            publishedAt: "2 hours ago"
          },
          {
            title: "Global Summit Addresses Climate Change Solutions",
            description: "World leaders gather to discuss urgent actions needed to combat climate change.",
            url: "#",
            publishedAt: "5 hours ago"
          },
          {
            title: "Tech Giant Announces Revolutionary New Product",
            description: "The latest innovation promises to change how we interact with technology daily.",
            url: "#",
            publishedAt: "1 day ago"
          },
          {
            title: "Space Exploration Reaches New Milestone",
            description: "Recent mission discoveries provide new insights into our solar system.",
            url: "#",
            publishedAt: "2 days ago"
          }
        ];
        
        setNews(mockNews);
      } catch (err) {
        setError('Unable to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    
    // Refresh news every 30 minutes
    const interval = setInterval(fetchNews, 1800000);
    return () => clearInterval(interval);
  }, []);

  const displayedNews = preview ? news.slice(0, 3) : news;

  return (
    <div className={`widget ${preview ? 'preview' : ''}`}>
      <div className="widget-header">
        <span className="widget-icon">📰</span>
        <h2>Latest News {preview && '(Headlines)'}</h2>
      </div>
      <div className="widget-content">
        {loading ? (
          <div className="loading">Loading news...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="news-list">
            {displayedNews.map((article, index) => (
              <article key={index} className="news-item">
                <h3 className="news-title">{article.title}</h3>
                <p className="news-description">{article.description}</p>
                <div className="news-meta">
                  <span className="news-time">{article.publishedAt}</span>
                  <a href={article.url} className="news-link">
                    Read more
                  </a>
                </div>
              </article>
            ))}
            
            {news.length === 0 && (
              <div className="news-empty">No news available at the moment.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;