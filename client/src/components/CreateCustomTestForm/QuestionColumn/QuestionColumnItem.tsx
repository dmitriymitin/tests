import s from './QuestionColumn.module.scss';
import {Draggable} from 'react-beautiful-dnd';
import React from 'react';
import clsx from 'clsx';
import {Button, Spin} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import IsVisible from "../../ui/isVisibleWrapper";

interface ItemProps {
  text: string;
  id: string;
  index: number;
  className?: string;
  onDelete?: (id?: string) => void;
  onClick?: (id?: string) => void;
}

const QuestionColumnItem: React.FC<ItemProps> = ({text, id, index, onDelete, onClick, className}) => {
  return (
    <Draggable draggableId={text} index={index}>
      {provided => (
        <div
          className={clsx('flex-row flex-middle gap-5', s.columnItem, s.bc, className)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(id)}
        >
          <div className={clsx('flex-grow-1')}>
            {text}
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(id);
            }}
            className="clearBtnForIcon"
            icon={<CloseOutlined/>}
          />
        </div>
      )}
    </Draggable>
  );
};

export default QuestionColumnItem;
