import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  useSelector, 
  useDispatch 
} from 'react-redux';

import { handleUserRole } from './features/form/formSlice';
import { handleNavigateTo } from './features/navigation/navigationSlice';
import { useSnackbar } from 'notistack';

import FactCheckIcon from '@mui/icons-material/FactCheck';
import KeyIcon from '@mui/icons-material/Key';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBox from '@mui/icons-material/AccountBox';
import Folder from '@mui/icons-material/Folder';
import Assessment from '@mui/icons-material/Assessment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SsidChart from '@mui/icons-material/SsidChart';
import Feed from '@mui/icons-material/Feed';
import ListAlt from '@mui/icons-material/ListAlt';

import Authentication from './Authentication';
import Menu from './components/Menu';
import ViewsPath from './modules/ViewsPath';

import Gate from './views/Gate';
import PageNotFound from './views/PageNotFound';

// Students components
import DashboardStudent from './views/student/Dashboard';
import StudentProfile from './views/student/StudentProfile';

// System-administrator components
import DashboardSysadmin from './views/sysadmin/Dashboard';
import StudentsAccount from './views/sysadmin/StudentsAccount';
import TeachersAccount from './views/sysadmin/TeachersAccount';
import StudentsRecord from './views/sysadmin/StudentsRecord';
import TeachersRecord from './views/sysadmin/TeachersRecord';

import PageLoading from './components/PageLoading';

// Root will always be excluded. Index 1 = 0
const views = new ViewsPath( 
  'app', // ROOT
  
  'student/dashboard',
  'student/account/profile',
  'student/account/change-password',
  'student/attendance',

  'teacher/dashboard',
  'teacher/account',
  'teacher/schedule',
  'teacher/students-attendance-record',

  'sysadmin/dashboard',
  'sysadmin/account',
  'sysadmin/students-account',
  'sysadmin/teachers-account',
  'sysadmin/students-record',
  'sysadmin/teachers-record',
  'sysadmin/attendance-record',
  'sysadmin/graph-report',
  'sysadmin/school-form-2',

  'gate', // 16th index
);

window.requestHeader = {
  'headers': {
    'authorization': `Bearer ${Cookies.get('token')}`
  }
}

function App() {
  const { userRole } = useSelector( state => state.form );
  const navigateTo = useSelector( state => state.navigation.to );
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleNavigation = route => {
    dispatch(handleNavigateTo( route ));
  }

  const checkIfSemesterExists = () => {
    Axios.get(`${window.API_BASE_ADDRESS}/master/check-semester`)
    .catch( err => {
      enqueueSnackbar('Error while checking semester, please restart the page.', { variant: 'error' });
      console.error( err );
    });
  }

  /* =====================

      Sysadmin Items

  =======================*/
  const sysadminItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon/>,
      onClick: () => handleNavigation('/app/sysadmin/dashboard')
    },
    {
      text: 'Account',
      icon: <AccountBox/>,
      collapsable: true,
      subList: [
        {
          text: 'Students Account',
          icon: <AccountCircle/>,
          onClick: () => handleNavigation('/app/sysadmin/students-account')
        },
        {
          text: 'Teachers Account',
          icon: <AccountCircle/>,
          onClick: () => handleNavigation('/app/sysadmin/teachers-account')
        }
      ]
    },
    {
      text: 'Records',
      icon: <Folder/>,
      collapsable: true,
      subList: [
        {
          text: 'Students Record',
          icon: <ListAlt/>,
          onClick: () => handleNavigation('/app/sysadmin/students-record')
        },
        {
          text: 'Teachers Record',
          icon: <ListAlt/>,
          onClick: () => handleNavigation('/app/sysadmin/teachers-record')
        },
        {
          text: 'Attendance Record',
          icon: <ListAlt/>
        }
      ]
    },
    {
      text: 'Reports',
      icon: <Assessment/>,
      collapsable: true,
      subList: [
        {
          text: 'Graph',
          icon: <SsidChart/>
        },
        {
          text: 'School Form 2',
          icon: <Feed/>
        }
      ]
    }
  ];


  /* =====================

      Teacher Items

  =======================*/
  const teacherItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon/>
    },
    {
      text: 'Account',
      icon: <AccountBox/>,
      collapsable: true,
      subList: [
        {
          text: 'Students Account',
          icon: <AccountCircle/>

        },
        {
          text: 'Teachers Account',
          icon: <AccountCircle/>
        }
      ]
    },
    {
      text: 'Records',
      icon: <Folder/>,
      collapsable: true,
      subList: [
        {
          text: 'Students Record',
          icon: <ListAlt/>
        },
        {
          text: 'Teachers Record',
          icon: <ListAlt/>
        },
        {
          text: 'Attendance Record',
          icon: <ListAlt/>
        }
      ]
    },
    {
      text: 'Reports',
      icon: <Assessment/>,
      collapsable: true,
      subList: [
        {
          text: 'Graph',
          icon: <SsidChart/>
        },
        {
          text: 'School Form 2',
          icon: <Feed/>
        }
      ]
    }
  ];


  /* =====================

      Student Items

  =======================*/
  const studentItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon/>,
      onClick: () => handleNavigation('/app/student/dashboard')
    },
    {
      text: 'Account',
      icon: <AccountBox/>,
      collapsable: true,
      subList: [
        {
          text: 'Profile',
          icon: <AccountCircle/>,
          onClick: () => handleNavigation('/app/student/account/profile')
        },
        {
          text: 'Change Password',
          icon: <KeyIcon/>
        }
      ]
    },
    {
      text: 'Attendance Record',
      icon: <FactCheckIcon/>
    }
  ];


  const items = {
    sysadmin: sysadminItems,
    teacher: teacherItems,
    student: studentItems,
  }

  const generateItem = role => {
    switch( role ){
      case 'sysadmin':
        return sysadminItems;

      case 'student':
        return studentItems;

      case 'teacher':
        return teacherItems;

      default:
        return [];
    }
  }

  React.useEffect(() => checkIfSemesterExists(), []);
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
          // Slicing routes for each user type
          student: [0, 3],
          teacher: [3, 7],
          sysadmin: [7, 16]
        }}
        setRole={val => dispatch(handleUserRole( val ))}
        setRedirectTo={val => dispatch(handleNavigateTo( val ))}
      >
        <Menu items={items} hideOn='/app/gate'>
          <Routes>
            {/* Gate */}
            <Route path="/app/gate" element={<Gate />}/>
            
            {/* System-administrator's routes */}
            <Route path="/app/sysadmin/dashboard" element={<DashboardSysadmin/>}/>
            <Route path="/app/sysadmin/students-record" element={<StudentsRecord/>}/>
            <Route path="/app/sysadmin/students-account" element={<StudentsAccount/>}/>
            <Route path="/app/sysadmin/teachers-account" element={<TeachersAccount/>}/>
            <Route path="/app/sysadmin/teachers-record" element={<TeachersRecord/>}/>
            
            {/* Students' routes */}
            <Route path="/app/student/dashboard" element={<DashboardStudent/>}/>
            <Route path="/app/student/account/profile" element={<StudentProfile/>}/>

            {/* Teachers' routes */}
          </Routes>
        </Menu>      
      </Authentication>
      {/* Navigate to */}
      { navigateTo && <Navigate to={navigateTo}/> } 
    </div>
  );
}



export default App;
