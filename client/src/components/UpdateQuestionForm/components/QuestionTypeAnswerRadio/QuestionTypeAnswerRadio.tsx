import React, {useCallback, useEffect, useState} from 'react';
import {Button, Form, GetProp, Input, Radio, Row, Space} from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import s from '../QuestionTypeAnswerChecbox/QuestionTypeAnswerChecbox.module.scss';
import {CloseOutlined} from '@ant-design/icons';
import {useForm} from 'antd/es/form/Form';
import {areAllUniqueInArrString, getUniqId} from '../../../../utils/helpers';
import {russianAlphabet} from '../../../../utils/russianAlphabet';
import {AnswerType} from '../../../../models/question';

const QuestionTypeAnswerRadio = () => {
  const formInstance = useFormInstance();
  const defaultFieldForm = formInstance.getFieldValue('answerFieldsData');
  // @ts-ignore
  const defaultArrayIds = defaultFieldForm && defaultFieldForm?.radio ? Object.keys(defaultFieldForm?.radio?.values).sort((a, b) => {
    return defaultFieldForm?.radio?.values[a].rang - defaultFieldForm?.radio?.values[b].rang;
  }) : undefined;
  const [arrayIds, setArrayIds] = useState(defaultArrayIds || [getUniqId()]);
  const defaultChecked = defaultFieldForm?.radio?.keys?.[0];
  const [checked, setChecked] = useState<string | undefined>(defaultChecked || undefined);
  const [formRadio] = useForm();

  useEffect(() => {
    arrayIds.forEach(el => {
      formRadio.setFieldValue('key-' + el, defaultFieldForm?.radio?.values?.[el]?.key);
      formRadio.setFieldValue('title-' + el, defaultFieldForm?.radio?.values?.[el]?.title);
    });
  }, []);

  const setFieldsValueInFormInstance = useCallback((allFields: {}) => {
    const allKeys: string[] = [];
    const fieldsData = Object.entries(allFields).reduce((acc, el) => {
      const splitArr = el[0].split('-');
      const titOrKey = splitArr[0];
      const uniqId = splitArr[1];
      // @ts-ignore
      const newObject = acc[uniqId] || {};

      if (titOrKey === 'key') {
        const key = el[1] as string || '';
        newObject['key'] = key;
        newObject['keyId'] = uniqId;
        allKeys.push(key);
      }

      if (titOrKey === 'title') {
        newObject['title'] = el[1] || '';
      }

      newObject['rang'] = arrayIds.indexOf(uniqId) + 1;
      return {...acc, [uniqId]: newObject};
    }, {});

    const isAllUniqKeysNew = areAllUniqueInArrString(allKeys);

    formInstance.setFieldValue('answerFieldsData', isAllUniqKeysNew ? {
      [AnswerType.Radio]: {
        keys: fieldsData[checked]?.keyId ? [fieldsData[checked]?.keyId] : [],
        values: fieldsData
      }
    } : null);
    formInstance?.submit();
  }, [arrayIds, checked, formInstance]);

  const setFormFields = useCallback((isCheckField?: boolean, isSetInstance = true) => {
    arrayIds.forEach((id, index) => {
      if (!isCheckField || isCheckField && !formRadio.getFieldValue(`key-${id}`)) {
        formRadio.setFieldValue(`key-${id}`, russianAlphabet[index] || '');
      }
    });
    if (isSetInstance) {
      const allFields = formRadio.getFieldsValue();
      setFieldsValueInFormInstance(allFields);
    }
  }, [arrayIds, formRadio, setFieldsValueInFormInstance]);

  useEffect(() => {
    setFormFields(true);
  }, [arrayIds, setFormFields]);

  const oRadioChange: GetProp<typeof Radio.Group, 'onChange'> = (e) => {
    setChecked(e.target.value);
  };

  const handleAddEl = () => {
    setArrayIds(prev => [...prev, getUniqId()]);
  };

  const deleteEl = (id: string) => {
    setArrayIds(prev => [...prev.filter(el => el !== id)]);
    setChecked(prev => prev === id ? undefined : prev);
  };

  return (
    <Radio.Group value={checked} onChange={oRadioChange}>
      <Form
        form={formRadio}
        onFieldsChange={(_, allFields) => {
          // @ts-ignore
          const allFieldsNew = allFields.reduce((acc, el) => {
            if (!el || !el?.name?.[0]) {
              return acc;
            }

            // @ts-ignore
            acc[el?.name[0]] = el?.value || '';
            return acc;
          }, {});

          setFieldsValueInFormInstance(allFieldsNew);
        }}
      >
        <Space direction="vertical">
          {arrayIds.map((id, index) => (
            <div key={id} className="flex-row flex-middle flex-center gap-20 ">
              <div className="flex-row flex-middle flex-center gap-20 testBackground boxShadow1">
                <Row wrap={false} className={s.row}>
                  <Radio value={id}/>
                  <Form.Item noStyle name={`title-${id}`}>
                    <Input/>
                  </Form.Item>
                </Row>
                <div key={id} className="flex-row flex-middle flex-center gap-10">
                  <div className="fs-16">Ключ:</div>
                  <Form.Item noStyle name={`key-${id}`}>
                    <Input/>
                  </Form.Item>
                </div>
              </div>
              <button
                disabled={arrayIds.length === 1}
                onClick={() => deleteEl(id)}
                className="clearButton hoverButton fs-18 dangerColor"
              >
                <CloseOutlined/>
              </button>
            </div>
          ))}
          <div className="flex-row flex-between gap-20 mt-10 mb-10">
            <Button onClick={handleAddEl}>Добавить вариант ответа</Button>
            <Button style={{marginRight: 40}} danger onClick={() => setFormFields(false)}>Сбросить ключи</Button>
          </div>
        </Space>
      </Form>
    </Radio.Group>
  );
};

export default QuestionTypeAnswerRadio;
