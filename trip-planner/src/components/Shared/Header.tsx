import { Link, useNavigate } from 'react-router-dom';
import './styles/header.css';
import Paths from '../../routes/Paths';
import { useUser } from '../../providers/user-provider/UserContext';
import { logout } from '../../api/AuthenticationService';

const Header = () => {
    const { isAuthenticated, changeUserInformationToLoggedOut } = useUser();
    console.log(isAuthenticated);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        changeUserInformationToLoggedOut();
        await logout(refreshToken || '');
        navigate(Paths.HOME);
    }
   
    return (
        <header className='header-container'>
            <section className='left-side-header'>
                <Link to={Paths.HOME} className='link'>Home</Link>
            </section>
            <section className='right-side-header'>
                { !isAuthenticated ? (
                    <>
                        <Link to={Paths.LOGIN} className='link'>Log in</Link>
                        <Link to={Paths.REGISTER} className='link'>Sign up</Link>
                    </>
                ) : (
                    <Link to={Paths.HOME} className='link' onClick={handleLogout}>Logout</Link>
                )}
            </section>
        </header>
    )
}

export default Header;