import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './styles.css';

const CardBox = ({ title, description, status = '', children }) => {
    return (
        <div className="card-box">
            <div className="card-content">
                <h3>{title}</h3>
                <p>{description}</p>
                {status &&
                    <div className='pendent-container'>
                        <FontAwesomeIcon
                            icon={faTimesCircle}
                            color='#FF0C0C'
                            size='m'
                        />
                        <h4>Possui Pendência</h4>
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