import React from 'react';
import {Layout} from "antd";
import CreateCustomTestForm from "../../components/CreateCustomTestForm/CreateCustomTestForm";
import {useLocation} from "react-router-dom";

const CreateCustomTest = () => {
    const location = useLocation();
    const testId = location.pathname.split('/')[4]
    return (
        <Layout className={'layout'}>
            <div className="container">
                <CreateCustomTestForm testId={testId}/>
            </div>
        </Layout>
    );
};

export default CreateCustomTest;
