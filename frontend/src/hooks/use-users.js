import {useSelector} from 'react-redux';

export function useUsers() {
  return useSelector((state) => state.users)
}
