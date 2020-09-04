import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import ReactLoading from 'react-loading';
import axios from 'axios';

import CardBox from '../../components/CardBox'

import logoImg from '../../assets/images/logo.svg'

import heroImg from '../../assets/images/hero.svg'
import tickImg from '../../assets/images/correct.svg'
import crossImg from '../../assets/images/cross.svg'

import './styles.css';

function ConsultList() {
  const [sequencial, setSequencial] = useState('');
  const [cpf, setCpf] = useState('');
  const [componentData, setComponentData] = useState('');
  const [loading, setLoading] = useState(false);

  let startLoading = () => {
    setLoading(true)
  }

  let stopLoading = () => {
    setLoading(false)
  }

  let getImovelInfos = async (e) => {
    const sequencialRegex = /^(\d){7}$/
    const cpfRegex = /^(\d){11}$/
    let sequencial_ra = sequencial.match(sequencialRegex);
    let cpf_ra = cpf.match(cpfRegex);
    let all_match = sequencial_ra && cpf_ra;

    if (!loading && all_match) {
      startLoading()
      e.preventDefault();
      let imovelSequencial = sequencial // 6907954
      let imovelCpf = cpf // 89021029472

      const webserviceUrl = 'http://dcba0e7ed745.ngrok.io'
      const params = {
        'sequencial': imovelSequencial,
        'cpf': imovelCpf
      }
      let serverRequest = await axios.get(`${webserviceUrl}/imovel`, { params });
      let serverResponse = await serverRequest.data;

      let bombeirosResponse = serverResponse.bombeiros;
      let darfResponse = serverResponse.darf;

      let componentData = { iptuCertUrl: `${webserviceUrl}/pdf` }

      if (bombeirosResponse.length === 0) {
        componentData.bombeirosText = 'Sem pendências.';
        componentData.bombeirosImg = tickImg;
      }

      else if (bombeirosResponse.length !== 0) {
        let componentText;

        if (bombeirosResponse.length === 1) {
          componentText = `Taxa de ${bombeirosResponse[0]} pendente.`
        }
        else {
          componentText = `Anos de ${bombeirosResponse.join(', ')} pendentes.`;
        }

        componentData.bombeirosText = componentText;
        componentData.bombeirosImg = crossImg;
      }

      if (darfResponse === 'OKAY') {
        componentData.darfText = 'Sem pendências';
        componentData.darfImg = tickImg;
      }
      else if (darfResponse !== 'OKAY') {
        componentData.darfText = 'Taxa pendente.';
        componentData.darfImg = crossImg;
      }

      stopLoading()
      setComponentData(componentData)
    }
  }

  return (
    <div id='page-consult-form' className='container'>
      <header>
        <img src={logoImg} alt="Propi" />
      </header>
      <main>
        <div className='consult-container'>
          <h1>Para o imóvel</h1>
          <hr className='title-separator' />

          <div className="cards-container">

            <div className="left-column-area">
              <CardBox
                title='DARF'
                description='A sigla DARF se refere a Documento de Arrecadação de Receitas Federais. Trata-se de um documento emitido pelo Ministério da Fazenda e da Secretaria da Receita Federal para cobrança de tributos administrados por esses órgãos.'
              >
                <div className="darf-content">
                  <div className="darf-left-column-content">

                    <div className="darf-text-row">
                      <strong>Responsável: </strong>
                      <h6>MARIA DE LOUDES BORBA</h6>
                    </div>

                    <div className="darf-text-row">
                      <strong>Responsável: </strong>
                      <h6>MARIA DE LOUDES BORBA</h6>
                    </div>

                    <div className="darf-text-row">
                      <strong>Responsável: </strong>
                      <h6>MARIA DE LOUDES BORBA</h6>
                    </div>
                  </div>

                  <div className="darf-right-column-content">
                    <div className="darf-text-row">
                      <strong>Valor Principal: </strong>
                      <h6>123</h6>
                    </div>
                  </div>
                </div>
              </CardBox>
            </div>

            <div className="right-column-area">
              <CardBox
                title='Certidão Negativa de Débitos de IPTU'
                description='Certifica a existência de débitos referentes ao IPTU do imóvel'
              >
              </CardBox>

            </div>
          </div>
        </div>

      </main>
      <div className='bottom-details'>

      </div>
    </div >

  );
}

export default ConsultList;
