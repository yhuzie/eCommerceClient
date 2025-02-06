import { Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function ProductCard({ product }) {
    return (
        <Card className="mb-3 cs-product-card">
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text><strong>Price: ₱{product.price}</strong></Card.Text>
                <LinkContainer to={`/products/${product._id}`}>
                    <Button variant="primary">Details</Button>
                </LinkContainer>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;
