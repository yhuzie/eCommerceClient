import { useState, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

function Login() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:4000/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        .then(res => res.json())
        .then(data => {
            if (!data || data.error) {
                Swal.fire('Error', data.message || 'Login failed. Please try again.', 'error');
            } else if (data.user && data.user._id) {
                localStorage.setItem('token', data.access);
                setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
                Swal.fire('Success', 'Login successful!', 'success').then(() => navigate('/products'));
            } else {
                console.error("Unexpected response format:", data);
                Swal.fire('Error', 'Unexpected error. Please contact support.', 'error');
            }
        })
        .catch(error => {
            console.error("Network or server error:", error);
            Swal.fire('Error', 'Unable to connect to the server. Please try again later.', 'error');
        });
    };

    return (
        <>
            <Container className="cs-container cs-h1-div">
                <h1>Lace Up and Log In</h1>
            </Container>
            <Container 
                className="cs-container d-flex justify-content-center"
                style={{ alignItems: 'flex-start' }}
            >
                <Form className="cs-gray-box" onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
                    <Button type="submit" className="mt-3 w-100">Login</Button>
                    <div className="text-center mt-4">
                        <span>Don't have an account? </span>
                        <Link to="/register">Register here</Link>
                    </div>
                </Form>
            </Container>
        </>
    );
}

export default Login;
