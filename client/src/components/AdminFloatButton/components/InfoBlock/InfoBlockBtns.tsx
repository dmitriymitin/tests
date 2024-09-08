import React from 'react';
import {useSelectTestsStore} from '../../../../store/folders/useSelectTestsStore';
import {Button, message, Space} from 'antd';
import clsx from 'clsx';
import s from '../../AdminFloatButton.module.scss';
import {BtnsTextBlockInfo, currentActionForApi} from '../../../../store/folders/const';
import {useMutation, useQueryClient} from 'react-query';
import {
  actionManyTest,
  clearAllTestResultsFetcher,
  closeAllTestFetcher,
  openAllTestFetcher
} from '../../../../api/test';
import {useAllTest} from '../../../../http/hooks/useAllTest';

const InfoBlockBtns = () => {
  const currentAction = useSelectTestsStore(store => store.lastCurrentAction);
  const currentBtns = BtnsTextBlockInfo[currentAction];
  const queryClient = useQueryClient();
  const selectTestsStore = useSelectTestsStore(store => store);
  const {isLoading: isAllTestLoading, invalidate} = useAllTest();

  const {
    mutateAsync: actionManyTestsTrigger,
    isLoading: actionManyTestsLoading
  } = useMutation(actionManyTest);

  const {
    mutateAsync: openAllTestTrigger
  } = useMutation(openAllTestFetcher);

  const {
    mutateAsync: closeAllTestTrigger
  } = useMutation(closeAllTestFetcher);

  const {
    mutateAsync: clearAllTestResultsTrigger
  } = useMutation(clearAllTestResultsFetcher);

  const handleOpenAllTest = async () => {
    try {
      await openAllTestTrigger();
      await queryClient.invalidateQueries({queryKey: ['allTests']});
      message.success('Все тесты успешно открыты!');
    } catch (e) {
      message.error('Ошибка при открытии всех тестов!');
    }
  };

  const handleCloseAllTest = async () => {
    try {
      await closeAllTestTrigger();
      await queryClient.invalidateQueries({queryKey: ['allTests']});
      message.success('Все тесты успешно закрыты!');
    } catch (e) {
      message.error('Ошибка при закрытии всех тестов!');
    }
  };

  const handleClearResultsAllTest = async () => {
    try {
      await clearAllTestResultsTrigger();
      message.success('Все результаты тестов успешно очищены!');
    } catch (e) {
      message.error('Ошибка при очистке результатов тестов!');
    }
  };

  const handleAllClick = () => {
    switch (currentAction) {
      case 'openTests':
        return handleOpenAllTest();
      case 'closeTests':
        return handleCloseAllTest();
      case 'clearResults':
        return handleClearResultsAllTest();
    }
  };

  const handleManyClick = async () => {
    try {
      await actionManyTestsTrigger({
        testIds: selectTestsStore.selectTests,
        action: currentActionForApi[selectTestsStore.lastCurrentAction],
        folderId: undefined
      });
      await invalidate();
      selectTestsStore.setCurrentAction(undefined);
      message.success('Действие к выбранным тестам успешно применено!');
    } catch (e) {
      message.error('Ошибка при применении действия к выбранным тестам');
    }
  };

  return (
    <div className={s.spaceWrapper}>
      <Space className={s.spaace}>
        {currentBtns[0].length > 0 &&
        <Button
          onClick={handleAllClick}
          type="default"
          size="middle"
        >
          {currentBtns[0]}
        </Button>}
        <Button
          onClick={handleManyClick}
          type="primary"
          size="middle"
          loading={actionManyTestsLoading || isAllTestLoading}
          className={clsx({
            [s.activeSuccessBtn]: selectTestsStore.currentAction === 'clearResults',
            [s.activeDangerBtn]: selectTestsStore.currentAction === 'closeTests' || selectTestsStore.currentAction === 'deleteTests',
            [s.activeGrayBtn]: selectTestsStore.currentAction === 'addInFolder',
          })}
        >
          {currentBtns[1]}
        </Button>
      </Space>
    </div>
  );
};

export default InfoBlockBtns;
