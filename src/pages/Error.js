// pages/Error.js
import React from 'react';
import Banner from '../components/Banner';

function Error() {
    const errorData = {
        title: "404",
        content: "The page you are looking for cannot be found",
        destination: "/products",
        buttonLabel: "Explore Deals"
    };

    return <Banner data={errorData} />;
}

export default Error;