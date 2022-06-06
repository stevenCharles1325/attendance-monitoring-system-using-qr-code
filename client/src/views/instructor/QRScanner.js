import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import debounce from 'lodash.debounce';

// import { QrReader } from 'react-qr-reader';
import { QR } from '../../components/QR';
import { useSelector, useDispatch } from 'react-redux';

import Menu from '../../components/Menu';
import Schedule from './Schedule';
import LabeledText from '../../components/LabeledText';

import Avatar from '@mui/material/Avatar';
import QamsHeader from '../../components/QamsHeader';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ButtonBase from '@mui/material/ButtonBase';

import AddCardIcon from '@mui/icons-material/AddCard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

import CreditCardIcon from '@mui/icons-material/CreditCard'; // section store
import StoreIcon from '@mui/icons-material/Store'; // strand icon
import ArticleIcon from '@mui/icons-material/Article';
import { useSnackbar } from 'notistack';

const QRScanner = props => {
	const [userData, setUserData] = React.useState( null );
	const [qrData, setQrData] = React.useState( '' );
	const [isTimein, setIsTimein] = React.useState( true );
	const [isCameraDenied, setIsCameraDenied] = React.useState( null );
	const [rows, setRows] = React.useState( [] );

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

	const getTimeRecords = () => {
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
			setIsCameraDenied( true );
		});

		handleUserDataFetching();
	}, []);

	const createRow = data => (
		<div className="border-bottom w-full h-fit py-3 text-center text-uppercase d-flex">
			{ data.forEach( datum => <div className="qams-col p-auto text-truncate">{ datum }</div>) }
		</div>
	);

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
		<div className="student-dashboard h-full row d-flex py-3">
			<QamsHeader title="QR Scanner"/>
			<div className="flex-grow-1 py-5 d-flex overflow-hidden flex-column justify-content-around align-items-center">
				<div className="student-dashboard-info-box my-4 shadow row h-fit rounded overflow-hidden">
					<div className="border col-md-6 h-[300px] p-3 d-flex justify-content-center align-items-center">
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

				<div className="student-dashboard-info-box h-[500px] min-w-[300px] my-4 shadow row h-fit rounded overflow-auto">
					<div className="w-full min-w-[700px] d-flex flex-column">
						<div className="border-bottom w-full h-fit min-h-[50px] py-3 text-center text-uppercase font-bold d-flex">
							<div className="qams-col p-auto text-truncate">Student NO.</div>
							<div className="qams-col p-auto text-truncate">Name</div>
							<div className="qams-col p-auto text-truncate">Strand</div>
							<div className="qams-col p-auto text-truncate">Section</div>
							<div className="qams-col p-auto text-truncate">Time-in</div>
							<div className="qams-col p-auto text-truncate">Time-out</div>
						</div>
						<div className="flex-grow-1">
							{ rows }
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}




export default QRScanner;