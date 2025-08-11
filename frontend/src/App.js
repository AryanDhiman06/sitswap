import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RequestsPage from './pages/RequestsPage';
import CreateRequestPage from './pages/CreateRequestPage';
import PetProfilesPage from './pages/PetProfilesPage';
import { logout } from './utils/apiHelper';

function Navigation({user, onLogout}){
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/requests', label: 'Browse Requests', icon: '🔍' },
    { path: '/create-request', label: 'Create Request', icon: '➕' },
    { path: '/pet-profiles', label: 'My Pets', icon: '🐕' }
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
      boxShadow: '0 4px 20px rgba(46, 204, 113, 0.3)',
      padding: '0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            🐕
          </div>
          <h1 style={{
            margin: 0,
            color: 'white',
            fontSize: '24px',
            fontWeight: '700',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            SitSwap
          </h1>
        </div>

        <div style={{
          display: 'flex',
          gap: '0',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50px',
          padding: '5px'
        }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                color: location.pathname === item.path ? '#2c3e50' : 'white',
                padding: '12px 20px',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: location.pathname === item.path ? 'white' : 'transparent',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: 'max-content',
                boxShadow: location.pathname === item.path ? '0 4px 15px rgba(0,0,0,0.1)' : 'none'
              }}
              onMouseEnter={(e) => {
                if(location.pathname !== item.path){
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if(location.pathname !== item.path){
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div style={{
          display: 'flex', 
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            color: 'white',
            fontSize: '14px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}>
              <span style={{fontWeight: '600'}}>Welcome {user.name}</span>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 12px',
                borderRadius: '15px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span>💰</span>
                <span>{user.points} points</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => {logout(); onLogout();}}
            style={{
              backgroundColor: 'rgba(231, 76, 60, 0.9)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e74c3c';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.9)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fffe',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Router>
        {user && <Navigation user={user} onLogout={handleLogout}/>}

        <main style={{
          minHeight: user ? 'calc(100vh - 80px)' : '100vh'
        }}>
          <Routes>
            <Route path="/" element={
              user ? <DashboardPage user={user} /> : <LoginPage setUser={setUser} />
            } />
            <Route path="/dashboard" element={
              user ? <DashboardPage user={user} /> : <LoginPage setUser={setUser} />
            } />
            <Route path="/requests" element={
              user ? <RequestsPage user={user} /> : <LoginPage setUser={setUser} />
            } />
            <Route path="/create-request" element={
              user ? <CreateRequestPage user={user} /> : <LoginPage setUser={setUser} />
            } />
            <Route path="/pet-profiles" element={
              user ? <PetProfilesPage user={user} /> : <LoginPage setUser={setUser} />
            } />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;


