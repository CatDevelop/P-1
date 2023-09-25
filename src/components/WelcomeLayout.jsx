import React, {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import WidthContent from "./WidthContent/WidthContent";
import {SpotlightProvider} from "@mantine/spotlight";
import {FileAddOutlined, FileOutlined, SearchOutlined} from "@ant-design/icons";
import {MantineProvider} from '@mantine/core';
import {getNotes} from "../store/slices/notesSlice";
import {getUsers} from "../store/slices/usersSlice";
import {removeNote} from "../store/slices/noteSlice";
import {useNotes} from "../hooks/use-notes";
import {useDispatch} from "react-redux";
import {Spin} from "antd";

const HomeLayout = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    let actions= [
        {
            title: 'Создать статью',
            description: 'Создать новую статью',
            onTrigger: () => navigate("/notes/0?createnote=1"),
            icon: <FileAddOutlined/>,
        },
        {
            title: 'Создать серию статей',
            description: 'Создать новую серию статей',
            onTrigger: () =>navigate("/notes/0?creategroup=1"),
            icon: <FileAddOutlined/>,
        }
    ];

    return (
        <div>
            <MantineProvider theme={{ colorScheme: 'dark' }}>
                <SpotlightProvider shortcut={['mod + F']}
                                   actions={actions}
                                   searchIcon={<SearchOutlined />}
                                   searchPlaceholder="Поиск..."
                                   nothingFoundMessage="Ничего не найдено..."
                                   limit={3}
                >
                    {/*<NavBar type="main"/>*/}
                    <WidthContent>
                        <Outlet/>
                    </WidthContent>
                    {/*<Footer/>*/}
                </SpotlightProvider>
            </MantineProvider>
        </div>
    );
};

export default HomeLayout;
