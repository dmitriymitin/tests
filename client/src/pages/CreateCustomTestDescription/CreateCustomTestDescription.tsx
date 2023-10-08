import s from "./CreateCustomTestDescription.module.scss";
import React, {FC, memo} from "react";
import {useLocation} from "react-router-dom";
import {Layout} from "antd";
import CreateCustomTestForm from "../../components/CreateCustomTestForm/CreateCustomTestForm";

interface CreateCustomTestDescriptionProps {}

const CreateCustomTestDescription: FC<CreateCustomTestDescriptionProps> = ({}) => {
    const location = useLocation();
    const testId = location.pathname.split('/')[5]
    return (
        <Layout>
            <div className="container">
                <h1 className="title">
                    Страница создания теста только с описанием
                </h1>
                {/*<CreateCustomTestForm testId={testId}/>*/}
            </div>
        </Layout>
    );
};

export default memo(CreateCustomTestDescription);
