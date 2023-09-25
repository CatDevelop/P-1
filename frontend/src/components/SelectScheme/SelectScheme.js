import React, {useEffect} from 'react';
import s from './SelectScheme.module.css'
import {Checkbox, ConfigProvider, Form, Input, Select, Spin, theme} from 'antd';
import {getSchemes} from "../../store/slices/schemesSlice";
import {Provider, useDispatch} from "react-redux";
import {useSchemes} from "../../hooks/use-schemes";
import store from "../../store";

function SelectScheme(props) {
    const dispatch = useDispatch()
    const schemes = useSchemes();
    console.log(props.initialValues)
    useEffect(() => {
        dispatch(getSchemes())
    }, [])
    if(schemes.isLoading)
        return <Spin/>

    const options = schemes.schemes.map(scheme => {
        return {label: scheme.title, value: scheme.id}
    })

    return (
        <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
        <div className={s.container}>
            <p className={s.title}>Схема из Базы данных ПИН-КОД</p>
            <Form layout="horizontal" hideRequiredMark>

                <Form.Item
                    name="selectScheme"
                    label="Схема"
                    initialValue={props.initialValues?.schemeID}
                    style={{marginBottom: "12px"}}
                    // initialValue={editNote ? JSON.parse(editNote.tags).map(tag => ({value: tag, label: tag})) : []}
                    // rules={[{ required: true, message: 'Please select an owner' }]}
                >
                    <Select
                        // mode="tags"
                        style={{
                            width: '100%',
                        }}
                        options={options}
                        showSearch
                        onChange={value => props.onDataChange({schemeID: value})}
                    />
                </Form.Item>
                <Form.Item
                    name="selectSchemeDescription"
                    label="Описание схемы"
                    initialValue={props.initialValues?.description}
                    style={{marginBottom: "12px"}}
                    // rules={[{required: true, message: 'Введите название статьи'}]}
                    // initialValue={editNote?.title}
                >
                    <Input onChange={e => props.onDataChange({description: e.target.value})}/>
                </Form.Item>
                {/*<Form.Item*/}
                {/*    name="selectSchemeStatic"*/}
                {/*    style={{marginBottom: "12px"}}*/}
                {/*    // label="Описание схемы"*/}
                {/*    // rules={[{required: true, message: 'Введите название статьи'}]}*/}
                {/*    // initialValue={editNote?.title}*/}
                {/*>*/}
                {/*    <Checkbox defaultChecked={props.initialValues?.isStatic} onChange={e => props.onDataChange({isStatic: e.target.checked})}>Статическое отображение</Checkbox>*/}
                {/*</Form.Item>*/}
            </Form>
        </div>
        </ConfigProvider>
    )
}

export default SelectScheme;
