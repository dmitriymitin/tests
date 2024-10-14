import React, {useEffect, useState} from 'react';
import {Button, FloatButton, message, notification} from 'antd';
import {EditOutlined} from '@ant-design/icons';
import s from '../../AdminFloatButton.module.scss';
import gs from '../../../../GlobalStyles.module.scss';
import clsx from 'clsx';
import {useMedia} from 'react-use';
import {useSelectTestsStore} from '../../../../store/folders/useSelectTestsStore';
import InfoBlockDescription from '../InfoBlock/InfoBlockDescription';
import InfoBlockTitle from '../InfoBlock/InfoBlockTitle';
import InfoBlockBtns from '../InfoBlock/InfoBlockBtns';

const AdminAddFloatGroup = () => {
  const isPC = useMedia('(min-width: 768px)');
  const selectTestsStore = useSelectTestsStore(store => store);
  const [open, setOpen] = useState(!!selectTestsStore.currentAction || false);
  const [api, contextHolder] = notification.useNotification({
    placement: isPC ? 'bottomLeft' : 'topRight',
    maxCount: 1,
    top: isPC ? 70 : 60,
    stack: false,
    prefixCls: s.prefixSpaaceBlock
  });

  const openNotification = () => {
    const key = `open${Date.now()}`;

    api.open({
      duration: 0,
      className: s.spaaceBlock,
      message: <InfoBlockTitle/>,
      description: <InfoBlockDescription/>,
      btn: <InfoBlockBtns/>,
      key,
      onClose: () => selectTestsStore.setCurrentAction(undefined)
    });
  };

  useEffect(() => {
    if (!selectTestsStore.currentAction) {
      api.destroy();
      setOpen(false);
    } else {
      api.destroy();
      setTimeout(() => {
        openNotification();
      }, 200);
    }
  }, [api, selectTestsStore.currentAction]);

  return (
    <div>
      {contextHolder}
      <FloatButton.Group
        trigger="click"
        type="primary"
        // style={{right: isPC ? 214 : 164}}
        style={{right: isPC ? 154 : 104}}
        icon={<EditOutlined/>}
        onClick={() => {
          setOpen(prev => {
            if (prev) {
              selectTestsStore.setCurrentAction(undefined);
            }

            return !prev;
          });
        }}
        open={open}
      >
        <div className={gs.adminFunctionBlock}>
          <button
            onClick={() => {
              setTimeout(() => {
                selectTestsStore.setLastAction('openTests');
              }, 200);
              selectTestsStore.setCurrentAction('openTests');
            }}
            className={clsx('clearButton', gs.btn, {[s.activeBtn]: selectTestsStore.currentAction === 'openTests'})}
          >
            Открыть тесты
          </button>
          <div className={gs.underline}/>
          <button
            onClick={() => {
              setTimeout(() => {
                selectTestsStore.setLastAction('closeTests');
              }, 200);
              selectTestsStore.setCurrentAction('closeTests');
            }}
            className={clsx('clearButton', gs.btn, gs.btnDanger, {[s.activeDangerBtn]: selectTestsStore.currentAction === 'closeTests'})}
          >
            Закрыть тесты
          </button>
          <div className={gs.underline}/>
          <button
            onClick={() => {
              setTimeout(() => {
                selectTestsStore.setLastAction('clearResults');
              }, 200);
              selectTestsStore.setCurrentAction('clearResults');
            }}
            className={clsx('clearButton', gs.btn, gs.btnSuccess, {[s.activeSuccessBtn]: selectTestsStore.currentAction === 'clearResults'})}
          >
            Очистить результаты тестов
          </button>
          <div className={gs.underline}/>
          {/* <button */}
          {/*  onClick={() => { */}
          {/*    setTimeout(() => { */}
          {/*      selectTestsStore.setLastAction('addInFolder') */}
          {/*    }, 200) */}
          {/*    selectTestsStore.setCurrentAction('addInFolder') */}
          {/*  }} */}
          {/*  className={clsx('clearButton', gs.btn, gs.btnGray, {[s.activeGrayBtn]: selectTestsStore.currentAction === 'addInFolder'})} */}
          {/* > */}
          {/*  Добавить в папку */}
          {/* </button> */}
          <button
            onClick={() => {
              setTimeout(() => {
                selectTestsStore.setLastAction('deleteTests');
              }, 200);
              selectTestsStore.setCurrentAction('deleteTests');
            }}
            className={clsx('clearButton', gs.btn, gs.btnDanger, {[s.activeDangerBtn]: selectTestsStore.currentAction === 'deleteTests'})}
          >
            Удалить тесты
          </button>
        </div>
      </FloatButton.Group>
    </div>
  );
};

export default AdminAddFloatGroup;
