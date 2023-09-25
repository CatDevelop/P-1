import s from "./Authorization.module.css";
import React, {useEffect} from "react";
import {Container, createStyles, rem,} from '@mantine/core';
import image from '../../assets/images/image.svg';
import {removeSchemes} from "../../store/slices/schemesSlice";
import {useDispatch} from "react-redux";
import {removeTasks} from "../../store/slices/tasksSlice";
import AuthorizationForm from "../../components/AuthorizationForm/AuthorizationForm";

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
                        </div>
                        <img style={{flex: "1", width: "500px"}} src={image} alt={""}/>
                    </div>
                </Container>
            </div>
        </div>
    )
}