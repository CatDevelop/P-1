import {Badge} from "@mantine/core";
import React from "react";
import {categories as taskCategories} from "../../../core/models/taskEntities";

export default function TaskCategoryBadge(props) {
    // if (props.id === 0)
    //     return;

    return (
        <Badge color={taskCategories[props.id].textColor}
               style={{width: "115px"}}
               variant={"outline"}
               radius={"sm"}
               size="sm"
        >
            {
                taskCategories[props.id].name
            }
        </Badge>
    )
}
