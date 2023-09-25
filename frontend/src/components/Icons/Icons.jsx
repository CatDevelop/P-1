import React from "react";
export const TaskPlannedStatusIcon = (props) => {
    if (props.size === "small")
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                        stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        )
    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )

}

export const TaskInWorkStatusIcon = (props) => {
    if (props.size === "small")
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.2933 9.30662L9.62892 7.53039C9.07512 7.16119 8.33333 7.55818 8.33333 8.22376V11.7762C8.33333 12.4418 9.07512 12.8388 9.62892 12.4696L12.2933 10.6934C12.788 10.3635 12.788 9.63648 12.2933 9.30662Z"
                        stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path
                        d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                        stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        )
    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.2933 9.30662L9.62892 7.53039C9.07512 7.16119 8.33333 7.55818 8.33333 8.22376V11.7762C8.33333 12.4418 9.07512 12.8388 9.62892 12.4696L12.2933 10.6934C12.788 10.3635 12.788 9.63648 12.2933 9.30662Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

export const TaskWaitingStatusIcon = (props) => {
    if (props.size === "small")
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6.66667 10H6.675M10 10H10.0083M13.3333 10H13.3417M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                        stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        )
    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6.66667 10H6.675M10 10H10.0083M13.3333 10H13.3417M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

export function TaskCompletedStatusIcon (props) {
    if (props.size === "small")
        return <div style={{display: "flex", justifyContent: "center"}}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                        stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

    return <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
}
