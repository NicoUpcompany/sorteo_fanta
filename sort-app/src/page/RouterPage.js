import React from 'react'
import { Layout, Menu } from 'antd';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
} from "react-router-dom";
import logo from '../assets/up.png'
import { SortApp } from '../SortApp';
import { SortPage } from './SortPage';
import { SortReg } from './SortReg';

const { Header, Content, Footer } = Layout;

export const RouterPage = () => {
    return (
        <>
            <Router>
                <Layout className="layout">
                    <Header>
                        <Menu theme="dark" mode="horizontal" >
                            <Menu.Item key="/">
                                <Link to='/' >Sorteo Andina</Link>
                            </Menu.Item>
                            <Menu.Item key="region">
                                <Link to='/region' >Sorteo Embonor</Link>
                            </Menu.Item>
                            <Menu.Item key="sorteos">
                                <Link to='/sorteos' >Sorteos</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content >
                        <Switch>
                            <Route exact path="/sorteos" component={SortPage} />
                            <Route exact path="/region" component={SortReg} />
                            <Route exact path="/" component={SortApp} />
                            <Redirect to="/" />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}> <img
                            src={logo}
                            alt='logo_up'
                        /></Footer>
                </Layout>,
            </Router>
        </>
    )
}
