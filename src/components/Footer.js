// components/Footer.js
import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="text-white py-4 cs-footer ">
            <Container className="text-center">
                <p>© {new Date().getFullYear()} Sapashoes. All rights reserved.</p>
            </Container>
        </footer>
    );
}

export default Footer;
