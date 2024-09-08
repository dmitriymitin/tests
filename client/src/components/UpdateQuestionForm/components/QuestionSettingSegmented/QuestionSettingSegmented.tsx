import React, {useEffect, useState} from 'react';
import {Form, Input, InputNumber, Popover, Segmented, Select} from "antd";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import IsVisible from "../../../ui/isVisibleWrapper";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {pluralization} from "../../../../utils/helpers";

export type TQuestionType = 'yesNo' | 'time'

interface IQuestionSettingSegmentedProps {
  formName: string;
  text: string;
  type?: TQuestionType;
  description?: string;
}

const QuestionSettingSegmented = ({formName, text, type = 'yesNo', description}: IQuestionSettingSegmentedProps) => {
  const formInstance = useFormInstance();
  const defaultValue = type === 'time' ? undefined : (formInstance.getFieldValue(formName) || 0);
  const [value, setValue] = useState<number>(defaultValue);
  const [valueSec, setValueSec] = useState<number>(undefined);

  useEffect(() => {
    if (type === 'yesNo') {
      formInstance.setFieldValue(formName, value)
    }
    if (type === 'time') {
      const valueTime = valueSec ? (value + '.' + valueSec) : value;
      formInstance.setFieldValue(formName, valueTime)
    }
  }, [formInstance, formName, type, value, valueSec]);

  return (
    <Form.Item name={formName}>
      <div className="flex-row flex-middle gap-10 fs-16">
        {text}
        <IsVisible isVisible={type === 'yesNo'}>
          <Segmented
            onChange={e => setValue(e)}
            defaultValue={value}
            block
            style={{maxWidth: 200, width: '100%'}}
            options={[
              { label: 'Да', value: 1},
              { label: 'Нет',  value: 0}
            ]}
          />
        </IsVisible>
        <IsVisible isVisible={type === 'time'}>
          <div className={"flex-row flex-middle gap-10"}>
            <InputNumber
              placeholder={'Не учитывается'}
              type={'number'}
              value={value}
              onChange={e => setValue(e)}
              onKeyPress={e => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              style={{maxWidth: 80, width: '100%'}}
            />
            {pluralization(value, ['минута', 'минуты', 'минут'])}
            <InputNumber
              placeholder={'Не учитывается'}
              type={'number'}
              value={valueSec}
              onChange={e => setValueSec(e)}
              onKeyPress={e => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              style={{maxWidth: 80, width: '100%'}}
            />
            {pluralization(valueSec, ['секунда.', 'секунды.', 'секунд.'])}
          </div>
        </IsVisible>
        <IsVisible isVisible={!!description}>
          <Popover className="cursor-pointer fs-18" content={description}>
            <QuestionCircleOutlined/>
          </Popover>
        </IsVisible>
      </div>
    </Form.Item>
  );
};

export default QuestionSettingSegmented;