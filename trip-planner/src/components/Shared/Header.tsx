import { Link } from 'react-router-dom';
import './styles/header.css';
import Paths from '../../routes/Paths';
import React from 'react';

const Header = () => {


    return (
        <header className='header-container'>
            <section className='left-side-header'>
                <Link to={Paths.HOME} className='link'>Home</Link>
            </section>
            <section className='right-side-header'>
                <Link to={Paths.LOGIN} className='link'>Log in</Link>
                <Link to={Paths.REGISTER} className='link'>Sign up</Link>
            </section>
        </header>
    )
}

export default Header;