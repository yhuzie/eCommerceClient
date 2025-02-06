import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function EditProduct({ product, fetchProducts }) {
    const notyf = new Notyf();

    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);
    const [image, setImage] = useState(null);
    const [showEdit, setShowEdit] = useState(false);

    const openEdit = () => setShowEdit(true);
    const closeEdit = () => setShowEdit(false);

    const handleEdit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        if (image) formData.append("image", image);

        fetch(`http://localhost:4000/products/${product._id}/update`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                notyf.success("Product updated successfully");
                closeEdit();
                fetchProducts(); // Refresh the product list
            } else {
                notyf.error("Failed to update product");
            }
        })
        .catch(() => notyf.error("An error occurred"));
    };

    const handleDelete = () => {
        fetch(`http://localhost:4000/products/${product._id}/delete`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                notyf.success("Product Deleted Successfully");
                closeEdit();
                fetchProducts(); // Refresh the product list after deletion
            } else {
                notyf.error("Failed to Delete Product");
            }
        })
        .catch(() => notyf.error("An error occurred"));
    };

    return (
        <>
            <Button variant="primary" size="sm" onClick={openEdit}>Edit</Button>

            <Modal show={showEdit} onHide={closeEdit}>
                <Form className='cs-form' onSubmit={handleEdit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="productName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="productDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="productPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="productImage">
                            <Form.Label>Update Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEdit}>Close</Button>
                        <Button variant="success" type="submit">Submit</Button>
                        <Button variant="danger" onClick={handleDelete}>Delete Product</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
