import { useState } from 'react'
import './App.css'
import WorkoutTypeManager from './components/WorkoutTypeManager'
import WorkoutLogManager from './components/WorkoutLogManager'

function App() {
  const [activeTab, setActiveTab] = useState<'logs' | 'types'>('logs');

  return (
    <div className="app-container">
      <header>
        <h1>Workout Tracker</h1>
        <nav className="tabs">
          <button 
            className={activeTab === 'logs' ? 'active' : ''} 
            onClick={() => setActiveTab('logs')}
          >
            Workout Logs
          </button>
          <button 
            className={activeTab === 'types' ? 'active' : ''} 
            onClick={() => setActiveTab('types')}
          >
            Workout Types
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'logs' ? <WorkoutLogManager /> : <WorkoutTypeManager />}
      </main>

      <footer>
        <p>Workout Tracker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
