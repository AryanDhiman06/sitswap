import {useNavigate} from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function LoginPage({setUser}){
    const navigate = useNavigate();

    const handleLogin = (user) => {
        setUser(user);
        navigate('/dashboard');
    };

    return <LoginForm onLogin={handleLogin}/>;
}

export default LoginPage;