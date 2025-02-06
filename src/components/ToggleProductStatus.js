import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function ToggleProductStatus({ product, isAvailable, fetchProducts }) {
    const notyf = new Notyf();

    const toggleStatus = () => {
        const url = `http://localhost:4000/products/${product._id}/${isAvailable ? 'archive' : 'activate'}`;
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                notyf.success(isAvailable ? "Successfully Disabled" : "Successfully Activated");
                fetchProducts();
            } else {
                notyf.error("Something Went Wrong");
            }
        });
    };

    return (
        <Button className='cs-btn-max-width' variant={isAvailable ? "danger" : "success"} size="sm" onClick={toggleStatus}>
            {isAvailable ? "Disable" : "Activate"}
        </Button>
    );
}
