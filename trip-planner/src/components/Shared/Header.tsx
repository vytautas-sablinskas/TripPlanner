import { Link, useLocation, useNavigate } from "react-router-dom";
import "./styles/header.css";
import Paths from "../../routes/Paths";
import { useUser } from "../../providers/user-provider/UserContext";
import { logout, refreshAccessToken } from "../../api/AuthenticationService";
import { BellDot, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { toast } from "sonner";
import { getUserInformation } from "@/api/UserService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Logo from "../../../public/logo.svg";

const Header = () => {
  const {
    isAuthenticated,
    hasNotifications,
    changeUserInformationToLoggedOut,
    changeUserInformationToLoggedIn,
    changeHasNotifications,
  } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [photo, setPhoto] = useState<any>("/avatar-placeholder.png");

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    changeUserInformationToLoggedOut();
    await logout(refreshToken || "");
    navigate(Paths.HOME);
  };

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
          setPhoto(data.photo);
        }
      }
    };

    tryFetchingUserInformation();
  }, [location?.pathname]);

  return (
    <header className="header-container">
      <div className="flex justify-center items-end">
        <Link to={Paths.HOME}>
          <img src="/logo.png" alt="Logo" className="h-[80px]" />
        </Link>
      </div>
      <section className="right-side-header">
        {!isAuthenticated ? (
          <>
            <Link to={Paths.LOGIN} className="link">
              Log in
            </Link>
            <Link to={Paths.REGISTER} className="link">
              Sign up
            </Link>
          </>
        ) : (
          <div className="flex items-center">
            <Link to={Paths.TRIPS} className="link font-bold !mr-1">
              Trips
            </Link>
            <Link to={Paths.NOTIFICATIONS} className="link mr-3 notification">
              <BellDot className="w-5 h-5" />
              <span className={hasNotifications ? "badge" : ""} />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={photo}
                  width={40}
                  height={40}
                  alt="avatar"
                  className="header-avatar"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>User Information</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(Paths.PROFILE)}>
                  <User className="w-4 h-4 mr-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </section>
    </header>
  );
};

export default Header;
