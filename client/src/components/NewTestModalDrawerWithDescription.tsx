import {FC, memo} from "react";
import {useMedia} from "react-use";
import {useMutation, useQueryClient} from "react-query";
import {createNewTestWithDescription} from "../api/test";
import {useForm} from "antd/es/form/Form";
import {Button, Drawer, Form, Input, message, Modal} from "antd";
import {useNavigate} from "react-router-dom";
import {getFormateDate} from "../utils/getFormateDate";
import drawerStyles from '../DrawerStyles.module.scss'

interface NewTestModalDrawerWithDescriptionProps {
    open: boolean;
    setOpen: (val: boolean) => void;
}

const NewTestModalDrawerWithDescription: FC<NewTestModalDrawerWithDescriptionProps> = ({open, setOpen}) => {
    const isPC = useMedia('(min-width: 768px)');
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const {
        mutateAsync: createNewTestTrigger,
        isLoading: isCreateNewTestLoading
    } = useMutation(createNewTestWithDescription);

    const [form] = useForm()

    const onOk = async () => {
        try {
            await form.validateFields();
            const testName = form.getFieldValue('testName')
            const testQuestionNumber = form.getFieldValue('testQuestionNumber')
            const date = new Date();
            const createDate = getFormateDate(date)
            const res = await createNewTestTrigger({
                title: testName,
                quantityQuestion: testQuestionNumber,
                createDate
            });
            navigate(`/admin/testInfo/customTest/description/${res._id}`)
            await queryClient.invalidateQueries({ queryKey: ['allTests'] })
            setOpen(false)
        } catch (e) {
            message.error('Ошибка при создании теста')
        }
    }

    const content = (
        <Form
            form={form}
            autoComplete='off'
            layout={'vertical'}
        >
            <Form.Item
                label={'Введите название теста'}
                name={'testName'}
                rules={[
                    {
                        required: true,
                        message: 'Введите название теста'
                    }
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label={'Введите кол-во вопросов'}
                rules={[
                    {
                        required: true,
                        message: 'Введите кол-во вопросов'
                    }
                ]}
                name={'testQuestionNumber'}
            >
                <Input type={'number'}/>
            </Form.Item>
        </Form>
    )

    return (
        <>
            {isPC &&
                <Modal
                    open={open}
                    title="Создание нового теста с описанием"
                    onCancel={() => setOpen(false)}
                    onOk={onOk}
                    className={"modalWrapper"}
                    footer={(
                        <>
                            <Button onClick={() => setOpen(false)}>Отмена</Button>
                            <Button loading={isCreateNewTestLoading} type={'primary'} onClick={onOk}>Подтвердить</Button>
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
                    width={500}
                    height={'auto'}
                    className={drawerStyles.drawer}
                    destroyOnClose
                >
                    <div className={drawerStyles.drawerWrapper}>
                        {content}
                        <div className={drawerStyles.btns}>
                            <Button onClick={() => setOpen(false)}>Отмена</Button>
                            <Button loading={isCreateNewTestLoading} type={'primary'} onClick={onOk}>Подтвердить</Button>
                        </div>
                    </div>
                </Drawer>
            }
        </>
    )
};

export default memo(NewTestModalDrawerWithDescription);
