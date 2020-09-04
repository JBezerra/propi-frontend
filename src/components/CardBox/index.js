import React from 'react';

import './styles.css';

const CardBox = ({ title, description, status = '', children }) => {
    return (
        <div className="card-box">
            <div className="card-content">
                <h3>{title}</h3>
                <p>{description}</p>
                {status &&
                    <div className=''>
                    </div>}
                <hr />
                <div className="children-content">
                    {children}
                </div>
            </div>
        </div >
    );
}

export default CardBox;