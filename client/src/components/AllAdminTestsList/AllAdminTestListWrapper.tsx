'use client'
import s from "./AllAdminTestsList.module.scss";
import React, {FC, memo, useEffect, useState} from "react";
import AllAdminTestsList from "./AllAdminTestsList";
import {Segmented, Select, Spin} from "antd";
import {EFilterById, EFilterTranslate, TFilterById} from "../../api/test/type";
import {useAllFolder} from "../../http/hooks/useAllFolder";
import FolderFunctionBlock from "./FolderFunctionBlock/FolderFunctionBlock";

interface AllAdminTestListWrapperProps {}

const AllAdminTestListWrapper: FC<AllAdminTestListWrapperProps> = ({}) => {
    const {
        data: allFolder,
        isLoading: isFolderLoading,
    } = useAllFolder();

    const [showTestInFolder, setShowTestInFolder] = useState<number>(0);
    const [filterById, setFilterById] = useState<string>('2');
    const [folderId, setFolderId] = useState<string | undefined>(undefined);

    useEffect(() => {
      setFolderId(undefined);
    }, [allFolder]);

    const handleFilterChange = (e: string) => {
        setFilterById(e)
    }

    const handleFolderChange = (e: any) => {
        if (!e) setFolderId(undefined)
        else setFolderId(e);
    }

    return (
      <div className={s.all__tests__list}>
          <div className={s.header__wrapper}>
              <h2>Список тестов</h2>
              <Select
                defaultValue={filterById}
                className={s.select}
                options={Object.keys(EFilterTranslate).map((el, index) => ({
                    label: EFilterTranslate[el],
                    value: EFilterById[el as TFilterById]
                }))}
                onChange={handleFilterChange}
              />
          </div>
          {isFolderLoading
            ? <div className={s.folderLoading}><Spin/></div>
            :
            allFolder && allFolder.length > 0 &&
            <Segmented
              value={folderId || 0}
              defaultValue={folderId || 0}
              onChange={handleFolderChange}
              style={{marginTop: 15, marginBottom: 15}}
              options={
                  [
                      {
                          value: 0,
                          label: 'Все тесты'
                      },
                      ...allFolder?.map((el, index) => ({
                          value: el._id,
                          label: el.name
                      }))
                  ]
              }
              block
            />
          }
          {!folderId && allFolder && allFolder.length > 0 &&
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
          }
        {folderId &&
            <FolderFunctionBlock
                folderId={folderId}
                folderName={allFolder?.find(el => el._id === folderId)?.name}
            />
        }
        <AllAdminTestsList
          showTestInFolder={folderId ? 1 : showTestInFolder}
          isShowBadge={!folderId}
          filterById={filterById}
          folderId={folderId}
        />
      </div>)
};

export default memo(AllAdminTestListWrapper);
