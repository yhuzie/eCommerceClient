import { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNo: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            Swal.fire('Error', 'Passwords do not match!', 'error');
            return;
        }

        fetch(`http://localhost:4000/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                Swal.fire('Error', data.message, 'error');
            } else {
                Swal.fire('Success', 'Registration successful!', 'success').then(() => navigate('/login'));
            }
        })
        .catch(error => {
            console.error("Error during registration:", error);
            Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
        });
    };

    return (
        <>
            <Container className="cs-container cs-h1-div">
                <h1>Your Shoe Game Starts Here</h1>
            </Container>
            <Container 
                className="cs-container d-flex justify-content-center"
                style={{ alignItems: 'flex-start' }}
            >
                <Form className="cs-gray-box" onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
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
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="mobileNo" 
                            value={formData.mobileNo} 
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
                    <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
                    <Button type="submit" className="mt-3 w-100">Register</Button>
                    <div className="text-center mt-4">
                        <span>Already have an account? </span>
                        <Link to="/login">Login here</Link>
                    </div>
                </Form>
            </Container>
        </>
    );
}

export default Register;
