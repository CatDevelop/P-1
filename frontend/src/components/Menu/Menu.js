import React, {useState} from 'react';
import s from './Menu.module.css';
import {Badge, Menu, Popover} from "antd";
import {
    ApartmentOutlined,
    AppstoreOutlined,
    BellOutlined,
    BugOutlined,
    CalendarOutlined,
    FolderOpenOutlined,
    HomeOutlined, LayoutOutlined,
    MessageOutlined,
    SettingOutlined,
    UserOutlined
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";


function FirstMenu(props) {
    const navigate = useNavigate();
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }

    const topMenu = [
        getItem('Основная', 'Home', <HomeOutlined/>),
        getItem('Мессенджер', 'Messenger',
            <Badge dot={true}
                   size="small"
                   offset={[10, 10]}>
                <MessageOutlined/>
            </Badge>),
        getItem('Календарь', 'Schedule', <CalendarOutlined/>),

        {
            type: 'divider',
        },

        getItem('Задачи', 'Tasks', <AppstoreOutlined/>),
        getItem('Баги', 'Bugs', <BugOutlined/>),
        getItem('Спринты', 'Sprints', <LayoutOutlined />),

        {
            type: 'divider',
        },

        getItem('Статьи', 'Notes', <FolderOpenOutlined/>),
        getItem('Схемы', 'Schemes', <ApartmentOutlined/>),
    ];

    const bottomMenu = [
        // getItem('Профиль', 'Profile', <UserOutlined/>),
        getItem('Уведомления',
            'Notification',
            <BellOutlined/>),
        getItem('Настройки', 'Settings', <SettingOutlined/>),

    ];

    const onClick = (item) => {
        switch (item.key) {
            case 'Home':
                navigate('/')
                break
            case 'Messenger':
                navigate('/messenger')
                break
            case 'Schedule':
                navigate('/schedule')
                break

            case 'Tasks':
                navigate('/tasks')
                break
            case 'Bugs':
                navigate('/bugs')
                break
            case 'Sprints':
                navigate('/sprints')
                break

            case 'Notes':
                navigate('/notes/0')
                break
            case 'Schemes':
                navigate('/schemes')
                break

            case 'Notification':
                setNotificationsOpen(!notificationsOpen)
                break
            case 'Settings':
                navigate('/settings')
                break
            default:
                navigate('/')
                break
        }
    }


    return (
        <div className={s.menu}>
            <Menu
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="dark"
                inlineCollapsed={true}
                style={{backgroundColor: "#202023", width: "60px"}}
                items={topMenu}
                selectedKeys={props.selectedKeys ?? []}
                onClick={onClick}
            />

            <Menu
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="dark"
                inlineCollapsed={true}
                style={{backgroundColor: "#202023", width: "60px"}}
                items={bottomMenu}
                selectedKeys={props.selectedKeys ?? []}
                onClick={onClick}
            />
        </div>
    )
}

export default FirstMenu;
