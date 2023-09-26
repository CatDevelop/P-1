import s from "./Pages.module.css";
import FirstMenu from "../components/Menu/Menu";
import React, {useEffect} from "react";
import {Container, createStyles, List, rem, Text, ThemeIcon, Title,} from '@mantine/core';
import {CheckOutlined} from "@ant-design/icons";
import image from '../assets/images/image.svg';
import {removeSchemes} from "../store/slices/schemesSlice";
import {useDispatch} from "react-redux";
import {removeTasks} from "../store/slices/tasksSlice";

const useStyles = createStyles((theme) => ({
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
        height: `90vh`,
        // paddingTop: `calc(${theme.spacing.xl} * 3)`,
        // paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    },

    content: {
        maxWidth: rem(480),
        marginRight: `calc(${theme.spacing.xl} * 3)`,


        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
            marginRight: 0,
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: rem(44),
        lineHeight: 1.2,
        fontWeight: 900,

        [theme.fn.smallerThan('xs')]: {
            fontSize: rem(28),
        },
    },

    control: {
        [theme.fn.smallerThan('xs')]: {
            flex: 1,
        },
    },

    image: {
        flex: 1,

        // [theme.fn.smallerThan('md')]: {
        //     display: 'none',
        // },
    },

    highlight: {
        position: 'relative',
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
        borderRadius: theme.radius.sm,
        padding: `${rem(4)} ${rem(12)}`,
    },
}));

export const HomePage = () => {
    const { classes } = useStyles();
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(removeSchemes())
        dispatch(removeTasks())
    }, [])
    return (
        <div>
            <div className={s.mainContainer}>
                <FirstMenu selectedKeys={["Home"]}/>
                <Container>
                    <div className={classes.inner}>
                        <div className={classes.content}>
                            <Title className={classes.title}>
                                Система управления проектами <span className={classes.highlight}>π-1</span>
                            </Title>
                            <Text color="dimmed" mt="md">
                                Эффективное управление проектом для твоей команды. Все инструменты - теперь в одном приложении
                            </Text>

                            <List
                                mt={30}
                                spacing="sm"
                                size="sm"
                                icon={
                                    <ThemeIcon size={20} radius="xl">
                                        <CheckOutlined />
                                        {/*<IconCheck size={rem(12)} stroke={1.5} />*/}
                                    </ThemeIcon>
                                }
                            >
                                <List.Item>
                                    <b>Постановка задач</b> – менеджмент задач всех членов команды с разным представлением: таблица, канбан, гант
                                </List.Item>
                                <List.Item>
                                    <b>Менеджер багов</b> – сообщайте о багах, отслеживайте их и расставляйте приоритеты
                                </List.Item>
                                <List.Item>
                                    <b>Блочный редактор статей</b> – своя база знаний с обширным набором блочных модулей
                                </List.Item>
                                <List.Item>
                                    <b>Построитель схем</b> – создавай схемы разной сложности и встраивай их в статьи
                                </List.Item>
                            </List>

                            {/*<Group mt={30}>*/}
                            {/*    <Button radius="xl" size="md" className={classes.control}>*/}
                            {/*        Get started*/}
                            {/*    </Button>*/}
                            {/*    <Button variant="default" radius="xl" size="md" className={classes.control}>*/}
                            {/*        Source code*/}
                            {/*    </Button>*/}
                            {/*</Group>*/}
                        </div>
                        <img style={{flex: "1", width:"500px"}} src={image} alt={""}/>
                    </div>
                </Container>
            </div>
        </div>
    )
}
