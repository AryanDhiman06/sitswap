import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {apiCall} from '../utils/apiHelper';

function DashboardPage({user}){
    const [pets, setPets] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try{
            setLoading(true);

            const petsData = await apiCall(`/users/${user.id}/pets`);
            setPets(petsData);

            const allRequests = await apiCall('/dogsits/status/PENDING');
            const userRequests = allRequests.filter(req => req.owner.id === user.id);
            setMyRequests(userRequests);

            setAcceptedRequests([]);
        } catch (err){
            setError("Failed to load dashboard data: " + err.message);
        } finally{
            setLoading(false);
        }
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return {
            date: date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        };
    };

    const calculatePoints = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const hours = Math.ceil((end - start) / (1000 * 60 * 60));
        return hours * 10;
    };

    const getUpcomingRequests = () => {
        const now = new Date();
        const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        return myRequests.filter(request => {
            const startTime = new Date(request.startTime);
            return startTime >= now && startTime <= twentyFourHoursFromNow;
        });
    };

    const getPointsColor = (points) => {
        if(points >= 100){
            return '#4CAF50';
        }
        if(points >= 50){
            return '#FF9800';
        }
        return '#F44336';
    };

    const getPointsMessage = (points) => {
        if(points >= 100){
            return 'Excellent balance! 🌟';
        }
        if(points >= 50){
            return 'Good balance 👍';
        }
        return 'Consider earning more points 💪';
    };

    if (loading){
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 50%, #81c784 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    padding: '50px',
                    borderRadius: '25px',
                    textAlign: 'center',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        border: '5px solid #e8f5e9',
                        borderTop: '5px solid #4caf50',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 25px'
                    }}></div>
                    <h2 style={{
                        margin: '0 0 10px 0',
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#2e7d32'
                    }}>
                        Loading Your Dashboard
                    </h2>
                    <p style={{margin: 0, color: '#666', fontSize: '16px'}}>
                        Fetching your latest data...
                    </p>
                </div>
                <style>
                    {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                </style>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 50%, #81c784 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '40px 20px'
        }}>
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '8%',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                animation: 'float 10s ease-in-out infinite'
            }}></div>
            <div style={{
                position: 'absolute',
                top: '60%',
                right: '12%',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                animation: 'float 8s ease-in-out infinite reverse'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '15%',
                left: '15%',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                animation: 'float 12s ease-in-out infinite'
            }}></div>

            <style>
                {`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(10deg); }
                }
                
                .dashboard-card {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .dashboard-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                }
                
                .action-btn {
                    transition: all 0.3s ease;
                }
                
                .action-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
                }
                
                .pet-card {
                    transition: all 0.3s ease;
                }
                
                .pet-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }
                
                .request-card {
                    transition: all 0.3s ease;
                }
                
                .request-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
                }
                `}
            </style>

            <div style={{maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1}}>
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '25px',
                    padding: '40px',
                    marginBottom: '30px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                        margin: '0 auto 25px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '60px',
                        boxShadow: '0 15px 30px rgba(76, 175, 80, 0.3)',
                        animation: 'float 6s ease-in-out infinite'
                    }}>
                        🏠
                    </div>
                    <h1 style={{
                        margin: '0 0 15px 0',
                        fontSize: '42px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Welcome back, {user.name}! 🌟
                    </h1>
                    <p style={{
                        margin: '0 0 25px 0',
                        color: '#666',
                        fontSize: '20px',
                        fontWeight: '400'
                    }}>
                        Your SitSwap dashboard is ready to help you manage your pet care community
                    </p>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '15px',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        padding: '15px 25px',
                        borderRadius: '20px',
                        border: '2px solid rgba(76, 175, 80, 0.2)'
                    }}>
                        <span style={{fontSize: '28px'}}>💰</span>
                        <div style={{textAlign: 'left'}}>
                            <div style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: getPointsColor(user.points)
                            }}>
                                {user.points} Points
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: '#666',
                                fontWeight: '500'
                            }}>
                                {getPointsMessage(user.points)}
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        border: '2px solid rgba(244, 67, 54, 0.2)',
                        borderRadius: '20px',
                        padding: '25px',
                        marginBottom: '30px',
                        color: '#d32f2f',
                        fontSize: '16px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}>
                        <span style={{fontSize: '28px'}}>⚠️</span>
                        <div>
                            <div style={{fontWeight: '600', marginBottom: '5px'}}>Dashboard Error</div>
                            {error}
                        </div>
                    </div>
                )}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '25px',
                    marginBottom: '40px'
                }}>
                    <div className="dashboard-card" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        padding: '30px',
                        borderRadius: '20px',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                            margin: '0 auto 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)'
                        }}>
                            🐾
                        </div>
                        <h3 style={{margin: '0 0 10px 0', color: '#2e7d32', fontSize: '20px', fontWeight: '600'}}>
                            My Pets
                        </h3>
                        <p style={{
                            margin: '0 0 15px 0',
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: '#4CAF50'
                        }}>
                            {pets.length}
                        </p>
                        <p style={{margin: '0', color: '#666', fontSize: '14px'}}>
                            {pets.length === 0 ? 'Add your first pet profile!' : 
                             pets.length === 1 ? '1 pet registered' : 
                             `${pets.length} pets registered`}
                        </p>
                    </div>

                    <div className="dashboard-card" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        padding: '30px',
                        borderRadius: '20px',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                            margin: '0 auto 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            boxShadow: '0 8px 20px rgba(33, 150, 243, 0.3)'
                        }}>
                            📋
                        </div>
                        <h3 style={{margin: '0 0 10px 0', color: '#2e7d32', fontSize: '20px', fontWeight: '600'}}>
                            Active Requests
                        </h3>
                        <p style={{
                            margin: '0 0 15px 0',
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: '#2196F3'
                        }}>
                            {myRequests.length}
                        </p>
                        <p style={{margin: '0', color: '#666', fontSize: '14px'}}>
                            {myRequests.length === 0 ? 'No pending requests' : 
                             myRequests.length === 1 ? '1 request pending' : 
                             `${myRequests.length} requests pending`}
                        </p>
                    </div>

                    <div className="dashboard-card" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        padding: '30px',
                        borderRadius: '20px',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                            margin: '0 auto 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)'
                        }}>
                            ⏰
                        </div>
                        <h3 style={{margin: '0 0 10px 0', color: '#2e7d32', fontSize: '20px', fontWeight: '600'}}>
                            Upcoming Soon
                        </h3>
                        <p style={{
                            margin: '0 0 15px 0',
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: '#FF9800'
                        }}>
                            {getUpcomingRequests().length}
                        </p>
                        <p style={{margin: '0', color: '#666', fontSize: '14px'}}>
                            {getUpcomingRequests().length === 0 ? 'No upcoming requests' : 
                             getUpcomingRequests().length === 1 ? 'Request starting soon' : 
                             'Requests starting soon'}
                        </p>
                    </div>

                    <div className="dashboard-card" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        padding: '30px',
                        borderRadius: '20px',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                            margin: '0 auto 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            boxShadow: '0 8px 20px rgba(156, 39, 176, 0.3)'
                        }}>
                            🤝
                        </div>
                        <h3 style={{margin: '0 0 10px 0', color: '#2e7d32', fontSize: '20px', fontWeight: '600'}}>
                            Jobs Completed
                        </h3>
                        <p style={{
                            margin: '0 0 15px 0',
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: '#9C27B0'
                        }}>
                            {acceptedRequests.length}
                        </p>
                        <p style={{margin: '0', color: '#666', fontSize: '14px'}}>
                            Helping the community! 🌟
                        </p>
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '25px',
                    padding: '40px',
                    marginBottom: '40px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        marginBottom: '30px'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ff5722 0%, #d84315 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px'
                        }}>
                            ⚡
                        </div>
                        <h3 style={{
                            margin: 0,
                            fontSize: '28px',
                            fontWeight: '600',
                            color: '#2e7d32'
                        }}>
                            Quick Actions
                        </h3>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px'
                    }}>
                        <button 
                            onClick={() => navigate('/create-request')}
                            className="action-btn"
                            style={{
                                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                color: 'white',
                                padding: '20px',
                                border: 'none',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
                            }}
                        >
                            <span style={{fontSize: '24px'}}>📝</span>
                            Create New Request
                        </button>

                        <button
                            onClick={() => navigate('/requests')}
                            className="action-btn"
                            style={{
                                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                                color: 'white',
                                padding: '20px',
                                border: 'none',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)'
                            }}
                        >
                            <span style={{fontSize: '24px'}}>🔍</span>
                            Browse Requests
                        </button>

                        <button
                            onClick={() => navigate('/pet-profiles')}
                            className="action-btn"
                            style={{
                                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                                color: 'white',
                                padding: '20px',
                                border: 'none',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)'
                            }}
                        >
                            <span style={{fontSize: '24px'}}>🐕</span>
                            {pets.length === 0 ? 'Add First Pet' : 'Manage Pets'}
                        </button>
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '25px',
                    padding: '40px',
                    marginBottom: '40px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px'
                            }}>
                                🐾
                            </div>
                            <h3 style={{
                                margin: 0,
                                fontSize: '28px',
                                fontWeight: '600',
                                color: '#2e7d32'
                            }}>
                                My Pet Family
                            </h3>
                        </div>
                        <button
                            onClick={() => navigate('/pet-profiles')}
                            style={{
                                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                color: 'white',
                                padding: '12px 20px',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                            }}
                        >
                            <span style={{fontSize: '16px'}}>
                                {pets.length === 0 ? '➕' : '👁️'}
                            </span>
                            {pets.length === 0 ? 'Add Pet' : 'View All'}
                        </button>
                    </div>

                    {pets.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 40px',
                            backgroundColor: 'rgba(165, 214, 167, 0.1)',
                            borderRadius: '20px',
                            border: '2px dashed rgba(76, 175, 80, 0.3)'
                        }}>
                            <div style={{fontSize: '80px', marginBottom: '20px'}}>🐕</div>
                            <h4 style={{
                                margin: '0 0 15px 0',
                                fontSize: '24px',
                                fontWeight: '600',
                                color: '#2e7d32'
                            }}>
                                No pets registered yet
                            </h4>
                            <p style={{
                                margin: '0 0 25px 0',
                                color: '#666',
                                fontSize: '16px'
                            }}>
                                Add your first pet profile to start creating sitting requests and connecting with other pet lovers!
                            </p>
                            <button
                                onClick={() => navigate('/pet-profiles')}
                                style={{
                                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                    color: 'white',
                                    padding: '15px 30px',
                                    border: 'none',
                                    borderRadius: '15px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 15px 35px rgba(76, 175, 80, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.3)';
                                }}
                            >
                                <span style={{fontSize: '20px'}}>➕</span>
                                Add Your First Pet
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '20px'
                        }}>
                            {pets.slice(0, 3).map(pet => (
                                <div key={pet.id} className="pet-card" style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '20px',
                                    padding: '25px',
                                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    textAlign: 'center'
                                }}>
                                    {pet.imageUrl && (
                                        <div style={{marginBottom: '15px'}}>
                                            <img
                                                src={`http://localhost:8080${pet.imageUrl}`}
                                                alt={pet.name}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    border: '3px solid #4caf50',
                                                    boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)'
                                                }}
                                            />
                                        </div>
                                    )}
                                    <h4 style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#2e7d32'
                                    }}>
                                        {pet.name}
                                    </h4>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        flexWrap: 'wrap'
                                    }}>
                                        <span style={{
                                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                            color: '#2e7d32',
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            border: '1px solid rgba(76, 175, 80, 0.2)'
                                        }}>
                                            {pet.breed}
                                        </span>
                                        <span style={{
                                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                            color: '#1976d2',
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            border: '1px solid rgba(33, 150, 243, 0.2)'
                                        }}>
                                            {pet.age}y
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {pets.length > 3 && (
                                <div className="pet-card" style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '20px',
                                    padding: '25px',
                                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                                    border: '2px dashed rgba(76, 175, 80, 0.3)',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate('/pet-profiles')}
                            >
                                <div>
                                    <div style={{fontSize: '36px', marginBottom: '10px'}}>➕</div>
                                    <div style={{
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#2e7d32',
                                        marginBottom: '5px'
                                    }}>
                                        +{pets.length - 3} more pets
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#666'
                                    }}>
                                        Click to view all
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '25px',
                padding: '40px',
                marginBottom: '40px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px'
                        }}>
                            📋
                        </div>
                        <h3 style={{
                            margin: 0,
                            fontSize: '28px',
                            fontWeight: '600',
                            color: '#2e7d32'
                        }}>
                            My Recent Requests
                        </h3>
                    </div>
                    <button
                        onClick={() => navigate('/create-request')}
                        style={{
                            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                            color: 'white',
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(33, 150, 243, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(33, 150, 243, 0.3)';
                        }}
                    >
                        <span style={{fontSize: '16px'}}>➕</span>
                        New Request
                    </button>
                </div>

                {myRequests.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 40px',
                        backgroundColor: 'rgba(33, 150, 243, 0.05)',
                        borderRadius: '20px',
                        border: '2px dashed rgba(33, 150, 243, 0.2)'
                    }}>
                        <div style={{fontSize: '80px', marginBottom: '20px'}}>📋</div>
                        <h4 style={{
                            margin: '0 0 15px 0',
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#2e7d32'
                        }}>
                            No active requests
                        </h4>
                        <p style={{
                            margin: '0 0 25px 0',
                            color: '#666',
                            fontSize: '16px'
                        }}>
                            Create your first dog-sitting request to get started connecting with trusted sitters!
                        </p>
                        <button
                            onClick={() => navigate('/create-request')}
                            style={{
                                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                                color: 'white',
                                padding: '15px 30px',
                                border: 'none',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 15px 35px rgba(33, 150, 243, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 8px 25px rgba(33, 150, 243, 0.3)';
                            }}
                        >
                            <span style={{fontSize: '20px'}}>📝</span>
                            Create First Request
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '20px'
                    }}>
                        {myRequests.slice(0, 2).map(request => {
                            const startDateTime = formatDateTime(request.startTime);
                            const endDateTime = formatDateTime(request.endTime);
                            const points = calculatePoints(request.startTime, request.endTime);

                            return (
                                <div key={request.id} className="request-card" style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '15px',
                                    padding: '25px',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                        color: '#2e7d32',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        border: '1px solid rgba(76, 175, 80, 0.2)'
                                    }}>
                                        PENDING
                                    </div>

                                    <h4 style={{
                                        margin: '0 0 15px 0',
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#2e7d32',
                                        paddingRight: '80px'
                                    }}>
                                        {request.description}
                                    </h4>

                                    <div style={{
                                        backgroundColor: 'rgba(165, 214, 167, 0.1)',
                                        padding: '12px',
                                        borderRadius: '10px',
                                        marginBottom: '15px',
                                        border: '1px solid rgba(165, 214, 167, 0.2)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#2e7d32'
                                        }}>
                                            <span style={{fontSize: '16px'}}>🐕</span>
                                            {request.petName} • {request.petBreed}
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '12px',
                                        marginBottom: '15px',
                                        fontSize: '13px'
                                    }}>
                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                marginBottom: '3px'
                                            }}>
                                                <span style={{fontSize: '14px'}}>📅</span>
                                                <span style={{fontWeight: '600', color: '#2e7d32'}}>Start</span>
                                            </div>
                                            <div style={{color: '#666', marginLeft: '20px'}}>
                                                {startDateTime.date} {startDateTime.time}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                marginBottom: '3px'
                                            }}>
                                                <span style={{fontSize: '14px'}}>🏁</span>
                                                <span style={{fontWeight: '600', color: '#2e7d32'}}>End</span>
                                            </div>
                                            <div style={{color: '#666', marginLeft: '20px'}}>
                                                {endDateTime.date} {endDateTime.time}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '15px',
                                        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <span style={{fontSize: '16px'}}>📍</span>
                                            <span style={{
                                                fontSize: '14px',
                                                color: '#666',
                                                fontWeight: '500'
                                            }}>
                                                {request.location}
                                            </span>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <span style={{fontSize: '14px'}}>💰</span>
                                            <span style={{
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                color: '#2e7d32'
                                            }}>
                                                {points} pts
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {myRequests.length > 2 && (
                            <div className="request-card" style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '15px',
                                padding: '25px',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                                border: '2px dashed rgba(33, 150, 243, 0.3)',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate('/requests')}
                        >
                            <div>
                                <div style={{fontSize: '36px', marginBottom: '10px'}}>👁️</div>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#2e7d32',
                                    marginBottom: '5px'
                                }}>
                                    +{myRequests.length - 2} more requests
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#666'
                                }}>
                                    Click to view all
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        {getUpcomingRequests().length > 0 && (
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '25px',
                padding: '40px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px'
                    }}>
                        ⏰
                    </div>
                    <h3 style={{
                        margin: 0,
                        fontSize: '28px',
                        fontWeight: '600',
                        color: '#2e7d32'
                    }}>
                        Starting Soon (Next 24 Hours)
                    </h3>
                </div>

                <div style={{
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    borderRadius: '15px',
                    padding: '25px',
                    border: '2px solid rgba(255, 193, 7, 0.2)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '15px'
                    }}>
                        <span style={{fontSize: '24px'}}>🚨</span>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#f57c00'
                        }}>
                            {getUpcomingRequests().length} request{getUpcomingRequests().length !== 1 ? 's' : ''} starting soon!
                        </span>
                    </div>

                    <div style={{
                        display: 'grid',
                        gap: '12px'
                    }}>
                        {getUpcomingRequests().map(request => {
                            const startDateTime = formatDateTime(request.startTime);

                            return (
                                <div key={request.id} style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{
                                            fontWeight: '600',
                                            color: '#2e7d32',
                                            marginBottom: '5px'
                                        }}>
                                            {request.petName} • {request.description}
                                        </div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#666'
                                        }}>
                                            📍 {request.location}
                                        </div>
                                    </div>
                                    <div style={{
                                        textAlign: 'right',
                                        fontSize: '14px'
                                    }}>
                                        <div style={{
                                            fontWeight: '600',
                                            color: '#f57c00',
                                            marginBottom: '2px'
                                        }}>
                                            {startDateTime.date}
                                        </div>
                                        <div style={{color: '#666'}}>
                                            {startDateTime.time}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}
    </div>
</div>
    );
}

export default DashboardPage;