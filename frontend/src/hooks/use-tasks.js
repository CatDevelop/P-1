import {useSelector} from 'react-redux';

export function useTasks() {
  return useSelector((state) => state.tasks)
}
