import {useSelector} from 'react-redux';

export function useNotes() {
  return useSelector((state) => state.notes)
}
