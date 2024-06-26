import React, {FC} from 'react';
import {Layout, Row} from "antd";
import AdminForm from "../components/AdminForm/AdminForm";

const Admin:FC = () => {
    return (
      <Layout className={'layout'}>
            <div className="container">
                <AdminForm/>
            </div>
        </Layout>
    );
};

export default Admin;
