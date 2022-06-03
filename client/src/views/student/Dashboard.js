import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';

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

import AddCardIcon from '@mui/icons-material/AddCard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import StoreIcon from '@mui/icons-material/Store';

const Dashboard = props => {
	const [userData, setUserData] = React.useState( null );

	const handleUserDataFetching = () => {
		Axios.get(
			`${window.API_BASE_ADDRESS}/master/get-single-user/type/student/id/${Cookies.get('userId')}`, 
			window.requestHeader
		)
		.then( res => setUserData( res.data ))
		.catch( err => {
			console.error( err );
		});
	}

	// const handleTimeout = () => {
	// 	Axios.put(
	// 		`${window.API_BASE_ADDRESS}/master/time-out/attendanceId/${userData?.currentAttendanceID}/student/${Cookies.get('userId')}`, 
	// 		null,
	// 		window.requestHeader
	// 	)
	// 	.then(() => {
	// 		handleUserDataFetching();
	// 	})
	// 	.catch( err => {
	// 		console.error( err );
	// 	});
	// }

	React.useEffect(() => {
		const refreshData = setInterval(() => handleUserDataFetching(), 2000);

		return () => clearInterval( refreshData );
	}, []);

	return(
		<div className="student-dashboard row d-flex flex-column">
			<QamsHeader title="Dashboard"/>

			<div className="flex-grow-1 d-flex flex-column justify-content-around align-items-center">
				<div className="student-dashboard-info-box row d-flex justify-content-center align-items-center border">
					<div style={{ height: 'fit-content' }} className="col-md-6 p-3 d-flex justify-content-center align-items-center">
						<QR.Generator value={userData?.studentNo}/>	
					</div>
					<div 
						style={{ height: '300px' }} 
						className="col-md-6 p-4 border d-flex flex-column justify-content-around"
					>
						<h2 className="mb-4"><b>QR CODE</b></h2>
						<Divider/>
						<br/>
						<p className="m-0 text-capitalize">{ userData?.lastName + ',' } { userData?.firstName } { userData?.middleName?.[0] ? userData?.middleName?.[0] + '.' : '' }</p>
						<p>{ userData?.studentNo }</p>
						<div className="my-2">
							<Stack direction="row" spacing={1}>
								<Chip icon={<StoreIcon fontSize="small"/>} label={userData?.strand[ 0 ]}/>
								<Chip icon={<CreditCardIcon fontSize="small"/>} label={userData?.section[ 0 ]}/>
							</Stack>
						</div>
						<Divider/>
						<div className="col-12 d-flex flex-column justify-content-center align-items-center">
							<div className="w-full">
								<p>Current Subject:</p>
							</div>
							{
								userData?.currentSubject
									? <Chip label={userData?.currentSubject}/>
									: null
							}
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


export default Dashboard;