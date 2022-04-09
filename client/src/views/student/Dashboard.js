import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';

import { QRCode } from 'react-qrcode-logo';
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

	React.useEffect(() => handleUserDataFetching(), []);

	return(
		<div className="student-dashboard row d-flex flex-column">
			<QamsHeader title="Dashboard"/>

			<div className="flex-grow-1 d-flex flex-column justify-content-around align-items-center">
				<div className="student-dashboard-info-box row d-flex justify-content-center align-items-center border">
					<div className="col-md-6 p-3 d-flex justify-content-center align-items-center">
						<QRCode
							qrStyle="dots"
							eyeRadius={10}
							logoWidth={80}
							logoOpacity={0.5}
							value={props.id ?? '1801201'}
							logoImage="/images/logo/cctLogo_new.png" 
						/>	
					</div>
					<div 
						style={{ height: 'fit-content' }} 
						className="col-md-6 p-4"
					>
						<h2 className="mb-4">QR CODE</h2>
						<p className="m-0">{ userData?.lastName + ',' } { userData?.firstName } { userData?.middleName?.[0] ? userData?.middleName?.[0] + '.' : '' }</p>
						<p>{ userData?.studentNo}</p>

						<Stack direction="row" spacing={1}>
							<Chip icon={<StoreIcon fontSize="small"/>} label={userData?.strand[ 0 ]}/>
							<Chip icon={<CreditCardIcon fontSize="small"/>} label={userData?.section[ 0 ]}/>
						</Stack>
					</div>
				</div>
				<div className="student-dashboard-sched-box my-3 d-flex flex-column justify-content-center align-items-center border">
					<div className="col-12 py-2 text-center border-bottom">
						<h4>{ userData?.section[ 0 ] } Schedule</h4>
					</div>
					<div className="flex-grow-1 col-12">
						{/*SCHEDULE GOES HERE!*/}
					</div>
				</div>
			</div>
		</div>
	);
}


export default Dashboard;