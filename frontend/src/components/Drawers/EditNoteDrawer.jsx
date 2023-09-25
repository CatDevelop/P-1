import {App, Avatar, Button, Checkbox, Col, Drawer, Form, Input, Row, Select, Space} from "antd";
import s from "../../pages/Pages.module.css";
import {EditOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useAuth} from "../../hooks/use-auth";
import {updateNoteMeta, updateNoteOwner} from "../../store/slices/noteSlice";
import {useUsers} from "../../hooks/use-users";

export default function EditNoteDrawer(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch()
    const users = useUsers()

    const [editNoteIsEditOwner, setEditNoteIsEditOwner] = useState(false);
    const [editNoteForm] = Form.useForm();
    const [editNoteSubmittable, setEditNoteSubmittable] = React.useState(false);
    const editNoteValues = Form.useWatch([], editNoteForm);
    const editNoteImage = Form.useWatch('editNoteImage', editNoteForm);

    const usersOptions = users?.users.map(user => {
        return {label: user.secondName + " " + user.firstName, value: user.id}
    })

    useEffect(() => {
        editNoteForm.validateFields({validateOnly: true}).then(
            () => {
                setEditNoteSubmittable(true);
            },
            () => {
                setEditNoteSubmittable(false);
            },
        );
    }, [editNoteValues]);

    useEffect(() => {
        editNoteForm.resetFields();
    }, [props.editNote])

    const closeEditNote = () => {
        props.setEditNote(null)
        editNoteForm.resetFields();
        setEditNoteIsEditOwner(false)
        props.setOpenEditNote(false);
    };

    const handleUpdateNoteMeta = (payload) => {
        message.open({
            key: 'updateNoteMeta',
            type: 'loading',
            content: 'Обновляю информацию о статье...'
        });

        dispatch(updateNoteMeta({
            noteID: props.editNote.id,
            seriesID: props.seriesID,
            ownerID: props.editNote.ownerID,
            noteName: payload.editNoteName,
            noteTags: JSON.stringify(payload.editNoteTags),
            noteImage: payload.editNoteImage,
            noteVisible: payload.editNoteVisible ? 1 : 0
        })).then(p => {
            if (p.error) {
                message.open({
                    key: 'updateNoteMeta',
                    type: 'error',
                    content: p.payload,
                    duration: 2,
                });
            } else {
                message.open({
                    key: 'updateNoteMeta',
                    type: 'success',
                    content: 'Информация о статье успешно обновлена!',
                    duration: 2,
                });
                closeEditNote()
            }
        })
    }

    const handleEditNoteOwner = () => {
        message.open({
            key: 'editNoteOwner',
            type: 'loading',
            content: 'Изменяю ответственного за статью...'
        });

        dispatch(updateNoteOwner({
            noteID: props.editNote.id,
            ownerID: editNoteForm.getFieldValue("editNoteOwner"),
            seriesID: props.seriesID,
        })).then(p => {
            if (p.error) {
                message.open({
                    key: 'editNoteOwner',
                    type: 'error',
                    content: p.payload,
                    duration: 2,
                });
            } else {
                message.open({
                    key: 'editNoteOwner',
                    type: 'success',
                    content: 'Ответственный успешно изменён!',
                    duration: 2,
                });
            }
            closeEditNote()
        })
    }

    let editNoteUser = users?.users.find(user => user.id === props.editNote?.ownerID)

    return (
        <Drawer
            title="Редактирование статьи"
            width={500}
            onClose={closeEditNote}
            open={props.openEditNote}
            bodyStyle={{paddingBottom: 80}}
            extra={
                <Space>
                    {/*<Button onClick={closeCreateNote}>Отмена</Button>*/}
                    <Button disabled={!editNoteSubmittable || editNoteIsEditOwner} type="primary"
                            onClick={() => {
                                editNoteForm
                                    .validateFields()
                                    .then((values) => {
                                        // form.resetFields();
                                        // handleCreateNote(values)
                                        handleUpdateNoteMeta(values)
                                    })
                                    .catch((info) => {
                                        console.log('Validate Failed:', info);
                                    });
                            }}>
                        Сохранить
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical" hideRequiredMark form={editNoteForm}
                  initialValues={{
                      editNoteVisible: props.editNote?.isVisible === '1'
                  }}
            >
                <Form.Item
                    name="editNoteName"
                    label="Название"
                    rules={[{required: true, message: 'Введите название статьи'}]}
                    initialValue={props.editNote?.title}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="editNoteTags"
                    label="Теги"
                    initialValue={props.editNote ? JSON.parse(props.editNote.tags) : []}
                    // rules={[{ required: true, message: 'Please select an owner' }]}
                >
                    <Select
                        mode="tags"
                        style={{
                            width: '100%',
                        }}
                        options={[{value: "Frontend", label: "Frontend"}, {
                            value: "Backend",
                            label: "Backend"
                        }]}
                    />
                </Form.Item>
                <Form.Item
                    name="editNoteImage"
                    label="Ссылка на изображение"
                    rules={[{
                        required: true,
                        message: 'Введите ссылку на изображение превью'
                    }, {
                        pattern: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm,
                        message: 'Введите корректную ссылку'
                    }]}
                    initialValue={props.editNote?.image}
                >
                    <Input/>
                </Form.Item>
                {
                    editNoteImage?.length !== 0 && editNoteImage?.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm) ?
                        <Form.Item
                            label="Превью баннера"
                        >
                            <div
                                style={
                                    {
                                        borderRadius: "8px",
                                        width: "300px",
                                        height: "180px",
                                        background: "url(" + editNoteImage + ") no-repeat center center",
                                        backgroundSize: "cover !important"
                                    }
                                }
                                alt="example"
                                // src="https://images.unsplash.com/photo-1689616977225-bf0ab4ae1ac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80"
                            />
                        </Form.Item> : <></>
                }

                <Form.Item
                    name="editNoteVisible"
                    valuePropName="checked"
                >
                    <Checkbox >Статья видна всем пользователям</Checkbox>
                </Form.Item>

                <Form.Item label="Ответственный">
                    {
                        editNoteIsEditOwner ?
                            <Row gutter={[10, 0]}>
                                <Col flex="auto">
                                    <Form.Item
                                        name="editNoteOwner"
                                        initialValue={editNoteUser?.id}
                                    >
                                        <Select style={{width: '100%'}}
                                                options={usersOptions}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Button type="primary"
                                            onClick={() => handleEditNoteOwner()}>Изменить</Button></Col>
                                <Col>
                                    <Button
                                        onClick={() => {
                                            setEditNoteIsEditOwner(false);
                                            editNoteForm.setFieldValue("editNoteOwner", props.editNote.ownerID)
                                        }}>Отменить</Button>
                                </Col>
                            </Row>
                            :
                            <div className={s.createNoteOwner}>
                                <Avatar
                                    src={"https://ren-design.ru/api/knowledge-base/1.0/files/avatars/" + editNoteUser?.avatar}
                                    size={24}/>
                                <div
                                    className={s.createNoteOwnerName}>{editNoteUser?.secondName + " " + editNoteUser?.firstName}</div>
                                <Button icon={<EditOutlined/>}
                                        onClick={() => setEditNoteIsEditOwner(true)}/>
                            </div>
                    }

                </Form.Item>
            </Form>
        </Drawer>
    )
}
