import React from 'react';
import s from './PutInFolderBtn.module.scss';
import {Button, message, Tooltip} from "antd";
import {useMutation, useQueryClient} from "react-query";
import {putFolderOneApi} from "../../../api/test";
import {useAllFolder} from "../../../http/hooks/useAllFolder";
import {useAllTest} from "../../../http/hooks/useAllTest";
import clsx from "clsx";
import {useSelectTestsStore} from "../../../store/folders/useSelectTestsStore";

const PutInFolderBtn = ({id}:{id?: string}) => {
  const queryClient = useQueryClient();
  const {data} = useAllFolder();
  const {mutateAsync} = useMutation({
    mutationFn: putFolderOneApi
  })
  const testsSelectStore = useSelectTestsStore(store => store)

  const handlePut = async (folderId: string) => {
    try {
      await mutateAsync({id, folderId: folderId});
      await queryClient.invalidateQueries({ queryKey: ['allTests'] });
    } catch (e) {
      message.error('Ошибка при добавлении теста в папку');
    }
  }

  const btn = (
    <Button
      onClick={(e) => e.stopPropagation()}
      className={s.btn}
      style={{width: 'max-content'}}
    >
      Добавить в папку
    </Button>
  )

  return (
    <Tooltip
      destroyTooltipOnHide
      color={'white'}
      placement="bottom"
      title={
        <div className={clsx('tooltipWrapper', s.tooltipWrapperMain)}>
          {data?.map((el, index) => (
            <div className={s.tooltipItem} onClick={(e) => {
              e.stopPropagation();
              handlePut(el._id)
            }}>
              {el.name}
            </div>
          ))}
        </div>
      }
    >
      {btn}
    </Tooltip>
  );
};

export default PutInFolderBtn;