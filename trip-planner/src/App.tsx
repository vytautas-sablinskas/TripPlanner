import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/Shared/Layout";
import UserContextProvider from "./providers/user-provider/UserContextProvider";

const App = () => {
  return (
    <UserContextProvider>
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
    </UserContextProvider>
  );
};

export default App;
