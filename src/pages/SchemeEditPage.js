import s from "./Pages.module.css";
import FirstMenu from "../components/Menu/Menu";
import React, {useEffect, useState} from "react";
import SchemeCard from "../components/SchemeCard/SchemeCard";
import {Modal, Spin} from "antd";
import SchemePreview from "../components/SchemePreview/SchemePreview";
import SchemeEdit from "../components/SchemeEdit/SchemeEdit";
import {useDispatch} from "react-redux";
import {getScheme} from "../store/slices/schemeSlice";
import {useParams} from "react-router-dom";
import {useScheme} from "../hooks/use-scheme";
import {removeSchemes} from "../store/slices/schemesSlice";

export const SchemeEditPage = () => {
    const {schemeID} = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch()
    const scheme = useScheme()

    useEffect (()=> {
        dispatch(getScheme(schemeID))
        dispatch(removeSchemes())
    }, [])
    const showModal = () => {
        setIsModalOpen(true);
    };

    const hideModal = () => {
        setIsModalOpen(false);
    };




    return (
        <div>
            <div className={s.mainContainer}>
                <FirstMenu selectedKeys={[]}/>
                {
                    scheme.isLoading ?
                        <Spin/> : <>
                            <div className={s.pageTitle}>{scheme.scheme.title}</div>
                            <SchemeEdit schemeID={schemeID} scheme={JSON.parse(scheme.scheme.scheme)}/>
                        </>
                }
            </div>
        </div>
    )
}
