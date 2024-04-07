import { Link, useLocation, useNavigate } from 'react-router-dom';
import './styles/header.css';
import Paths from '../../routes/Paths';
import { useUser } from '../../providers/user-provider/UserContext';
import { logout, refreshAccessToken } from '../../api/AuthenticationService';
import { BellDot } from 'lucide-react';
import { useEffect, useState } from 'react';
import { checkTokenValidity } from '@/utils/jwtUtils';
import { toast } from 'sonner';
import { getUserInformation } from '@/api/UserService';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

const Header = () => {
    const { isAuthenticated, hasNotifications, changeUserInformationToLoggedOut, changeUserInformationToLoggedIn, changeHasNotifications } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        changeUserInformationToLoggedOut();
        await logout(refreshToken || '');
        navigate(Paths.HOME);
    }

    useEffect(() => {
        const tryFetchingUserInformation = async () => {
            if (isAuthenticated) {
                const accessToken = localStorage.getItem("accessToken");
                if (!checkTokenValidity(accessToken || "")) {
                    const result = await refreshAccessToken();
                    if (!result.success) {
                        toast.error("Session has expired. Login again!", {
                            position: "top-center",
                        });

                        changeUserInformationToLoggedOut();
                        navigate(Paths.LOGIN);
                        return;
                    }

                    changeUserInformationToLoggedIn(
                    result.data.accessToken,
                    result.data.refreshToken
                    );
                }

                const response = await getUserInformation();
                if (response.ok) {
                    const data = await response.json();
                    changeHasNotifications(data.hasUnreadNotifications);
                }
            }
        }

        tryFetchingUserInformation();
    }, [location?.pathname]);
   
    return (
        <header className='header-container'>
            <section className='left-side-header'>
                <Link to={Paths.HOME} className='link'>Home</Link>
                { isAuthenticated && (
                    <Link to={Paths.TRIPS} className='link'>Trips</Link>
                )}
            </section>
            <section className='right-side-header'>
                { !isAuthenticated ? (
                    <>
                        <Link to={Paths.LOGIN} className='link'>Log in</Link>
                        <Link to={Paths.REGISTER} className='link'>Sign up</Link>
                    </>
                ) : (
                    <div className='flex items-center'>
                      <Link to={Paths.NOTIFICATIONS} className='link mr-3 notification'>
                        <BellDot className='w-5 h-5'/>
                        <span className={hasNotifications ? "badge" : ""} />
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <img src="/avatar-placeholder.png" width={40} height={40} alt="avatar" className="header-avatar" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>User Information</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link to={Paths.HOME} className='link' onClick={handleLogout}>Logout</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                )}
            </section>
        </header>
    )
}

export default Header;