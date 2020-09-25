import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';

import LoadingPDF from '../Skeleton/LoadingPDF'

import './styles.css';

const PDFCardContent = ({ fileSrc }) => {
    return (
        <>
            <div className="pdf-card-content">
                {fileSrc ? (
                    <div className='cnd-iptu-content'>
                        <Document file={fileSrc} >
                            <Page pageNumber={1} width={350} />
                        </Document>
                    </div >) : <LoadingPDF />}
            </div >
        </>
    );
}

export default PDFCardContent;