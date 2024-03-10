import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Layout from './components/Shared/Layout';
import { ThemeProvider, createTheme } from '@mui/material';
import UserContextProvider from './providers/user-provider/UserContextProvider';

const App = () => {
    const theme = createTheme({
        typography: {
            fontFamily: [
                'Source Sans 3',
                'Inter',
                'sans-serif',
                'Roboto',
            ].join(','),
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <UserContextProvider>
                <Router>
                    <Layout>
                        <Routes>
                            {AppRoutes.map((route: any, index: any) => {
                                return <Route key={index} path={route.path} element={route.element} />;
                            })}
                        </Routes>
                    </Layout>
                </Router>
            </UserContextProvider>
        </ThemeProvider>
    );
}


export default App;