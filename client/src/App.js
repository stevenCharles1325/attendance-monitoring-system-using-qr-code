import React from 'react';
import Axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  useSelector, 
  useDispatch 
} from 'react-redux';

import { handleUserRole } from './features/form/formSlice';
import { handleNavigateTo } from './features/navigation/navigationSlice';
import { useSnackbar } from 'notistack';

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

import DashboardStudent from './views/student/Dashboard';

import DashboardSysadmin from './views/sysadmin/Dashboard';
import StudentsAccount from './views/sysadmin/StudentsAccount';
import StudentsRecord from './views/sysadmin/StudentsRecord';


import PageLoading from './components/PageLoading';

// Root will always be excluded. Index 1 = 0
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
  'sysadmin/students-record',
  'sysadmin/teachers-record',
  'sysadmin/attendance-record',
  'sysadmin/graph-report',
  'sysadmin/school-form-2',

  'gate', // 16th index
);


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
          icon: <ListAlt/>,
          onClick: () => handleNavigation('/app/sysadmin/students-record')
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
          student: [0, 3],
          teacher: [3, 7],
          sysadmin: [7, 16]
        }}
        setRole={val => dispatch(handleUserRole( val ))}
        setRedirectTo={val => dispatch(handleNavigateTo( val ))}
      >
        <Menu items={items}>
          <Routes>
            <Route path="/app/gate" element={<Gate />}/>
          
            <Route path="/app/sysadmin/dashboard" element={<DashboardSysadmin/>}/>
            <Route path="/app/sysadmin/students-record" element={<StudentsRecord/>}/>
            <Route path="/app/sysadmin/students-account" element={<StudentsAccount/>}/>
            
            <Route path="/app/student/dashboard" element={<DashboardStudent/>}/>
          </Routes>
        </Menu>      
      </Authentication>
      {/* Navigate to */}
      { navigateTo && <Navigate to={navigateTo}/> } 
    </div>
  );
}



export default App;
