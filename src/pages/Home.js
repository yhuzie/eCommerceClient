import { Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Home() {
    return (
        <main>
            <Container className="d-flex flex-column align-items-start justify-content-center vh-100 cs-container cs-homepage">
                <h1 className="cs-1-h1">
                    Get Latest Shoes.<br /> Buy Sapashoes.<br />
                </h1>
                <div className="d-flex gap-3 mt-3">
                    {/* Link to Products Page */}
                    <LinkContainer to="/products">
                        <Button className="cs-btn-primary" variant="primary">SHOP NOW</Button>
                    </LinkContainer>

                    {/* Link to Register Page */}
                    <LinkContainer to="/register">
                        <Button className="cs-btn-sec" variant="outline-primary">SIGN UP</Button>
                    </LinkContainer>
                </div>
            </Container>
        </main>
    );
}

export default Home;
