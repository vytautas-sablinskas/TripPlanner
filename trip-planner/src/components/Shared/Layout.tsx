import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "sonner";
import "./styles/layout.css";

const Layout = ({ children }: any) => {
  return (
    <div className="main-body">
      <Header />
      <main style={{ flex: 1, display: "flex", width: "100%" }}>
        {children}
      </main>
      <Footer />
      <Toaster richColors closeButton />
    </div>
  );
};

export default Layout;
