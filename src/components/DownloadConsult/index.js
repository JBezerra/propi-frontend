import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileDownload } from '@fortawesome/free-solid-svg-icons'

import api from '../../services/api'

import './styles.css';

const DownloadConsult = ({ CPF, sequential }) => {

    function downloadConsultHandle() {
        api.get('/consult/download', {
            params: {
                cpf: CPF,
                sequential
            }
        }).then(response => {
            const link = document.createElement('a');
            const url = response.request.responseURL;
            link.href = url;
            link.setAttribute('download', 'Consulta.zip');
            document.body.appendChild(link);
            link.click();
        });
    }

    return (
        <div className="float-container">
            {/* <a href='http://localhost:5000/consult/download?cpf=13986430415&sequential=6907954' download> */}
            <div className="download-consult-container" onClick={() => downloadConsultHandle()}>
                <FontAwesomeIcon
                    icon={faFileDownload}
                    color='black'
                    size='lg'
                />
                <h4>Baixar documentos</h4>
            </div>
            {/* </a> */}
        </div>
    );
}

export default DownloadConsult;