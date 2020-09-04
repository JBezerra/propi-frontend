import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faExpand } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

import CardBox from '../../components/CardBox'
import PDFCardContent from '../../components/PDFCardContent'

import logoImg from '../../assets/images/logo.svg'

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
        // componentData.bombeirosImg = tickImg;
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
        // componentData.bombeirosImg = crossImg;
      }

      if (darfResponse === 'OKAY') {
        componentData.darfText = 'Sem pendências';
        // componentData.darfImg = tickImg;
      }
      else if (darfResponse !== 'OKAY') {
        componentData.darfText = 'Taxa pendente.';
        // componentData.darfImg = crossImg;
      }

      stopLoading()
      setComponentData(componentData)
    }
  }

  return (
    <div id='page-consult-form' className='container'>
      <header>
        <img src={logoImg} alt='Propi' />
      </header>
      <main>
        <div className='consult-container'>
          <h1>Para o imóvel</h1>
          <hr className='title-separator' />

          <div className='cards-container'>
            <div className='left-column-area'>
              <CardBox
                title='DARF'
                description='A sigla DARF se refere a Documento de Arrecadação de Receitas Federais. Trata-se de um documento emitido pelo Ministério da Fazenda e da Secretaria da Receita Federal para cobrança de tributos administrados por esses órgãos.'
              >
                <div className='darf-content'>
                  <div className='darf-left-column-content'>
                    <div className='card-text-row'>
                      <strong>Responsável: </strong>
                      <h6>MARIA DE LOUDES BORBA</h6>
                    </div>

                    <div className='card-text-row'>
                      <strong>Receita: </strong>
                      <h6>MARIA DE LOUDES BORBA</h6>
                    </div>

                    <div className='card-text-row'>
                      <strong>Data limite: </strong>
                      <h6>MARIA DE LOUDES BORBA</h6>
                    </div>
                  </div>

                  <div className='darf-right-column-content'>
                    <div className='card-text-row'>
                      <strong>Valor principal: </strong>
                      <h6>R$ 117,44</h6>
                    </div>

                    <div className='card-text-row'>
                      <strong>Valor multa: </strong>
                      <h6>R$ 117,44</h6>
                    </div>

                    <div className='card-text-row'>
                      <strong>Valor juros: </strong>
                      <h6>R$ 117,44</h6>
                    </div>

                    <div className='card-text-row'>
                      <strong>Valor total: </strong>
                      <h6>R$ 117,44</h6>
                    </div>
                  </div>
                </div>

                <div className='payment-file-button'>
                  <h4>Boleto de pagamento</h4>
                  <FontAwesomeIcon icon={faAngleUp} />
                </div>
              </CardBox>

              <CardBox
                title='Taxa de Bombeiro'
                description='Certifica a existência de débitos referentes A Taxa de Prevenção e Extinção de Incêndios (TPEI).'
              >
                <div className='tpei-content'>
                  <div className='card-text-row'>
                    <strong>2016: </strong>
                    <h6>Sem débitos</h6>
                  </div>
                  <div className='card-text-row'>
                    <strong>2017: </strong>
                    <h6>Sem débitos</h6>
                  </div>
                  <div className='card-text-row'>
                    <strong>2018: </strong>
                    <h6>Sem débitos</h6>
                  </div>
                  <div className='card-text-row'>
                    <strong>2019: </strong>
                    <h6>Sem débitos</h6>
                  </div>
                  <div className='card-text-row'>
                    <strong>2020: </strong>
                    <h6>Sem débitos</h6>
                  </div>
                </div>
                <div className='payment-file-button'>
                  <h4>Boleto de pagamento</h4>
                  <FontAwesomeIcon icon={faAngleUp} />
                </div>
              </CardBox>

              <CardBox
                title='Certidão Negativa de Débitos Patrimoniais do Imóvel'
                description='Certidão de Domínio da União é um documento hábil para o conhecimento da condição de dominialidade de um imóvel em relação à área da União.'
              >
              </CardBox>
            </div>

            <div className='right-column-area'>
              <CardBox
                title='Certidão Negativa de Débitos de IPTU'
                description='Certifica a existência de débitos referentes ao IPTU do imóvel'
              >
                <PDFCardContent fileSrc='http://127.0.0.1:5000/pdf' />
              </CardBox>

              <CardBox
                title='Certidão de Inteiro Teor'
                description='Certidão em inteiro teor, integral ou verbo ad verbum é um documento extraído de um livro de registro que reproduz todas as palavras nele contidas. Certidão de inteiro teor também pode ser uma certidão que apresenta todos os atos praticados e os nomes dos proprietários.'
              >
                <div className='teor-content'>
                  <div className="column-content">
                    <strong>Número do RIP</strong>
                    <h6>2531 0012514-33</h6>
                    <h6>2531 0012514-33</h6>
                    <h6>2531 0012514-33</h6>
                    <h6>2531 0012514-33</h6>
                  </div>
                  <div className="teor-address-content">
                    <strong>Endereço do Imóvel</strong>
                    <div>
                      <h6>MARQUES DO HERVAL,167,SANTO ANTONIO</h6>
                      <FontAwesomeIcon icon={faExpand} />
                    </div>
                    <div>
                      <h6>MARQUES DO HERVAL,167,SANTO ANTONIO</h6>
                      <FontAwesomeIcon icon={faExpand} />
                    </div>
                    <div>
                      <h6>MARQUES DO HERVAL,167,SANTO ANTONIO</h6>
                      <FontAwesomeIcon icon={faExpand} />
                    </div>
                    <div>
                      <h6>MARQUES DO HERVAL,167,SANTO ANTONIO</h6>
                      <FontAwesomeIcon icon={faExpand} />
                    </div>

                  </div>

                </div>
              </CardBox>

            </div>
          </div>
        </div>


        <div className='consult-container'>
          <h1>Para o proprietário</h1>
          <hr className='title-separator' />

          <div className='cards-container'>
            <div className='left-column-area'>
              <CardBox
                title='Certidão Negativa de Débitos Trabalhistas'
                description='A Certidão será negativa se a pessoa de quem se trata não estiver inscrita como devedora no Banco Nacional de Devedores Trabalhistas. A Certidão será positiva se a pessoa de quem se trata tiver execução definitiva em andamento, já com ordem de pagamento não cumprida.'
              >
                <PDFCardContent fileSrc='http://127.0.0.1:5000/pdf' />
              </CardBox>

              <CardBox
                title='Certidão Negativa Criminal'
                description='Constata a existência de ação de natureza criminal contra o CPF/CNPJ apresentado, consultado nos sistemas processuais da respectiva Corte.'
              >
                <PDFCardContent fileSrc='http://127.0.0.1:5000/pdf' />
              </CardBox>
            </div>

            <div className='right-column-area'>
              <CardBox
                title='Certidão Negativa de Débitos Estaduais'
                description='A Certidão Negativa de Débitos é o documento emitido pela Secretaria de Estado da Fazenda dando prova da inexistência de pendências e débitos tributários do contribuinte. Quando constam pendências ou dívidas, a Certidão emitida é a chamada Certidão Positiva de Débitos.'
              >
                <PDFCardContent fileSrc='http://127.0.0.1:5000/pdf' />
              </CardBox>

              <CardBox
                title='Certidão Negativa da Justiça Federal Pernambuco'
                description='Constata a existência de ação ou execução de natureza criminal, cível e fisca, contra o CPF/CNPJ apresentado, perante na Justiça Federal de 1ª Instância, Seção Judiciária do respectivo Estado, consultado nos registros de distribuição do mesmo.'
              >
                <PDFCardContent fileSrc='http://127.0.0.1:5000/pdf' />
              </CardBox>

              <CardBox
                title='Certidão de Ações Trabalhistas'
                description='Certifica que o CPF/CNPJ não consta nas bases processuais do Tribunal Regional do Trabalho, após validado na Receita Federal. A Certidão de Ações Trabalhistas tem validade por 30 dias após sua emissão e não gera os efeitos da Certidão Negativa de Débitos Trabalhistas - CNDT.'
              >
                <PDFCardContent fileSrc='http://127.0.0.1:5000/pdf' />
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
