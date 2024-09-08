
import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';

export type TCurrentAction = 'openTests' | 'closeTests' | 'clearResults' | 'addInFolder' | 'deleteTests'

interface ISelectTestsStore {
  currentAction: TCurrentAction | undefined;
  onlyMakeTestsAction: 0 | 1;
  setOnlyMakeTestsAction: (val: 0 | 1) => void;
  lastCurrentAction: TCurrentAction;
  setCurrentAction: (action: TCurrentAction | undefined) => void;
  selectTests: string[];
  setLastAction: (action: TCurrentAction) => void;
  addTest: (id: string) => void;
  removeTest: (id: string) => void;
}

export const useSelectTestsStore = create<ISelectTestsStore>()(
  persist(devtools(
    immer((setState) => ({
      currentAction: undefined,
      lastCurrentAction: 'openTests',
      onlyMakeTestsAction: 0,
      setOnlyMakeTestsAction: (val: 0 | 1) => setState((store) => {
        store.onlyMakeTestsAction = val;
      }),
      selectTests: [],
      setLastAction: (action: TCurrentAction) => setState((store) => {
        store.lastCurrentAction = action;
      }),
      setCurrentAction: (action: TCurrentAction | undefined) => setState((store) => {
        if (!action) {
          store.selectTests = [];
        }

        store.onlyMakeTestsAction = 0;
        store.currentAction = action;
      }),
      addTest: (id: string) => setState((store) => {
        store.selectTests.push(id);
      }),
      removeTest: (id: string) => setState((store) => {
        store.selectTests = store.selectTests.filter(el => el !== id);
      }),
    }))
  ), {
    name: 'Folders', version: 1
  })
);
