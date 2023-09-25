import {useSelector} from 'react-redux';

export function useScheme() {
  return useSelector((state) => state.scheme);
}
