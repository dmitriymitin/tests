import React, {FC, useEffect, useState} from 'react';
import {Card, Form, List} from "antd";
import {IconAnswerTypeText} from "../../../../utils/ui/icons/IconAnswerTypeText";
import {AnswerType} from "../../../../models/question";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import s from './QuestionTypeAnswerList.module.scss';
import clsx from "clsx";
import {IconAnswerTypeCheckbox} from "../../../../utils/ui/icons/IconAnswerTypeCheckbox";
import {IconAnswerTypeRadio} from "../../../../utils/ui/icons/IconAnswerTypeRadio";
import IsVisibleWrapper from "../../../ui/isVisibleWrapper";
import {BulbOutlined} from "@ant-design/icons";

const componentArray = [
  {title: 'Текстовый', type: AnswerType.Text, content: IconAnswerTypeText, fs: '150px'},
  {title: 'Один вариант', type: AnswerType.Radio, content: IconAnswerTypeRadio, fs: '150px'},
  {title: 'Множество вариантов', type: AnswerType.Checkbox, content: IconAnswerTypeCheckbox, fs: '150px'}
];

interface IQuestionTypeAnswerListProps {
  isInfoBlock?: boolean;
}

export const QuestionTypeAnswerList: FC<IQuestionTypeAnswerListProps> = ({isInfoBlock}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const form = useFormInstance();

  useEffect(() => {
    if (activeIndex === null) {
      form.setFieldsValue({ answerType: null });
    } else {
      form.setFieldsValue({ answerType: componentArray[activeIndex].type });
    }
    form.submit();
  }, [activeIndex, form]);

  const onClickCard = (index: number) => () => {
    if (index === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  }

  return (
    <>
      <Form.Item
        name={'answerType'}
        rules={[
          {
            required: true,
            message: 'Пожалуйста, выберить один из способов ответа'
          }
        ]}
      >
        <List
          grid={{gutter: 16, column: 4}}
          dataSource={componentArray}
          renderItem={(item, index) => {
            const isActiveCard = index === activeIndex;
            const className = clsx(s.card, {[s.active]: isActiveCard});
            const style = {fontSize: item.fs || '100px'}
            return (
              <List.Item>
                <Card
                  hoverable
                  title={item.title}
                  onClick={onClickCard(index)}
                  className={className}
                >
                  {item.content({style})}
                </Card>
              </List.Item>
            )
          }}
        />
      </Form.Item>
      <IsVisibleWrapper isVisible={isInfoBlock && activeIndex !== null}>
        <div className={clsx(s.infoBlock, "flex-row flex-middle gap-20")}>
          <BulbOutlined style={{fontSize: 25}}/>
          Не забудьте ввести или выбрать правильный ответ. Обратите внимание, что в случае одиночного или множественного варианта ответов ключи по умолчанию генерируются автоматически, но вы также можете их изменить.
        </div>
      </IsVisibleWrapper>
    </>
  );
};