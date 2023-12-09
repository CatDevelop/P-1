import React, {useCallback} from 'react'
import styles from './VkAuthButton.module.css'
import {VKLogo} from "../../assets/images/VKLogo";
import {useNavigate} from "react-router-dom";

const APP_ID = 51771611;
export default function VkAuthButton() {
    return (
        <a className={styles.vkAuthButton} href={`https://oauth.vk.com/authorize?client_id=${APP_ID}&display=popup&redirect_uri=https://pi-1.ru/login&scope=offline,email&response_type=code&v=5.154`}>
                <div className={styles.vkAuthButton__logo}>
                    {VKLogo}
                </div>
                Войти через VK ID
        </a>
    )
}
