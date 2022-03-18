import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { 
  useSelector, 
  useDispatch 
} from 'react-redux';

import { handleNavigateTo } from './features/navigation/navigationSlice';

import Authentication from './Authentication';

import ViewsPath from './modules/ViewsPath';

import Gate from './views/Gate';
import PageNotFound from './views/PageNotFound';

import DashboardStudent from './views/student/Dashboard';

import DashboardSysadmin from './views/sysadmin/Dashboard';
import StudentsAccount from './views/sysadmin/StudentsAccount';

import PageLoading from './components/PageLoading';

// viewsPath count/length will be deducted by 1
const views = new ViewsPath( 
  'app', // ROOT
  
  'student/dashboard',
  'student/account',
  'student/attendance',

  'teacher/dashboard',
  'teacher/account',
  'teacher/schedule',
  'teacher/students-attendance-record',

  'sysadmin/dashboard',
  'sysadmin/account',
  'sysadmin/students-account',
  'sysadmin/teachers-account',
  'sysadmin/student-records',
  'sysadmin/teacher-records',
  'sysadmin/attendance-records',
  'sysadmin/graph-report',
  'sysadmin/school-form-2',

  'gate', // 16th index
);


function App() {
  const navigateTo = useSelector( state => state.navigation.to );
  const dispatch = useDispatch();

  React.useEffect(() => dispatch(handleNavigateTo( null )), [navigateTo]);

  return (
    <div className="App">
      <Authentication
        // status="off" // When status is set to off then Authentication will not work
        loading={<PageLoading/>}
        pageNotFound={<PageNotFound/>}
        verificationEndpoint={`${window.API_BASE_ADDRESS}/master/verify-me`}
        viewPaths={views.getPaths().slice( 0, views.getPaths().length - 1 )}
        gatePaths={views.getPaths().slice( 16, views.getPaths().length )}
        root={views.getRoot()}
        userLevels={{
          student: [0, 3],
          teacher: [3, 7],
          sysadmin: [7, 16]
        }}
        setRedirectTo={val => dispatch(handleNavigateTo( val ))}
      >
        <Routes>
          <Route path="/app/gate" element={<Gate />}/>
          
          <Route path="/app/sysadmin/dashboard" element={<DashboardSysadmin/>}/>
          <Route path="/app/sysadmin/students-account" element={<StudentsAccount/>}/>
          
          <Route path="/app/student/dashboard" element={<DashboardStudent/>}/>
        </Routes>
      </Authentication>
      {/* Navigate to */}
      { navigateTo && <Navigate to={navigateTo}/> } 
    </div>
  );
}



export default App;
