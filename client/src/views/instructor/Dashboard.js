import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import debounce from 'lodash.debounce';

// import { QrReader } from 'react-qr-reader';
import { QR } from '../../components/QR';
import { useSelector, useDispatch } from 'react-redux';

import Menu from '../../components/Menu';
import LabeledText from '../../components/LabeledText';

import Avatar from '@mui/material/Avatar';
import QamsHeader from '../../components/QamsHeader';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import AddCardIcon from '@mui/icons-material/AddCard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import StoreIcon from '@mui/icons-material/Store';
import { useSnackbar } from 'notistack';


const Dashboard = props => {
	const [userData, setUserData] = React.useState( null );
	const [qrData, setQrData] = React.useState( '' );
	const [isTimein, setIsTimein] = React.useState( true );
	const [isCameraDenied, setIsCameraDenied] = React.useState( null );

	const { enqueueSnackbar } = useSnackbar();

	const handleTimingin = (_, isTimingIn) => setIsTimein( isTimein => isTimingIn === null ? isTimein : isTimingIn );
	const handleTimein = async studentNo => {
		Axios.put(
			`${window.API_BASE_ADDRESS}/master/student/update-attendance/id/${studentNo}/teacherId/${Cookies.get('userId')}`,
			window.requestHeader
		)
		.then( res => {
			const attendanceMsg = res?.data?.message;
			const isMessage = !!attendanceMsg;
			const studentName = res?.data?.studentName ?? studentNo;

			if( isMessage ){
				enqueueSnackbar( attendanceMsg, { variant: 'success' });
			}
			else{
				enqueueSnackbar( `${studentName} now has attendance.`, { variant: 'success' });
			}

			setQrData( null );
		})	
		.catch( err => {
			const message = err?.response?.data?.message ?? 'Please try again!';

			enqueueSnackbar( message, { variant: 'error' });
			setQrData( null );
		});
	}

	const handleTimeout = async studentNo => {
		Axios.put(
			`${window.API_BASE_ADDRESS}/master/time-out/student/${studentNo}`, 
			null,
			window.requestHeader
		)
		.then(() => {
			enqueueSnackbar( 'Successfully time-out student', { variant: 'success' });
		})
		.catch( err => {
			console.error( err );
		});
	}
	
	// const memoizedAttendancing = React.useCallback(() => {
	// 	if( qrData )
	// 		handleAttendancing( qrData );
	// }, [qrData]);

	// const debouncedAttendancing = debounce(() => memoizedAttendancing(), 1000);

	const handleUserDataFetching = () => {
		Axios.get(
			`${window.API_BASE_ADDRESS}/master/get-single-user/type/teacher/id/${Cookies.get('userId')}`, 
			window.requestHeader
		)
		.then( res => setUserData( res.data ))
		.catch( err => {
			console.error( err );
		});
	}

	React.useEffect(() => {
		navigator.permissions.query({ name: 'microphone' })
		.then( permissionObj => {
			const isPermissionDenied = permissionObj.state === 'denied'; 

			setIsCameraDenied( isPermissionDenied );
		})
		.catch( error => {
			console.log('Got error :', error);
			setIsCameraDenied( true );
		});

		handleUserDataFetching()
	}, []);

	React.useEffect(() => {
		if( qrData ){
			if( isTimein ){
				handleTimein( qrData );
			}		
			else{
				handleTimeout( qrData );
			}
		}
	}, [isTimein, qrData]);

	return(
		<div className="student-dashboard row d-flex flex-column">
			<QamsHeader title="Dashboard"/>
			<div className="flex-grow-1 d-flex flex-column justify-content-around align-items-center">
				<div className="student-dashboard-info-box my-4 shadow row h-fit">
					<div className="border col-md-6 h-[300px] p-3 d-flex justify-content-center align-items-center">
						{/*<QRCode
							qrStyle="dots"
							eyeRadius={10}
							logoWidth={80}
							logoOpacity={0.5}
							value={props.id ?? '1801201'}
							logoImage="/images/logo/cctLogo_new.png" 
						/>*/}
						{
							!isCameraDenied
								? <QR.Scanner onScan={val => setQrData( val )}/>
								: <h5 className="p-3 rounded bg-danger text-white">
									Camera permission denied
								</h5>
						}
					</div>
					<div 
						className="col-md-6 p-4 h-fit"
					>
						<h2 className="mb-4">QR SCANNER</h2>
						<Divider/>
						<br/>
						<p className="m-0 text-capitalize font-bold">{ userData?.lastName + ',' } { userData?.firstName } { userData?.middleName?.[0] ? userData?.middleName?.[0] + '.' : '' }</p>
						<p>{ userData?.studentNo }</p>
						<div className="my-2">
							<Stack direction="row" spacing={1}>
								<Chip icon={<StoreIcon fontSize="small"/>} label={userData?.strand[ 0 ]}/>
								<Chip icon={<CreditCardIcon fontSize="small"/>} label={userData?.section[ 0 ]}/>
							</Stack>
						</div>
						<div className="col-12 d-flex flex-column justify-content-center align-items-center">
							{
								userData?.currentSubject
									? <Chip label={userData?.currentSubject}/>
									: null
							}
							<br/>
							<div className="w-full h-fit d-flex justify-content-around align-items-center">
								<ToggleButtonGroup
							      value={isTimein}
							      exclusive
							      onChange={handleTimingin}
							      aria-label="time-in toggle"
							    >
							      <ToggleButton value={true} aria-label="Time in">
							      	Time in
							      </ToggleButton>
							      <ToggleButton value={false} aria-label="Time out">
							        Time out
							      </ToggleButton>
							    </ToggleButtonGroup>
							</div>
						</div>
					</div>
				</div>
				{/*<div className="student-dashboard-sched-box my-3 d-flex flex-column justify-content-center align-items-center border">
					<div className="col-12 py-2 text-center border-bottom">
						<h4>{ userData?.section[ 0 ] } Schedule</h4>
					</div>
					<div className="flex-grow-1 col-12">
					</div>
				</div>*/}
			</div>
		</div>
	);
}

const CountCard = props => {
	return(
		<div className="w-[350px] h-[300px] rounded bg-white">

		</div>
	);
}


export default Dashboard;