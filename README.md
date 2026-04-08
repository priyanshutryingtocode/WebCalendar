# 🗓️ Web Calendar

A premium, interactive React calendar application featuring a nostalgic **spiral-bound notebook aesthetic** merged with a modern, high-performance scheduling engine.

## ✨ Key Features

* **Spiral Binding Aesthetic**: A unique UI that mimics a physical paper planner with custom spiral rings and month-specific thematic headers.
* **Tactile Drag-to-Select**: Intuitive mouse interaction allowing you to drag across multiple days to create multi-day events with perfectly rounded "pill" connectors.
* **Offline Holiday Logic**: Seamless holiday calculation using the `date-holidays` engine, ensuring your calendar is accurate regardless of network status.
* **Integrated Note-Taking**: A dedicated side-panel for jotting down monthly goals or quick memos on "ruled paper" logic.
* **Smart Search & Dimming**: Live search functionality that filters notes and events, visually dimming non-matching dates to help you focus.
* **Dark Mode Support**: Fully responsive theme engine with tailored color palettes for night-time planning.

## 🛠️ Tech Stack

* **Frontend**: React (Custom Hooks, Context API).
* **Styling**: Tailwind CSS (Notebook effects, clip-paths, and responsive grid).
* **Animations**: Framer Motion (Page-flip transitions and UI micro-interactions).
* **Icons**: Lucide React.
* **State Persistence**: Local Storage persistence for events, notes, and theme preferences.
* **Holiday Data**: `date-holidays` NPM package.

## 📂 Project Structure

```text
src/
├── components/
│   ├── Calendar.jsx        # Main application controller and layout
│   ├── CalendarGrid.jsx    # The core rendering engine for the dates
│   ├── CalendarHeader.jsx  # Animated month headers and navigation
│   ├── EventPanel.jsx      # Editor for creating and modifying events
│   └── NotesSection.jsx    # Ruled-paper notepad for general memos
├── hooks/
│   ├── useHolidays.js      # Holiday calculation and caching
│   ├── useCalendarEvents.js # CRUD logic for user events
│   ├── useLocalStorage.js  # Persistence layer
│   └── useTheme.js         # Dark/Light mode management