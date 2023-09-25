import {useSelector} from 'react-redux';

export function useTimeTracking() {
  return useSelector((state) => state.timeTracking)
}
