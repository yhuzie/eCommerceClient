import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

function Logout() {
    const { unsetUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        unsetUser();
        navigate('/');
    };

    return null; // No UI for logout, just performs action
}

export default Logout;
