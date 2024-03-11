import { useState } from "react";
import "../styles/flexbox.css";
import "../styles/text.css";
import "./styles/register.css";
import Card from '@mui/material/Card';
import { CardContent, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { LoadingButton } from '@mui/lab'
import { Link, useNavigate } from "react-router-dom";
import Paths from "../routes/Paths";
import { toast } from 'sonner'
import { login } from "../api/AuthenticationService";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useUser } from "../providers/user-provider/UserContext";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
    })
    const { changeUserInformationToLoggedIn } = useUser();

    interface FormErrors {
        email: string;
        password: string;
    }

    const [errorMessages, setErrorMessages] = useState<FormErrors>({
        email: '',
        password: '',
    });

    const handleChange = (event: any) => {
        const { id, value } = event.target;
        setFormValues(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const isValidForm = () => {
        const isValidEmail = (email: string) => {
            const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return re.test(String(email).toLowerCase());
        }

        const isValidPassword = (password: string) => {
            const minLength = 6;
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            const hasDigit = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            return (password.length >= minLength && hasUppercase && hasLowercase && hasDigit && hasSpecialChar);
        }

        let errors: FormErrors = {
            email: "",
            password: ""
        };

        if (!isValidEmail(formValues.email)) errors.email = "Invalid email format.";
        if (!isValidPassword(formValues.password)) errors.password = "Password must have at least one lowercase, one uppercase letter, one number, one symbol and at least 6 characters.";

        if (Object.values(errors).some(error => error.length > 0)) {
            setErrorMessages(errors);
            return false;
        }

        setErrorMessages({
            email: '',
            password: ''
        });

        return true;
    }

    const handleSignIn = async () => {
        if (!isValidForm()) {
            return;
        }

        debugger;

        setLoading(true);
        const response: any = await login(formValues);
        setLoading(false);
        const data = response === null ? response : await response.json();

        if (!response || !response.ok) {
            const message = data.errorMessage || 'Unexpected error. Try again later';
            toast.error(message, {
                position: 'top-center'
            });
            return;
        }

        changeUserInformationToLoggedIn(data.accessToken, data.refreshToken);
        navigate(Paths.HOME);
        toast.success("Successfully signed in!", {
            position: 'top-center'
        });
    }

    return (
        <div className="flexbox-container-column column-center-vertically column-center-horizontally">
            <Card className="register-container" variant="outlined">
                <CardContent>
                    <Typography sx={{ fontSize: '26px', textAlign: 'center', fontFamily: "sans-serif", fontWeight: 500, marginBottom: '20px' }} >Log In</Typography>
                    <div className="flexbox-container-column column-center-vertically column-center-horizontally">
                        <TextField
                            error={errorMessages.email.length !== 0}
                            helperText={errorMessages.email}
                            value={formValues.email}
                            id="email"
                            label="Email"
                            variant="outlined"
                            sx={{ marginTop: '15px', minWidth: '300px' }}
                            onChange={handleChange}
                        >
                            Email
                        </TextField>
                        <TextField
                            error={errorMessages.password.length !== 0}
                            helperText={errorMessages.password}
                            value={formValues.password}
                            id="password"
                            label="Password"
                            variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                            sx={{ marginTop: '15px', minWidth: '300px', maxWidth: '300px' }}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <LoadingButton
                            sx={{ marginTop: '15px', flex: 1, minWidth: '300px' }}
                            loading={loading}
                            variant="contained"
                            onClick={() => handleSignIn()}
                        >
                            Login
                        </LoadingButton>
                        <Typography sx={{ marginTop: '20px' }}>Don't have an account yet?<Link to={Paths.REGISTER}><strong className="login-text">Sign up</strong></Link></Typography>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login;