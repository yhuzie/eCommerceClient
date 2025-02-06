import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Form, InputGroup, Row, Col, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

function ProductDetails() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!productId) {
            Swal.fire("Error", "Product ID is missing.", "error");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:4000/products/${productId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data || data.message === "Product not found") {
                    Swal.fire("Error", "Product not found.", "error");
                } else {
                    setProduct(data);
                }
                setLoading(false);
            })
            .catch((error) => {
                Swal.fire("Error", "Failed to load product data.", "error");
                setLoading(false);
            });
    }, [productId]);

    const addToCart = () => {
        if (!user.id) {
            Swal.fire("Please log in", "You need to log in to add items to the cart.", "info").then(() => {
                navigate("/login");
            });
            return;
        }

        const subtotal = product.price * quantity;

        fetch(`http://localhost:4000/cart/add-to-cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                productId: product._id,
                price: product.price,
                quantity,
                subtotal,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    Swal.fire("Error", data.message, "error");
                } else {
                    Swal.fire("Success", "Product added to cart!", "success");
                }
            })
            .catch((error) => {
                Swal.fire("Error", "Failed to add product to cart.", "error");
            });
    };

    if (loading) return <p>Loading...</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <>
            <Container className="cs-container cs-h1-div">
                <h1>Get your <span className="cs-red">{product.name}</span> now.</h1>
            </Container>
            <Container className="cs-container pb-custom cs-100vh">
                <Row>
                    <Col md={7}>
                        <Card.Img
                            variant="top"
                            src={product.imageUrl ? `http://localhost:4000/${product.imageUrl}` : "placeholder.jpg"}
                            style={{ width: "100%", height: "auto", objectFit: "cover" }}
                        />
                    </Col>
                    <Col className="ps-5" md={5}>
                        <h1 className="cs-product-name pb-3">{product.name}</h1>
                        <p className="pb-5">{product.description}</p>
                        <h4>Price: ₱{product.price}</h4>
                        <InputGroup className="mb-3" style={{ maxWidth: "200px" }}>
                            <InputGroup.Text>Quantity</InputGroup.Text>
                            <Form.Control
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            />
                        </InputGroup>
                        <Button variant="primary" onClick={addToCart} className="mt-3">
                            {user.id ? "Add to Cart" : "Login to Add to Cart"}
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ProductDetails;
