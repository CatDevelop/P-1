import {Badge} from "@mantine/core";
import React from "react";

export default function TaskCategoryBadge(props) {
    const categories = [
        {label: 'Frontend', color: "teal"},
        {label: 'Backend', color: "violet"},
        {label: 'Mobile', color: "yellow"},
        {label: 'Дизайн', color: "grape"},
        {label: 'Аналитика', color: "gray"}
    ]
    if(props.id === 0)
        return;

    return (
        <Badge color={categories[props.id-1].color}
               style={{width: "90px"}}
               variant={"outline"}
               radius={"sm"}
               size="sm">
            {
                categories[props.id-1].label
            }
        </Badge>
    )
}
