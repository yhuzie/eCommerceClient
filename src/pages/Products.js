import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function Products() {
    const [products, setProducts] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:4000/products/active`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setProducts([]);
                setLoading(false);
            });
    }, []);

    const searchByName = () => {
        setLoading(true);
        fetch(`http://localhost:4000/products/search-by-name`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: searchName }),
        })
            .then((res) => res.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error searching by name:", error);
                setProducts([]);
                setLoading(false);
            });
    };

    const searchByPrice = () => {
        const min = minPrice === "" ? 0 : Number(minPrice);
        const max = maxPrice === "" ? 100000 : Number(maxPrice);

        setLoading(true);
        fetch(`http://localhost:4000/products/search-by-price`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ minPrice: min, maxPrice: max }),
        })
            .then((res) => res.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error searching by price:", error);
                setProducts([]);
                setLoading(false);
            });
    };

    const clearSearch = () => {
        setSearchName("");
        setMinPrice("");
        setMaxPrice("");
        setLoading(true);
        fetch(`http://localhost:4000/products/active`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setProducts([]);
                setLoading(false);
            });
    };

    if (loading) return <p>Loading products...</p>;

    return (
        <>
            <Container className="cs-container cs-h1-div">
                <h1>Explore Deals</h1>
            </Container>
            <Container className="cs-container cs-100vh">
                <div className="cs-search-filter">
                    <div className="d-flex align-items-center mb-3">
                        <h3 className="mb-0 me-2">Search</h3>
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <Form>
                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="formProductName">
                                    <Form.Control
                                        type="text"
                                        placeholder="Product Name"
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="formMinPrice">
                                    <Form.Control
                                        type="number"
                                        placeholder="Minimum Price"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="formMaxPrice">
                                    <Form.Control
                                        type="number"
                                        placeholder="Maximum Price"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex gap-3 mt-3">
                            <Button variant="primary" onClick={searchByName}>
                                Search by Name
                            </Button>
                            <Button variant="primary" onClick={searchByPrice}>
                                Search by Price
                            </Button>
                            <Button variant="danger" onClick={clearSearch}>
                                Clear
                            </Button>
                        </div>
                    </Form>
                </div>

                <h2>What’s In Store</h2>
                <div className="pb-custom" style={{ display: "flex", flexWrap: "wrap" }}>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Card key={product._id} style={{ width: "18rem", margin: "1rem" }}>
                                <Link to={`/products/${product._id}`}>
                                    <Card.Img
                                        variant="top"
                                        src={product.imageUrl ? `http://localhost:4000/${product.imageUrl}` : "placeholder.jpg"}
                                        style={{ cursor: "pointer" }} // To show it's clickable
                                    />
                                </Link>
                                <Card.Body>
                                    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Card.Title style={{ cursor: "pointer" }}>{product.name}</Card.Title>
                                    </Link>
                                    <Card.Text>Price: ₱{product.price}</Card.Text>
                                    <Link to={`/products/${product._id}`}>
                                        <Button variant="primary">Buy Now</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </Container>
        </>
    );
}

export default Products;
