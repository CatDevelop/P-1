import {Badge} from "@mantine/core";
import React from "react";

export default function TaskPriorityBadge(props) {
    switch (props.id) {
        case 0:
            return <div style={{display: "flex", justifyContent: "center", alignItems: 'center'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 18V5" stroke="#BBBBBB" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M12 9V18" stroke="#BBBBBB" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M6 13V18" stroke="#BBBBBB" strokeWidth="3" strokeLinecap="round"/>
                </svg>

            </div>
        case 1:
            return <div style={{display: "flex", justifyContent: "center", alignItems: 'center'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 18V5" stroke="#BBBBBB" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M12 9V18" stroke="#BBBBBB" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M6 13V18" stroke="#1668DC" strokeWidth="3" strokeLinecap="round"/>
                </svg>

            </div>
        case 2:
            return <div style={{display: "flex", justifyContent: "center", alignItems: 'center'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 18V5" stroke="#BBBBBB" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M12 9V18" stroke="#1668DC" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M6 13V18" stroke="#1668DC" strokeWidth="3" strokeLinecap="round"/>
                </svg>
            </div>
        case 3:
            return <div style={{display: "flex", justifyContent: "center", alignItems: 'center'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 18V5" stroke="#1668DC" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M12 9V18" stroke="#1668DC" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M6 13V18" stroke="#1668DC" strokeWidth="3" strokeLinecap="round"/>
                </svg>

            </div>
        case 4:
            return <div style={{display: "flex", justifyContent: "center", alignItems: 'center'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 18V5" stroke="#E03131" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M12 9V18" stroke="#E03131" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M6 13V18" stroke="#E03131" strokeWidth="3" strokeLinecap="round"/>
                </svg>
            </div>
    }
    return;
}
