
// components/Banner.js
import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Banner({ data }) {
    return (
        <>
        
        <Container className="d-flex flex-column align-items-start justify-content-center vh-100 cs-container cs-homepage">
        <h1 className="cs-1-h1 cs-404">{data.title}</h1>
        <p>{data.content}</p>
        <div >
            <LinkContainer to="/products">
                <Button className='cs-btn-primary' variant="primary">{data.buttonLabel}</Button>
            </LinkContainer>
        </div>
        </Container>
        
        </>

    );
}

export default Banner;