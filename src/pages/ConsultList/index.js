import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faAngleDown, faExpand, faTruckMonster } from '@fortawesome/free-solid-svg-icons'
import { UnmountClosed } from 'react-collapse';


import api from '../../services/api'

import PDFModal from '../../components/PDFModal';
import CardBox from '../../components/CardBox'
import PDFCardContent from '../../components/PDFCardContent'
import LoadingPage from '../../components/LoadingPage'


import logoImg from '../../assets/images/logo.svg'

import './styles.css';

function ConsultList() {

  const location = useLocation();
  const history = useHistory()

  const [sequential, setSequential] = useState('')
  const [CPF, setCPF] = useState('')
  const [name, setName] = useState('')

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

  const [darfReloadState, setDarfReloadState] = useState(false)
  const [bombermanReloadState, setBombermanReloadState] = useState(false)
  const [immobileReloadState, setImmobileReloadState] = useState(false)
  const [trf5ReloadState, setTrf5ReloadState] = useState(false)
  const [workersLawsuitReloadState, setWorkersLawsuitReloadState] = useState(false)
  const [iptuReloadState, setIptuReloadState] = useState(false)
  const [laborReloadState, setLaborReloadState] = useState(false)
  const [stateReloadState, setStateReloadState] = useState(false)
  const [jfpeReloadState, setJfpeReloadState] = useState(false)

  const [pdfsFileSource, setPdfsFileSource] = useState({})

  const [loadingStatus, setLoadingStatus] = useState(true)

  const [openPDFModal, setOpenPDFModal] = useState(false)
  const [PDFModalFileSrc, setPDFModalFileSrc] = useState('')

  const [darfPaymentPDFOpen, setDarfPaymentPDFOpen] = useState(false)
  const [bombermanPaymentPDFOpen, setBombermanPaymentPDFOpen] = useState(false)

  let FILE_SOURCE_LIST = {}
  const webserviceUrl = api.defaults.baseURL;


  useEffect(() => {
    const { sequentialInput, CPFInput, nameInput } = location.state;
    console.log(sequentialInput, CPFInput, nameInput)

    setCPF(CPFInput)
    setSequential(sequentialInput)
    setName(nameInput)

    getConsultAndFiles(sequentialInput, CPFInput, nameInput);
  }, []);

  const darfRequestHandler = () => {
    if (!darfReloadState) {
      setDarfReloadState(true)
      const cpfParam = { "cpf": CPF }
      api.post(`/consult/darf`, cpfParam).then(response => {
        const { data } = response;
        setDARFData(data);
        setDarfReloadState(false)
        getPdfsFiles(CPF, sequential)
      }).catch(err => {
        setDarfServiceDown(true);
        setDarfReloadState(false)
      })
    }
  }

  const bombermanRequestHandler = () => {
    if (!bombermanReloadState) {
      setBombermanReloadState(true)
      const sequentialParam = { "sequential": sequential }
      api.post(`/consult/bomberman`, sequentialParam).then(response => {
        const { data } = response;
        setBombermanData(data.pendent_years);
        setBombermanReloadState(false)
        getPdfsFiles(CPF, sequential)
      }).catch(err => {
        setBombermanReloadState(false)
        setBombermanServiceDown(true);
      })
    }
  }

  const immobileRequestHandler = () => {
    if (!immobileReloadState) {
      setImmobileReloadState(true)
      const cpfParam = { "cpf": CPF }
      api.post(`/consult/immobile`, cpfParam).then(response => {
        const { data } = response;
        setImmobileData(data.pendent);
        setImmobileReloadState(false)
      }).catch(err => {
        setImmobileReloadState(false)
        setImmobileServiceDown(true);
      })
    }
  }

  const trf5RequestHandler = () => {
    if (!trf5ReloadState) {
      setTrf5ReloadState(true);
      const cpfAndNameParam = { "cpf": CPF, "name": name }
      api.post(`/consult/trf5`, cpfAndNameParam).then(data => {
        getPdfsFiles(CPF, sequential)
        setTrf5ReloadState(false);
      }).catch(err => {
        setTrf5ReloadState(false);
        setTrf5ServiceDown(true);
      })
    }
  }

  const workersLawsuitRequestHandler = () => {
    if (!workersLawsuitReloadState) {
      setWorkersLawsuitReloadState(true)
      const cpfParam = { "cpf": CPF }
      api.post(`/consult/workers-lawsuit`, cpfParam).then(data => {
        getPdfsFiles(CPF, sequential)
        setWorkersLawsuitReloadState(false)
      }).catch(err => {
        setWorkersLawsuitReloadState(false)
        setWorkersLawsuitServiceDown(true);
      })
    }
  }

  const iptuRequestHandler = () => {
    if (!iptuReloadState) {
      setIptuReloadState(true)
      const sequentialParam = { "sequential": sequential }
      api.post(`/consult/iptu`, sequentialParam).then(data => {
        getPdfsFiles(CPF, sequential)
        setIptuReloadState(false)
      }).catch(err => {
        setIptuReloadState(false)
        setIptuServiceDown(true);
      })
    }
  }

  const laborRequestHandler = () => {
    if (!laborReloadState) {
      setLaborReloadState(true)
      const cpfParam = { "cpf": CPF }
      api.post(`/consult/labor`, cpfParam).then(data => {
        getPdfsFiles(CPF, sequential)
        setLaborReloadState(false)
      }).catch(err => {
        setLaborReloadState(false)
        setLaborServiceDown(true);
      })
    }
  }

  const stateRequestHandler = () => {
    if (!stateReloadState) {
      setStateReloadState(true)
      const cpfParam = { "cpf": CPF }
      api.post(`/consult/state`, cpfParam).then(data => {
        getPdfsFiles(CPF, sequential)
        setStateReloadState(false)
      }).catch(err => {
        setStateReloadState(false)
        setStateServiceDown(true);
      })
    }
  }

  const jfpeRequestHandler = () => {
    if (!jfpeReloadState) {
      setJfpeReloadState(true)
      const cpfAndNameParam = { "cpf": CPF, "name": name }
      api.post(`/consult/jfpe`, cpfAndNameParam).then(data => {
        getPdfsFiles(CPF, sequential)
        setJfpeReloadState(false);
      }).catch(err => {
        setJfpeReloadState(false);
        setJfpeServiceDown(true);
      })
    }
  }

  async function getConsultAndFiles(sequentialInput, CPFInput, nameInput) {
    await getImmobileConsultAndPdfs(sequentialInput, CPFInput, nameInput);
  }

  async function getImmobileConsultAndPdfs(sequentialInput, CPFInput, nameInput) {
    // 6907954 // 89021029472 // 13986430415 // MARIA DE LOURDES BORBA

    // const cpfParam = { "cpf": CPFInput }
    // const sequentialParam = { "sequential": sequentialInput }
    // const cpfAndNameParam = { "cpf": CPFInput, "name": nameInput }

    // const darfRequest = api.post(`/consult/darf`, cpfParam).then(response => {
    //   const { data } = response;
    //   setDARFData(data);
    // }).catch(err => {
    //   setDarfServiceDown(true);
    // })

    // const bombermanRequest = api.post(`/consult/bomberman`, sequentialParam).then(response => {
    //   const { data } = response;
    //   setBombermanData(data.pendent_years);
    // }).catch(err => {
    //   setBombermanServiceDown(true);
    // })


    // const immobileRequest = api.post(`/consult/immobile`, cpfParam).then(response => {
    //   const { data } = response;
    //   console.log(data.pendent)
    //   setImmobileData(data.pendent);
    // }).catch(err => {
    //   setImmobileServiceDown(true);
    // })

    // const trf5Request = api.post(`/consult/trf5`, cpfAndNameParam).catch(err => {
    //   setTrf5ServiceDown(true);
    // })

    // const workersLawsuitRequest = api.post(`/consult/workers-lawsuit`, cpfParam).catch(err => {
    //   setWorkersLawsuitServiceDown(true);
    // })

    // const iptuRequest = api.post(`/consult/iptu`, sequentialParam).catch(err => {
    //   setIptuServiceDown(true);
    // })

    // const laborRequest = api.post(`/consult/labor`, cpfParam).catch(err => {
    //   setLaborServiceDown(true);
    // })

    // const stateRequest = api.post(`/consult/state`, cpfParam).catch(err => {
    //   setStateServiceDown(true);
    // })

    // const jfpeRequest = api.post(`/consult/jfpe`, cpfAndNameParam).catch(err => {
    //   setJfpeServiceDown(true);
    // })

    // Promise.all([bombermanRequest, darfRequest, immobileRequest,
    //   trf5Request, workersLawsuitRequest, iptuRequest, laborRequest,
    //   stateRequest, jfpeRequest]).then(resolve => {
    //     setLoadingStatus(false)
    //     getPdfsFiles(CPFInput, sequentialInput)
    //   })
    setLoadingStatus(false)
    getPdfsFiles(CPFInput, sequentialInput)
  }

  function getPdfsFiles(CPF, sequential) {
    FILE_SOURCE_LIST = {
      'IPTU_NEGATIVE_DEBTS': `${sequential}_IPTUNegativeDebts`,
      'DARF_PAYMENT': `${CPF}_DARFPayment`,
      'BOMBERMAN_PAYMENT': `${sequential}_BombermanPayment`,
      'LABOR_NEGATIVE_DEBTS': `${CPF}_LaborNegativeDebts`,
      'STATE_NEGATIVE_DEBTS': `${CPF}_StateNegativeDebts`,
      'JFPE_NEGATIVE_DEBTS': `${CPF}_JFPENegativeDebts`,
      'TRF5_NEGATIVE_CRIMINALS': `${CPF}_TRF5NegativeCriminals`,
      'WORKERS_LAWSUIT': `${CPF}_WorkersLawsuit`
    }
    const PDFS_FILE_SOURCE = {
      'IPTU_NEGATIVE_DEBTS': `${webserviceUrl}/get_certificate?file=${FILE_SOURCE_LIST['IPTU_NEGATIVE_DEBTS']}`,
      'DARF_PAYMENT': `${webserviceUrl}/get_certificate?file=${FILE_SOURCE_LIST['DARF_PAYMENT']}`,
      'BOMBERMAN_PAYMENT': `${webserviceUrl}/get_certificate?file=${FILE_SOURCE_LIST['BOMBERMAN_PAYMENT']}`,
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
      {openPDFModal && <PDFModal PDFFileSrc={PDFModalFileSrc} closeModal={() => { setOpenPDFModal(false) }} />}
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
                reloadHandler={darfRequestHandler}
                reloadState={darfReloadState}
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
                <div className='payment-file-container'>
                  <div className='payment-file-button' onClick={() => {
                    setDarfPaymentPDFOpen(!darfPaymentPDFOpen)
                    getPdfsFiles(CPF, sequential)
                  }}>
                    <h4>Boleto de pagamento</h4>
                    <FontAwesomeIcon
                      icon={darfPaymentPDFOpen ? faAngleDown : faAngleUp}
                    />
                  </div>
                  <div className="payment-file">
                    <UnmountClosed isOpened={darfPaymentPDFOpen} className='payment-file'>
                      <PDFCardContent fileSrc={pdfsFileSource['DARF_PAYMENT']} />
                      <div className='modal-pdf-button' onClick={() => {
                        setOpenPDFModal(true)
                        setPDFModalFileSrc(pdfsFileSource['DARF_PAYMENT'])
                      }}>
                        <h6>Expandir documento</h6>
                        <FontAwesomeIcon icon={faExpand} size='xs' />
                      </div>
                    </UnmountClosed>
                  </div>
                </div>
              </CardBox>

              <CardBox
                title='Taxa de Bombeiro'
                description='Certifica a existência de débitos referentes A Taxa de Prevenção e Extinção de Incêndios (TPEI).'
                pendent={!bombermanData.length == 0}
                serviceDown={bombermanServiceDown}
                reloadHandler={bombermanRequestHandler}
                reloadState={bombermanReloadState}
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
                <div className='payment-file-container'>
                  <div className='payment-file-button' onClick={() => {
                    setBombermanPaymentPDFOpen(!bombermanPaymentPDFOpen)
                    getPdfsFiles(CPF, sequential)
                  }}>
                    <h4>Boleto de pagamento</h4>
                    <FontAwesomeIcon
                      icon={bombermanPaymentPDFOpen ? faAngleDown : faAngleUp}
                    />
                  </div>
                  <div className="payment-file">
                    <UnmountClosed isOpened={bombermanPaymentPDFOpen} className='payment-file'>
                      <PDFCardContent fileSrc={pdfsFileSource['BOMBERMAN_PAYMENT']} />
                      <div className='modal-pdf-button' onClick={() => {
                        setOpenPDFModal(true)
                        setPDFModalFileSrc(pdfsFileSource['BOMBERMAN_PAYMENT'])
                      }}>
                        <h6>Expandir documento</h6>
                        <FontAwesomeIcon icon={faExpand} size='xs' />
                      </div>
                    </UnmountClosed>
                  </div>
                </div>
              </CardBox>

              <CardBox
                title='Certidão Negativa de Débitos Patrimoniais do Imóvel'
                description='Certidão de Domínio da União é um documento hábil para o conhecimento da condição de dominialidade de um imóvel em relação à área da União.'
                pendent={immobileData}
                serviceDown={immobileServiceDown}
                reloadHandler={immobileRequestHandler}
                reloadState={immobileReloadState}
              >
              </CardBox>
            </div>

            <div className='right-column-area'>
              <CardBox
                title='Certidão Negativa de Débitos de IPTU'
                description='Certifica a existência de débitos referentes ao IPTU do imóvel'
                serviceDown={iptuServiceDown}
                reloadHandler={iptuRequestHandler}
                reloadState={iptuReloadState}
              >
                {!iptuServiceDown &&
                  <>
                    <PDFCardContent fileSrc={pdfsFileSource['IPTU_NEGATIVE_DEBTS']} />
                    <div className='modal-pdf-button' onClick={() => {
                      setOpenPDFModal(true)
                      setPDFModalFileSrc(pdfsFileSource['IPTU_NEGATIVE_DEBTS'])
                    }}>
                      <h6>Expandir documento</h6>
                      <FontAwesomeIcon icon={faExpand} size='xs' />
                    </div>
                  </>
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
                reloadHandler={laborRequestHandler}
                reloadState={laborReloadState}
              >
                {!laborServiceDown &&
                  <>
                    <PDFCardContent fileSrc={pdfsFileSource['LABOR_NEGATIVE_DEBTS']} />
                    <div className='modal-pdf-button' onClick={() => {
                      setOpenPDFModal(true)
                      setPDFModalFileSrc(pdfsFileSource['LABOR_NEGATIVE_DEBTS'])
                    }}>
                      <h6>Expandir documento</h6>
                      <FontAwesomeIcon icon={faExpand} size='xs' />
                    </div>
                  </>
                }
              </CardBox>

              <CardBox
                title='Certidão Negativa Criminal'
                description='Constata a existência de ação de natureza criminal contra o CPF/CNPJ apresentado, consultado nos sistemas processuais da respectiva Corte.'
                serviceDown={trf5ServiceDown}
                reloadHandler={trf5RequestHandler}
                reloadState={trf5ReloadState}
              >
                {!trf5ServiceDown &&
                  <>
                    <PDFCardContent fileSrc={pdfsFileSource['TRF5_NEGATIVE_CRIMINALS']} />
                    <div className='modal-pdf-button' onClick={() => {
                      setOpenPDFModal(true)
                      setPDFModalFileSrc(pdfsFileSource['TRF5_NEGATIVE_CRIMINALS'])
                    }}>
                      <h6>Expandir documento</h6>
                      <FontAwesomeIcon icon={faExpand} size='xs' />
                    </div>
                  </>
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
                reloadHandler={stateRequestHandler}
                reloadState={stateReloadState}
              >
                {!stateServiceDown &&
                  <>
                    <PDFCardContent fileSrc={pdfsFileSource['STATE_NEGATIVE_DEBTS']} />
                    <div className='modal-pdf-button' onClick={() => {
                      setOpenPDFModal(true)
                      setPDFModalFileSrc(pdfsFileSource['STATE_NEGATIVE_DEBTS'])
                    }}>
                      <h6>Expandir documento</h6>
                      <FontAwesomeIcon icon={faExpand} size='xs' />
                    </div>
                  </>
                }
              </CardBox>

              <CardBox
                title='Certidão Negativa da Justiça Federal Pernambuco'
                description='Constata a existência de ação ou execução de natureza criminal, cível e fisca, contra o CPF/CNPJ apresentado, perante na Justiça Federal de 1ª Instância, Seção Judiciária do respectivo Estado, consultado nos registros de distribuição do mesmo.'
                serviceDown={jfpeServiceDown}
                reloadHandler={jfpeRequestHandler}
                reloadState={jfpeReloadState}
              >
                {!jfpeServiceDown &&
                  <>
                    <PDFCardContent fileSrc={pdfsFileSource['JFPE_NEGATIVE_DEBTS']} />
                    <div className='modal-pdf-button' onClick={() => {
                      setOpenPDFModal(true)
                      setPDFModalFileSrc(pdfsFileSource['JFPE_NEGATIVE_DEBTS'])
                    }}>
                      <h6>Expandir documento</h6>
                      <FontAwesomeIcon icon={faExpand} size='xs' />
                    </div>
                  </>
                }
              </CardBox>

              <CardBox
                title='Certidão de Ações Trabalhistas'
                description='Certifica que o CPF/CNPJ não consta nas bases processuais do Tribunal Regional do Trabalho, após validado na Receita Federal. A Certidão de Ações Trabalhistas tem validade por 30 dias após sua emissão e não gera os efeitos da Certidão Negativa de Débitos Trabalhistas - CNDT.'
                serviceDown={workersLawsuitServiceDown}
                reloadHandler={workersLawsuitRequestHandler}
                reloadState={workersLawsuitReloadState}
              >
                {!workersLawsuitServiceDown &&
                  <>
                    <PDFCardContent fileSrc={pdfsFileSource['WORKERS_LAWSUIT']} />
                    <div className='modal-pdf-button' onClick={() => {
                      setOpenPDFModal(true)
                      setPDFModalFileSrc(pdfsFileSource['WORKERS_LAWSUIT'])
                    }}>
                      <h6>Expandir documento</h6>
                      <FontAwesomeIcon icon={faExpand} size='xs' />
                    </div>
                  </>
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
