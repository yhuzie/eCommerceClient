import { useState, useEffect } from 'react';
import { Button, Table, Form, InputGroup, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    const fetchCartItems = () => {
        fetch(`http://localhost:4000/cart/get-cart`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Cart not found") {
                setCartItems([]);
                setTotal(0);
            } else {
                setCartItems(data.cart.cartItems);
                setTotal(data.cart.totalPrice);
            }
        })
        .catch(error => {
            console.error("Error loading cart:", error);
            Swal.fire("Error", "Failed to load cart items.", "error");
        });
    };

    const updateQuantity = (productId, quantity) => {
        fetch(`http://localhost:4000/cart/update-cart-quantity`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId, newQuantity: quantity })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setCartItems(prevItems => prevItems.map(item =>
                    item.productId._id === productId ? { ...item, quantity, subtotal: quantity * item.productId.price } : item
                ));
                setTotal(data.newTotalPrice);
            } else {
                Swal.fire("Error", data.message || "Failed to update quantity.", "error");
            }
        })
        .catch(() => {
            Swal.fire("Error", "Failed to update quantity.", "error");
        });
    };

    const removeItem = (productId) => {
        fetch(`http://localhost:4000/cart/${productId}/remove-from-cart`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setCartItems(prevItems => prevItems.filter(item => item.productId._id !== productId));
                setTotal(data.newTotalPrice);
            } else {
                Swal.fire("Error", data.message || "Failed to remove item.", "error");
            }
        })
        .catch(() => {
            Swal.fire("Error", "Failed to remove item.", "error");
        });
    };

    const clearCart = () => {
        fetch(`http://localhost:4000/cart/clear-cart`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setCartItems([]);
                setTotal(0);
                Swal.fire("Success", "Cart cleared!", "success");
            } else {
                Swal.fire("Error", data.message || "Failed to clear cart.", "error");
            }
        })
        .catch(() => {
            Swal.fire("Error", "Failed to clear cart.", "error");
        });
    };
    const handleCheckout = async () => {
        const totalPrice = cartItems.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
    
        const formattedCartItems = cartItems.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            quantity: item.quantity,
            price: item.productId.price,
            subtotal: item.quantity * item.productId.price,
        }));
    
        try {
            const response = await fetch(`http://localhost:4000/orders/checkout`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cartItems: formattedCartItems, totalPrice })
            });
    
            const data = await response.json();
    
            if (data.success) {
                // Show success popup and wait for user confirmation
                Swal.fire({
                    icon: 'success',
                    title: 'Order placed!',
                    text: 'Your order has been placed successfully.',
                    confirmButtonText: 'OK'
                }).then(async () => {
                    // Call clearCart function to clear the cart on the backend and wait for it to finish
                    await fetch(`http://localhost:4000/cart/clear-cart`, {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }).then(() => {
                        // Now that the cart is cleared, update the state in the frontend
                        setCartItems([]);
                        setTotal(0);
                        // Redirect to the products page
                        window.location.href = '/products';
                    }).catch(() => {
                        Swal.fire("Error", "Failed to clear cart after checkout.", "error");
                    });
                });
            } else {
                Swal.fire("Error", data.message || "Failed to place order.", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Failed to place order.", "error");
        }
    };
    
    
    
    

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <>
        <Container className="cs-container cs-h1-div">
            <h1>Your Shopping Cart</h1>
        </Container>        
        <div  className='cs-container pt-5 pb-custom cs-100vh' >

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th style={{ width: "40%" }}>Product</th>
                        <th>Price</th>
                        <th style={{ width: "20%" }}>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => (
                        <tr key={item.productId._id}>
                            <td>
                                <Link to={`/product/${item.productId._id}`}>
                                    {item.productId.name || 'Unknown Product'}
                                </Link>
                            </td>
                            <td>₱{item.productId.price}</td>
                            <td>
                                <InputGroup style={{ maxWidth: "120px" }}>
                                    <Button variant="outline-secondary" onClick={() => updateQuantity(item.productId._id, Math.max(1, item.quantity - 1))}>-</Button>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.productId._id, Math.max(1, parseInt(e.target.value) || 1))}
                                        style={{ textAlign: "center" }}
                                    />
                                    <Button variant="outline-secondary" onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>+</Button>
                                </InputGroup>
                            </td>
                            <td>₱{item.subtotal}</td>
                            <td>
                                <Button variant="danger" onClick={() => removeItem(item.productId._id)}>Remove</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <h3>Total: ₱{total}</h3>
            <Button variant="success" onClick={handleCheckout}>Checkout</Button>
            <Button variant="danger" onClick={clearCart}>Clear Cart</Button>


        </div>
        </>
    );
}

export default Cart;
