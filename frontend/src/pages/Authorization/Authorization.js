import s from "./Authorization.module.css";
import React, {useEffect} from "react";
import {Container, createStyles, rem,} from '@mantine/core';
import image from '../../assets/images/image.svg';
import {removeSchemes} from "../../store/slices/schemesSlice";
import {useDispatch} from "react-redux";
import {removeTasks} from "../../store/slices/tasksSlice";
import AuthorizationForm from "../../components/AuthorizationForm/AuthorizationForm";
import VkAuth from 'react-vk-auth';

const useStyles = createStyles((theme) => ({
    content: {
        maxWidth: rem(480),
        marginRight: `calc(${theme.spacing.xl} * 3)`,

        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
            marginRight: 0,
        },
    },
}));

export const AuthorizationPage = () => {
    const {classes} = useStyles();
    const dispatch = useDispatch()

    const handleVkResponse = (data) => {
        console.warn(data)
    }

    useEffect(() => {
        dispatch(removeSchemes())
        dispatch(removeTasks())
    }, [])

    return (
        <div>
            <div className={s.mainContainer}>
                <Container>
                    <div className={s.inner}>
                        <div className={classes.content}>
                            <AuthorizationForm/>
                            <button onClick={()=> {
                                VK.Auth.login((r) => {
                                    if (r.session) {
                                        let username = r.session.user.first_name;
                                        console.log("LOGIN_SUCCESS", username)
                                    } else {
                                        console.log("LOGIN_FAIL", username)
                                    }
                                }, 4);
                            }}>
                                test
                            </button>
                            {/*<VkAuth apiId="51771611" callback={handleVkResponse} />*/}
                        </div>
                        <img style={{flex: "1", width: "500px"}} src={image} alt={""}/>
                    </div>
                </Container>
            </div>
        </div>
    )
}
