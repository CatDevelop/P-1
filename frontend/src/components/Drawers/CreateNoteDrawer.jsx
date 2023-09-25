import {App, Avatar, Button, Drawer, Form, Input, Select, Space} from "antd";
import s from "../../pages/Pages.module.css";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {createNote} from "../../store/slices/noteSlice";
import {useAuth} from "../../hooks/use-auth";

export default function CreateNoteDrawer(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch()
    const user = useAuth()

    const [createNoteForm] = Form.useForm();
    const [createNoteSubmittable, setCreateNoteSubmittable] = React.useState(false);
    const createNoteValues = Form.useWatch([], createNoteForm);
    const createNoteImage = Form.useWatch('createNoteImage', createNoteForm);

    useEffect(() => {
        createNoteForm.validateFields({validateOnly: true}).then(
            () => {
                setCreateNoteSubmittable(true);
            },
            () => {
                setCreateNoteSubmittable(false);
            },
        );
    }, [createNoteValues]);

    const closeCreateNote = () => {
        createNoteForm.resetFields();
        props.setOpenCreateNote(false);
    };

    const handleCreateNote = (payload) => {
        message.open({
            key: 'createNote',
            type: 'loading',
            content: 'Создаю статью...'
        });

        dispatch(createNote({
            ownerID: payload.createNoteOwner,
            seriesID: props.seriesID,
            noteName: payload.createNoteName,
            noteTags: JSON.stringify(payload.createNoteTags),
            noteImage: payload.createNoteImage
        })).then(p => {
            if (p.error) {
                message.open({
                    key: 'createNote',
                    type: 'error',
                    content: p.payload,
                    duration: 2,
                });
            } else {
                message.open({
                    key: 'createNote',
                    type: 'success',
                    content: 'Статья успешно создана!',
                    duration: 2,
                });
                closeCreateNote()
            }
        })
    }

    return (
        <Drawer
            title="Создание новой статьи"
            width={500}
            onClose={closeCreateNote}
            open={props.openCreateNote}
            bodyStyle={{paddingBottom: 80}}
            extra={
                <Space>
                    <Button disabled={!createNoteSubmittable} type="primary" onClick={() => {
                        createNoteForm
                            .validateFields()
                            .then((values) => {
                                // form.resetFields();
                                handleCreateNote(values)
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
            <Form layout="vertical" hideRequiredMark form={createNoteForm}>
                <Form.Item name="createNoteName"
                           label="Название"
                           rules={[
                               {
                                   required: true,
                                   message: 'Введите название статьи'
                               }
                           ]}
                >
                    <Input/>
                </Form.Item>


                <Form.Item name="createNoteTags"
                           label="Теги"
                >
                    <Select mode="tags"
                            style={{width: '100%'}}
                            options={[{value: "frontend", label: "Frontend"}, {
                                value: "backend",
                                label: "Backend"
                            }]}
                    />
                </Form.Item>


                <Form.Item name="createNoteImage"
                           label="Ссылка на изображение"
                           rules={[
                               {
                                   required: true,
                                   message: 'Введите ссылку на изображение превью'
                               },
                               {
                                   pattern: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm,
                                   message: 'Введите корректную ссылку'
                               }
                           ]}
                >
                    <Input/>
                </Form.Item>



                {
                    createNoteImage?.length !== 0
                    && createNoteImage?.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm) ?
                        <Form.Item label="Превью баннера">
                            <div
                                style={
                                    {
                                        borderRadius: "8px",
                                        width: "300px",
                                        height: "180px",
                                        background: "url(" + createNoteImage + ") no-repeat center center",
                                        backgroundSize: "cover !important"
                                    }
                                }
                            />
                        </Form.Item> : <></>
                }

                <Form.Item name="createNoteOwner"
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
