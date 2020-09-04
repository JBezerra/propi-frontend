import React from 'react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpand } from '@fortawesome/free-solid-svg-icons'

import './styles.css';

const PDFCardContent = ({ fileSrc }) => {
    return (
        <div className="pdf-card-content">
            <div className='cnd-iptu-content'>
                <Document file={fileSrc}>
                    <Page pageNumber={1} width={350} />
                </Document>
            </div >
            <div className='modal-pdf-button'>
                <h6>Expandir documento</h6>
                <FontAwesomeIcon icon={faExpand} size='xs' />
            </div>
        </div >
    );
}

export default PDFCardContent;