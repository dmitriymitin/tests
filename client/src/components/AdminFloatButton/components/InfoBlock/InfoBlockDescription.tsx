import React, {useState} from 'react';
import {useSelectTestsStore} from '../../../../store/folders/useSelectTestsStore';
import {DescriptionBlockInfo} from '../../../../store/folders/const';
import s from './InfoBlock.module.scss';
import fs from '../../AdminFloatButton.module.scss';
import clsx from 'clsx';
import gs from '../../../../GlobalStyles.module.scss';
import {Button, Segmented} from 'antd';
import ChoseTestsModalDrawer from './ChoseTestsModalDrawer';
import {useAllTest} from '../../../../http/hooks/useAllTest';

const InfoBlockDescription = () => {
  const [open, setOpen] = useState(false);
  const selectTestsStore = useSelectTestsStore(store => store);
  const {invalidate: invalidateAllTest} = useAllTest();

  const currentText = DescriptionBlockInfo[selectTestsStore.lastCurrentAction];

  // Функция для окрашивания текста в соответствующий цвет
  const colorizeText = (text: string, color: 'blue' | 'green' | 'danger' | 'gray' | string) => {
    const currentColor = (() => {
      switch (color) {
        case 'blue':
          return '#1677ff';
        case 'green':
          return 'green';
        case 'danger':
          return 'red';
        case 'gray':
          return 'rgba(128, 128, 128, 0.42)';
      }
    })();
    return <span style={{color: currentColor, fontWeight: 900}}>{text}</span>;
  };

  // Разбиваем текст на части внутри фигурных скобок
  const parts = currentText.split(/{|}/);

  // Создаем массив с элементами, окрашенными в соответствующие цвета
  const coloredParts = parts.map((part, index) => {
    if (index % 2 === 1) {
      // Четные индексы соответствуют тексту внутри фигурных скобок
      const [color, text] = part.split(', ');
      return colorizeText(text, color);
    } else {
      // Нечетные индексы - обычный текст
      return part;
    }
  });

  return <div className={s.infoBlockDescription}>
    <ChoseTestsModalDrawer open={open} setOpen={setOpen}/>
    <div>{coloredParts}</div>
    {
      (selectTestsStore.lastCurrentAction === 'openTests' || selectTestsStore.lastCurrentAction === 'closeTests') &&
        <div className={s.questionWrapper}>
          Отображать только тесты для текущего действия?
          <Segmented
                onChange={ e => selectTestsStore.setOnlyMakeTestsAction(e as any)}
                defaultValue={selectTestsStore.onlyMakeTestsAction}
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
    }
    {/* <div className={s.infoBlockDescriptionBtnWrapper}> */}
    {/*  {selectTestsStore.selectTests.length > 0 && */}
    {/*      <Button */}
    {/*          type="primary" */}
    {/*          size="middle" */}
    {/*          onClick={() => { */}
    {/*            setOpen(true) */}
    {/*          }} */}
    {/*          className={clsx({ */}
    {/*            [fs.activeDangerBtn]: selectTestsStore.currentAction === 'closeTests' || selectTestsStore.currentAction === 'deleteTests', */}
    {/*            [fs.activeSuccessBtn]: selectTestsStore.currentAction === 'clearResults', */}
    {/*            [fs.activeGrayBtn]: selectTestsStore.currentAction === 'addInFolder', */}
    {/*          })} */}
    {/*      > */}
    {/*          Выбрано тестов: {selectTestsStore.selectTests.length} */}
    {/*      </Button> */}
    {/*  } */}
    {/* </div> */}
  </div>;
};

export default InfoBlockDescription;
