import {App, Avatar, Button, Drawer, Form, Input, Space} from "antd";
import s from "../../pages/Pages.module.css";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useAuth} from "../../hooks/use-auth";
import {createScheme} from "../../store/slices/schemeSlice";

export default function CreateSchemeDrawer(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch()
    const user = useAuth()

    const [createSchemeForm] = Form.useForm();
    const [createSchemeSubmittable, setCreateSchemeSubmittable] = React.useState(false);
    const createSchemeValues = Form.useWatch([], createSchemeForm);

    useEffect(() => {
        createSchemeForm.validateFields({validateOnly: true}).then(
            () => {
                setCreateSchemeSubmittable(true);
            },
            () => {
                setCreateSchemeSubmittable(false);
            },
        );
    }, [createSchemeValues]);

    const closeCreateSchemeDrawer = () => {
        createSchemeForm.resetFields();
        props.setOpenCreateSchemeDrawer(false);
    };

    const handleCreateScheme = (payload) => {
        message.open({
            key: 'createScheme',
            type: 'loading',
            content: 'Создаю схему...'
        });

        dispatch(createScheme({
            ownerID: payload.createSchemeOwner,
            schemeName: payload.createSchemeName,
        })).then(() => {
            message.open({
                key: 'createScheme',
                type: 'success',
                content: 'Схема успешно создана!',
                duration: 2,
            });
            closeCreateSchemeDrawer()
        }, () => {
            message.open({
                key: 'createScheme',
                type: 'error',
                content: 'Ошибка создания схемы',
                duration: 2,
            });
        })
    }

    return (
        <Drawer
            title="Создание новой схемы"
            width={500}
            onClose={closeCreateSchemeDrawer}
            open={props.openCreateSchemeDrawer}
            bodyStyle={{paddingBottom: 80}}
            extra={
                <Space>
                    <Button disabled={!createSchemeSubmittable} type="primary" onClick={() => {
                        createSchemeForm
                            .validateFields()
                            .then((values) => {
                                // form.resetFields();
                                handleCreateScheme(values)
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}>
                        Создать
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical" hideRequiredMark form={createSchemeForm}>
                <Form.Item name="createSchemeName"
                           label="Название"
                           rules={[
                               {
                                   required: true,
                                   message: 'Введите название схемы'
                               }
                           ]}
                >
                    <Input/>
                </Form.Item>


                <Form.Item name="createSchemeOwner"
                           initialValue={user.id}
                           label="Ответственный"
                >
                    <div className={s.createNoteOwner}>
                        <Avatar
                            src={"https://ren-design.ru/api/knowledge-base/1.0/files/avatars/" + user.avatar}
                            size={24}/>
                        <div
                            className={s.createNoteOwnerName}>{user.secondName + " " + user.firstName}</div>
                    </div>
                </Form.Item>
            </Form>
        </Drawer>
    )
}
