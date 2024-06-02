import React, {FC, useEffect} from 'react';
import AppRouter from "./components/AppRouter";
import {ConfigProvider, Layout} from "antd";
import "./App.css"
import {useTypedSelector} from "./hooks/useTypedSelector";
import {AuthActionCreators} from "./store/reducers/auth/action-creators";
import {useDispatch} from "react-redux";
import { theme } from "antd";
import {QueryClient, QueryClientProvider} from "react-query";
import Navbar from "./components/Navbar";
const { defaultAlgorithm, darkAlgorithm } = theme;
const App : FC = () => {
    const queryClient = new QueryClient();
    const {isLoading, darkTheme} = useTypedSelector(state => state.auth)
    const dispatch = useDispatch();
    const body = document.getElementById('body');

    useEffect(() => {
        const res = localStorage.getItem('token')
        if (localStorage.getItem('token')) {
            AuthActionCreators.checkAuth()(dispatch)
        } else {
            AuthActionCreators.setIsLoadingFalse()(dispatch)
        }
    }, [])

    useEffect(() => {
        if (body) {
            body.classList.add("backGroundColorWhite");
        }
    }, [])

    return (
        <ConfigProvider
            theme={{
                algorithm: defaultAlgorithm,
            }}>
            <QueryClientProvider client={queryClient}>
                <Layout className={'layout'}>
                    {isLoading
                        ?
                            <div
                                style={{
                                    width: '100vh',
                                    height: '100vh'
                                }}
                            >
                            </div>
                        :
                        <>
                            <Navbar/>
                            <Layout.Content>
                                    <div className="page" style={{
                                        marginBottom: 200
                                    }}>
                                        <AppRouter/>
                                    </div>
                            </Layout.Content>
                        </>
                    }
                </Layout>
            </QueryClientProvider>
        </ConfigProvider>

    );
};

export default App;
