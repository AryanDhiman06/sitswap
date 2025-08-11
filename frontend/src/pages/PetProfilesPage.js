import React, {useState, useEffect} from 'react';
import {apiCall} from '../utils/apiHelper';

function PetProfilesPage({user}) {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingPet, setEditingPet] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        breed: '',
        age: '',
        size: '',
        description: '',
        specialNeeds: '',
        energyLevel: 'medium'
    })

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const data = await apiCall(`/users/${user.id}/pets`);
            setPets(data);
        } catch (err) {
            setError('Failed to load pet profiles: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev, 
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }

            setImageFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('');

        try{
            let petResponse;

            if(editingPet){
                petResponse = await apiCall(`/pets/${editingPet.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
            }else{
                petResponse = await apiCall(`/users/${user.id}/pets`, {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
            }

            if(imageFile && petResponse.id){
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);

                await apiCall(`/pets/${petResponse.id}/image`, {
                    method: 'POST',
                    body: imageFormData,
                    headers: {}
                });
            }

            await fetchPets();
            resetForm();
            alert(editingPet ? 'Pet profile updated successfully' : 'Pet profile created successfully');
        }catch (err) {
            setError('Error saving pet profile: ' + err.message);
        }
    };

    const handleEdit = (pet) => {
        setEditingPet(pet);
        setFormData({
            name: pet.name,
            breed: pet.breed,
            age: pet.age.toString(),
            size: pet.size,
            description: pet.description || '',
            specialNeeds: pet.specialNeeds || '',
            energyLevel: pet.energyLevel || 'medium'
        });
        setImagePreview(pet.imageUrl ? `http://localhost:8080${pet.imageUrl}` : null);
        setImageFile(null);
        setShowForm(true);
        // Smooth scroll to form
        setTimeout(() => {
            document.querySelector('.pet-form')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleDelete = async (petId) => {
        if(window.confirm('Are you sure you want to delete this pet profile?')) {
            try {
                await apiCall(`/pets/${petId}`, {
                    method: 'DELETE'
                });
                await fetchPets();
                alert('Pet profile deleted successfully');
            } catch (err) {
                setError('Error deleting pet profile: ' + err.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            breed: '',
            age: '',
            size: '',
            description: '',
            specialNeeds: '',
            energyLevel: 'medium'
        });
        setEditingPet(null);
        setShowForm(false);
        setImageFile(null);
        setImagePreview(null);
    };

    if(loading){
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
                    padding: '40px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
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
                        Loading your pets...
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
                top: '15%',
                left: '10%',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                animation: 'float 8s ease-in-out infinite'
            }}></div>
            <div style={{
                position: 'absolute',
                top: '60%',
                right: '15%',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                animation: 'float 6s ease-in-out infinite reverse'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '20%',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                animation: 'float 10s ease-in-out infinite'
            }}></div>

            <style>
                {`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(10deg); }
                }
                
                .card-hover {
                    transition: all 0.3s ease;
                }
                
                .card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                }
                
                .input-field {
                    transition: all 0.3s ease;
                }
                
                .input-field:focus {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.2);
                    border-color: #4caf50 !important;
                }
                
                .btn-primary {
                    transition: all 0.3s ease;
                    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
                }
                
                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(76, 175, 80, 0.4);
                    background: linear-gradient(135deg, #45a049 0%, #4caf50 100%);
                }
                
                .btn-secondary {
                    transition: all 0.3s ease;
                    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
                }
                
                .btn-secondary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(33, 150, 243, 0.3);
                }
                
                .btn-danger {
                    transition: all 0.3s ease;
                    background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
                }
                
                .btn-danger:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(244, 67, 54, 0.3);
                }
                `}
            </style>

            <div style={{maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1}}>
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
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                        margin: '0 auto 25px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px',
                        boxShadow: '0 10px 25px rgba(76, 175, 80, 0.3)'
                    }}>
                        🐾
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <div style={{textAlign: 'left'}}>
                            <h1 style={{
                                margin: '0 0 15px 0',
                                fontSize: '36px',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                My Pet Profiles
                            </h1>
                            <p style={{
                                margin: 0,
                                color: '#666',
                                fontSize: '18px'
                            }}>
                                Manage your furry family members
                            </p>
                        </div>

                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-primary"
                            style={{
                                padding: '15px 30px',
                                border: 'none',
                                borderRadius: '15px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 10px 25px rgba(76, 175, 80, 0.3)'
                            }}
                        >
                            <span style={{fontSize: '20px'}}>➕</span>
                            Add New Pet
                        </button>
                    </div>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        border: '2px solid rgba(244, 67, 54, 0.2)',
                        borderRadius: '15px',
                        padding: '20px',
                        marginBottom: '25px',
                        color: '#d32f2f',
                        fontSize: '16px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <span style={{fontSize: '24px'}}>⚠️</span>
                        {error}
                    </div>
                )}

                {showForm && (
                    <div className="pet-form card-hover" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '40px',
                        marginBottom: '30px',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
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
                                🐕
                            </div>
                            <h3 style={{
                                margin: 0,
                                fontSize: '28px',
                                fontWeight: '600',
                                color: '#2e7d32'
                            }}>
                                {editingPet ? 'Edit Pet Profile' : 'Add New Pet Profile'}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '10px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#2e7d32'
                                }}>
                                    Pet Photo
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{
                                        width: '100%',
                                        padding: '20px',
                                        border: '3px dashed #4caf50',
                                        borderRadius: '15px',
                                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        textAlign: 'center'
                                    }}
                                />
                                {imagePreview && (
                                    <div style={{marginTop: '20px', textAlign: 'center'}}>
                                        <img 
                                            src={imagePreview}
                                            alt="Pet preview"
                                            style={{
                                                width: '200px',
                                                height: '200px',
                                                objectFit: 'cover',
                                                borderRadius: '20px',
                                                border: '4px solid #4caf50',
                                                boxShadow: '0 10px 30px rgba(76, 175, 80, 0.3)'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#2e7d32'
                                    }}>
                                        Pet Name *
                                    </label>
                                    <input 
                                        type='text'
                                        name='name'
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-field"
                                        style={{
                                            width: '100%',
                                            padding: '15px 20px',
                                            borderRadius: '12px',
                                            border: '2px solid #e8f5e9',
                                            fontSize: '16px',
                                            backgroundColor: 'white',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#2e7d32'
                                    }}>
                                        Breed *
                                    </label>
                                    <input
                                        type='text'
                                        name='breed'
                                        required
                                        value={formData.breed}
                                        onChange={handleChange}
                                        className="input-field"
                                        style={{
                                            width: '100%',
                                            padding: '15px 20px',
                                            borderRadius: '12px',
                                            border: '2px solid #e8f5e9',
                                            fontSize: '16px',
                                            backgroundColor: 'white',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'}}>
                                <div>
                                    <label style={{
                                         display: 'block',
                                        marginBottom: '8px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#2e7d32'
                                    }}>
                                        Age *
                                    </label>
                                    <input
                                        type='number'
                                        name='age'
                                        required
                                        min="0"
                                        max="30"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="input-field"
                                        style={{
                                            width: '100%',
                                            padding: '15px 20px',
                                            borderRadius: '12px',
                                            border: '2px solid #e8f5e9',
                                            fontSize: '16px',
                                            backgroundColor: 'white',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#2e7d32'
                                    }}>
                                        Size *
                                    </label>
                                    <select
                                        name='size'
                                        required
                                        value={formData.size}
                                        onChange={handleChange}
                                        className="input-field"
                                        style={{
                                            width: '100%',
                                            padding: '15px 20px',
                                            borderRadius: '12px',
                                            border: '2px solid #e8f5e9',
                                            fontSize: '16px',
                                            backgroundColor: 'white',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <option value="">Select Size</option>
                                        <option value="small">Small (under 25 lbs)</option>
                                        <option value="medium">Medium (25-60 lbs)</option>
                                        <option value="large">Large (60-90 lbs)</option>
                                        <option value="extra-large">Extra Large (over 90 lbs)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#2e7d32'
                                    }}>
                                        Energy Level
                                    </label>
                                    <select
                                        name="energyLevel"
                                        value={formData.energyLevel}
                                        onChange={handleChange}
                                        className="input-field"
                                        style={{
                                            width: '100%',
                                            padding: '15px 20px',
                                            borderRadius: '12px',
                                            border: '2px solid #e8f5e9',
                                            fontSize: '16px',
                                            backgroundColor: 'white',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#2e7d32'
                                }}>
                                    Pet Description
                                </label>
                                <textarea
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Tell us about your pet's personality, favorite activities, etc."
                                    className="input-field"
                                    style={{
                                        width: '100%',
                                        padding: '15px 20px',
                                        borderRadius: '12px',
                                        border: '2px solid #e8f5e9',
                                        fontSize: '16px',
                                        backgroundColor: 'white',
                                        outline: 'none',
                                        minHeight: '100px',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#2e7d32'
                                }}>
                                    Special Needs/Requirements
                                </label>
                                <textarea 
                                    name="specialNeeds"
                                    value={formData.specialNeeds}
                                    onChange={handleChange}
                                    placeholder="Any medical conditions, dietary restrictions, behavioral notes, etc."
                                    className="input-field"
                                    style={{
                                        width: '100%',
                                        padding: '15px 20px',
                                        borderRadius: '12px',
                                        border: '2px solid #e8f5e9',
                                        fontSize: '16px',
                                        backgroundColor: 'white',
                                        outline: 'none',
                                        minHeight: '80px',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '15px',
                                justifyContent: 'center',
                                paddingTop: '20px'
                            }}>
                                <button
                                    type='submit'
                                    className="btn-primary"
                                    style={{
                                        padding: '15px 30px',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)'
                                    }}
                                >
                                    <span style={{fontSize: '18px'}}>💾</span>
                                    {editingPet ? 'Update Pet' : 'Add Pet'}
                                </button>
                                <button
                                    type='button'
                                    onClick={resetForm}
                                    style={{
                                        padding: '15px 30px',
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.backgroundColor = '#5a6268';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.backgroundColor = '#6c757d';
                                    }}
                                >
                                    <span style={{fontSize: '18px'}}>❌</span>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div>
                    {pets.length === 0 ? (
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
                                No pet profiles yet
                            </h3>
                            <p style={{
                                color: '#666',
                                margin: '0 0 25px 0',
                                fontSize: '16px'
                            }}>
                                Add your first pet profile to get started with creating sitting requests!
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn-primary"
                                style={{
                                    padding: '15px 30px',
                                    border: 'none',
                                    borderRadius: '15px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    boxShadow: '0 10px 25px rgba(76, 175, 80, 0.3)'
                                }}
                            >
                                <span style={{fontSize: '20px'}}>➕</span>
                                Add Your First Pet
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                            gap: '25px'
                        }}>
                            {pets.map(pet => (
                                <div key={pet.id} className="card-hover" style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '20px',
                                    padding: '30px',
                                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    position: 'relative'
                                }}>
                                    {pet.imageUrl && (
                                        <div style={{
                                            textAlign: 'center',
                                            marginBottom: '20px'
                                        }}>
                                            <img
                                                src={`http://localhost:8080${pet.imageUrl}`}
                                                alt={pet.name}
                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    borderRadius: '20px',
                                                    border: '4px solid #4caf50',
                                                    boxShadow: '0 10px 30px rgba(76, 175, 80, 0.3)'
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div style={{
                                        textAlign: 'center',
                                        marginBottom: '25px'
                                    }}>
                                        <h3 style={{
                                            margin: '0 0 10px 0',
                                            fontSize: '28px',
                                            fontWeight: '600',
                                            color: '#2e7d32'
                                        }}>
                                            {pet.name}
                                        </h3>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '15px',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{
                                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                color: '#2e7d32',
                                                padding: '6px 12px',
                                                borderRadius: '15px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                border: '1px solid rgba(76, 175, 80, 0.2)'
                                            }}>
                                                {pet.breed}
                                            </span>
                                            <span style={{
                                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                color: '#1976d2',
                                                padding: '6px 12px',
                                                borderRadius: '15px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                border: '1px solid rgba(33, 150, 243, 0.2)'
                                            }}>
                                                {pet.age} years old
                                            </span>
                                            <span style={{
                                                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                                color: '#f57c00',
                                                padding: '6px 12px',
                                                borderRadius: '15px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                border: '1px solid rgba(255, 152, 0, 0.2)',
                                                textTransform: 'capitalize'
                                            }}>
                                                {pet.size}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{
                                        backgroundColor: 'rgba(165, 214, 167, 0.1)',
                                        padding: '15px',
                                        borderRadius: '12px',
                                        marginBottom: '20px',
                                        border: '1px solid rgba(165, 214, 167, 0.2)',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            marginBottom: '5px'
                                        }}>
                                            <span style={{fontSize: '18px'}}>⚡</span>
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: '#2e7d32'
                                            }}>
                                                Energy Level
                                            </span>
                                        </div>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '15px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            backgroundColor: pet.energyLevel === 'high' ? 'rgba(244, 67, 54, 0.1)' : 
                                                           pet.energyLevel === 'medium' ? 'rgba(255, 193, 7, 0.1)' : 
                                                           'rgba(76, 175, 80, 0.1)',
                                            color: pet.energyLevel === 'high' ? '#d32f2f' : 
                                                  pet.energyLevel === 'medium' ? '#f57c00' : 
                                                  '#388e3c',
                                            border: `1px solid ${pet.energyLevel === 'high' ? 'rgba(244, 67, 54, 0.2)' : 
                                                                pet.energyLevel === 'medium' ? 'rgba(255, 193, 7, 0.2)' : 
                                                                'rgba(76, 175, 80, 0.2)'}`
                                        }}>
                                            {pet.energyLevel ? pet.energyLevel.charAt(0).toUpperCase() + pet.energyLevel.slice(1) : "Medium"}
                                        </span>
                                    </div>

                                    {pet.description && (
                                        <div style={{marginBottom: '20px'}}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '10px'
                                            }}>
                                                <span style={{fontSize: '18px'}}>📝</span>
                                                <strong style={{color: '#2e7d32', fontSize: '16px'}}>Description</strong>
                                            </div>
                                            <p style={{
                                                margin: 0,
                                                color: '#555',
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                paddingLeft: '26px'
                                            }}>
                                                {pet.description}
                                            </p>
                                        </div>
                                    )}

                                    {pet.specialNeeds && (
                                        <div style={{marginBottom: '25px'}}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '10px'
                                            }}>
                                                <span style={{fontSize: '18px'}}>🏥</span>
                                                <strong style={{color: '#2e7d32', fontSize: '16px'}}>Special Needs</strong>
                                            </div>
                                            <p style={{
                                                margin: 0,
                                                color: '#555',
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                paddingLeft: '26px'
                                            }}>
                                                {pet.specialNeeds}
                                            </p>
                                        </div>
                                    )}

                                    <div style={{
                                        display: 'flex',
                                        gap: '12px',
                                        justifyContent: 'center',
                                        paddingTop: '20px',
                                        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <button
                                            onClick={() => handleEdit(pet)}
                                            className="btn-secondary"
                                            style={{
                                                padding: '12px 20px',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)'
                                            }}
                                        >
                                            <span style={{fontSize: '16px'}}>✏️</span>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pet.id)}
                                            className="btn-danger"
                                            style={{
                                                padding: '12px 20px',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)'
                                            }}
                                        >
                                            <span style={{fontSize: '16px'}}>🗑️</span>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PetProfilesPage;