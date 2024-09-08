import React, {Fragment, useEffect, useState} from 'react';
import {useForm} from 'antd/es/form/Form';
import {useMedia} from 'react-use';
import {Badge, Button, Checkbox, Drawer, Form, Input, message, Modal, Segmented, Spin} from 'antd';
import {ITestCustomModelResponse, ITestModelResponse} from '../../../api/test/type';
import drawerStyles from '../../../DrawerStyles.module.scss';
import s from './CreateNewForder.module.scss';
import {useAllTest} from '../../../http/hooks/useAllTest';
import {useMutation} from 'react-query';
import {createNewFolderApi, updateFolderApi} from '../../../api/test';
import {useAllFolder} from '../../../http/hooks/useAllFolder';
import {deleteElementFromArrayByIndex} from '../../../utils/deleteElementFromArrayByIndex';
import clsx from 'clsx';

interface ChangeCustomQuestionProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  titleFolder?: string;
  activeTestIdsDefault?: string[];
  isChange?: boolean;
  folderId?: string;
}

const CreateNewForder = ({open, setOpen, titleFolder = '', activeTestIdsDefault = [], isChange, folderId}: ChangeCustomQuestionProps) => {
  const {data: allTest, isLoading: isAllTestLoading, invalidate} = useAllTest();
  const {data: allFolder} = useAllFolder();
  const {invalidate: invalidateFolder} = useAllFolder();
  const [form] = useForm();
  const {mutateAsync, isLoading: isCreateFolderLoading} = useMutation({
    mutationFn: createNewFolderApi
  });
  const {mutateAsync: updateFolderTrigger, isLoading: isUpdateFolderLoading} = useMutation({
    mutationFn: updateFolderApi
  });

  const [activeTestIds, setActiveTestIds] = useState<string[]>(activeTestIdsDefault || []);
  const [isRerender, setIsRerender] = useState(false);
  const [showTestInFolder, setShowTestInFolder] = useState<number>(0);

  const isPC = useMedia('(min-width: 768px)');

  useEffect(() => {
    form.setFieldValue('folderName', titleFolder);
  }, [form, titleFolder]);

  useEffect(() => {
    setActiveTestIds(activeTestIdsDefault);
  }, [open]);

  const onOk = async () => {
    try {
      await form.validateFields();
    } catch (e) {
      return;
    }

    try {
      const folderName = form.getFieldValue('folderName');

      if (isChange) {
        await updateFolderTrigger({
          folderName,
          testIds: activeTestIds,
          folderId
        });
      } else {
        await mutateAsync({
          folderName,
          testIds: activeTestIds
        });
      }

      await invalidate();
      await invalidateFolder();
      setOpen(false);
      message.success('Папки создана успешно');
      localStorage.removeItem('currentFolder');
    } catch (e) {
      message.error('Ошибка при создании папки');
    }
  };

  const onCancel = () => {
    setOpen(false);
  };

  const newAllTest = allTest?.reduce((acc, el, index) => {
    if (showTestInFolder || !el.folderId) {
      acc.push(el);
    }

    return acc;
  }, [] as (ITestModelResponse & ITestCustomModelResponse)[]);

  const content =
    isAllTestLoading
      ? <div className={s.loading}>
        <Spin/>
      </div>
      : <div className={s.content}>
        <Form
          form={form}
        >
          <Form.Item
            name={'folderName'}
            className={s.item}
            rules={[{
              required: true,
              message: 'Поле обязательно для ввода'
            }]}
            label={'Название папки'}
          >
            <Input placeholder={'Введите название папки'}/>
          </Form.Item>
        </Form>
        <div className={s.questionWrapper}>
          Отображать тесты, которые уже находятся в папке?
          <Segmented
            onChange={e => setShowTestInFolder(e as any)}
            defaultValue={showTestInFolder}
            block
            style={{width: 200}}
            options={[{
              label: 'Да',
              value: 1
            },
            {
              label: 'Нет',
              value: 0
            }
            ]}
          />
        </div>
        {newAllTest && newAllTest?.length > 0 &&
        <div className={s.body}>
          <Fragment>
            <div className={s.label}>Выберите тесты, которые попадут в папку:</div>
            <div className={s.listTest}>
              {newAllTest?.map((el, index) => {
                const folderName = allFolder?.find(folder => folder._id === el.folderId)?.name;
                return (
                  <div
                              key={el._id}
                              style={{cursor: 'pointer'}}
                              onClick={() => {
                                setActiveTestIds(state => {
                                  const indexId = state.findIndex(st => st === el._id);
                                  if (indexId >= 0) {
                                    return deleteElementFromArrayByIndex(state, indexId);
                                  }

                                  state.push(el._id);
                                  return state;
                                });
                                setIsRerender(state => !state);
                              }}>
                    <Badge.Ribbon text={folderName} color="gold" style={{
                      display: showTestInFolder ? folderName ? 'block' : 'none' : 'none',
                    }}>
                      <div className={clsx(s.testWrapper, 'testBackground')}>
                        <Checkbox
                                    defaultChecked={activeTestIds.includes(el._id)}
                                    value={activeTestIds.includes(el._id)}
                                    checked={activeTestIds.includes(el._id)}
                        />
                        <div className={s.title}>{el.title}</div>
                      </div>
                    </Badge.Ribbon>
                  </div>

                );
              }
              )}
            </div>
          </Fragment>
        </div>
        }
      </div>;

  return (
    <>
      {isPC &&
      <Modal
              open={open}
              title={isChange ? 'Изменение папки' : 'Создание новой папки'}
              onCancel={() => setOpen(false)}
              onOk={onOk}
              width={800}
              className={'modalWrapper'}
              footer={(
                <>
                  <Button onClick={onCancel}>Отмена</Button>
                  <Button loading={isCreateFolderLoading || isUpdateFolderLoading} type={'primary'} onClick={onOk}>{isChange ? 'Изменить папку' : 'Создать папку'}</Button>
                </>
              )}
      >
        {content}
      </Modal>
      }

      {!isPC &&
      <Drawer
              placement={'bottom'}
              onClose={() => setOpen(false)}
              open={open}
              width={500}
              height={'auto'}
              className={drawerStyles.drawer}
              destroyOnClose
      >
        <div className={drawerStyles.drawerWrapper}>
          {content}
        </div>
        <div className={drawerStyles.btns}>
          <Button onClick={onCancel}>Отмена</Button>
          <Button loading={isCreateFolderLoading || isUpdateFolderLoading} type={'primary'} onClick={onOk}>{isChange ? 'Изменить папку' : 'Создать папку'}</Button>
        </div>
      </Drawer>
      }
    </>
  );
};

export default CreateNewForder;
