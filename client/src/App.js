import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Authentication from './Authentication';

import ViewsPath from './modules/ViewsPath';
import Gate from './views/Gate';
import DashboardSysadmin from './views/sysadmin/Dashboard';
import DashboardStudent from './views/student/Dashboard';

import PageLoading from './components/PageLoading';

const views = new ViewsPath(
  'app', 
  'gate',
  'sysadmin-dashboard',
  'student-dashboard',
  'teacher-dashboard'
);


function App() {
  const [navigateTo, setNavigateTo] = React.useState( null );

  React.useEffect(() => setNavigateTo( null ), [navigateTo]);

  return (
    <div className="App">
      <Authentication
        status="off"
        loading={<PageLoading/>}
        verificationEndpoint={`${window.API_BASE_ADDRESS}/master/verify-me`}
        viewPaths={views.getPaths().slice( 2 )}
        gatePaths={views.getPaths().slice( 0, 1 )}
        setRedirectTo={val => setNavigateTo( val )}
      >
        <Routes>
          <Route path="/app/gate" element={<Gate />}/>
          <Route path="/app/sysadmin-dashboard" element={<DashboardSysadmin/>}/>
          <Route path="/app/student-dashboard" element={<DashboardStudent/>}/>
        </Routes>
      </Authentication>
      { navigateTo }
    </div>
  );
}



export default App;
