import React from 'react';
import ReactLoading from 'react-loading';
import './styles.css';

const LoadingPage = () => {
    return (
        <div className="loading-container">
            <ReactLoading type={'spin'} />
        </div>
    );
}

export default LoadingPage;