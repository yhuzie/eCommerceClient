import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavBar from './components/AppNavBar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import { UserProvider } from './UserContext';
import './App.css';
import Error from './pages/Error';
import Footer from './components/Footer';

function App() {
    const [user, setUser] = useState({ id: null, isAdmin: false });

    const unsetUser = () => {
        localStorage.clear();
        setUser({ id: null, isAdmin: false });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`http://localhost:4000/users/details`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
                } else {
                    setUser({ id: null, isAdmin: false });
                }
            })
            .catch(error => {
                console.error("Error fetching user details:", error);
                setUser({ id: null, isAdmin: false });
                localStorage.removeItem('token'); // Clear invalid token
            });
        }
    }, []);

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <div className="cs-app-container"> {/* Outer container */}
                <Router>
                    <AppNavBar />
                    <main className="cs-content"> {/* Main content area */}
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:productId" element={<ProductDetails />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="*" element={<Error />} />
                            {user.isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
                        </Routes>
                    </main>
                    <Footer />
                </Router>
            </div>
        </UserProvider>
    );
}

export default App;
