import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'
import { Trash2 } from 'lucide-react'
import { Inbox } from 'lucide-react'
import { Briefcase, Clock, MessageCircle } from 'lucide-react'

function App() {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('applied')
  const [applications, setApplications] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)  
  const [loading, setLoading] = useState(true)

  async function handleSubmit(e) {
    e.preventDefault()
    const {error} = await supabase
    .from('applications')
    .insert({
      company: company, 
      role: role, 
      status: status,
      user_id: user.id
    })

    if (error) {
      console.log('error adding application: ', error)
    }

    setCompany('')
    setRole('')
    setStatus('')
    fetchApplications()
  }

  async function fetchApplications() {
    if (!user) return
    const {data, error} = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)

    if (error){console.error('Error fetching applications:', error)} 
    else {
      setApplications(data)
    }
  }

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setUser(data.session.user)
      }
      setLoading(false)
    }
    getSession()
  }, [])
  
  useEffect(() => {
    fetchApplications()
  }, [user])
  

  async function handleDelete(id) {
    const {error} = await supabase
    .from('applications')
    .delete()
    .eq('id', id)

    if (error){console.error('Error deleting application', error)}
    else {
      fetchApplications()
    }

  }

  async function handleUpdateStatus(id, newStatus) {
    const {error} = await supabase
    .from('applications')
    .update({status: newStatus})
    .eq('id', id)

    if (error){console.error('Error updating application', error)}
    else {
      fetchApplications()
    }
  }

  async function handleSignUp(e) {
    const {error} = await supabase.auth.signUp({ email, password })
    if (error) {
      console.log("error signing up: ", error)
    }
  }

  async function handleLogIn(e) {
    const {data, error} = await supabase.auth.signInWithPassword({ email, password})
    if (error) {
      console.log('error siging in: ', error)
    } else {
      setUser(data.user)
      console.log('Logged in user:', data.user)
    }
  }

  async function handleLogout(e) {
    const {error} = await supabase.auth.signOut()
    if (error) {
      console.log('error logging out: ', error)
    } else {
      setUser(null)
    }
  }

  
  if (loading) return <p>Loading...</p>

  return (
    <div className="app-container">
    <h1>Application <span className="accent">Tracker</span></h1>
      {!user && (
        <form>
          <input
            type='email'
            placeholder='E-Mail'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="btn-secondary" onClick={handleSignUp}>Sign Up</button>
          <button type="button" className="btn-primary" onClick={handleLogIn}>Log In</button>
        </form>
      )}
  
      {user && (
        <div className="section">
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Logged in as {user.email}
        </p>
        <h2 style={{ fontSize: '18px', fontWeight:'600', color: '#374151', marginBottom: '4px'}}>
          Add new application
        </h2>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
          <div className="stat-card">
            <Briefcase size={20} color='#2563eb'/>
            <span className="stat-number">{applications.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className='stat-card'>
            <Clock size={20} color='#92400e'/>
            <span className='stat-number'>
              {applications.filter((app) => app.status === 'applied').length}
            </span>
            <span className='start-label'>Applied</span>
          </div>
          <div className="stat-card">
            <MessageCircle size={20} color='#065f46' />
            <span className="stat-number">
              {applications.filter((app) => app.status === 'interviewing').length}
            </span>
            <span className="stat-label">Interviewing</span>
          </div>
        </div>
        <div className="section">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder='Company'
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <input
              type="text"
              placeholder='Role'
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
            </select>
            <button className="btnApp" type="submit">Add Application</button>
          </form>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight:'600', color: '#374151', marginBottom: '4px'}}>
            Your applications
          </h2>
          
          <ul>
            {applications.length === 0 &&  (
              <div className="section">
                <Inbox size={40} style={{ marginBottom: '8px'}} />
                <p style={{ color:'#6b7280' }}>No applications submitted...</p>
              </div>
            )}
            {applications.map((app) => (
              <li key={app.id}>
                <div className="section" style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
                  {app.status === 'applied' ? <Clock size={16} color="#92400e" /> : <MessageCircle size={16} color="#065f46" />}
                  <span>{app.company} - {app.role}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
                <select value={app.status} onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                  className={`status-select status-${app.status}`}>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                </select>
                  <button onClick={() => handleDelete(app.id)} className='icon-btn' aria-label="Delete">
                    <Trash2 size={18}/>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      )}
      <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '16px'}}>
        Built by Jes · with React & Supabase
      </p>
    </div>
  )  

}

export default App