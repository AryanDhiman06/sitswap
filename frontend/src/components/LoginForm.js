import React, {useState} from 'react';

function LoginForm({onLogin}){
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: ''
    });
    const [isSignup, setIsSignup] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const endpoint = isSignup ? '/auth/signup' : '/auth/login';
        const requestBody = isSignup
            ? {
                name: formData.name,
                email: formData.email,
                username: formData.username,
                password: formData.password
            }
            : {
                username: formData.username,
                password: formData.password
            };

        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            const credentials = btoa(`${formData.username}:${formData.password}`);
            localStorage.setItem('authCredentials', credentials);
            localStorage.setItem('currentUser', JSON.stringify(data));

            onLogin(data);
        } catch (err) {
            setError('Error creating account: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            username: '',
            password: ''
        });
        setError('');
    };
            

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                animation: 'float 6s ease-in-out infinite'
            }}></div>
            <div style={{
                position: 'absolute',
                top: '70%',
                right: '15%',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                animation: 'float 8s ease-in-out infinite reverse'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '20%',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                animation: 'float 7s ease-in-out infinite'
            }}></div>

            <style>
                {`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                .form-container {
                    transition: all 0.3s ease;
                }
                
                .form-container:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }
                
                .input-field {
                    transition: all 0.3s ease;
                }
                
                .input-field:focus {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.2);
                }
                
                .submit-btn {
                    transition: all 0.3s ease;
                    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
                }
                
                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(46, 204, 113, 0.3);
                    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
                }
                
                .toggle-btn {
                    transition: all 0.3s ease;
                }
                
                .toggle-btn:hover {
                    color: #2ecc71;
                    transform: scale(1.05);
                }
                `}
            </style>

            <div className="form-container" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '50px 40px',
                width: '100%',
                maxWidth: '450px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                position: 'relative'
            }}>
                <div style={{textAlign: 'center', marginBottom: '40px'}}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                        margin: '0 auto 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px'
                    }}>
                        🐕
                    </div>
                    <h1 style={{
                        margin: '0 0 10px 0',
                        fontSize: '32px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        SitSwap
                    </h1>
                    <p style={{
                        margin: '0',
                        color: '#7f8c8d',
                        fontSize: '16px',
                        fontWeight: '400'
                    }}>
                        {isSignup ? 'Join our community of pet lovers' : 'Welcome back to SitSwap'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        color: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        padding: '15px',
                        borderRadius: '12px',
                        marginBottom: '25px',
                        border: '1px solid rgba(231, 76, 60, 0.2)',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {isSignup && (
                        <>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    color: '#2c3e50',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    Full Name
                                </label>
                                <input 
                                    className="input-field"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        borderRadius: '12px',
                                        border: '2px solid #ecf0f1',
                                        fontSize: '16px',
                                        backgroundColor: '#fff',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    color: '#2c3e50',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    Email Address
                                </label>
                                <input 
                                    className="input-field"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        borderRadius: '12px',
                                        border: '2px solid #ecf0f1',
                                        fontSize: '16px',
                                        backgroundColor: '#fff',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#2c3e50',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            Username
                        </label>
                        <input
                            className="input-field"
                            type="text"
                            name="username"
                            placeholder="Choose a username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '16px 20px',
                                borderRadius: '12px',
                                border: '2px solid #ecf0f1',
                                fontSize: '16px',
                                backgroundColor: '#fff',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#2c3e50',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            Password
                        </label>
                        <input
                            className="input-field"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '16px 20px',
                                borderRadius: '12px',
                                border: '2px solid #ecf0f1',
                                fontSize: '16px',
                                backgroundColor: '#fff',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        className="submit-btn"
                        type='submit'
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '18px',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            marginTop: '10px'
                        }}
                    >
                        {loading ? (
                            <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTop: '2px solid white',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                {isSignup ? 'Creating Account...' : 'Signing In...'}
                            </span>
                        ) : (
                            isSignup ? 'Create Account' : 'Sign In'
                        )}
                    </button>
                </form>

                <div style={{textAlign: 'center', marginTop: '30px'}}>
                    <button 
                        className="toggle-btn"
                        type="button"
                        onClick={() => {
                            setIsSignup(!isSignup);
                            resetForm();
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#7f8c8d',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        {isSignup ? 'Already have an account? Sign in here' : 'Need an account? Create one here'}
                    </button>
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
        </div>

        /*<div style={{maxWidth: '400px', margin: '0 auto', padding: '20px'}}>
            <h2>{isSignup ? 'Create Account' : 'Login' }</h2>

            {error && (
                <div style={{
                    color: 'red', 
                    backgroundColor: '#ffe6e6', 
                    padding: '10px', 
                    borderRadius: '5px',
                    marginBottom: '15px'
                }}>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {isSignup && (
                    <>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc'
                            }}
                        />
                        <input 
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '15px',
                                borderRadius: '5px',
                                border: '1px solid #ccc'
                            }}
                        />
                    </>
                )}

                <input 
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '15px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />

                <input 
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '15px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />

                <button
                    type='submit'
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: loading ? '#cccccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {loading ? (isSignup ? 'Creating Account...' : 'Logging in...') : (isSignup ? 'Create Account' : 'Login')}
                </button>
            </form>

            <div style={{textAlign: 'center', marginTop: '20px'}}>
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignup(!isSignup);
                            resetForm();
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#4CAF50',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        {isSignup ? 'Already have an account? Login here' : 'Need an account? Sign up here'}
                    </button>
            </div>
        </div>
        */
    );
    
}

export default LoginForm;