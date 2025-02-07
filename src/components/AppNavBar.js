import { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UserContext from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function AppNavBar() {
    const { user, unsetUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        unsetUser();
        navigate('/');
    };

    const handleCartClick = () => {
        if (user.id) {
            // Redirect to cart page if user is logged in
            navigate('/cart');
        } else {
            // Redirect to login page if user is not logged in
            navigate('/login');
        }
    };

    return (
        <Navbar expand="lg" className="transparent-navbar">
            <Container className='cs-container'>
                <LinkContainer to="/">
                    <Navbar.Brand id='cs-logo'>SELECT<span>PONO</span></Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/products">
                            <Nav.Link>SHOP NOW</Nav.Link>
                        </LinkContainer>
                        {user.isAdmin && (
                            <LinkContainer to="/admin">
                                <Nav.Link>DASHBOARD</Nav.Link>
                            </LinkContainer>
                        )}
                        {user.id ? (
                            <Nav.Link onClick={handleLogout}>LOGOUT</Nav.Link>
                        ) : (
                            <>
                                <LinkContainer to="/login">
                                    <Nav.Link>LOGIN</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/register">
                                    <Nav.Link>REGISTER</Nav.Link>
                                </LinkContainer>
                            </>
                        )}
                    </Nav>
                    <Nav className="cart">
                        <Nav.Link  onClick={handleCartClick}>
                            <FontAwesomeIcon icon={faShoppingCart} />
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavBar;
