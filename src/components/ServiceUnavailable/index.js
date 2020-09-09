import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'

import './styles.css';

const ServiceUnavailable = () => {
    return (
        <div className='unavailable-container'>
            <FontAwesomeIcon
                icon={faExclamation}
                color='#f39c12'
                size='2x'
            />
            <h4>Ocorreu um erro inesperado. Verifique a validade de seus dados. <br />Serviço temporariamente indisponível.</h4>
        </div>
    );
}

export default ServiceUnavailable;