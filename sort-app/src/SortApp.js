import React, { useState, useEffect } from 'react'
import XLSX from 'xlsx';
import { Card, Col, Row, Spin } from 'antd';
import { Typography } from 'antd';
import { LoadingOutlined, RightOutlined } from '@ant-design/icons';
import fanta from './assets/fanta.png'
import { notification } from "antd";
import './sorteoApp.css';
import { useSort } from './hooks/useSort';
import confetti from "canvas-confetti";

const { Title } = Typography

export const SortApp = () => {

    const [users, setUsers] = useState([]);
    const [ganador, setGanador] = useState();
    const [loading, setLoading] = useState(false)
    const { getSort, nuevoSorteo, sorts } = useSort();

    const readFile = (e) => {

        let label = e.target.nextElementSibling;
        let labelVal = label.innerHTML;
        let fileName = '';
        fileName = (e.target.getAttribute('data-multiple-caption') || '').replace('{count}', e.target.files.length);
        if (fileName) {
            label.querySelector('span').innerHTML = fileName
        } else {
            label.innerHTML = labelVal
        }
        const file = e.target.files[0];
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (e) => {
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: 'buffer' });

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                setUsers(data);

                resolve(data);

                notification['success']({
                    message: 'Archivo cargado correctamente'
                })

            }

            fileReader.onerror = ((error) => {
                reject(error);
            })

        })

        promise.then((d) => {
            console.log(d);
        })
    }

    useEffect(() => {
        getSort(false);
    }, [getSort])

    const sortear = (participantes) => {
        const numGanador = Math.round(Math.random() * participantes.length);
        
        if(!numGanador){
            notification["error"]({
                message:"Cargar nuevamente los participantes"
            })
            return {
                nombre: '',
                nummero: ''
            };
        }
        
        const { nombre, numero } = users[numGanador];

        return {
            nombre,
            numero
        }
    }

    const onFinish = (e, second) => {
        if (!second) {
            setLoading(true)
            console.log('Se está enviando el formulario')
            e.preventDefault();
            const { nombre, numero } = sortear(users);
            if(nombre === '' || numero === '') {
                setLoading(false);
                return false;
            }
            setGanador({ nombre, numero })
            setTimeout(() => {
                setLoading(false);
                confetti({
                    particleCount: 300,
                    spread: 100
                  });
            }, 2000);
        } else {
            setLoading(true)
            e.preventDefault();
            const { nombre, numero } = sortear(users);
            setGanador({ nombre, numero })
            if(nombre === '' || numero === '') {
                setLoading(false);
                return false;
            }
            setTimeout(() => {
                setLoading(false);
                confetti({
                    particleCount: 150,
                    spread: 60
                  });
            }, 2000);

            const data = {
                winner: ganador.nombre,
                n_sort: sorts + 1,
                phone: ganador.numero,
                requirements: false
            }

            nuevoSorteo(data, false);
        }

    };

    const isWinner = (e) => {
        e.preventDefault();
        const data = {
            winner: ganador.nombre,
            n_sort: sorts + 1,
            phone: ganador.numero,
            requirements: true
        }

        nuevoSorteo(data, false);
        setGanador("");
    }



    const antIcon = <LoadingOutlined spin />;


    return (
        <>
            <Spin spinning={loading} size="large" tip="Cargando..." indicator={antIcon} >
                <div className="container">
                    <div className="header">
                        <Title style={{ color: 'rgba(255, 130, 0, 0.95)', marginTop: '10px' }}>Sorteo RM N° {sorts + 1}</Title>
                        <img
                            src={fanta}
                            alt="logo_fanta"
                        />
                    </div>
                    {
                        !ganador &&
                        <div className='form'>
                            <form>
                                <div className="container-input">
                                    <input type="file" name="file-1" id="file-1" className="inputfile inputfile-1" data-multiple-caption="{count} archivos seleccionados" multiple onChange={e => readFile(e)} />
                                    <label htmlFor="file-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="iborrainputfile" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                                        <span className="iborrainputfile">Seleccionar archivo</span>
                                    </label>
                                    <input type="button" className="inputfile inputfile-1" />
                                    <label>
                                        <RightOutlined />
                                        <span className="iborrainputfile" onClick={e => onFinish(e)}>Realizar Sorteo</span>
                                    </label>
                                </div>
                            </form>

                        </div>
                    }
                    {
                        ganador &&
                        <Row className="winner" gutter={24}>
                            <Col span={12} >
                                <Card title="Número Ganador" bordered={false} style={{ width: 300 }}>
                                    <Title>{ganador.numero}</Title>
                                </Card>
                            </Col>
                            <Col span={12} style={{paddingLeft:"30px"}} >
                                <button onClick={e => isWinner(e)} className="btn">SI CUMPLE</button>
                                <button onClick={e => onFinish(e, true)} style={{ marginTop: '10px' }} className="btn">NO CUMPLE</button>
                            </Col>
                        </Row>
                    }
                </div>

            </Spin>
        </>
    )
}
