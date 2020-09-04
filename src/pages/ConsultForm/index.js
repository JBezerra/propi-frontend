import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import landingLogoImg from '../../assets/images/landing-logo.svg'

import './styles.css';

const ConsultForm = () => {

    const history = useHistory()
    const [sequential, setSequencial] = useState('');
    const [CPF, setCPF] = useState('');

    function handleConsultCertificates() {
        const sequencialRegex = /^(\d){7}$/
        const cpfRegex = /^(\d){11}$/

        let sequencial_ra = sequential.match(sequencialRegex);
        let cpf_ra = CPF.match(cpfRegex);

        let all_match = sequencial_ra && cpf_ra;

        if (!all_match) {
            alert('Sequencial ou CPF no formato inválido.\nEm ambos, não use pontos nem dígitos.')
        }
        else {
            history.push({
                pathname: '/consult',
                state: { sequential, CPF }
            })
        }
    }

    return (
        <div id="page-consult-form-container" className="container">
            <img src={landingLogoImg} />
            <h1>Com um clique, pesquise débitos, taxas e certidões de um imóvel e seu proprietário.</h1>
            <div className='inputs-container'>
                <div className="input-block">
                    <label htmlFor='sequential'>Sequencial do imóvel</label>
                    <input
                        placeholder='Exemplo 6907954'
                        type="text"
                        id='sequential'
                        value={sequential}
                        onChange={(e) => setSequencial(e.target.value)}
                    />
                </div>
                <hr />
                <div className="input-block">
                    <label htmlFor='cpf'>CPF</label>
                    <input
                        placeholder='Digite o número do CPF'
                        type="text"
                        id='cpf'
                        value={CPF}
                        onChange={(e) => setCPF(e.target.value)}
                    />
                </div>

                <div className="submit-button" onClick={handleConsultCertificates}>
                    <h3>Buscar pendências</h3>
                    <FontAwesomeIcon icon={faSearch} />
                </div>
            </div>
        </div>
    );
}

export default ConsultForm;