import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import ServiceUnavailable from '../ServiceUnavailable'

import './styles.css';

const CardBox = ({ title, description, pendent = undefined, serviceDown = false, children }) => {
    return (
        <div className="card-box">
            <div className="card-content">
                <h3>{title}</h3>
                <p>{description}</p>

                {pendent != undefined && !serviceDown && pendent &&
                    < div className='pendent-container'>
                        <FontAwesomeIcon
                            icon={faTimesCircle}
                            color='#FF0C0C'
                        />
                        <h4>Possui Pendências</h4>
                    </div>}

                {pendent != undefined && !serviceDown && !pendent &&
                    <div className='not-pendent-container'>
                        <FontAwesomeIcon
                            icon={faCheckCircle}
                            color='#3BEC5D'
                        />
                        <h4>Sem Pendências</h4>
                    </div>
                }

                <hr />
                <div className="children-content">
                    {!serviceDown ? children : <ServiceUnavailable />}
                </div>
            </div>
        </div >
    );
}

export default CardBox;