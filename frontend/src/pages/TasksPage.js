import s from "./Pages.module.css";
import FirstMenu from "../components/Menu/Menu";
import React, {useEffect, useState} from "react";
import {Breadcrumb, Button, Col, Dropdown, Row, Segmented, Select, Space, Spin} from "antd";
import {useDispatch} from "react-redux";
import {getUsers} from "../store/slices/usersSlice";
import {getTasks} from "../store/slices/tasksSlice";
import {useUsers} from "../hooks/use-users";
import TaskList from "../components/TasksList/TaskList";
import {useListState} from '@mantine/hooks';
import {PlusOutlined} from "@ant-design/icons";
import _ from 'lodash'
import {
    TaskCompletedStatusIcon,
    TaskInWorkStatusIcon,
    TaskPlannedStatusIcon,
    TaskWaitingStatusIcon
} from "../components/Icons/Icons";
import SelectSort from "../components/SelectSort/SelectSort";
import TaskDrawer from "../components/Drawers/TaskDrawer";
import {useTasks} from "../hooks/use-tasks";
import {removeSchemes} from "../store/slices/schemesSlice";
import {removeNotes} from "../store/slices/notesSlice";
import {removeNote} from "../store/slices/noteSlice";
import TasksBoard from "../components/TasksBoard/TasksBoard";

