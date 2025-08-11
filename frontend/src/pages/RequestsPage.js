import React, {useState, useEffect} from 'react';
import { apiCall } from '../utils/apiHelper';

function RequestsPage({user}) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await apiCall('/dogsits/status/PENDING');
            setRequests(data);
        } catch (err){
            setError(err.message);
        } finally{
            setLoading(false);
        }
    };

    const acceptRequest = async (requestId) => {
        try {
            await apiCall(`/dogsits/${requestId}/accept/${user.id}`,{
                method: 'PUT'
            });
            fetchRequests();
            alert('Request accepted successfully!');
        } catch (err) {
            alert('Error accepting request: ' + err.message);
        }
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return{
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

    const calculateDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const hours = Math.ceil((end - start) / (1000 * 60 * 60));

        if(hours < 24){
            return `${hours} hour${hours !== 1 ? 's' : ''}`
        }else{
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            return `${days} day${days !== 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours}h` : ''}`;
        }
    };

    const filteredRequests = requests.filter(request => {
        if (filter === 'mine') return request.owner.id === user.id;
        if (filter === 'others') return request.owner.id !== user.id;
        return true;
    });

    const sortedRequests = [...filteredRequests].sort((a, b) => {
        if(sortBy === 'date'){
            return new Date(a.startTime) - new Date(b.startTime);
        }else if(sortBy === 'points'){
            return calculatePoints(b.startTime, b.endTime) - calculatePoints(a.startTime, a.endTime);
        }
        return 0;
    });

    if(loading){
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 50%, #81c784 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '40px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        border: '4px solid #e8f5e9',
                        borderTop: '4px solid #4caf50',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <p style={{margin: 0, color: '#2e7d32', fontSize: '18px', fontWeight: '500'}}>
                        Loading requests...
                    </p>
                </div>
                <style>
                    {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    `}
                </style>
            </div>
        );
    }

    if(error){
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 50%, #81c784 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '40px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{fontSize: '60px', marginBottom: '20px'}}>🚫</div>
                    <h2 style={{color: '#d32f2f', marginBottom: '10px'}}>Error Loading Requests</h2>
                    <p style={{color: '#666', margin: 0}}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 50%, #81c784 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '30px 0',
                marginBottom: '30px'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px'
                    }}>
                        <div>
                            <h1 style={{
                                margin: '0 0 10px 0',
                                fontSize: '36px',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                🐕 Available Requests
                            </h1>
                            <p style={{
                                margin: 0,
                                color: '#666',
                                fontSize: '18px'
                            }}>
                                Find the perfect dog-sitting opportunity
                            </p>
                        </div>
                        <div style={{
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            padding: '20px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            border: '2px solid rgba(76, 175, 80, 0.2)'
                        }}>
                            <div style={{fontSize: '24px', marginBottom: '5px'}}>💰</div>
                            <div style={{
                                fontSize: '28px',
                                fontWeight: 'bold',
                                color: '#2e7d32',
                                marginBottom: '5px'
                            }}>
                                {user.points}
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: '#666',
                                fontWeight: '500'
                            }}>
                                Your Points
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                    }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <label style={{
                                 color: '#2e7d32',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Filter:
                            </label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '2px solid #e8f5e9',
                                    backgroundColor: 'white',
                                    color: '#2e7d32',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="all">All Requests</option>
                                <option value="others">Available to Accept</option>
                                <option value="mine">My Requests</option>
                            </select>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <label style={{
                                color: '#2e7d32',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Sort by:
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '2px solid #e8f5e9',
                                    backgroundColor: 'white',
                                    color: '#2e7d32',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="date">Start Date</option>
                                <option value="points">Points (High to Low)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px 40px'
            }}>
                {sortedRequests.length === 0 ? (
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '60px 40px',
                        textAlign: 'center',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <div style={{fontSize: '80px', marginBottom: '20px'}}>🐕</div>
                        <h3 style={{
                            color: '#2e7d32',
                            marginBottom: '15px',
                            fontSize: '24px',
                            fontWeight: '600'
                        }}>
                            No requests found
                        </h3>
                        <p style={{
                            color: '#666',
                            margin: 0,
                            fontSize: '16px'
                        }}>
                            {filter === 'mine' 
                                ? "You haven't created any requests yet." 
                                : "There are no available requests at the moment."
                            }
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gap: '25px',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
                    }}>
                        {sortedRequests.map(request => {
                            const startDateTime = formatDateTime(request.startTime);
                            const endDateTime = formatDateTime(request.endTime);
                            const points = calculatePoints(request.startTime, request.endTime);
                            const duration = calculateDuration(request.startTime, request.endTime);
                            const isMyRequest = request.owner.id === user.id;

                            return (
                                <div key={request.id} style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '20px',
                                    padding: '30px',
                                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
                                }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        backgroundColor: isMyRequest ? 'rgba(33, 150, 243, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                                        color: isMyRequest ? '#1976d2' : '#2e7d32',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        border: `1px solid ${isMyRequest ? 'rgba(33, 150, 243, 0.2)' : 'rgba(76, 175, 80, 0.2)'}`
                                    }}>
                                        {isMyRequest ? '👤 Your Request' : '🌟 Available'}
                                    </div>

                                    <h3 style={{
                                        margin: '0 0 15px 0',
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        color: '#2e7d32',
                                        paddingRight: '100px'
                                    }}>
                                        {request.description}
                                    </h3>

                                    <div style={{
                                        backgroundColor: 'rgba(165, 214, 167, 0.1)',
                                        padding: '15px',
                                        borderRadius: '12px',
                                        marginBottom: '20px',
                                        border: '1px solid rgba(165, 214, 167, 0.2)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '8px'
                                        }}>
                                            <span style={{fontSize: '18px'}}>🐕</span>
                                            <span style={{
                                                fontWeight: '600',
                                                color: '#2e7d32',
                                                fontSize: '16px'
                                            }}>
                                                {request.petName}
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            marginLeft: '28px'
                                        }}>
                                            {request.petBreed} • {request.petAge} years old • {request.petSize}
                                            {request.petEnergyLevel && (
                                                <span style={{
                                                    marginLeft: '8px',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    fontSize: '11px',
                                                    fontWeight: '500',
                                                    backgroundColor: request.petEnergyLevel === 'high' ? 'rgba(255, 152, 0, 0.1)' : 
                                                                   request.petEnergyLevel === 'medium' ? 'rgba(255, 193, 7, 0.1)' : 
                                                                   'rgba(76, 175, 80, 0.1)',
                                                    color: request.petEnergyLevel === 'high' ? '#f57c00' : 
                                                          request.petEnergyLevel === 'medium' ? '#fbc02d' : 
                                                          '#388e3c'
                                                }}>
                                                    {request.petEnergyLevel.charAt(0).toUpperCase() + request.petEnergyLevel.slice(1)} Energy
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '15px',
                                        marginBottom: '25px'
                                    }}>
                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '5px'
                                            }}>
                                                <span style={{fontSize: '16px'}}>📍</span>
                                                <span style={{
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#2e7d32'
                                                }}>
                                                    Location
                                                </span>
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#666',
                                                marginLeft: '24px'
                                            }}>
                                                {request.location}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '5px'
                                            }}>
                                                <span style={{fontSize: '16px'}}>👤</span>
                                                <span style={{
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#2e7d32'
                                                }}>
                                                    Owner
                                                </span>
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#666',
                                                marginLeft: '24px'
                                            }}>
                                                {request.owner.name}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '5px'
                                            }}>
                                                <span style={{fontSize: '16px'}}>📅</span>
                                                <span style={{
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#2e7d32'
                                                }}>
                                                    Starts
                                                </span>
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#666',
                                                marginLeft: '24px'
                                            }}>
                                                {startDateTime.date} at {startDateTime.time}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '5px'
                                            }}>
                                                <span style={{fontSize: '16px'}}>🏁</span>
                                                <span style={{
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#2e7d32'
                                                }}>
                                                    Ends
                                                </span>
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#666',
                                                marginLeft: '24px'
                                            }}>
                                                {endDateTime.date} at {endDateTime.time}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '20px',
                                        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#666',
                                                marginBottom: '2px'
                                            }}>
                                                Duration: {duration}
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}>
                                                <span style={{fontSize: '16px'}}>💰</span>
                                                <span style={{
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    color: '#2e7d32'
                                                }}>
                                                    {points} points
                                                </span>
                                            </div>
                                        </div>

                                        {isMyRequest ? (
                                            <div style={{
                                                backgroundColor: 'rgba(158, 158, 158, 0.1)',
                                                color: '#666',
                                                padding: '12px 24px',
                                                borderRadius: '12px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                border: '1px solid rgba(158, 158, 158, 0.2)'
                                            }}>
                                                Your Request
                                            </div>
                                        ) : (
                                            <button
                                               onClick={() => acceptRequest(request.id)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                                    color: 'white',
                                                    padding: '12px 24px',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
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
                                                Accept Request 🐾
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RequestsPage;