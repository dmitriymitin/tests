import React, {FC, useCallback, useEffect, useState} from 'react';
import s from './QuestionTypeAnswerChecbox.module.scss';
import {Button, Checkbox, Form, GetProp, Input, Row, Space} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import {useForm} from 'antd/es/form/Form';
import {russianAlphabet} from '../../../../utils/russianAlphabet';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import {areAllUniqueInArrString, getUniqId} from '../../../../utils/helpers';
import {AnswerType} from '../../../../models/question';

const QuestionTypeAnswerCheckbox = () => {
  const formInstance = useFormInstance();
  const defaultFieldForm = formInstance.getFieldValue('answerFieldsData');
  // @ts-ignore
  const defaultArrayIds = defaultFieldForm && defaultFieldForm?.checkbox ? Object.keys(defaultFieldForm?.checkbox?.values).sort((a, b) => {
    return defaultFieldForm?.checkbox?.values[a].rang - defaultFieldForm?.checkbox?.values[b].rang;
  }) : undefined;
  const [arrayIds, setArrayIds] = useState(defaultArrayIds || [getUniqId()]);
  const [checkedList, setCheckedList] = useState<string[] | undefined>(defaultFieldForm?.checkbox?.keys || []);
  const [formCheckbox] = useForm();

  useEffect(() => {
    arrayIds.forEach(el => {
      formCheckbox.setFieldValue('key-' + el, defaultFieldForm?.checkbox?.values?.[el]?.key);
      formCheckbox.setFieldValue('title-' + el, defaultFieldForm?.checkbox?.values?.[el]?.title);
    });
  }, []);

  const setFieldsValueInFormInstance = useCallback((allFields: {}) => {
    const correctKeysNew: string[] = [];
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
      const indexRightAnswer = checkedList?.indexOf(uniqId);
      const isRightAnswer = indexRightAnswer !== undefined && indexRightAnswer + 1 ? true : undefined;
      if (isRightAnswer && el[1] && !correctKeysNew.includes(uniqId)) {
        correctKeysNew.push(uniqId as string);
      }

      return {...acc, [uniqId]: newObject};
    }, {});

    const isAllUniqKeysNew = areAllUniqueInArrString(allKeys);

    formInstance.setFieldValue('answerFieldsData', isAllUniqKeysNew ? {
      [AnswerType.Checkbox]: {
        keys: correctKeysNew,
        values: fieldsData
      }
    } : null);
    formInstance.submit();
  }, [arrayIds, checkedList, formInstance]);

  const setFormFields = useCallback((isCheckField?: boolean, isSetInstance = true) => {
    arrayIds.forEach((id, index) => {
      if (!isCheckField || isCheckField && !formCheckbox.getFieldValue(`key-${id}`)) {
        formCheckbox.setFieldValue(`key-${id}`, russianAlphabet[index] || '');
      }
    });
    if (isSetInstance) {
      const allFields = formCheckbox.getFieldsValue();
      setFieldsValueInFormInstance(allFields);
    }
  }, [arrayIds, formCheckbox, setFieldsValueInFormInstance]);

  useEffect(() => {
    setFormFields(true);
  }, [arrayIds, setFormFields]);

  const onCheckboxChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    setCheckedList(checkedValues as any);
  };

  const handleAddEl = () => {
    setArrayIds(prev => [...prev, getUniqId()]);
  };

  const deleteEl = (id: string) => {
    setArrayIds(prev => [...prev.filter(el => el !== id)]);
    setCheckedList(prev => {
      if (!prev) {
        return [];
      }

      return [...prev.filter(el => el !== id)];
    });
  };

  return (
    <Checkbox.Group value={checkedList} onChange={onCheckboxChange}>
      <Form
          form={formCheckbox}
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
                  <Checkbox value={id}/>
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
    </Checkbox.Group>
  );
};

export default QuestionTypeAnswerCheckbox;
