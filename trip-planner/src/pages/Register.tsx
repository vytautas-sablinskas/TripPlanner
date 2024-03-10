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
import { register } from "../api/AuthenticationService";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
    })

    interface FormErrors {
        name: string;
        surname: string;
        email: string;
        password: string;
    }

    const [errorMessages, setErrorMessages] = useState<FormErrors>({
        name: '',
        surname: '',
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
        const isValidName = (nameOrSurname: string) => {
            return nameOrSurname.length > 0;
        }

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
            name: "",
            surname: "",
            email: "",
            password: ""
        };
        if (!isValidName(formValues.name)) errors.name = "Name must be at least 1 character long.";
        if (!isValidName(formValues.surname)) errors.surname = "Surname must be at least 1 character long.";
        if (!isValidEmail(formValues.email)) errors.email = "Invalid email format.";
        if (!isValidPassword(formValues.password)) errors.password = "Password must have at least one lowercase, one uppercase letter, one number, one symbol and at least 6 characters.";

        if (Object.values(errors).some(error => error.length > 0)) {
            setErrorMessages(errors);
            return false;
        }

        setErrorMessages({
            name: '',
            surname: '',
            email: '',
            password: ''
        });

        return true;
    }

    const handleSignUp = async () => {
        if (!isValidForm()) {
            return;
        }

        setLoading(true);
        const response: any = await register(formValues);
        setLoading(false);

        if (!response || !response.ok) {
            const data = await response.json();
            const message = data.message || 'Unexpected error. Try again later';
            toast.error(message, {
                position: 'top-center'
            });
            return;
        }

        

        navigate(Paths.HOME);
        toast.success("Successfully signed up!", {
            position: 'top-center'
        });
    }

    return (
        <div className="flexbox-container-column column-center-vertically column-center-horizontally">
            <Card className="register-container" variant="outlined">
                <CardContent>
                    <Typography sx={{ fontSize: '26px', textAlign: 'center', fontFamily: "sans-serif", fontWeight: 500, marginBottom: '20px' }} >Sign Up</Typography>
                    <div className="flexbox-container-column column-center-vertically column-center-horizontally">
                        <TextField
                            error={errorMessages.name.length !== 0}
                            helperText={errorMessages.name}
                            value={formValues.name}
                            id="name"
                            label="Name"
                            variant="outlined"
                            sx={{ marginTop: '15px', minWidth: '300px' }}
                            onChange={handleChange}
                        >
                            Name
                        </TextField>
                        <TextField
                            error={errorMessages.surname.length !== 0}
                            helperText={errorMessages.surname}
                            value={formValues.surname}
                            id="surname"
                            label="Surname"
                            variant="outlined"
                            sx={{ marginTop: '15px', minWidth: '300px' }}
                            onChange={handleChange}
                        >
                            Surname
                        </TextField>
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
                            onClick={() => handleSignUp()}
                        >
                            Create an account
                        </LoadingButton>
                        <Typography sx={{ marginTop: '20px' }}>Already have an account?<Link to={Paths.LOGIN}><strong className="login-text">Log in</strong></Link></Typography>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Register;