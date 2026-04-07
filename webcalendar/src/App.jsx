// src/App.jsx
import Calendar from './components/Calendar';

function App() {
  return (
    // The background color here ensures the page matches the calendar's container
    <div className="min-h-screen bg-gray-100">
      <Calendar />
    </div>
  );
}

export default App;