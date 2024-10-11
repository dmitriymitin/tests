import React, {useState} from 'react';
import {Droppable} from 'react-beautiful-dnd';
import s from './QuestionColumn.module.scss';
import QuestionColumnItem from './QuestionColumnItem';
import clsx from 'clsx';
import {Button, Empty, Popover, Spin} from 'antd';
import {CloseOutlined, InfoCircleOutlined, LoadingOutlined} from '@ant-design/icons';
import IsVisible from '../../ui/isVisibleWrapper';
import {IQuestion} from "../../../api/question/type";
import {ICustomTestQuestion, ITestCustomModelResponse} from "../../../api/test/type";

export type TQuestionColumn = {
  id: string;
  title?: string;
  isInfo?: boolean;
  isShowResult?: boolean;
  info?: string;
  currentList?: {
    id?: string;
    convertId?: string;
  };
  questionsDataShowResult?: IQuestion[];
  list: {
    id?: string;
    convertId?: string;
  }[];
}

interface ColumnProps {
  col: TQuestionColumn;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  isDisableAddBtn?: boolean;
  onResult?: () => void;
  currentList?: {
    id?: string;
    convertId?: string;
  };
  isLoading?: boolean;
  isShowResult?: boolean;
}

const QuestionColumn = ({col, isShowResult, isLoading, currentList, onDelete, onClick, onResult}: ColumnProps) => {
  const {list, info, title, id} = col;
  // const [isDropDisabled, setIsDropDisabled] = useState(true);
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => {
        // setIsDropDisabled(!snapshot.isUsingPlaceholder);
        return (
          <div className={clsx(s.column, 'gap-10')}>
            <div className="flex-row gap-10 flex-middle">
              <h2 className="fs-20 h35p">{title}</h2>
              <Popover className="cursor-pointer fs-18 mxw-100" content={info}>
                <InfoCircleOutlined />
              </Popover>
              <IsVisible isVisible={isLoading}>
                <Spin indicator={<LoadingOutlined spin />}/>
              </IsVisible>
            </div>
            <div className={clsx(s.list)}>
              <div className={clsx('boxShadow1', s.listQuestions)}>
                <IsVisible isVisible={list && !list.length}>
                  <div className="status-block h220p">
                    <Empty description={'Вопросов пока нет. Вы можете добавить их из общего списка'}/>
                  </div>
                </IsVisible>
                <div {...provided.droppableProps}
                     ref={provided.innerRef}>
                  {list.map((el, index) => {
                    const isActive = snapshot.draggingOverWith === el?.id && snapshot.isUsingPlaceholder;
                    return (
                      <QuestionColumnItem
                          className={clsx({['bgEEE']: el.id === currentList?.id, ['boxShadow3']: isActive})}
                          key={el?.id}
                          id={el?.id}
                          text={el?.convertId}
                          index={index}
                          onDelete={onDelete}
                          onClick={onClick}
                      />
                    );
                  })}
                  {provided.placeholder}
                </div>
              </div>
              <Button disabled={isShowResult} className="mt-10" onClick={onResult}>Посмотреть результат</Button>
            </div>
          </div>
        );
      }}
    </Droppable>
  );
};

export default QuestionColumn;
