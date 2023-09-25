import './App.css';
import {HashRouter, Route, Routes} from "react-router-dom";
import WelcomeLayout from "./components/WelcomeLayout";
import {EditNotePage} from "./pages/Notes/EditNotePage";
import {AuthorizationPage} from "./pages/Authorization/Authorization";
import RequireUnauth from "./hoc/RequireUnauth";
import RequireAuth from "./hoc/RequireAuth";
import {NotePage} from "./pages/Notes/NotePage";
import {HomePage} from "./pages/HomePage";
import {TasksPage} from "./pages/TasksPage";
import {SchemesPage} from "./pages/SchemesPage";
import {NotesPage} from "./pages/NotesPage";
import {SchemeEditPage} from "./pages/SchemeEditPage";
import React from "react";
import {NotFoundPage} from "./pages/NotFoundPage";
import {NotDevelopedPage} from "./pages/NotDevelopedPage";
import {SettingsPage} from "./pages/SettingsPage";

function MyApp() {
    return (
        <div className="App">
            <HashRouter>
                <Routes>
                    <Route path='/login' element={
                        <RequireUnauth>
                            <AuthorizationPage/>
                        </RequireUnauth>
                    }/>

                    <Route path='/' element={
                            <RequireAuth>
                                <WelcomeLayout/>
                            </RequireAuth>
                    }>
                        <Route index element={<HomePage/>}/>
                        {/*<Route path='messenger' element={<MessengerPage/>}/>*/}
                        {/*<Route path='schedule' element={<SchedulePage/>}/>*/}

                        <Route path='messenger' element={<NotDevelopedPage selectedKey={"Messenger"}/>}/>
                        <Route path='schedule' element={<NotDevelopedPage selectedKey={"Schedule"}/>}/>

                        <Route path='tasks' element={<TasksPage/>}/>
                        {/*<Route path='bugs' element={<BugsPage/>}/>*/}

                        {/*<Route path='tasks' element={<NotDevelopedPage selectedKey={"Tasks"}/>}/>*/}
                        <Route path='bugs' element={<NotDevelopedPage selectedKey={"Bugs"}/>}/>
                        <Route path='sprints' element={<NotDevelopedPage selectedKey={"Sprints"}/>}/>

                        {/*<Route path='notes' element={<NotesPage groupID="0"/>}/>*/}
                        <Route path='notes/:seriesID' element={<NotesPage/>}/>
                        <Route path='schemes' element={<SchemesPage/>}/>
                        <Route path='scheme/:schemeID' element={<SchemeEditPage/>}/>

                        {/*<Route path='settings' element={<NotDevelopedPage selectedKey={"Settings"}/>}/>*/}
                        <Route path='settings' element={<SettingsPage/>}/>


                        <Route path='note/:noteID' element={<NotePage/>}/>
                        <Route path='note/edit/:noteID' element={<EditNotePage/>}/>
                        <Route path='*' element={<NotFoundPage/>}/>
                    </Route>


                </Routes>
            </HashRouter>
        </div>
    );
}

export default MyApp;
