import { Link } from 'react-router-dom';
import './styles/header.css';
import Paths from '../../routes/Paths';

const Header = () => {


    return (
        <header className='header-container'>
            <section className='left-side-header'>
                <Link to={Paths.HOME}>Home</Link>
            </section>
            <section className='right-side-header'>
                <Link to={Paths.LOGIN}>Log in</Link>
                <Link to={Paths.REGISTER}>Sign up</Link>
            </section>
        </header>
    )
}

export default Header;