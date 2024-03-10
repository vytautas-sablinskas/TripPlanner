import React from "react";
import UserContextProvider from "../../providers/user-provider/UserContextProvider";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from 'sonner'

const Layout = ({ children }: any) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <UserContextProvider>
                <Header />
                <main style={{ flex: 1, display: 'flex' }}>
                    {children}
                </main>
                <Footer />
                <Toaster richColors/>
            </UserContextProvider>
        </div>
    );
}

export default Layout;