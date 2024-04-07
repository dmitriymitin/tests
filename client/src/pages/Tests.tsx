import React, {FC} from 'react';
import {useTypedSelector} from "../hooks/useTypedSelector";
import {Layout} from "antd";
import Loader from "../components/Loader";
import AllTest from "../components/AllTest/AllTest";

const Tests:FC = () => {
    return (
      <Layout className={'layout'}>
            <div className="container">
                <AllTest/>
            </div>
        </Layout>
    );
};

export default Tests;
