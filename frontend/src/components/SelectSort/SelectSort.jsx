import {Button, Dropdown, Popover, Select, Space} from "antd";
import React from 'react'
import s from './SelectSort.module.css'
import {
    CloseOutlined,
    DeleteOutlined,
    DownOutlined,
    PlusOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
    SwapOutlined
} from "@ant-design/icons";

export default function SelectSort(props) {
    console.log(props)
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
                props.handlersSortList.append({
                    position: props.sortList.length,
                    label: "По приоритету",
                    value: "priority",
                    isAsc: true
                })
            }
        },
        {
            value: "status",
            label: "По статусу",
            onClick: () => {
                props.handlersSortList.append({
                    position: props.sortList.length,
                    label: "По статусу",
                    value: "status",
                    isAsc: true
                })
            }
        },
        {
            value: "deadlineDate",
            label: "По дате",
            onClick: () => {
                props.handlersSortList.append({
                    position: props.sortList.length,
                    label: "По дате",
                    value: "deadlineDate",
                    isAsc: true
                })
            }
        },
        {
            value: "categoryID",
            label: "По категории",
            onClick: () => {
                props.handlersSortList.append({
                    position: props.sortList.length,
                    label: "По категории",
                    value: "categoryID",
                    isAsc: true
                })
            }
        }
    ]

    let popoverContent = () => {
        return <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
            {
                props.sortList.map(sort => {
                    console.log(sort)
                    return (
                        <Space align={"center"} key={"sortList" + sort.value + sort.position}>
                            <Select options={sortsOptions}
                                    defaultValue={sort.value}
                                    style={{width: "140px"}}
                                    onChange={(e, o) => {
                                        props.handlersSortList.setItem(sort.position, {
                                            ...sort,
                                            value: e,
                                            label: o.label
                                        })
                                    }}
                            />
                            <Button icon={sort.isAsc ? <SortAscendingOutlined/> : <SortDescendingOutlined/>}
                                    onClick={() => {
                                        props.handlersSortList.setItem(sort.position, {...sort, isAsc: !sort.isAsc})
                                    }}/>
                            <Button icon={<CloseOutlined/>}
                                    type={"text"}
                                    size={"small"}
                                    onClick={() => {
                                        props.handlersSortList.remove(sort.position)
                                        props.handlersSortList.apply((item, index) => {
                                            if (index > sort.position - 1)
                                                return {...item, position: item.position - 1}
                                            else return item
                                        })
                                    }}
                            />
                        </Space>
                    )
                })
            }
            {
                sortsAddOptions.filter(sort => !props.sortList.map(s => s.value).includes(sort.value)).length > 0 ?
                    <Dropdown
                        menu={{items: sortsAddOptions.filter(sort => !props.sortList.map(s => s.value).includes(sort.value))}}
                        placement="bottomLeft"
                        trigger={['click']}>
                        <Button type={"text"} size={"small"}>
                            <PlusOutlined/>
                            Добавить сортировку
                        </Button></Dropdown> : <></>
            }

            {
                props.sortList.length > 0 ?
                    <Button type={"text"} size={"small"} onClick={() => props.handlersSortList.setState([])}>
                        <DeleteOutlined/>
                        Удалить сортировку
                    </Button> : <></>
            }


        </div>
    }


    if (props.sortList.length === 0)
        return (<Popover trigger="click" content={popoverContent} placement={"bottom"} arrow={false}>
                <div className={s.tagContainer}>
                    <Button size={"small"}>
                        <SwapOutlined rotate={90}/>
                        Добавьте сортировку
                        <DownOutlined size={6}/>
                    </Button>

                </div>
            </Popover>

        )

    if (props.sortList.length === 1)
        return (<Popover trigger="click" content={popoverContent} placement={"bottom"} arrow={false}>
                <div className={s.tagContainer}>
                    <Button size={"small"}>
                        {
                            props.sortList[0].isAsc ? <SortAscendingOutlined/> : <SortDescendingOutlined/>
                        }
                        {props.sortList[0].label}
                        <DownOutlined size={6}/>
                    </Button>

                </div>
            </Popover>

        )

    if (props.sortList.length > 1)
        return (<Popover trigger="click" content={popoverContent} placement={"bottom"} arrow={false}>
                <div className={s.tagContainer}>
                    <Button size={"small"}>
                        <SwapOutlined rotate={90}/>
                        {props.sortList.length + " сортировки"}
                        <DownOutlined size={6}/>
                    </Button>

                </div>
            </Popover>

        )
}
