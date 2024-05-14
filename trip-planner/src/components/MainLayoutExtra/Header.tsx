import { Link, useLocation, useNavigate } from "react-router-dom";
import "./styles/header.css";
import Paths from "../../routes/Paths";
import { useUser } from "../../providers/user-provider/UserContext";
import {
  logout,
  refreshAccessToken,
} from "../../services/AuthenticationService";
import { BellDot, File, LogOut, Menu, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { toast } from "sonner";
import { getUserInformation } from "@/services/UserService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Header = ({ isHomePage }: any) => {
  const {
    isAuthenticated,
    hasNotifications,
    changeUserInformationToLoggedOut,
    changeUserInformationToLoggedIn,
    changeHasNotifications,
    role,
  } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [photo, setPhoto] = useState<any>("/avatar-placeholder.png");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const isAdmin = useRef(false);

  useEffect(() => {
    if (!role) {
      return;
    }

    if (Array.isArray(role)) {
      if (!role.includes("Admin")) {
        isAdmin.current = false;
        return;
      }
    } else {
      if (role !== "Admin" && !role.split(",").includes("Admin")) {
        isAdmin.current = false;
        return;
      }
    }

    isAdmin.current = true;
  }, [role]);

  const checkIsSmallScreen = () => {
    setIsSmallScreen(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", checkIsSmallScreen);

    checkIsSmallScreen();
    return () => {
      window.removeEventListener("resize", checkIsSmallScreen);
    };
  }, []);

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
            result.data.refreshToken,
            result.data.id
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
    <header
      className={`${isHomePage ? "header-container-home" : "header-container"}`}
    >
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
            {isSmallScreen && !isAdmin.current ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="cursor-pointer mb-1 mr-1 px-3 link"
                >
                  <div>
                    <Menu className="w-5 h-5 notification" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Menu</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate(Paths.TRIPS)}
                    className="cursor-pointer"
                  >
                    Trips
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate(Paths.UNSELECTED_PLANS)}
                    className="cursor-pointer"
                  >
                    Plans
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate(Paths.RECOMMENDATIONS)}
                    className="cursor-pointer"
                  >
                    Recommendations
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {!isAdmin.current && (
                  <>
                    <Link to={Paths.TRIPS} className="link font-bold !mr-1">
                      Trips
                    </Link>
                    <Link
                      to={Paths.UNSELECTED_PLANS}
                      className="link font-bold !mr-1"
                    >
                      Plans
                    </Link>
                    <Link
                      to={Paths.RECOMMENDATIONS}
                      className="link font-bold !mr-1"
                    >
                      Recommendations
                    </Link>
                  </>
                )}
                {isAdmin.current && (
                  <Link
                    to={Paths.RECOMMENDATION_WEIGHTS}
                    className="link font-bold !mr-1"
                  >
                    Manage Recommendations
                  </Link>
                )}
              </>
            )}
            {!isAdmin.current && (
              <Link to={Paths.NOTIFICATIONS} className="link mr-3 notification">
                <BellDot className="w-5 h-5" />
                <span className={hasNotifications ? "badge" : ""} />
              </Link>
            )}
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
                <DropdownMenuItem
                  onClick={() => navigate(Paths.PROFILE)}
                  className="cursor-pointer"
                >
                  <User className="w-4 h-4 mr-4" />
                  Profile
                </DropdownMenuItem>
                {!isAdmin.current && (
                  <DropdownMenuItem
                    onClick={() => navigate(Paths.USER_DOCUMENTS)}
                    className="cursor-pointer"
                  >
                    <File className="w-4 h-4 mr-4" />
                    Documents
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
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
