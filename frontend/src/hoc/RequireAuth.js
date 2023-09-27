import React, { useEffect } from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

const RequireAuth = ({ children }) => {
    const user = useAuth();
    const navigate = useNavigate()
    if (!user.isAuth) {
        console.log("NOT AUTH")
        return <Navigate to='/login' />;
    }

    return children;
};

export default RequireAuth;
