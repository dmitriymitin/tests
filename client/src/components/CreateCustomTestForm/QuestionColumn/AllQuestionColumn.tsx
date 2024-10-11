import React, {Fragment, useState} from 'react';
import {Droppable} from 'react-beautiful-dnd';
import s from './QuestionColumn.module.scss';
import QuestionColumnItem from './QuestionColumnItem';
import {useAllQuestion} from '../../../http/hooks/useAllQuestion';
import IsVisible from '../../ui/isVisibleWrapper';
import {Button, Empty, Space, Spin} from 'antd';
import QuestionAnswerItem from './QuestionAnswerItem';
import question from '../../AllQuestions/Question/Question';
import {IQuestion} from '../../../api/question/type';
import {TQuestionColumn} from './QuestionColumn';
import {Link, useNavigate} from 'react-router-dom';
import {RouteNames} from '../../../router';
import QuestionLink from '../../AllQuestions/AllQuestionsBlock/QuestionLink';
import {LoadingOutlined} from '@ant-design/icons';
import AllGroupQuestion from '../../AllQuestions/AllGroupQuestion/AllGroupQuestion';
interface ColumnProps {
  col: TQuestionColumn;
  isLoadingAddQuestion?: boolean;
  onAdd?: (id?: IQuestion) => void;
  listTestQuestions?: TQuestionColumn;
  onAllQuestions?: () => void;
  isLoading?: boolean;
  isAllQuestionsLoading?: boolean;
  dataQuestion?: IQuestion[];
}

const AllQuestionColumn = (
  {col,
    listTestQuestions,
    isLoading,
    onAllQuestions,
    dataQuestion,
    isLoadingAddQuestion,
    isAllQuestionsLoading,
    onAdd}: ColumnProps) => {
  const {list, id, title, currentList, isShowResult} = col;
  const {data} = useAllQuestion({isFetching: false});
  const resultDataQuestion = (() => {
    if (isAllQuestionsLoading) {
      return [];
    }

    if (currentList) {
      return dataQuestion;
    }

    return (isShowResult ? listTestQuestions?.list : list)?.
      map(el => (isShowResult ? dataQuestion : data)?.
        find(question => question?._id === el?.id))?.
      filter(question => !!question);
  })();
  const allQuestionTitle = (
    <button onClick={onAllQuestions} className="clearButton cursor-pointer width-max-content p-0 h35p">
      <div className="flex-row gap-10 flex-middle">
        <h2 className="p-0 fs-20">{title}</h2>
        <IsVisible isVisible={isLoading}>
          <Spin indicator={<LoadingOutlined spin/>}/>
        </IsVisible>
      </div>
    </button>
  );

  const getResultsList = (renderList: IQuestion[], provided?: any) => {
    return (
      <div className={s.list}>
        <IsVisible isVisible={!currentList && renderList && !!renderList.length}>
          {renderList?.map((el, index) => {
            return (
              <QuestionAnswerItem
                isDisableAddQuestion={isLoadingAddQuestion}
                isHiddenAddQuestion={isShowResult}
                key={el?._id}
                question={el}
                index={index}
                onAdd={onAdd}
                isAllList={!provided}
              />
            );
          })}
        </IsVisible>
        {provided && provided.placeholder}
      </div>
    );
  };

  return (
    <>
      <IsVisible isVisible={Boolean(currentList)}>
        {(() => {
          const currentQuestion = resultDataQuestion?.find(el => el._id === currentList?.id);
          return (
            <div className={s.column}>
              <div className="flex-row flex-middle gap-10 h35p">
                {allQuestionTitle}
                <div> {'->'} </div>
                <div className="flex-row flex-middle gap-5">
                  <h2 className="p-0 fs-20">Вопрос</h2>
                  <QuestionLink className="fs-18" convertId={currentQuestion?.convertId} id={currentQuestion?._id}
                                isPublic={currentQuestion?.setting?.isPublicQuestion}/>
                </div>
              </div>
              <div className={s.list}>
                <QuestionAnswerItem
                  question={currentQuestion}
                  index={0}
                  isTitle={false}
                  isInfo={Boolean(currentList)}/>
              </div>
            </div>
          );
        })()}
      </IsVisible>
      <div className={s.column}>
        <IsVisible isVisible={!currentList}>
          <div className="flex-col gap-10">
            <div className="flex-row flex-middle gap-10 h35p">
              {allQuestionTitle}
              <IsVisible isVisible={isShowResult}>
                <>
                  <div> {'->'} </div>
                  <div className="flex-row flex-middle gap-5">
                    <h2 className="p-0 fs-20">Результат</h2>
                  </div>
                </>
              </IsVisible>
            </div>
            <IsVisible isVisible={!isShowResult}>
              <AllGroupQuestion isCount={false}/>
            </IsVisible>
          </div>
        </IsVisible>
        <IsVisible isVisible={(!isShowResult && !isAllQuestionsLoading && !currentList && resultDataQuestion && !resultDataQuestion?.length)}>
          <div className="status-block h220p">
            <Empty description={(
              <div className="flex-col gap-10">
                Доступных вопросов для добавления нет
                <Link to={RouteNames.ADMIN_QUESTION_CREATE}>
                  <Button>Создать вопрос</Button>
                </Link>
              </div>
            )}/>
          </div>
        </IsVisible>
        <IsVisible isVisible={!isShowResult}>
          {getResultsList(resultDataQuestion)}
        </IsVisible>
        <IsVisible isVisible={isAllQuestionsLoading}>
          <div className="status-block h220p">
            <Spin size="large"/>
          </div>
        </IsVisible>
        <Droppable droppableId={id}>
          {(provided, snapshot) => {
            return (
              <>
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {getResultsList(!isShowResult ? [] : resultDataQuestion, provided)}
                </div>
              </>
            );
          }}
        </Droppable>
      </div>
    </>
  );
};

export default AllQuestionColumn;
