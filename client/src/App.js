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

import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
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
import QrCodeIcon from '@mui/icons-material/QrCode';

import Authentication from './Authentication';
import Menu from './components/Menu';
import ViewsPath from './modules/ViewsPath';

import Gate from './views/Gate';
import PageNotFound from './views/PageNotFound';

// System-administrator components
import DashboardSysadmin from './views/sysadmin/Dashboard';
import StudentsAccount from './views/sysadmin/StudentsAccount';
import TeachersAccount from './views/sysadmin/TeachersAccount';
import StudentsRecord from './views/sysadmin/StudentsRecord';
import TeachersRecord from './views/sysadmin/TeachersRecord';
import AttendanceRecord from './views/sysadmin/AttendanceRecord';

// Students and Teachers merged components
import Profile from './views/Profile';
import ChangePassword from './views/ChangePasswordForm';

// Students components
import QRCode from './views/student/QRCode';
import DashboardStudent from './views/student/Dashboard';

// Teacher components
import DashboardTeacher from './views/instructor/Dashboard';
import QRScanner from './views/instructor/QRScanner';
import StudentsAttendance from './views/instructor/StudentsAttendance';

// Page component
import PageLoading from './components/PageLoading';

// Root will always be excluded. Index 1 = 0
const views = new ViewsPath( 
  'app', // ROOT
  
  'student/dashboard',
  'student/account/profile',
  'student/account/change-password',
  'student/qr-code',

  'teacher/dashboard',
  'teacher/account/profile',
  'teacher/account/change-password',
  'teacher/qr-scanner',
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

window.STRANDS = {
  'ABM': {
    '1': [
      'Introduction to the Philosophy of the Human Person',
      'Contemporary Philippine Art from the Region',
      'Understanding Culture, Society and Politics',
      'Physical education and Health 3',
      'Values education 3',
      'Practical Research 2',
      'English for Academic and Professional purpose',
      'Fundamental of Accountancy, Business and Management 2',
      'Business Mathematics',
      'Business Finance',
    ],
    '2': [
      'Media and Information Literacy',
      'Physical Education and Health 4',
      'Values education 4',
      'Inquiries, Investigations and Immersion',
      'Applied Economics',
      'Business Ethics and Social Responsibility',
      'Principle of Marketing',
      'Work Immersion/Business Enterprise Simulation'
    ]
  },
  'HUMSS': {
    '1': [
      'Introduction to the Philosophy of the Human Person',
      'Contemporary Philippine Art from the Region',
      'Understanding Culture, Society and Politics',
      'Physical education and Health 3',
      'Values education 3',
      'Practical Research 2',
      'English for Academic and Professional purpose',
      'Discipline and Ideas in the Applied Social Science',
      'Creative Writing',
      'Introduction to World Religion and Belief System',
    ],
    '2': [
      'Media and Information Literacy',
      'Physical Education and Health 4',
      'Values education 4',
      'Inquiries, Investigations and Immersion',
      'Trend, Networks and Critical Thinking in the 21st Century',
      'Community Engagement Solidarity and Citizenship',
      'Creative Non-Fiction: The Literary Essay',
      'Culminating Activity',
    ]
  },
  'STEM': {
    '1': [
      '21st Century Literature from the Philippines and the World',
      'Contemporary Philippine Art from the Region',
      'Media and Information Literacy',
      'Understanding Culture, Society and Politics',
      'Physical education and Health 3',
      'Values education 3',
      'English for Academic and Professional purpose',
      'Pagsulat sa Filipino sa Piling Larangan (Akademiko)',
      'General Physics 1',
      'General Biology',
    ],
    '2': [
      'Physical Education and Health 4',
      'Values education 4',
      'Entrepreneurship',
      'Practical Research 2',
      'Inquiries, Investigations and Immersion',
      'General Physics 2',
      'General Chemistry 2',
      'General Biology 2',
      'Research',
    ]
  },
  'HE': {
    '1': [
      'Contemporary Philippine Art from the Region',
      'Introduction to the Philosophy of the Human Person',
      'Understanding Culture, Society and Politics',
      'Physical Education and Health 3',
      'Values education 3',
      'Media and Information Literacy',
      'English for Academic and Professional purpose',
      'Practical Research 2',
      'Bread and Pastry Production 3',
      'Food and Beverages Production 3',
    ],
    '2': [
      'Physical Education and Health 4',
      'Values education 4',
      'Inquiries, Investigations and Immersion',
      'Bread and Pastry Production 4',
      'Food and Beverages Production 4',
      'Work Immersion',
    ]
  },
  'ICT': {
      '1': [
        'Contemporary Philippine Art from the Region',
        'Introduction to the Philosophy of the Human Person',
        'Understanding Culture, Society and Politics',
        'Physical Education and Health 3',
        'Values education 3',
        'Media and Information Literacy',
        'English for Academic and Professional purpose',
        'Practical Research 2',
        'Computer Programing 3',
        'Animation 3',
      ],
      '2': [
        'Physical Education and Health 4',
        'Values education 4',
        'Inquiries, Investigations and Immersion',
        'Computer Programing 4',
        'Animation 4',
        'Work Immersion',
      ]
  }
};


window.availableStrandNames = {
  STEM: 'science, technology, engineering and mathematics',
  HE: 'home economics strand',
  GAS: 'general academic strand',
  HUMSS: 'humanities and social sciences',
  ICT: 'information and communication technology',
  ABM: 'accountacy, business and management strand',
}

function App() {
  const { userRole, id } = useSelector( state => state.form );
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
      text: 'Manage Accounts',
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
          icon: <ListAlt/>,
          onClick: () => handleNavigation('/app/sysadmin/attendance-record')
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
      icon: <DashboardIcon/>,
      onClick: () => handleNavigation('/app/teacher/dashboard')
    },
    {
      text: 'Account',
      icon: <AccountBox/>,
      collapsable: true,
      subList: [
        {
          text: 'Profile',
          icon: <AccountCircle/>,
          onClick: () => handleNavigation('/app/teacher/account/profile')
        },
        {
          text: 'Change Password',
          icon: <KeyIcon/>,
          onClick: () => handleNavigation('/app/teacher/account/change-password')
        }
      ]
    },
    {
      text: 'Qr Scanner',
      icon: <QrCodeScannerIcon/>,
      onClick: () => handleNavigation('/app/teacher/qr-scanner')
    },
    {
      text: 'Students Attendance Record',
      icon: <Folder/>,
      onClick: () => handleNavigation('/app/teacher/students-attendance-record')
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
      text: 'QR Code',
      icon: <QrCodeIcon/>,
      onClick: () => handleNavigation('/app/student/qr-code')
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
          icon: <KeyIcon/>,
          onClick: () => handleNavigation('/app/student/account/change-password')
        }
      ]
    },
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
        gatePaths={views.getPaths().slice( 18, views.getPaths().length )}
        root={views.getRoot()}
        userLevels={{
          // Slicing routes for each user type
          student: [0, 4],
          teacher: [4, 9],
          sysadmin: [9, 18]
        }}
        setRole={val => dispatch(handleUserRole( val ))}
        setRedirectTo={val => dispatch(handleNavigateTo( val ))}
      >
        <Menu items={items} hideOn='/app/gate' username={Cookies.get('userId')}>
          <Routes>
            {/* Gate */}
            <Route path="/app/gate" element={<Gate />}/>
            
            {/* System-administrator's routes */}
            <Route path="/app/sysadmin/dashboard" element={<DashboardSysadmin/>}/>
            <Route path="/app/sysadmin/students-record" element={<StudentsRecord/>}/>
            <Route path="/app/sysadmin/students-account" element={<StudentsAccount/>}/>
            <Route path="/app/sysadmin/teachers-account" element={<TeachersAccount/>}/>
            <Route path="/app/sysadmin/teachers-record" element={<TeachersRecord/>}/>
            <Route path="/app/sysadmin/attendance-record" element={<AttendanceRecord/>}/>
            
            {/* Students' routes */}
            <Route path="/app/student/dashboard" element={<DashboardStudent/>}/>
            <Route path="/app/student/account/profile" element={<Profile userType="student"/>}/>
            <Route path="/app/student/account/change-password" element={<ChangePassword/>}/>
            <Route path="/app/student/qr-code" element={<QRCode/>}/>

            {/* Teachers' routes */}
            <Route path="/app/teacher/dashboard" element={<DashboardTeacher/>}/>
            <Route path="/app/teacher/account/profile" element={<Profile userType="teacher"/>}/>
            <Route path="/app/teacher/account/change-password" element={<ChangePassword/>}/>
            <Route path="/app/teacher/qr-scanner" element={<QRScanner/>}/>
            <Route path="/app/teacher/students-attendance-record" element={<StudentsAttendance/>}/>
          </Routes>
        </Menu>      
      </Authentication>
      {/* Navigate to */}
      { navigateTo && <Navigate to={navigateTo}/> } 
    </div>
  );
}



export default App;
