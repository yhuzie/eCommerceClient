import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Table, Container } from 'react-bootstrap';
import AddProduct from '../components/AddProduct';
import EditProduct from '../components/EditProduct';
import ToggleProductStatus from '../components/ToggleProductStatus';
import UserOrders from '../components/UserOrders';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AdminDashboard() {
    const notyf = useMemo(() => new Notyf(), []); // Memoize the Notyf instance
    const [productsData, setProductsData] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showOrdersModal, setShowOrdersModal] = useState(false);

    const fetchProductsData = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:4000/products/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProductsData(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            notyf.error("Failed to load products.");
        }
    }, [notyf]);

    useEffect(() => {
        fetchProductsData();
    }, [fetchProductsData]);

    const handleAddProductClick = () => setShowAddModal(true);
    const closeAddProductModal = () => setShowAddModal(false);
    const handleShowOrdersClick = () => setShowOrdersModal(true);
    const closeOrdersModal = () => setShowOrdersModal(false);

    return (
        <>
            <Container className="cs-container cs-h1-div">
                <h1>Admin Dashboard</h1>
            </Container>        
            <div className='cs-container pt-3 pb-custom cs-100vh'>
                <div className="d-flex justify-content-center mb-4">
                    <Button variant="primary" className="mx-2 cs-btn-max-width" onClick={handleAddProductClick}>Add New Product</Button>
                    <Button variant="success" className="mx-2 cs-btn-max-width" onClick={handleShowOrdersClick}>Show User Orders</Button>
                </div>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr className="text-center">
                            <th style={{ width: "40%" }}>Name</th>
                            <th style={{ width: "20%" }}>ID</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Availability</th>
                            <th colSpan="2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsData.length > 0 ? (
                            productsData.map(product => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product._id}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price}</td>
                                    <td className={product.isActive ? "text-success" : "text-danger"}>
                                        {product.isActive ? "Available" : "Unavailable"}
                                    </td>
                                    <td className="text-center cs-action">
                                        <EditProduct product={product} fetchProducts={fetchProductsData} notyf={notyf} />
                                        <ToggleProductStatus  product={product} isAvailable={product.isActive} fetchProducts={fetchProductsData} notyf={notyf} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No products available</td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                {showAddModal && (
                    <AddProduct fetchProducts={fetchProductsData} closeModal={closeAddProductModal} notyf={notyf} />
                )}

                {showOrdersModal && (
                    <UserOrders closeModal={closeOrdersModal} />
                )}
            </div>
        </>
    );
}
