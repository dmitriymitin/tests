import React, {Fragment} from 'react';
import {useMedia} from "react-use";
import {Button, Drawer, Modal, Spin} from "antd";
import drawerStyles from '../../../../DrawerStyles.module.scss';
import s from "../../AdminFloatButton.module.scss";
import {TitleBlockInfo} from "../../../../store/folders/const";
import {useSelectTestsStore} from "../../../../store/folders/useSelectTestsStore";
import {useAllTest} from "../../../../http/hooks/useAllTest";

interface ChoseTestsModalDrawerProps {
  open: boolean,
  setOpen: (val: boolean) => void,
}

const ChoseTestsModalDrawer = ({ open, setOpen }: ChoseTestsModalDrawerProps) => {
  const {data: allTest, isLoading: isAllTestLoading, invalidate} = useAllTest();
  const selectTestsStore = useSelectTestsStore(store => store)
  const isPC = useMedia('(min-width: 768px)');
  const onOk = async () => {
    setOpen(false);
  }

  const onCancel = () => {
    setOpen(false);
  }

  const content = (
    isAllTestLoading
      ? <div className={s.loading}>
        <Spin/>
      </div>
      :
      <div className={s.content}>

      </div>
  )

  return (
    <>
      {isPC &&
          <Modal
              open={open}
              title={TitleBlockInfo[selectTestsStore.lastCurrentAction]}
              onCancel={() => setOpen(false)}
              onOk={onOk}
              width={800}
              className={"modalWrapper"}
              footer={(
                <>
                  <Button onClick={onCancel}>Закрыть</Button>
                </>
              )}
          >
            {content}
          </Modal>
      }

      {!isPC &&
          <Drawer
              placement={"bottom"}
              onClose={() => setOpen(false)}
              open={open}
              title={TitleBlockInfo[selectTestsStore.lastCurrentAction]}
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
              </div>
          </Drawer>
      }
    </>
  )
};

export default ChoseTestsModalDrawer;
