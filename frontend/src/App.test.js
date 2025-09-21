import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock the setTimeout to avoid waiting in tests
jest.useFakeTimers();

test('renders personal dashboard title', async () => {
  render(<App />);
  
  // Initially shows loading screen
  const loadingElement = screen.getByText(/Loading Dashboard/i);
  expect(loadingElement).toBeInTheDocument();
  
  // Fast-forward until all timers have been executed
  jest.advanceTimersByTime(2000);
  
  // After loading, should show the main dashboard title
  await waitFor(() => {
    const titleElement = screen.getByText(/Personal Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });
});

// Add a simple test that doesn't depend on the component
test('basic test to verify jest is working', () => {
  expect(1 + 1).toBe(2);
});