import React from 'react';
import s from './PutInFolderBtn.module.scss';
import {Button, message, Tooltip} from "antd";
import {useMutation, useQueryClient} from "react-query";
import {putFolderOneApi} from "../../../api/test";
import {useAllFolder} from "../../../http/hooks/useAllFolder";
import {useAllTest} from "../../../http/hooks/useAllTest";

const PutInFolderBtn = ({id}:{id?: string}) => {
  const queryClient = useQueryClient();
  const {data} = useAllFolder();
  const {mutateAsync} = useMutation({
    mutationFn: putFolderOneApi
  })

  const handlePut = async (folderId: string) => {
    try {
      await mutateAsync({id, folderId: folderId});
      await queryClient.invalidateQueries({ queryKey: ['allTests'] });
    } catch (e) {
      message.error('Ошибка при добавлении теста в папку');
    }
  }

  return (
    <Tooltip
      destroyTooltipOnHide
      color={'white'}
      placement="bottom"
      title={
        <div className={'tooltipWrapper'}>
          {data?.map((el, index) => (
            <div className={s.tooltipItem} onClick={() => handlePut(el._id)}>
              {el.name}
            </div>
          ))}
        </div>
      }
    >
      <Button
        className={s.btn}
        style={{width: 'max-content'}}
      >
        Поместить в папку
      </Button>
    </Tooltip>
  );
};

export default PutInFolderBtn;