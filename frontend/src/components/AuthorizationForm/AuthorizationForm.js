import React, {useState} from 'react';
import s from './AuthorizationForm.module.css';
import {signInUser} from '../../store/slices/userSlice';
import {useDispatch} from "react-redux";
import md5 from 'md5';
import {App, Button, Form, Input} from 'antd';

function AuthorizationForm(props) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const { message } = App.useApp();

    const onSubmit = (payload) => {
        if(!isLoading) {
            setIsLoading(true);
            message.loading({content: "Вхожу в аккаунт...", key: 'signIn'})
            payload.password = md5(payload.password);
            const data = {
                login: payload.login,
                password: payload.password
            }
            dispatch(signInUser(data)).then((response) => {
                setIsLoading(false)
                if(response.payload !== '400') {
                    message.destroy('signIn')
                    message.success({content: "Вы успешно авторизовались"})
                } else {
                    message.destroy('signIn')
                    message.error({content: "Неправильный логин или пароль"})
                }
            });

        }
    }

    return (
        <div className={s.authorizationForm}>
            <p className={s.header}>Добро пожаловать в базу знаний команды ПИН-КОД</p>
            <Form
                name="authorization"
                // labelCol={{span: 8,}}
                // wrapperCol={{span: 16,}}
                style={{width: 300}}
                onFinish={onSubmit}
                autoComplete="off"
                layout={'vertical'}
            >
                <Form.Item
                    label="Логин"
                    name="login"
                    rules={[
                        {
                            required: true,
                            message: 'Поле обязательно для ввода!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Поле обязательно для ввода!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    // wrapperCol={{
                    //     offset: 8,
                    //     span: 16,
                    // }}
                    style={{ display:'flex', justifyContent: 'center'}}
                >
                    <Button type="primary" htmlType="submit">
                        Авторизоваться
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AuthorizationForm;
