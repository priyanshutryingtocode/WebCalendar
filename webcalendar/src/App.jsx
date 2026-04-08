// src/App.jsx
import Calendar from './components/Calendar';

function App() {
  return (
    // Added dark transition and dark background color
    <div className="w-full min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center">
      <Calendar />
    </div>
  );
}

export default App;