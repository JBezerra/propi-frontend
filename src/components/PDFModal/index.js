import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Document, Page } from 'react-pdf/dist/entry.webpack';

import './styles.css';

const PDFModal = ({ PDFFileSrc, closeModal }) => {
    return (
        <div className="modal-container">
            <div className="close-modal" onClick={closeModal}>
                <FontAwesomeIcon
                    icon={faTimes}
                    color='#FFF'
                    size='1x'
                />
            </div>
            <Document file={PDFFileSrc}>
                <Page pageNumber={1} width={500} />
            </Document>
        </div>
    );
}

export default PDFModal;