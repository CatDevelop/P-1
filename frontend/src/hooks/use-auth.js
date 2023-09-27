import {useSelector, useDispatch} from 'react-redux';
import {setUser} from '../store/slices/userSlice';

export function useAuth() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const localUser = {
        id: localStorage.getItem('P1-userId'),
        login: localStorage.getItem('P1-login'),
        firstName: localStorage.getItem('P1-firstName'),
        secondName: localStorage.getItem('P1-secondName'),
        avatar: localStorage.getItem('P1-avatar'),
    };

    if (localUser.login && localUser.id) {
        dispatch(setUser(localUser));
        return {
            isAuth: !!localUser.id,
            ...localUser,
        };
    }


    return {
        isAuth: !!user.id,
        ...user,
    };
}
