import React, {useState} from 'react';
import s from './AuthorizationForm.module.css';
import {signInUser} from '../../store/slices/userSlice';
import {useDispatch} from "react-redux";
import md5 from 'md5';
import {App, Button, Form, Input} from 'antd';
import VkAuthButton from "../VkAuthButton/VkAuthButton";

function AuthorizationForm(props) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const {message} = App.useApp();

    // if(props.code)
    //     console.log("Получить access", code)

    const onSubmit = (payload) => {
        if (!isLoading) {
            setIsLoading(true);
            message.loading({content: "Вхожу в аккаунт...", key: 'signIn'})

            payload.password = md5(payload.password);
            const data = {
                login: payload.login,
                password: payload.password
            }

            dispatch(signInUser(data)).then((response) => {
                setIsLoading(false)
                message.destroy('signIn')
                message.success({content: "Вы успешно авторизовались"})
            }, () => {
                setIsLoading(false)
                message.destroy('signIn')
                message.error({content: "Неправильный логин или пароль"})
            });
        }
    }

    return (
        <div>
            <p className={s.authorizationForm__header}>Добро пожаловать в базу знаний команды ПИН-КОД</p>
            <div className={s.authorizationForm__formContainer}>
                {/*{*/}
                {/*    !props.code ?*/}
                {/*    <VkAuthButton/> :*/}
                {/*        <div>*/}
                {/*            Вхожу в аккаунт*/}
                {/*        </div>*/}
                {/*}*/}

                <Form name="authorization"
                      style={{width: 300}}
                      onFinish={onSubmit}
                      autoComplete="off"
                      layout={'vertical'}
                >
                    <Form.Item label="Логин"
                               name="login"
                               rules={[
                                   {required: true, message: 'Поле обязательно для ввода!'},
                               ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item label="Пароль"
                               name="password"
                               rules={[
                                   {required: true, message: 'Поле обязательно для ввода!',},
                               ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item style={{display: 'flex', justifyContent: 'center'}}>
                        <Button type="primary" htmlType="submit">
                            Авторизоваться
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default AuthorizationForm;
