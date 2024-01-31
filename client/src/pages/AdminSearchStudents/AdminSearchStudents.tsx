import React from 'react';
import s from './AdminSearchStudents.module.scss'
import {Layout} from "antd";
import AdminSearchStudentsBlock from "../../components/AdminSearchStudentsBlock/AdminSearchStudentsBlock";
const AdminSearchStudents = () => {
    return (
        <Layout>
            <div className="container">
                <AdminSearchStudentsBlock/>
            </div>
        </Layout>
    );
};

export default AdminSearchStudents;
