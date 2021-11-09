import React, { useState, useEffect } from 'react'
import XLSX from 'xlsx';
import { Card, Col, Row, Spin } from 'antd';
import { Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, RightOutlined } from '@ant-design/icons';
import fanta from '../assets/logo.jpeg'
import { notification } from "antd";
import '../sorteoApp.css';
import { useSort } from '../hooks/useSort';
import confetti from "canvas-confetti";
import { Select } from 'antd';
const { Option } = Select;

const { Text, Title } = Typography

export const SortReg = () => {

    const [users, setUsers] = useState([]);
    const [ganador, setGanador] = useState();
    const [ganadores, setGanadores] = useState([]);
    const [loading, setLoading] = useState(false)
    const { getSort, nuevoSorteo, sortsReg } = useSort();
    const [youtube, setYoutube] = useState(0);
    const [parlantes, setParlantes] = useState(0);
    const [mesas, setMesas] = useState(0);

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

    const onChange = (value) => {
        setYoutube(value);
    }

    const onChangeParlantes = (value) => {
        setParlantes(value);
    }

    const onChangeMesas = (value) => {
        setMesas(value);
    }


    useEffect(() => {
        getSort(true);
    }, [getSort])

    const sortear = (participantes) => {
        const numGanador = Math.floor(Math.random() * (participantes.length));

        console.log(participantes);

        console.log(numGanador);

        if (participantes.length === 0) {
            notification["error"]({
                message: "No hay suficientes participantes "
            })
            return {
                nombre: '',
                nummero: '',
            };
        }

        //Agrego los números de sorteos de youtube
        const nombre = users[numGanador]['Nombre completo']
        const numero = users[numGanador].Teléfono

        users.splice(numGanador, 1);

        return {
            nombre,
            numero
        }
    }

    const onFinish = (e, second) => {

        if (users.length === 0) {
            notification["error"]({
                message: "Se deben cargar los participantes"
            })

            return;
        }

        if (!second) {
            setLoading(true)
            e.preventDefault();
            //Sorteo de veces de youtube
            let winners = [];
            for (let index = 1; index <= youtube; index++) {
                console.log('sorteo youtubue ' + index + ' Participantes ' + users.length);
                let { nombre, numero } = sortear(users);
                if (nombre === '' || numero === '') {
                    setLoading(false);
                    return false;
                }
                winners.push({ nombre, numero, premio: 'Youtube' });
                if (index === youtube) {
                    setGanadores(winners)
                }
            }
            //Sorteo de veces de parlantes
            for (let index = 1; index <= parlantes; index++) {
                console.log('sorteo Parlantes ' + index + ' Participantes ' + users.length);
                let { nombre, numero } = sortear(users);
                if (nombre === '' || numero === '') {
                    setLoading(false);
                    return false;
                }
                winners.push({ nombre, numero, premio: 'Parlante' });
                if (index === parlantes) {
                    setGanadores(winners)
                }
            }
            //Sorteo de veces de mesa
            for (let index = 1; index <= mesas; index++) {
                console.log('sorteo mesa ' + index + ' Participantes ' + users.length);
                let { nombre, numero } = sortear(users);
                if (nombre === '' || numero === '') {
                    setLoading(false);
                    return false;
                }
                winners.push({ nombre, numero, premio: 'Mesa Dj' });
                if (index === youtube) {
                    setGanadores(winners)
                }
            }

            setTimeout(() => {
                setLoading(false);
                setGanador(true);
                confetti({
                    particleCount: 150,
                    spread: 60
                });
            }, 2000);
        } else {
            setLoading(true)
            console.log('Se está enviando el formulario')
            e.preventDefault();
            const { nombre, numero } = sortear(users);
            if (nombre === '' || numero === '') {
                setLoading(false);
                return false;
            }
            setGanador({ nombre, numero })
            setTimeout(() => {
                setLoading(false);
                confetti({
                    particleCount: 150,
                    spread: 60
                });
            }, 2000);

            const data = {
                winner: ganador.nombre,
                n_sort: sortsReg + 1,
                phone: ganador.numero,
                requirements: false
            }
            nuevoSorteo(data, true);
        }

    };

    const cumple = (e,numero, premio) => {
        e.preventDefault();
        const data = {
            winner: ganador.nombre,
            n_sort: sortsReg + 1,
            phone: numero,
            premio, premio,
            requirements: true
        }

        nuevoSorteo(data, true);
        let newArray = ganadores.filter(ganador => ganador.numero !== numero);
        setGanadores(newArray);
    }

    const noCumple = (e, numero) =>{
        e.preventDefault();
        let newArray = ganadores.filter(ganador => ganador.numero !== numero);
        setGanadores(newArray);
    }



    const antIcon = <LoadingOutlined spin />;


    return (
        <>
            <Spin spinning={loading} size="large" tip="Cargando..." indicator={antIcon} >
                <div className="container">
                    <div className="header">
                        <Title style={{ color: '#059436', marginTop: '10px' }}>Sorteo Embono N° {sortsReg + 1}</Title>
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
                                    {/* Youtube */}

                                    <Select
                                        showSearch
                                        style={{ width: 200, margin: '10px 0', borderRadius: '10px' }}
                                        placeholder="N° Youtube"
                                        optionFilterProp="children"
                                        onChange={onChange}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Option value={0}>0</Option>
                                        <Option value={1}>1</Option>
                                        <Option value={2}>2</Option>
                                        <Option value={3}>3</Option>
                                        <Option value={4}>4</Option>
                                        <Option value={5}>5</Option>
                                        <Option value={6}>6</Option>
                                        <Option value={7}>7</Option>
                                        <Option value={8}>8</Option>
                                        <Option value={9}>9</Option>
                                        <Option value={10}>10</Option>
                                    </Select>
                                    {/* Parlantes */}

                                    <Select
                                        showSearch
                                        style={{ width: 200, margin: '10px 0', borderRadius: '10px' }}
                                        placeholder="N° Parlantes"
                                        optionFilterProp="children"
                                        onChange={onChangeParlantes}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Option value={0}>0</Option>
                                        <Option value={1}>1</Option>
                                        <Option value={2}>2</Option>
                                        <Option value={3}>3</Option>
                                        <Option value={4}>4</Option>
                                        <Option value={5}>5</Option>
                                        <Option value={6}>6</Option>
                                        <Option value={7}>7</Option>
                                        <Option value={8}>8</Option>
                                        <Option value={9}>9</Option>
                                        <Option value={10}>10</Option>
                                    </Select>
                                    {/* Mesa */}

                                    <Select
                                        showSearch
                                        style={{ width: 200, margin: '10px 0', borderRadius: '10px' }}
                                        placeholder="N° Mesas Dj"
                                        optionFilterProp="children"
                                        onChange={onChangeMesas}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Option value={0}>0</Option>
                                        <Option value={1}>1</Option>
                                        <Option value={2}>2</Option>
                                        <Option value={3}>3</Option>
                                        <Option value={4}>4</Option>
                                        <Option value={5}>5</Option>
                                        <Option value={6}>6</Option>
                                        <Option value={7}>7</Option>
                                        <Option value={8}>8</Option>
                                        <Option value={9}>9</Option>
                                        <Option value={10}>10</Option>
                                    </Select>

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
                        <Row className="winner" gutter={24} >
                            <Col span={24} >
                                <Card title="GANADORES" bordered={false} style={{ width: '100%' }}>
                                    {
                                        ganadores.map((ganador, i) => {
                                            return (
                                                <div
                                                    key={ganador.numero}
                                                >
                                                    <Text>{i + 1} - </Text>
                                                    <Text>{ganador.numero}</Text>
                                                    <Text> - {ganador.premio}</Text>
                                                    <CheckCircleOutlined style={{color:'green', fontSize:'32px', margin:'10px', cursor:'pointer'}}
                                                        onClick={e => cumple(e, ganador.numero, ganador.premio)}
                                                    />
                                                    <CloseCircleOutlined style={{color:'red', fontSize:'32px', cursor:'pointer'}}
                                                        onClick={e => noCumple(e, ganador.numero)}
                                                    />
                                                    {/* <button onClick={e => isWinner(e)} className="btn">SI CUMPLE</button>
                                                    <button onClick={e => onFinish(e, true)} style={{ marginTop: '10px' }} className="btn">NO CUMPLE</button> */}
                                                    <br />
                                                </div>
                                            )
                                        })
                                    }
                                </Card>
                            </Col>
                            {/* <Col span={12} style={{ paddingLeft: "30px" }} >
                            </Col> */}
                        </Row>
                    }
                </div>

            </Spin>
        </>
    )
}
