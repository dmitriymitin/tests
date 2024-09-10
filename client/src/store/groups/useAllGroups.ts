import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {IQuestionGroup} from "../../api/questionGroup/type";

interface IGroupsStore {
  currentActiveGroups: IQuestionGroup[];
  setCurrentActiveGroupIds: (groups: IQuestionGroup[]) => void;
}

export const useAllGroupsStore = create<IGroupsStore>()(devtools(
  immer((setState) => ({
    currentActiveGroups: [],
    setCurrentActiveGroupIds: (groupsIds: IQuestionGroup[]) => setState((store) => {
      store.currentActiveGroups = groupsIds;
    }),
  }))
)
);
