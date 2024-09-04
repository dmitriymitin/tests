import React, {FC} from 'react';
import {Layout} from "antd";
import AdminTestsListForm from "../components/AdminTestsListForm/AdminTestsListForm";

const AdminListTestsPage:FC = () => {
    return (
      <Layout className={'layout'}>
            <div className="container">
                <AdminTestsListForm/>
            </div>
        </Layout>
    );
};

export default AdminListTestsPage;
