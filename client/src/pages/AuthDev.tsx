import React, {FC} from 'react';
import {Layout, Row} from "antd";
import AuthForm from "../components/AuthForm/AuthForm";
import AuthFormDev from "../components/AuthForm/AuthFormDev";

const AuthDev: FC = () => {
    return (
        <Layout>
            <Row justify="center" align="middle" className="auth">
                <AuthFormDev/>
            </Row>
        </Layout>
    );
};

export default AuthDev;
