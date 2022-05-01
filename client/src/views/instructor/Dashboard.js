import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';

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

import AddCardIcon from '@mui/icons-material/AddCard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import StoreIcon from '@mui/icons-material/Store';

const Dashboard = props => {
	const [userData, setUserData] = React.useState( null );
	const [qrData, setQrData] = React.useState( null );
	const [isCameraDenied, setIsCameraDenied] = React.useState( null );

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
		navigator.permissions.query({name: 'microphone'})
		.then((permissionObj) => {
			console.log(permissionObj.state);
			switch( permissionObj.state ){
				case 'denied':
					setIsCameraDenied( true );
					break;

				default:
					setIsCameraDenied( false );
					break;
			}
		})
		.catch((error) => {
			console.log('Got error :', error);
			setIsCameraDenied( true );
		});

		handleUserDataFetching()
	}, []);

	React.useEffect(() => console.log( qrData ), [qrData]);

	return(
		<div className="student-dashboard row d-flex flex-column">
			<QamsHeader title="Dashboard"/>
			<div className="flex-grow-1 d-flex flex-column justify-content-around align-items-center">
				<div className="student-dashboard-info-box row">
					<div 
						style={{
							height: '300px',
						}} 
						className="col-md-6 p-3 d-flex justify-content-center align-items-center"
					>
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
								? <QR.Scanner getData={val => setQrData( val )}/>
								: <h5 className="p-3 rounded bg-danger text-white">
									Camera permission denied
								</h5>
						}
						<p>{ qrData }</p>
					</div>
					<div 
						style={{ height: '200px', maxHeight: 'fit-content' }} 
						className="col-md-6 p-4"
					>
						<h2 className="mb-4">QR CODE</h2>
						<p className="m-0 text-capitalize">{ userData?.lastName + ',' } { userData?.firstName } { userData?.middleName?.[0] ? userData?.middleName?.[0] + '.' : '' }</p>
						<p>{ userData?.studentNo }</p>

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
					</div>
				</div>
			</div>
		</div>
	);
}


export default Dashboard;