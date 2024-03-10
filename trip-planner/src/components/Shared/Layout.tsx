import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from 'sonner'

const Layout = ({ children }: any) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <Header />
            <main style={{ flex: 1, display: 'flex' }}>
                {children}
            </main>
            <Footer />
            <Toaster richColors />
        </div>
    );
}

export default Layout;