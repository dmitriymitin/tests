import React from 'react';
import {Empty, Form, Layout, Spin} from 'antd';
import UpdateQuestionForm from '../../components/UpdateQuestionForm/UpdateQuestionForm';
import {useParams} from 'react-router-dom';
import {useQuery} from 'react-query';
import {getQuestion} from '../../api/question';
import InfoQuestionForm from '../../components/InfoQuestionForm/InfoQuestionForm';
import IsVisible from '../../components/ui/isVisibleWrapper';
import {useForm} from "antd/es/form/Form";
import {useTypedSelector} from "../../hooks/useTypedSelector";

const InfoQuestionPage = () => {
  const {isAuth} = useTypedSelector(state => state.auth);
  const [form] = useForm();
  const {questionId} = useParams();
  const queryKey = `question${questionId}`;

  const {data: questionData, isLoading: isLoadingQuestionData} = useQuery({
    queryKey,
    queryFn: () => getQuestion(questionId),
    enabled: Boolean(questionId),
    refetchOnWindowFocus: false,
    retry: false
  });

  const isVisibleQuestion = isAuth ? true : questionData?.setting?.isPublicQuestion;

  return (
    <>
      <IsVisible isVisible={isLoadingQuestionData && questionData}>
        <div className="status-block h220p">
          <Spin/>
        </div>
      </IsVisible>
      <IsVisible isVisible={!isLoadingQuestionData && !questionData}>
        <div className="status-block h220p">
          <Empty description={'Ошибка получения данных'}/>
        </div>
      </IsVisible>
      <IsVisible isVisible={!isLoadingQuestionData && !!questionData}>
        <Layout className={'layout'}>
          <div className="container main-wrapper">
            <h1 className={'title'}>
              Вопрос {questionData?.convertId}
            </h1>
            <IsVisible isVisible={!isVisibleQuestion}>
              <div className="status-block h220p">
                <Empty description={'Вопрос не доступен к просмотру'}/>
              </div>
            </IsVisible>
            <IsVisible isVisible={isVisibleQuestion}>
              <Form form={form} style={{width: '100%'}}>
                <InfoQuestionForm questionData={questionData} isAnswer isPublicAnswer/>
              </Form>
            </IsVisible>
          </div>
        </Layout>
      </IsVisible>
    </>
  );
};

export default InfoQuestionPage;
