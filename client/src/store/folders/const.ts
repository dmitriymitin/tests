import {TCurrentAction} from './useSelectTestsStore';
import {TActionManyTest} from '../../api/test';

export const TitleBlockInfo: {
  [key: TCurrentAction | string]: string;
} = {
  openTests: ' Открыть тесты',
  closeTests: 'Закрыть тесты',
  clearResults: 'Очистить результаты тестов',
  addInFolder: 'Добавить в папку',
  deleteTests: 'Удалить тесты'
};

export const DescriptionBlockInfo: {
  [key: TCurrentAction | string]: string;
} = {
  openTests: 'Пока это уведомление отображается на экране, вы можете выбрать тесты, к которым хотите {blue, открыть} доступ. После этого нажмите кнопку “Открыть выбранные тесты”',
  closeTests: 'Пока это уведомление отображается на экране, вы можете выбрать тесты, к которым хотите {danger, закрыть} доступ. После этого нажмите кнопку “Закрыть выбранные тесты”',
  clearResults: 'Пока это уведомление отображается на экране, вы можете выбрать тесты, у которых хотите {green, очистить} результаты. После этого нажмите кнопку “Очистить реузльтаты выбранных тестов”',
  addInFolder: 'Пока это уведомление отображается на экране, вы можете выбрать тесты, которые хотите {gray, переместить} в папку. После этого нажмите кнопку “Добавить выбранные тесты в папку”',
  deleteTests: 'Пока это уведомление отображается на экране, вы можете выбрать тесты, которые хотите {danger, удалить}. После этого нажмите кнопку “Удалить тесты”',
};

export const BtnsTextBlockInfo: {
  [key: TCurrentAction | string]: string[];
} = {
  openTests: ['Открыть все тесты', 'Открыть выбранные тесты'],
  closeTests: ['Закрыть все тесты', 'Закрыть выбранные тесты'],
  clearResults: ['Очистить результаты всех тестов', 'Очистить результаты выбранных тестов'],
  addInFolder: ['', 'Добавить выбранные тесты в папку'],
  deleteTests: ['', 'Удалить выбранные тесты'],
};

export const currentActionForApi: {
  [key: TCurrentAction | string]: TActionManyTest;
} = {
  openTests: 'open',
  closeTests: 'close',
  clearResults: 'clearResults',
  addInFolder: 'addInFolder',
  deleteTests: 'delete'
};
