import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/MainLayoutExtra/Layout";
import UserContextProvider from "./providers/user-provider/UserContextProvider";
import { APIProvider } from '@vis.gl/react-google-maps';

const App = () => {
  return (
    <UserContextProvider>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
        <Router>
          <Layout>
            <Routes>
              {AppRoutes.map((route: any, index: any) => {
                return (
                  <Route key={index} path={route.path} element={route.element} />
                );
              })}
            </Routes>
          </Layout>
        </Router>
      </APIProvider>
    </UserContextProvider>
  );
};

export default App;
