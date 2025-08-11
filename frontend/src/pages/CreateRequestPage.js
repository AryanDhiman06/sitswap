import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { apiCall } from '../utils/apiHelper';

function CreateRequestPage({user}) {
    const [pets, setPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState('');
    const [useExistingPet, setUseExistingPet] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        description: '',
        location: '',
        startTime: '',
        endTime: '',
        petName: '',
        petBreed: '',
        petAge: '',
        petSize: '',
        petDescription: '',
        petSpecialNeeds: '',
        petEnergyLevel: 'medium'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserPets();
    }, []);

    const fetchUserPets = async () => {
        try {
            const data = await apiCall(`/users/${user.id}/pets`);
            setPets(data);
        } catch (err){
            console.error('Failed to load pets:', err);
        }
    };

    const handlePetSelection = (e) => {
        const petId = e.target.value;
        setSelectedPetId(petId);

        if(petId && petId !== ''){
            const selectedPet = pets.find(pet => pet.id.toString() === petId);
            if(selectedPet){
                setFormData(prev => ({
                    ...prev,
                    petName: selectedPet.name,
                    petBreed: selectedPet.breed,
                    petAge: selectedPet.age.toString(),
                    petSize: selectedPet.size,
                    petDescription: selectedPet.description || '',
                    petSpecialNeeds: selectedPet.specialNeeds || '',
                    petEnergyLevel: selectedPet.energyLevel || 'medium'
                }));
                setImagePreview(selectedPet.imageUrl ? `http:localhost:8080${selectedPet.imageUrl}` : null);
            }
        }else{
            setFormData(prev => ({
                ...prev,
                petName: '',
            petBreed: '',
            petAge: '',
            petSize: '',
            petDescription: '',
            petSpecialNeeds: '',
            petEnergyLevel: 'medium'
            }));
            setImagePreview(null);
        }
    };

    const handleUseExistingPetChange = (e) => {
        const checked = e.target.checked;
        setUseExistingPet(checked);

        if(!checked){
            setSelectedPetId('');
            setImagePreview(null);
            setFormData(prev => ({
                ...prev,
                description: '',
                petName: '',
                petBreed: '',
                petAge: '',
                petSize: '',
                petDescription: '',
                petSpecialNeeds: '',
                petEnergyLevel: 'medium'
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file){
            if(!file.type.startsWith('image/')){
                setError('Please select a valid image file');
                return;
            }
            if(file.size > 5 * 1024 * 1024){
                setError('Image size must be less than 5MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculatePoints = () => {
        if(formData.startTime && formData.endTime) {
            const start = new Date(formData.startTime);
            const end = new Date(formData.endTime);
            const hours = Math.ceil((end - start) / (1000 * 60 * 60));
            return hours * 10;
        }
        return 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('');
        setLoading(true);

        const start = new Date(formData.startTime);
        const end = new Date(formData.endTime);
        const now = new Date();

        if(start <= now) {
            setError('Start time must be in the future');
            setLoading(false);
            return;
        }

        if(end <= start){
            setError('End time must be after start time');
            setLoading(false);
            return;
        }

        const pointsCost = calculatePoints();
        if(user.points < pointsCost){
            setError(`You need ${pointsCost} points to create this request, but you only have ${user.points} points`);
            setLoading(false);
            return;
        }

        try {
            const requestData = {
                description: useExistingPet ? (formData.description || `Dog-sitting request for ${formData.petName}`) : formData.description,
                location: formData.location,
                startTime: formData.startTime,
                endTime: formData.endTime,
                petName: formData.petName,
                petBreed: formData.petBreed,
                petAge: parseInt(formData.petAge),
                petSize: formData.petSize,
                petDescription: formData.petDescription,
                petSpecialNeeds: formData.petSpecialNeeds,
                petEnergyLevel: formData.petEnergyLevel,
                pet: selectedPetId ? { id: selectedPetId } : null
            };

            const response = await apiCall('/dogsits', {
                method: 'POST',
                body: JSON.stringify(requestData)
            });

            if(imageFile && response.id){
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);

                await apiCall(`/dogsits/${response.id}/image`, {
                    method: 'POST',
                    body: imageFormData,
                    headers: {}
                });
            }
            alert('Request completed successfully!');
            navigate('/dashboard');
        }catch (err) {
            setError('Error creating request: ' + err.message);
        }finally {
            setLoading(false);
        }
    };

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
                
                .form-section {
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }
                
                .form-section:hover {
                    transform: translateY(-2px);
                    border-color: rgba(76, 175, 80, 0.2);
                }
                
                .input-field {
                    transition: all 0.3s ease;
                }
                
                .input-field:focus {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.2);
                    border-color: #4caf50 !important;
                }
                
                .submit-btn {
                    transition: all 0.3s ease;
                    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
                }
                
                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(76, 175, 80, 0.4);
                    background: linear-gradient(135deg, #45a049 0%, #4caf50 100%);
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>

            <div style={{maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1}}>
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
                        🐕
                    </div>
                    <h1 style={{
                        margin: '0 0 15px 0',
                        fontSize: '36px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Create Dog-Sitting Request
                    </h1>
                    <p style={{
                        margin: '0 0 20px 0',
                        color: '#666',
                        fontSize: '18px'
                    }}>
                        Find the perfect sitter for your furry friend
                    </p>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        padding: '12px 20px',
                        borderRadius: '15px',
                        border: '2px solid rgba(76, 175, 80, 0.2)'
                    }}>
                        <span style={{fontSize: '20px'}}>💰</span>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#2e7d32'
                        }}>
                            Your Balance: {user.points} points
                        </span>
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
                        <span style={{fondSize: '24px'}}>⚠️</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                    <div className="form-section" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '30px',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            marginBottom: '25px'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px'
                            }}>
                                🎯
                            </div>
                            <h3 style={{
                                margin: 0,
                                fontSize: '24px',
                                fontWeight: '600',
                                color: '#2e7d32'
                            }}>
                                Choose Pet Option
                            </h3>
                        </div>

                        <div style={{marginBottom: '20px'}}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '15px 20px',
                                backgroundColor: useExistingPet ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0, 0, 0, 0.02)',
                                borderRadius: '12px',
                                border: `2px solid ${useExistingPet ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}>
                                <input 
                                    type="checkbox"
                                    checked={useExistingPet}
                                    onChange={handleUseExistingPetChange}
                                    style={{
                                        marginRight: '12px',
                                        transform: 'scale(1.3)',
                                        accentColor: '#4caf50'
                                    }}
                                />
                                <span style={{color: '#2e7d32'}}>Use existing pet profile</span>
                            </label>

                            {useExistingPet && (
                                <div style={{marginTop: '15px'}}>
                                    <select
                                        value={selectedPetId}
                                        onChange={handlePetSelection}
                                        required={useExistingPet}
                                        className="input-field"
                                        style={{
                                            width: '100%',
                                            padding: '15px 20px',
                                            borderRadius: '12px',
                                            border: '2px solid #e8f5e9',
                                            fontSize: '16px',
                                            backgroundColor: 'white',
                                            color: '#2e7d32',
                                            fontWeight: '500',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="">Select a pet...</option>
                                        {pets.map(pet => (
                                            <option key={pet.id} value={pet.id}>
                                                {pet.name} - {pet.breed}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-section" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '30px',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            marginBottom: '25px'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px'
                            }}>
                                📍
                            </div>
                            <h3 style={{
                                margin: 0,
                                fontSize: '24px',
                                fontWeight: '600',
                                color: '#2e7d32'
                            }}>
                                Request Details
                            </h3>
                        </div>

                        <div style={{marginBottom: '20px'}}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#2e7d32'
                            }}>
                                Location *
                            </label>
                            <input 
                                type='text'
                                name='location'
                                required
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Where are you located?"
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

                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#2e7d32'
                                }}>
                                    Start Date & Time *
                                </label>
                                <input 
                                    type="datetime-local"
                                    name='startTime'
                                    required
                                    value={formData.startTime}
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
                                    End Date & Time *
                                </label>
                                <input 
                                    type="datetime-local"
                                    name='endTime'
                                    required
                                    value={formData.endTime}
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

                        {formData.startTime && formData.endTime && (
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.1) 100%)',
                                border: '2px solid rgba(76, 175, 80, 0.2)',
                                borderRadius: '15px',
                                padding: '20px',
                                textAlign: 'center'
                            }}>
                                <div style={{fontSize: '24px', marginBottom: '8px'}}>💰</div>
                                <p style={{
                                    margin: 0,
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    color: '#2e7d32'
                                }}>
                                    Estimated Cost: {calculatePoints()} points
                                </p>
                            </div>
                        )}
                    </div>

                    {!useExistingPet && (
                        <div className="form-section" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            padding: '30px',
                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginBottom: '25px'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px'
                                }}>
                                    🐕
                                </div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '24px',
                                    fontWeight: '600',
                                    color: '#2e7d32'
                                }}>
                                    Pet Information
                                </h3>
                            </div>

                            <div style={{marginBottom: '20px'}}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
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
                                        padding: '15px',
                                        border: '2px dashed #4caf50',
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                                        fontSize: '16px',
                                        cursor: 'pointer'
                                    }}
                                />
                                {imagePreview && (
                                    <div style={{marginTop: '15px', textAlign: 'center'}}>
                                        <img
                                            src={imagePreview}
                                            alt="Pet preview"
                                            style={{
                                                width: '200px',
                                                height: '200px',
                                                objectFit: 'cover',
                                                borderRadius: '15px',
                                                border: '3px solid #4caf50',
                                                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
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
                                        name='petName'
                                        required
                                        value={formData.petName}
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
                                        name='petBreed'
                                        required
                                        value={formData.petBreed}
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

                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px'}}>
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
                                        name='petAge'
                                        required
                                        min="0"
                                        max="30"
                                        value={formData.petAge}
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
                                        name='petSize'
                                        required
                                        value={formData.petSize}
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
                                        name="petEnergyLevel"
                                        value={formData.petEnergyLevel}
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

                            <div style={{marginBottom: '20px'}}>
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
                                    name='petDescription'
                                    value={formData.petDescription}
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

                            <div style={{marginBottom: '20px'}}>
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
                                    name='petSpecialNeeds'
                                    value={formData.petSpecialNeeds}
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

                            <div style={{marginBottom: '20px'}}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#2e7d32'
                                }}>
                                    Request Description *
                                </label>
                                <textarea
                                    name='description'
                                    required
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your dog-sitting needs and any specific requirements..."
                                    className="input-field"
                                    style={{
                                        width: '100%',
                                        padding: '15px 20px',
                                        borderRadius: '12px',
                                        border: '2px solid #e8f5e9',
                                        fontSize: '16px',
                                        backgroundColor: 'white',
                                        outline: 'none',
                                        minHeight: '120px',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '30px',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        textAlign: 'center'
                    }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                padding: '20px 40px',
                                backgroundColor: loading ? '#cccccc' : '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '15px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                boxShadow: loading ? 'none' : '0 10px 25px rgba(76, 175, 80, 0.3)',
                                opacity: loading ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                margin: '0 auto'
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        border: '3px solid rgba(255,255,255,0.3)',
                                        borderTop: '3px solid white',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    Creating Request...
                                </>
                            ) : (
                                <>
                                    🐾 Create Request
                                </>
                            )}
                        </button>

                        {!loading && (
                            <p style={{
                                margin: '15px 0 0 0',
                                color: '#666',
                                fontSize: '14px'
                            }}>
                                Your request will be visible to all sitters immediately
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRequestPage;