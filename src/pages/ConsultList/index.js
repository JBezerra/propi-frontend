import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faExpand } from '@fortawesome/free-solid-svg-icons'
import ReactLoading from 'react-loading';

import api from '../../services/api'

import CardBox from '../../components/CardBox'
import PDFCardContent from '../../components/PDFCardContent'

import logoImg from '../../assets/images/logo.svg'

import './styles.css';

function ConsultList() {

  const location = useLocation();
  const history = useHistory()

  const [DARFData, setDARFData] = useState({})
  const [bombermanData, setBombermanData] = useState([])
  const [ndcImmobileData, setNdcImmobileData] = useState('')

  const [pdfsFileSource, setPdfsFileSource] = useState({})

  let FILE_SOURCE_LIST = {}
  // const webserviceUrl = 'http://dcba0e7ed745.ngrok.io'
  const webserviceUrl = 'http://localhost:5000'


  useEffect(() => {
    const { sequential, CPF } = location.state;
    getConsultAndFiles(sequential, CPF);
  }, [location]);

  async function getConsultAndFiles(sequential, CPF) {
    console.log(sequential, CPF)
    await getImmobileConsult(sequential, CPF);

    FILE_SOURCE_LIST = {
      'IPTU_NEGATIVE_DEBTS': `${sequential}_IPTUNegativeDebts`,
      'LABOR_NEGATIVE_DEBTS': `${CPF}_LaborNegativeDebts`,
      'STATE_NEGATIVE_DEBTS': `${CPF}_StateNegativeDebts`,
      'JFPE_NEGATIVE_DEBTS': `${CPF}_JFPENegativeDebts`,
      'TRF5_NEGATIVE_CRIMINALS': `${CPF}_TRF5NegativeCriminals`,
      'WORKERS_LAWSUIT': `${CPF}_WorkersLawsuit`
    }

    const PDFS_FILE_SOURCE = {
      'IPTU_NEGATIVE_DEBTS': `${webserviceUrl}/get_certificate?file=${FILE_SOURCE_LIST['IPTU_NEGATIVE_DEBTS']}`,
      'LABOR_NEGATIVE_DEBTS': `${webserviceUrl}/get_certificate?file=${FILE_SOURCE_LIST['LABOR_NEGATIVE_DEBTS']}`,
      'STATE_NEGATIVE_DEBTS': `${webserviceUrl}/get_certificate?file=${FILE_SOURCE_LIST['STATE_NEGATIVE_DEBTS']}`,
      'JFPE_NEGATIVE_DEBTS': `${webserviceUrl}/get_certificate?file=${FILE_SOURCE_LIST['JFPE_NEGATIVE_DEBTS']}`,
      'TRF5_NEGATIVE_CRIMINALS': `${webserviceUrl}/get_certificate?file=${FILE_SOURCE_LIST['TRF5_NEGATIVE_CRIMINALS']}`,
      'WORKERS_LAWSUIT': `${webserviceUrl}/get_certificate?file=${FILE_SOURCE_LIST['WORKERS_LAWSUIT']}`
    }

    setPdfsFileSource(PDFS_FILE_SOURCE)
  }

  async function getImmobileConsult(sequential, CPF) {
    // 6907954
    // 89021029472 // 13986430415
    const params = { sequential, CPF }
    let serverRequest = await api.get('/consult', { params });
    let response = await serverRequest.data;

    const { darf, bomberman, ndc_immobile } = response;

    setDARFData(darf);
    setBombermanData(bomberman);
    setNdcImmobileData(ndc_immobile);

  }

  return (
    <div id='page-consult-form' className='container'>
      <header>
        <img src={logoImg} alt='Propi' onClick={() => history.push('/')} />
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
                      <h6>{DARFData.owner}</h6>
                    </div>

                    <div className='card-text-row'>
                      <strong>Receita: </strong>
                      <h6>{DARFData.receipt}</h6>
                    </div>

                    <div className='card-text-row'>
                      <strong>Data limite: </strong>
                      <h6>R$ {DARFData.due_date}</h6>
                    </div>
                  </div>

                  <div className='darf-right-column-content'>
                    <div className='card-text-row'>
                      <strong>Valor principal: </strong>
                      <h6>R$ {DARFData.principal}</h6>
                    </div>

                    <div className='card-text-row'>
                      <strong>Valor multa: </strong>
                      <h6>R$ {DARFData.multa}</h6>
                    </div>

                    <div className='card-text-row'>
                      <strong>Valor juros: </strong>
                      <h6>R$ {DARFData.juros}</h6>
                    </div>

                    <div className='card-text-row'>
                      <strong>Valor total: </strong>
                      <h6>R$ {DARFData.total}</h6>
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
                  {["2016", "2017", "2018", "2019", "2020"].map(year => {
                    if (bombermanData.includes(year)) {
                      return (
                        <div className='card-text-row'>
                          <strong>{year}</strong>
                          <h6>Pendente</h6>
                        </div>
                      )
                    }
                    else {
                      return (
                        <div className='card-text-row'>
                          <strong>{year}</strong>
                          <h6>Sem débitos</h6>
                        </div>
                      )
                    }
                  })}
                </div>
                <div className='payment-file-button'>
                  <h4>Boleto de pagamento</h4>
                  <FontAwesomeIcon icon={faAngleUp} />
                </div>
              </CardBox>

              <CardBox
                title='Certidão Negativa de Débitos Patrimoniais do Imóvel'
                description='Certidão de Domínio da União é um documento hábil para o conhecimento da condição de dominialidade de um imóvel em relação à área da União.'
                staus={ndcImmobileData}
              >
              </CardBox>
            </div>

            <div className='right-column-area'>
              <CardBox
                title='Certidão Negativa de Débitos de IPTU'
                description='Certifica a existência de débitos referentes ao IPTU do imóvel'
              >
                <PDFCardContent fileSrc={pdfsFileSource['IPTU_NEGATIVE_DEBTS']} />
              </CardBox>

              {/* <CardBox
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
              </CardBox> */}
              <br />
              <br />
              <br />
              <br />
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
                <PDFCardContent fileSrc={pdfsFileSource['LABOR_NEGATIVE_DEBTS']} />
              </CardBox>

              <CardBox
                title='Certidão Negativa Criminal'
                description='Constata a existência de ação de natureza criminal contra o CPF/CNPJ apresentado, consultado nos sistemas processuais da respectiva Corte.'
              >
                <PDFCardContent fileSrc={pdfsFileSource['TRF5_NEGATIVE_CRIMINALS']} />
              </CardBox>
            </div>

            <div className='right-column-area'>
              <CardBox
                title='Certidão Negativa de Débitos Estaduais'
                description='A Certidão Negativa de Débitos é o documento emitido pela Secretaria de Estado da Fazenda dando prova da inexistência de pendências e débitos tributários do contribuinte. Quando constam pendências ou dívidas, a Certidão emitida é a chamada Certidão Positiva de Débitos.'
              >
                <PDFCardContent fileSrc={pdfsFileSource['STATE_NEGATIVE_DEBTS']} />
              </CardBox>

              <CardBox
                title='Certidão Negativa da Justiça Federal Pernambuco'
                description='Constata a existência de ação ou execução de natureza criminal, cível e fisca, contra o CPF/CNPJ apresentado, perante na Justiça Federal de 1ª Instância, Seção Judiciária do respectivo Estado, consultado nos registros de distribuição do mesmo.'
              >
                <PDFCardContent fileSrc={pdfsFileSource['JFPE_NEGATIVE_DEBTS']} />
              </CardBox>

              <CardBox
                title='Certidão de Ações Trabalhistas'
                description='Certifica que o CPF/CNPJ não consta nas bases processuais do Tribunal Regional do Trabalho, após validado na Receita Federal. A Certidão de Ações Trabalhistas tem validade por 30 dias após sua emissão e não gera os efeitos da Certidão Negativa de Débitos Trabalhistas - CNDT.'
              >
                <PDFCardContent fileSrc={pdfsFileSource['WORKERS_LAWSUIT']} />
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
