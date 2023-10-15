import s from "./Authorization.module.css";
import React, {useEffect} from "react";
import {Container, createStyles, rem,} from '@mantine/core';
import image from '../../assets/images/image.svg';
import {removeSchemes} from "../../store/slices/schemesSlice";
import {useDispatch} from "react-redux";
import {removeTasks} from "../../store/slices/tasksSlice";
import AuthorizationForm from "../../components/AuthorizationForm/AuthorizationForm";
import {Link, useLocation, useParams} from "react-router-dom";

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
    const search = useLocation().search;
    const code = new URLSearchParams(search).get('code');
    console.log(code)

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
                            <Link to="https://oauth.vk.com/authorize?client_id=51771611&display=popup&redirect_uri=https://pi-1.ru/login&scope=friends&response_type=code&v=5.154" target="_blank" rel="noopener noreferrer">
                                <button>
                                    ВК
                                </button>
                            </Link>
                        </div>
                        <img style={{flex: "1", width: "500px"}} src={image} alt={""}/>
                    </div>
                </Container>
            </div>
        </div>
    )
}
