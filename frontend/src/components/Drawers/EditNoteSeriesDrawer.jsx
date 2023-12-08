import {App, Avatar, Button, Checkbox, Drawer, Form, Input, Select, Space, Spin} from "antd";
import React, {useEffect} from "react";
import {updateNoteSeriesMeta} from "../../store/slices/noteSlice";
import {useDispatch} from "react-redux";
import {useAuth} from "../../hooks/use-auth";
import s from "./EditNoteSeriesDrawer.module.css";
import {EditOutlined} from "@ant-design/icons";
import {useUsers} from "../../hooks/use-users";

export default function EditNoteSeriesDrawer(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch()

    const user = useAuth()
    const users = useUsers()

    const [editNoteSeriesForm] = Form.useForm();
    const [editNoteSeriesSubmittable, setEditNoteSeriesSubmittable] = React.useState(false);
    const editNoteSeriesValues = Form.useWatch([], editNoteSeriesForm);
    const editNoteSeriesImage = Form.useWatch('editNoteSeriesImage', editNoteSeriesForm);

    useEffect(() => {
        editNoteSeriesForm.resetFields();
    }, [props?.editNoteSeries])

    useEffect(() => {
        editNoteSeriesForm.validateFields({validateOnly: true}).then(
            () => {
                setEditNoteSeriesSubmittable(true);
            },
            () => {
                setEditNoteSeriesSubmittable(false);
            },
        );
    }, [editNoteSeriesValues]);

    const closeEditNoteSeries = () => {
        props.setEditNoteSeries(null)
        editNoteSeriesForm.resetFields();
        props.setOpenEditNoteSeries(false);
    };

    const handleUpdateNoteSeriesMeta = (payload) => {
        if (props.editNoteSeries.title === payload.editNoteSeriesName && props.editNoteSeries.tags === JSON.stringify(payload.editNoteSeriesTags) && props.editNoteSeries.image === payload.editNoteSeriesImage  && (props.editNoteSeries.isVisible === '1') === payload.editNoteSeriesVisible) {
            closeEditNoteSeries()
            return
        }
        message.open({
            key: 'updateNoteSeriesMeta',
            type: 'loading',
            content: 'Обновляю информацию о статье...'
        });
        console.log(props)

        dispatch(updateNoteSeriesMeta({
            noteSeriesID: props.editNoteSeries.id,
            seriesID: props.seriesID,
            noteSeriesName: payload.editNoteSeriesName,
            noteSeriesTags: JSON.stringify(payload.editNoteSeriesTags),
            noteSeriesImage: payload.editNoteSeriesImage,
            noteSeriesVisible: payload.editNoteSeriesVisible,
        })).then(p => {
            if (p.error) {
                message.open({
                    key: 'updateNoteSeriesMeta',
                    type: 'error',
                    content: p.payload,
                    duration: 2,
                });
            } else {
                message.open({
                    key: 'updateNoteSeriesMeta',
                    type: 'success',
                    content: 'Информация о серии статей успешно обновлена!',
                    duration: 2,
                });
                closeEditNoteSeries()
            }
        })
    }

    if(users.isLoading)
        return <Spin/>

    let editNoteSeriesUser = users?.users.find(user => user.id === props.editNoteSeries?.ownerID)
    const editNoteCreateDate = new Date(props.editNoteSeries?.createDate);
    const editNoteCreateDateString = editNoteCreateDate.toLocaleDateString() + " " + editNoteCreateDate.toLocaleTimeString().slice(0, 5)

    return (
        <Drawer title="Редактирование серии статей"
                width={500}
                onClose={closeEditNoteSeries}
                open={props.openEditNoteSeries}
                bodyStyle={{paddingBottom: 80}}
                extra={
                    <Space>
                        <Button disabled={!editNoteSeriesSubmittable} type="primary" onClick={() => {
                            editNoteSeriesForm
                                .validateFields()
                                .then((values) => {
                                    handleUpdateNoteSeriesMeta(values)
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
            <Form layout="vertical" hideRequiredMark form={editNoteSeriesForm}
                  initialValues={{
                      editNoteSeriesVisible: props.editNoteSeries?.isVisible === '1'
                  }}
            >

                <Form.Item name="editNoteSeriesName"
                           label="Название"
                           rules={[
                               {
                                   required: true,
                                   message: 'Введите название серии статей'
                               }
                           ]}
                           initialValue={props.editNoteSeries?.title}
                >
                    <Input/>
                </Form.Item>


                <Form.Item name="editNoteSeriesTags"
                           label="Теги"
                           initialValue={props.editNoteSeries ? JSON.parse(props.editNoteSeries.tags) : []}
                >
                    <Select mode="tags"
                            style={{width: '100%',}}
                            options={[
                                {value: "Frontend", label: "Frontend"},
                                {value: "Backend", label: "Backend"}
                            ]}
                    />
                </Form.Item>


                <Form.Item
                    name="editNoteSeriesImage"
                    label="Ссылка на изображение"
                    rules={[{
                        required: true,
                        message: 'Введите ссылку на изображение превью'
                    }, {
                        pattern: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.\S{2,}|www\.[a-zA-Z0-9]+\.\S{2,})/gm,
                        message: 'Введите корректную ссылку'
                    }]}
                    initialValue={props.editNoteSeries?.image}
                >
                    <Input/>
                </Form.Item>


                {
                    editNoteSeriesImage?.length !== 0
                    && editNoteSeriesImage?.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.\S{2,}|www\.[a-zA-Z0-9]+\.\S{2,})/gm) ?
                        <Form.Item label="Превью баннера">
                            <div
                                style={
                                    {
                                        borderRadius: "8px",
                                        width: "300px",
                                        height: "180px",
                                        background: "url(" + editNoteSeriesImage + ") center center / cover no-repeat"
                                    }
                                }
                            />
                        </Form.Item> : <></>
                }

                {
                    props.editNoteSeries?.ownerID === user.id ?
                        <Form.Item
                            name="editNoteSeriesVisible"
                            valuePropName="checked"
                        >
                            <Checkbox >Серия статей видна всем пользователям</Checkbox>
                        </Form.Item> : <></>
                }

                <div className={s.editNoteSeriesOwnerContainer}>
                    {/*<Avatar*/}
                    {/*    src={"https://ren-design.ru/api/knowledge-base/1.0/files/avatars/" + editNoteSeriesUser?.avatar}*/}
                    {/*    size={24}/>*/}
                    <p
                        className={s.createNoteOwnerName}>{editNoteSeriesUser?.secondName + " " + editNoteSeriesUser?.firstName}</p>
                    <p>{editNoteCreateDateString}</p>
                </div>
            </Form>
        </Drawer>)
}
