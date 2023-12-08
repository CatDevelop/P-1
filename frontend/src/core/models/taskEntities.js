import categoriesStyles from './categories.module.css'

export const categories = [
    {
        id: 0,
        name: "Не установлена",
        color: "#000000",
        textColor: "gray",
        className: categoriesStyles.none
    },
    {
        id: 1,
        name: "Frontend",
        color: "#20c997",
        textColor: "teal",
        className: categoriesStyles.frontend
    },
    {
        id: 2,
        name: "Backend",
        color: "#845ef7",
        textColor: "violet",
        className: categoriesStyles.backend
    },
    {
        id: 3,
        name: "Mobile",
        color: "#fcc419",
        textColor: "yellow",
        className: categoriesStyles.mobile
    },
    {
        id: 4,
        name: "Дизайн",
        color: "#cc5de8",
        textColor: "grape",
        className: categoriesStyles.design
    },
    {
        id: 5,
        name: "Аналитика",
        color: "#228be6",
        textColor: "blue",
        className: categoriesStyles.analitycs
    }
]


const priorities = [
    {
        id: 0,
        name: "Незначительный",
        color: "",
        textColor: "gray",
        variant: ""
    },
    {
        id: 1,
        name: "Низкий",
        color: "",
        textColor: "green",
        variant: ""
    },
    // {label: 'Незначительный', color: ""},
    // {label: 'Низкий', color: "green"},
    // {label: 'Средний', color: "yellow"},
    // {label: 'Критичный', color: "red"},
    // {label: 'Блокер', color: "red", variant: "filled"}
]
