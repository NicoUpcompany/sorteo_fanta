import { Row, Col, Typography, Table, Input, Space, Button, Spin, notification, ConfigProvider } from 'antd'
import es_ES from 'antd/es/locale/es_ES';
import { SearchOutlined, ExportOutlined} from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import Highlighter from 'react-highlight-words';
import { getSortApi } from '../api/sort';
import { getSortRegApi } from '../api/sortReg';
import XLSX from 'xlsx';
import { ExportSheet } from 'react-xlsx-sheet';

const { Title } = Typography;

const userHeaders = [
    { title: 'ID', dataIndex: '_id' },
    { title: 'Número sorteo', dataIndex: 'n_sort' },
    { title: 'Teléfono', dataIndex: 'phone' },   
    { title: 'Día y hora de sorteo', dataIndex: 'time_sort' },

];

let searchInput = "";


export const SortPage = () => {

    const [sortData, setsortData] = useState([]);
    const [sortRegData, setsortRegData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getSort();
        getSortReg();
    }, [])

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };


    const getSort = async () => {
        await getSortApi().then(resp => {
            const arraySorts = [];
            console.log(resp.sort)
            if (!resp.ok) {
                notification["error"]({
                    message: resp.message
                });
            } else {
                resp.sort.forEach(item => {
                    const element = {
                        ...item,
                        key: item._id
                    }
                    arraySorts.push(element);
                });
            }
            setsortData(arraySorts);
            setLoading(false);
        });
    }

    const getSortReg = async () => {
        await getSortRegApi().then(resp => {
            const arraySorts = [];
            console.log(resp.sort)
            if (!resp.ok) {
                notification["error"]({
                    message: resp.message
                });
            } else {
                resp.sort.forEach(item => {
                    const element = {
                        ...item,
                        key: item._id
                    }
                    arraySorts.push(element);
                });
            }
            setsortRegData(arraySorts);
            setLoading(false);
        });
    }


    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={'Buscar'}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Limpiar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            width: 150,
            ...getColumnSearchProps('_id'),
        },
        {
            title: 'Número sorteo',
            dataIndex: 'n_sort',
            key: 'n_sort',
            width: 150,
            ...getColumnSearchProps('n_sort'),
        },
        // {
        //     title: 'Nombre',
        //     dataIndex: 'name',
        //     key: 'name',
        //     width: 150,
        //     ...getColumnSearchProps('name'),
        // },
        {
            title: 'Teléfono',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Día y hora del sorteo',
            dataIndex: 'time_sort',
            key: 'time_sort',
            width: 150,
            sorter: (a, b) => a.signUpTime.length - b.signUpTime.length,
        }
    ];
    return (
        <ConfigProvider locale={es_ES}>
        <Spin spinning={loading} size="large" tip="Cargando...">
            <Row style={{padding:'20px'}} >
                <Col span={24} >
                    <Title type='warning' style={{ paddingTop: '20px', textAlign: 'center', width: '100%' }} >Sorteos RM</Title>
                </Col>
                <Col span={24} >
                    <Table columns={columns} dataSource={sortData} bordered pagination={true} scroll={{ x: 1500, y: 300 }} sticky />
                    <ExportSheet
                        header={userHeaders}
                        fileName={`Lista sorteos`}
                        dataSource={sortData}
                        xlsx={XLSX}
                    >
                        <Button className="_btn" style={{position: 'absolute', bottom: '20px'}} icon={<ExportOutlined />} type="danger">Exportar Sorteos</Button>
                    </ExportSheet>
                </Col>
                <Col span={24} >
                    <Title type='warning' style={{ paddingTop: '20px', textAlign: 'center', width: '100%' }} >Sorteos Regiones</Title>
                </Col>
                <Col span={24} >
                    <Table columns={columns} dataSource={sortRegData} bordered pagination={true} scroll={{ x: 1500, y: 300 }} sticky />
                    <ExportSheet
                        header={userHeaders}
                        fileName={`Lista sorteos`}
                        dataSource={sortRegData}
                        xlsx={XLSX}
                    >
                        <Button className="_btn" style={{position: 'absolute', bottom: '20px'}} icon={<ExportOutlined />} type="danger">Exportar Sorteos</Button>
                    </ExportSheet>
                </Col>
            </Row>
        </Spin>
        </ConfigProvider>
    )
}
