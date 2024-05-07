import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "sonner";
import "./styles/layout.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Layout = ({ children }: any) => {
  const location = useLocation();
  const [homePage, setHomePage] = useState(false);

  useEffect(() => {
    setHomePage(location.pathname === "/")
  }, [location.pathname])

  return (
    <div className={`${homePage ? "main-body-full homepage-background" : "main-body"}`}>
      <div className="w-full flex justify-center">
        <Header isHomePage={homePage}/>
      </div>
      <main style={{ flex: 1, display: "flex", width: homePage ? "1110px" : "100%", justifyContent: homePage ? "center" : "normal" }}>
        {children}
      </main>
      {!homePage && (
        <Footer />
      )}
      <Toaster richColors closeButton />
    </div>
  );
};

export default Layout;
