import {useSelector} from 'react-redux';

export function useTasks() {
  // const localNotes = useSelector((state) => state.localNotes);
  // let networkNotesTemp = useSelector((state) => state.networkNotes);
  //
  // let childrens = [];
  // if(!networkNotesTemp.isLoading)
  //   childrens = networkNotesTemp.directories.children.map(file => {return {...file, icon: file.isBlocked === '1' ? <LockOutlined /> : ""}})
  // let networkNotes = {...networkNotesTemp, directories: {...networkNotesTemp.directories, children: childrens}}
  //
  // return { localNotes: localNotes, networkNotes: networkNotes};
  return useSelector((state) => state.tasks)
}
