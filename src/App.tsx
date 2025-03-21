import { useState, useEffect } from 'react'
import './App.css'
import WorkoutTypeManager from './components/WorkoutTypeManager'
import WorkoutLogManager from './components/WorkoutLogManager'
import { getCurrentUser } from './services/api'
import { User } from './types/workout'

function App() {
  const [activeTab, setActiveTab] = useState<'logs' | 'types'>('logs')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true)
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        
        // Redirect to login if not authenticated
        if (!currentUser) {
          window.location.href = '/login'
          return
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    window.location.href = '/login'
  }

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>
  }

  // If user is null, the useEffect will redirect to login
  if (!user) return null

  return (
    <div className="app-container">
      <header>
        <div className="header-top">
          <h1>Workout Tracker</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
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
