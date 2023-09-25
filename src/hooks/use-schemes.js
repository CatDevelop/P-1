import {useSelector} from 'react-redux';

export function useSchemes() {
  return useSelector((state) => state.schemes);
}
