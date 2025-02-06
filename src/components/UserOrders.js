import { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Table, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function UserOrders({ closeModal }) {
    const notyf = useMemo(() => new Notyf(), []); // Memoize the Notyf instance
    const [ordersData, setOrdersData] = useState([]);

    const fetchOrdersData = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:4000/orders/all-orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrdersData(data.orders || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            notyf.error("Failed to load orders");
        }
    }, [notyf]);

    useEffect(() => {
        fetchOrdersData();
    }, [fetchOrdersData]);

    return (
        <Modal show onHide={closeModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>User Orders</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Items</th>
                            <th>Total Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersData.length > 0 ? (
                            ordersData.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.userId}</td>
                                    <td>
                                        <ul>
                                            {order.productsOrdered.map((item, index) => (
                                                <li key={index}>
                                                    {item.productName} - Qty: {item.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{order.totalPrice}</td>
                                    <td>{order.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