const {Option} = Select;
export const TasksPage = () => {
    const dispatch = useDispatch()
    const users = useUsers()

    const [openTaskDrawer, setOpenTaskDrawer] = useState(false);
    const [editTask, setEditTask] = useState(null)
    const [viewMode, setViewMode] = useState("board")

    const [openFiltersPanel, setOpenFiltersPanel] = useState(false)

    let initialSorts = JSON.parse(localStorage.getItem('P1-TaskSorts')) || [];
    let initialFilters = JSON.parse(localStorage.getItem('P1-TaskFilters'))  || [];
    const [filters, setFilters] = useState(initialFilters)
    const [sortList, handlersSortList] = useListState(initialSorts);

    useEffect(() => {
        localStorage.setItem('P1-TaskFilters', JSON.stringify(filters))
    }, [filters])

    useEffect(() => {
        localStorage.setItem('P1-TaskSorts', JSON.stringify(sortList))
    }, [sortList])

    const sortsOptions = [
        {value: "priority", label: "По приоритету"},
        {value: "status", label: "По статусу"},
        {value: "deadlineDate", label: "По дате"},
        {value: "categoryID", label: "По категории"}
    ]

    const sortsAddOptions = [
        {
            value: "priority",
            label: "По приоритету",
            onClick: () => {
                handlersSortList.append({
                    position: sortList.length,
                    label: "По приоритету",
                    value: "priority",
                    isAsc: true
                })
                setOpenFiltersPanel(true)
            }
        },
        {
            value: "status",
            label: "По статусу",
            onClick: () => {
                handlersSortList.append({
                    position: sortList.length,
                    label: "По статусу",
                    value: "status",
                    isAsc: true
                })
                setOpenFiltersPanel(true)
            }
        },
        {
            value: "deadlineDate",
            label: "По дате",
            onClick: () => {
                handlersSortList.append({
                    position: sortList.length,
                    label: "По дате",
                    value: "deadlineDate",
                    isAsc: true
                })
                setOpenFiltersPanel(true)
            }
        },
        {
            value: "categoryID",
            label: "По категории",
            onClick: () => {
                handlersSortList.append({
                    position: sortList.length,
                    label: "По категории",
                    value: "categoryID",
                    isAsc: true
                })
                setOpenFiltersPanel(true)
            }
        }
    ]

    const filtersOptions = [
        {
            key: "responsibleFilter",
            label: "Ответственные",
            value: "responsible",
            onClick: () => {
                setFilters([...filters, {type: "responsible", values: []}])
            }
        },
        {
            key: "statusFilter",
            label: "Статусы",
            value: "status",
            onClick: () => {
                setFilters([...filters, {type: "status", values: []}])
            }
        },
        {
            key: "priorityFilter",
            label: "Приоритет",
            value: "priority",
            onClick: () => {
                setFilters([...filters, {type: "priority", values: []}])
            }
        }
    ]


    useEffect(() => {
        dispatch(getUsers())
        dispatch(getTasks())
        dispatch(removeSchemes())
        dispatch(removeNotes())
        dispatch(removeNote())
    }, [])

    const tasks = useTasks()

    const sortTasks = (tasks, sorts) => {
        let sortsName = sorts.map(sort => sort.value)
        let sortsOrders = sorts.map(sort => sort.isAsc ? "asc" : "desc")
        let sortedTasks = [...tasks]
        sortedTasks = _.orderBy(sortedTasks, sortsName, sortsOrders)
        return sortedTasks
    }

    const filterTasks = (tasks, filters) => {
        console.log(tasks, filters)
        let filteredTasks = [...tasks]
        filters.map(filter => {
            if (filter.values.length > 0)
                if (filter.type === "responsible")
                    filteredTasks = filteredTasks.filter(task => task.responsible.some(resp => filter.values.includes(resp)))
                else
                    filteredTasks = filteredTasks.filter(task => filter.values.includes(task[filter.type]))
        })
        console.log(filteredTasks)
        return filteredTasks
    }

    let filteredAndSortedTasks = filterTasks(sortTasks([...tasks.tasks], sortList), filters);
    let filteredTasks = filterTasks([...tasks.tasks], filters);

    console.log(filters)
    return (
        <div>
            <div className={s.mainContainer}>
                <FirstMenu selectedKeys={["Tasks"]}/>
                <Breadcrumb separator=">"
                            items={[{
                                title: "Задачи"
                            }]}
                />
                {
                    !users.isLoading && !tasks.isLoading ?
                        <>
                            <div style={{display: 'flex', flexDirection: "column", alignItems: 'center'}}>
                                <div className={s.tasksPageHeaderPanel}>


                                    <Row gutter={5} align={"middle"}>
                                        <Col flex={"auto"}>
                                            <Segmented options={[
                                                {value: "board", label: "Доска"},
                                                {value: "list", label: "Список"},
                                            ]}
                                                       onChange={setViewMode}
                                            />
                                        </Col>

                                        <Col>
                                            <Button size="small"
                                                    type={"text"}
                                                    style={{color: filters.length ? "#4096ff" : ""}}
                                                    onClick={() => setOpenFiltersPanel(!openFiltersPanel)}
                                            >Фильтры
                                            </Button>
                                        </Col>

                                        <Col>
                                            {
                                                sortList.length !== 0 ?
                                                    <Button size="small"
                                                            type={"text"}
                                                            style={{color: sortList.length ? "#4096ff" : ""}}
                                                            onClick={() => setOpenFiltersPanel(!openFiltersPanel)}
                                                    >
                                                        Сортировка
                                                    </Button> :
                                                    <Dropdown menu={{items: sortsAddOptions}} placement="bottomLeft"
                                                              trigger={['click']}>
                                                        <Button size="small"
                                                                type={"text"}
                                                        >
                                                            Сортировка
                                                        </Button>
                                                    </Dropdown>
                                            }

                                        </Col>
                                        <Col>
                                            <Button type={"primary"}>Создать</Button>
                                        </Col>
                                        {/*<Col>*/}

                                        {/*</Col>*/}
                                        {/*<Col>*/}
                                        {/*    <Input.Group compact>*/}
                                        {/*        <Button icon={sortDirectionIsAsc ? <SortAscendingOutlined/> : <SortDescendingOutlined/>} onClick={() => setSortDirectionIsAsc(!sortDirectionIsAsc)}/>*/}
                                        {/*        <Select defaultValue={"priority"}*/}
                                        {/*                style={{width: "180px"}}*/}
                                        {/*                options={sortsOptions}*/}
                                        {/*                value={sortValue}*/}
                                        {/*                onSelect={(e) => setSortValue(e)}*/}
                                        {/*        />*/}
                                        {/*    </Input.Group>*/}
                                        {/*</Col>*/}
                                    </Row>


                                    {
                                        openFiltersPanel ?
                                            <Row style={{borderTop: "1px solid #313134", padding: "10px 0"}}
                                                 wrap={false} gutter={10} align={"middle"}>
                                                <Col flex={"auto"}>
                                                    <Row style={{overflowX: "auto"}}
                                                         wrap={false}>
                                                        <Col>
                                                            <div style={{
                                                                padding: "0 10px 0 0",
                                                                borderRight: "1px solid #313134"
                                                            }}>
                                                                <SelectSort sortList={sortList}
                                                                            handlersSortList={handlersSortList}/>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Space align={"center"}
                                                                   style={{
                                                                       // background: "#000000",
                                                                       padding: "0 6px",
                                                                       // borderRadius: "6px",
                                                                       minHeight: "32px",
                                                                       marginLeft: "10px",
                                                                       background: "linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, radial-gradient(50% 0, farthest-side, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(50% 100%, farthest-side, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;"
                                                                   }}>

                                                                {/*<FilterOutlined/>*/}
                                                                {
                                                                    filters.map((filter, i) => {
                                                                        if (filter.type === "responsible")
                                                                            return (
                                                                                <Space>
                                                                                    Ответственные:
                                                                                    <Select bordered={false}
                                                                                            mode={"multiple"}
                                                                                            defaultOpen={true}
                                                                                            maxTagCount={2}
                                                                                            style={{
                                                                                                minWidth: "240px",
                                                                                                maxWidth: "500px",
                                                                                                width: "100%",
                                                                                                flexWrap: "nowrap"
                                                                                            }}
                                                                                            placeholder={"Выберите исполнителей"}
                                                                                            options={[
                                                                                                {
                                                                                                    value: 0,
                                                                                                    label: 'Не назначен'
                                                                                                },
                                                                                                {
                                                                                                    value: '1',
                                                                                                    label: 'Рожков Максим'
                                                                                                },
                                                                                                {
                                                                                                    value: '2',
                                                                                                    label: 'Крашенниникова Любовь'
                                                                                                },
                                                                                            ]}
                                                                                            value={filters[i].values}
                                                                                            onSelect={(e) => {
                                                                                                if (e === 0)
                                                                                                    setFilters(filters.with(i, {
                                                                                                        type: "responsible",
                                                                                                        values: [0]
                                                                                                    }))
                                                                                                else
                                                                                                    setFilters(filters.with(i, {
                                                                                                        type: "responsible",
                                                                                                        values: [...filters[i].values.filter(v => v !== 0), e]
                                                                                                    }))
                                                                                            }}
                                                                                            onChange={(e) => setFilters(filters.with(i, {
                                                                                                ...filters[i],
                                                                                                values: e
                                                                                            }))}
                                                                                    />
                                                                                </Space>
                                                                            )
                                                                        if (filter.type === "status")
                                                                            return (
                                                                                <Space>
                                                                                    Статус:
                                                                                    <Select bordered={false}
                                                                                            mode={"multiple"}
                                                                                            defaultOpen={true}
                                                                                            maxTagCount={2}
                                                                                            style={{
                                                                                                minWidth: "240px",
                                                                                                maxWidth: "500px",
                                                                                                width: "100%",
                                                                                                flexWrap: "nowrap"
                                                                                            }}
                                                                                            placeholder={"Выберите статус"}
                                                                                            options={[
                                                                                                {
                                                                                                    value: 0,
                                                                                                    label: <div style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        gap: "5px"
                                                                                                    }}>
                                                                                                        <TaskPlannedStatusIcon
                                                                                                            size={"small"}/>
                                                                                                        Запланировано
                                                                                                    </div>
                                                                                                },
                                                                                                {
                                                                                                    value: 1,
                                                                                                    label: <div style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        gap: "5px"
                                                                                                    }}>
                                                                                                        <TaskInWorkStatusIcon
                                                                                                            size={"small"}/>
                                                                                                        В работе
                                                                                                    </div>
                                                                                                },
                                                                                                {
                                                                                                    value: 2,
                                                                                                    label: <div style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        gap: "5px"
                                                                                                    }}>
                                                                                                        <TaskWaitingStatusIcon
                                                                                                            size={"small"}/>
                                                                                                        Ожидание
                                                                                                    </div>
                                                                                                },
                                                                                                {
                                                                                                    value: 3,
                                                                                                    label: <div style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        gap: "5px"
                                                                                                    }}>
                                                                                                        <TaskCompletedStatusIcon
                                                                                                            size={"small"}/>
                                                                                                        Выполнено
                                                                                                    </div>
                                                                                                },
                                                                                            ]}
                                                                                            onChange={(e) => setFilters(filters.with(i, {
                                                                                                ...filters[i],
                                                                                                values: e
                                                                                            }))}
                                                                                    />
                                                                                </Space>
                                                                            )

                                                                        if (filter.type === "priority")
                                                                            return (
                                                                                <Space>
                                                                                    Приоритет:
                                                                                    <Select bordered={false}
                                                                                            mode={"multiple"}
                                                                                            defaultOpen={true}
                                                                                            maxTagCount={2}
                                                                                            style={{
                                                                                                minWidth: "240px",
                                                                                                maxWidth: "500px",
                                                                                                width: "100%",
                                                                                                flexWrap: "nowrap"
                                                                                            }}
                                                                                            placeholder={"Выберите приоритет"}
                                                                                            options={[
                                                                                                {
                                                                                                    value: 0,
                                                                                                    label: <div style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        gap: "5px"
                                                                                                    }}>
                                                                                                        Незначительный
                                                                                                    </div>
                                                                                                },
                                                                                                {
                                                                                                    value: 1,
                                                                                                    label: <div style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        gap: "5px"
                                                                                                    }}>
                                                                                                        Низкий
                                                                                                    </div>
                                                                                                },
                                                                                                {
                                                                                                    value: 2,
                                                                                                    label: <div style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        gap: "5px"
                                                                                                    }}>
                                                                                                        Средний
                                                                                                    </div>
                                                                                                },
                                                                                                {
                                                                                                    value: 3,
                                                                                                    label: <div style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        gap: "5px"
                                                                                                    }}>
                                                                                                        Критичный
                                                                                                    </div>
                                                                                                },
                                                                                                {
                                                                                                    value: 4,
                                                                                                    label: <div style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        gap: "5px"
                                                                                                    }}>
                                                                                                        Блокер
                                                                                                    </div>
                                                                                                },
                                                                                            ]}
                                                                                            onChange={(e) => setFilters(filters.with(i, {
                                                                                                ...filters[i],
                                                                                                values: e
                                                                                            }))}
                                                                                    />
                                                                                </Space>
                                                                            )
                                                                    })
                                                                }
                                                                <Dropdown menu={{items: filtersOptions}}
                                                                          size={"small"}
                                                                          trigger={["click"]}
                                                                >
                                                                    <Button type={"text"} size={"small"}>
                                                                        <PlusOutlined/>
                                                                        Добавить фильтр
                                                                    </Button>
                                                                </Dropdown>
                                                            </Space>
                                                        </Col>


                                                    </Row>
                                                </Col>
                                                <Col>
                                                    <Button type={"text"} size={"small"} onClick={() => {
                                                        setFilters([])
                                                        handlersSortList.setState([])
                                                    }}>Сбросить</Button>
                                                </Col>
                                                <Col>
                                                    <Button>Сохранить для всех</Button>
                                                </Col>
                                            </Row>
                                            : <></>
                                    }
                                </div>
                            </div>

                            {
                                viewMode === "list" ?
                                    <TaskList tasks={filteredAndSortedTasks}
                                              users={users}
                                              setEditTask={setEditTask}
                                              setOpenTaskDrawer={setOpenTaskDrawer}
                                    /> :
                                    <TasksBoard tasks={filteredAndSortedTasks}
                                                users={users}
                                                setEditTask={setEditTask}
                                                setOpenTaskDrawer={setOpenTaskDrawer}
                                    />
                            }


                        </> : <Spin/>
                }

            </div>

            {
                editTask ? <TaskDrawer openTaskDrawer={openTaskDrawer}
                                       setOpenTaskDrawer={setOpenTaskDrawer}
                                       editTask={editTask}
                                       setEditTask={setEditTask}
                /> : <></>
            }


        </div>
    )
}
