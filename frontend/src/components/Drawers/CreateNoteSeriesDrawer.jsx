import {App, Button, Col, Drawer, Form, Input, Row, Select, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useAuth} from "../../hooks/use-auth";
import {createNoteSeries} from "../../store/slices/noteSlice";

export default function CreateNoteSeriesDrawer (props) {
    const {message} = App.useApp();
    const dispatch = useDispatch()
    const user = useAuth()

    const [createNoteSeriesForm] = Form.useForm();
    const [createNoteSeriesSubmittable, setCreateNoteSeriesSubmittable] = React.useState(false);
    const createNoteSeriesValues = Form.useWatch([], createNoteSeriesForm);
    const createNoteSeriesImage = Form.useWatch('createNoteSeriesImage', createNoteSeriesForm);
    const createNoteSeriesExportNoteInput = Form.useWatch('createNoteSeriesExportNote', createNoteSeriesForm);
    const [createNoteSeriesExportNotes, setCreateNoteSeriesExportNotes] = useState([]);
    const [exportNoteOptions, setExportNoteOptions] = useState([]);

    useEffect(() => {
        setExportNoteOptions(props.notes.notes.filter(note => note.type === "note").map(note => {
            return {value: note.id, label: note.title}
        }))
    }, [])

    useEffect(() => {
        setExportNoteOptions(props.notes.notes.filter(note => note.type === "note" && !createNoteSeriesExportNotes.includes(note.id)).map(note => {
            return {value: note.id, label: note.title}
        }))
    }, [createNoteSeriesExportNotes])


    useEffect(() => {
        createNoteSeriesForm.validateFields({validateOnly: true}).then(
            () => {
                setCreateNoteSeriesSubmittable(true);
            },
            () => {
                setCreateNoteSeriesSubmittable(false);
            },
        );
    }, [createNoteSeriesValues]);

    const closeCreateNoteSeries = () => {
        createNoteSeriesForm.resetFields();
        setCreateNoteSeriesExportNotes([])
        setExportNoteOptions([])
        props.setOpenCreateNoteSeries(false);
    };

    const handleCreateNoteSeries = (payload) => {
        message.open({
            key: 'createNoteSeries',
            type: 'loading',
            content: 'Создаю серию статей...'
        });

        dispatch(createNoteSeries({
            ownerID: user.id,
            seriesID: props.seriesID,
            seriesName: payload.createNoteSeriesName,
            seriesTags: JSON.stringify(payload.createNoteSeriesTags),
            seriesImage: payload.createNoteSeriesImage,
            seriesExportNotes: createNoteSeriesExportNotes.join(", ")
        })).then(p => {
            if (p.error) {
                message.open({
                    key: 'createNoteSeries',
                    type: 'error',
                    content: p.payload,
                    duration: 2,
                });
            } else {
                message.open({
                    key: 'createNoteSeries',
                    type: 'success',
                    content: 'Серия статей успешно создана!',
                    duration: 2,
                });
                closeCreateNoteSeries()
            }
        })
    }

    return (
        <Drawer
            title="Создание новой группы"
            width={500}
            onClose={closeCreateNoteSeries}
            open={props.openCreateNoteSeries}
            bodyStyle={{paddingBottom: 80}}
            extra={
                <Space>
                    {/*<Button onClick={closeCreateNote}>Отмена</Button>*/}
                    <Button disabled={!createNoteSeriesSubmittable} type="primary" onClick={() => {
                        createNoteSeriesForm
                            .validateFields()
                            .then((values) => {
                                handleCreateNoteSeries(values)
                                // form.resetFields();
                                // handleCreateNote(values)
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
            <Form layout="vertical" hideRequiredMark form={createNoteSeriesForm}>
                <Form.Item
                    name="createNoteSeriesName"
                    label="Название"
                    rules={[{required: true, message: 'Введите название группы'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="createNoteSeriesTags"
                    label="Теги"
                    // rules={[{ required: true, message: 'Please select an owner' }]}
                >
                    <Select
                        mode="tags"
                        style={{
                            width: '100%',
                        }}
                        options={[{value: "frontend", label: "Frontend"}, {
                            value: "backend",
                            label: "Backend"
                        }]}
                    />
                </Form.Item>
                <Form.Item
                    name="createNoteSeriesImage"
                    label="Ссылка на изображение"
                    rules={[{
                        required: true,
                        message: 'Введите ссылку на изображение превью'
                    }, {
                        pattern: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm,
                        message: 'Введите корректную ссылку'
                    }]}
                >
                    <Input/>
                </Form.Item>
                {
                    createNoteSeriesImage?.length !== 0 && createNoteSeriesImage?.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm) ?
                        <Form.Item
                            label="Превью баннера"
                        >
                            <div
                                style={
                                    {
                                        borderRadius: "8px",
                                        width: "300px",
                                        height: "180px",
                                        background: "url(" + createNoteSeriesImage + ") no-repeat center center",
                                        backgroundSize: "cover !important"
                                    }
                                }
                                alt="example"
                                // src="https://images.unsplash.com/photo-1689616977225-bf0ab4ae1ac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80"
                            />
                        </Form.Item> : <></>
                }
                <Form.Item
                    label="Экспортировать статьи"
                >
                    <Row gutter={10}>
                        <Col flex="auto">
                            <Form.Item name={"createNoteSeriesExportNote"}>
                                <Select style={{width: "100%"}}
                                        options={exportNoteOptions}
                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Button
                                disabled={!createNoteSeriesExportNoteInput}
                                type="dashed"
                                icon={<PlusOutlined/>}
                                onClick={() => {
                                    setCreateNoteSeriesExportNotes([...createNoteSeriesExportNotes, createNoteSeriesExportNoteInput])
                                    createNoteSeriesForm.setFieldsValue({createNoteSeriesExportNote: undefined});
                                }}
                            >
                                Добавить
                            </Button>
                        </Col>

                    </Row>
                    {
                        createNoteSeriesExportNotes.map(exportNote => {
                            const note = props.notes.notes.find(note => note.id === exportNote)
                            return <Row gutter={10}>
                                <Col flex="auto">
                                    <Input disabled={true} value={note.title}/>
                                </Col>
                                <Col>
                                    <MinusCircleOutlined
                                        onClick={() => setCreateNoteSeriesExportNotes(createNoteSeriesExportNotes.filter(exportNote => exportNote !== note.id))}
                                    />
                                </Col>
                            </Row>
                        })
                    }

                </Form.Item>
            </Form>
        </Drawer>
    )
}
