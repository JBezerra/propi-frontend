import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faExpand, faTruckMonster } from '@fortawesome/free-solid-svg-icons'

import api from '../../services/api'
import axios from 'axios'

import CardBox from '../../components/CardBox'
import PDFCardContent from '../../components/PDFCardContent'
import LoadingPage from '../../components/LoadingPage'


import logoImg from '../../assets/images/logo.svg'

import './styles.css';

function ConsultList() {

  const location = useLocation();
  const history = useHistory()

  const [DARFData, setDARFData] = useState({})
  const [bombermanData, setBombermanData] = useState([])
  const [immobileData, setImmobileData] = useState('')

  const [darfServiceDown, setDarfServiceDown] = useState(false)
  const [bombermanServiceDown, setBombermanServiceDown] = useState(false)
  const [immobileServiceDown, setImmobileServiceDown] = useState(false)
  const [trf5ServiceDown, setTrf5ServiceDown] = useState(false)
  const [workersLawsuitServiceDown, setWorkersLawsuitServiceDown] = useState(false)
  const [iptuServiceDown, setIptuServiceDown] = useState(false)
  const [laborServiceDown, setLaborServiceDown] = useState(false)
  const [stateServiceDown, setStateServiceDown] = useState(false)
  const [jfpeServiceDown, setJfpeServiceDown] = useState(false)

  const [pdfsFileSource, setPdfsFileSource] = useState({})

  const [loadingStatus, setLoadingStatus] = useState(true)


  let FILE_SOURCE_LIST = {}
  const webserviceUrl = api.defaults.baseURL;


  useEffect(() => {
    const { sequential, CPF, name } = location.state;
    getConsultAndFiles(sequential, CPF, name);
  }, []);

  async function getConsultAndFiles(sequential, CPF, name) {
    console.log(sequential, CPF, name)

    await getImmobileConsultAndPdfs(sequential, CPF, name);
  }

  async function getImmobileConsultAndPdfs(sequential, CPF, name) {
    // 6907954
    // 89021029472 // 13986430415
    // MARIA DE LOURDES BORBA
    const cpfParam = { "cpf": CPF }
    const sequentialParam = { "sequential": sequential }
    const cpfAndNameParam = { "cpf": CPF, "name": name }

    const darfRequest = api.post(`/consult/darf`, cpfParam).then(response => {
      const { data } = response;
      setDARFData(data);
    }).catch(err => {
      setDarfServiceDown(true);
    })

    const bombermanRequest = api.post(`/consult/bomberman`, sequentialParam).then(response => {
      const { data } = response;
      setBombermanData(data.pendent_years);
    }).catch(err => {
      setBombermanServiceDown(true);
    })


    const immobileRequest = api.post(`/consult/immobile`, cpfParam).then(response => {
      const { data } = response;
      console.log(data.pendent)
      setImmobileData(data.pendent);
    }).catch(err => {
      setImmobileServiceDown(true);
    })

    const trf5Request = api.post(`/consult/trf5`, cpfAndNameParam).catch(err => {
      setTrf5ServiceDown(true);
    })

    const workersLawsuitRequest = api.post(`/consult/workers-lawsuit`, cpfParam).catch(err => {
      setWorkersLawsuitServiceDown(true);
    })

    const iptuRequest = api.post(`/consult/iptu`, sequentialParam).catch(err => {
      setIptuServiceDown(true);
    })

    const laborRequest = api.post(`/consult/labor`, cpfParam).catch(err => {
      setLaborServiceDown(true);
    })

    const stateRequest = api.post(`/consult/state`, cpfParam).catch(err => {
      setStateServiceDown(true);
    })

    const jfpeRequest = api.post(`/consult/jfpe`, cpfAndNameParam).catch(err => {
      setJfpeServiceDown(true);
    })

    Promise.all([bombermanRequest, darfRequest, immobileRequest,
      trf5Request, workersLawsuitRequest, iptuRequest, laborRequest,
      stateRequest, jfpeRequest]).then(resolve => {
        setLoadingStatus(false)
        getPdfsFiles(CPF, sequential)
      })

  }

  function getPdfsFiles(CPF, sequential) {
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

  return (
    <div id='page-consult-form' className='container'>
      {loadingStatus && <LoadingPage />}
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
                pendent={!Object.keys(DARFData).length == 0}
                serviceDown={darfServiceDown}
              >
                {!darfServiceDown && Object.keys(DARFData).length != 0 &&
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
                        <h6>{DARFData.due_date}</h6>
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
                }

                <div className='payment-file-button'>
                  {/* <h4>Boleto de pagamento</h4>
                  <FontAwesomeIcon icon={faAngleUp} /> */}
                </div>
              </CardBox>

              <CardBox
                title='Taxa de Bombeiro'
                description='Certifica a existência de débitos referentes A Taxa de Prevenção e Extinção de Incêndios (TPEI).'
                pendent={!bombermanData.length == 0}
                serviceDown={bombermanServiceDown}
              >
                {!bombermanServiceDown && bombermanData.length != 0 &&
                  <div className='tpei-content'>
                    {["2016", "2017", "2018", "2019", "2020"].map(year => {
                      if (bombermanData.includes(year)) {
                        return (
                          <div key={year} className='card-text-row'>
                            <strong>{year}</strong>
                            <h6>Pendente</h6>
                          </div>
                        )
                      }
                      else {
                        return (
                          <div key={year} className='card-text-row'>
                            <strong>{year}</strong>
                            <h6>Sem débitos</h6>
                          </div>
                        )
                      }
                    })}
                  </div>
                }
                <div className='payment-file-button'>
                  {/* <h4>Boleto de pagamento</h4>
                  <FontAwesomeIcon icon={faAngleUp} /> */}
                </div>
              </CardBox>

              <CardBox
                title='Certidão Negativa de Débitos Patrimoniais do Imóvel'
                description='Certidão de Domínio da União é um documento hábil para o conhecimento da condição de dominialidade de um imóvel em relação à área da União.'
                pendent={immobileData}
                serviceDown={immobileServiceDown}
              >
              </CardBox>
            </div>

            <div className='right-column-area'>
              <CardBox
                title='Certidão Negativa de Débitos de IPTU'
                description='Certifica a existência de débitos referentes ao IPTU do imóvel'
                serviceDown={iptuServiceDown}
              >
                {!iptuServiceDown &&
                  <PDFCardContent fileSrc={pdfsFileSource['IPTU_NEGATIVE_DEBTS']} />
                }
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
                serviceDown={laborServiceDown}
              >
                {!laborServiceDown &&
                  <PDFCardContent fileSrc={pdfsFileSource['LABOR_NEGATIVE_DEBTS']} />
                }
              </CardBox>

              <CardBox
                title='Certidão Negativa Criminal'
                description='Constata a existência de ação de natureza criminal contra o CPF/CNPJ apresentado, consultado nos sistemas processuais da respectiva Corte.'
                serviceDown={trf5ServiceDown}
              >
                {!trf5ServiceDown &&
                  <PDFCardContent fileSrc={pdfsFileSource['TRF5_NEGATIVE_CRIMINALS']} />
                }
              </CardBox>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>

            <div className='right-column-area'>
              <CardBox
                title='Certidão Negativa de Débitos Estaduais'
                description='A Certidão Negativa de Débitos é o documento emitido pela Secretaria de Estado da Fazenda dando prova da inexistência de pendências e débitos tributários do contribuinte. Quando constam pendências ou dívidas, a Certidão emitida é a chamada Certidão Positiva de Débitos.'
                serviceDown={stateServiceDown}
              >
                {!stateServiceDown &&
                  <PDFCardContent fileSrc={pdfsFileSource['STATE_NEGATIVE_DEBTS']} />
                }
              </CardBox>

              <CardBox
                title='Certidão Negativa da Justiça Federal Pernambuco'
                description='Constata a existência de ação ou execução de natureza criminal, cível e fisca, contra o CPF/CNPJ apresentado, perante na Justiça Federal de 1ª Instância, Seção Judiciária do respectivo Estado, consultado nos registros de distribuição do mesmo.'
                serviceDown={jfpeServiceDown}
              >
                {!jfpeServiceDown &&
                  <PDFCardContent fileSrc={pdfsFileSource['JFPE_NEGATIVE_DEBTS']} />
                }
              </CardBox>

              <CardBox
                title='Certidão de Ações Trabalhistas'
                description='Certifica que o CPF/CNPJ não consta nas bases processuais do Tribunal Regional do Trabalho, após validado na Receita Federal. A Certidão de Ações Trabalhistas tem validade por 30 dias após sua emissão e não gera os efeitos da Certidão Negativa de Débitos Trabalhistas - CNDT.'
                serviceDown={workersLawsuitServiceDown}
              >
                {!workersLawsuitServiceDown &&
                  <PDFCardContent fileSrc={pdfsFileSource['WORKERS_LAWSUIT']} />
                }
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
