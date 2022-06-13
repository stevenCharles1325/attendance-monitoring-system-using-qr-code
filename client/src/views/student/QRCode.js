import React from 'react';
import uniqid from 'uniqid';
import Axios from 'axios';
import Cookies from 'js-cookie';

import { QR } from '../../components/QR';
import { useSelector, useDispatch } from 'react-redux';

import Menu from '../../components/Menu';
import LabeledText from '../../components/LabeledText';

import Avatar from '@mui/material/Avatar';
import QamsHeader from '../../components/QamsHeader';
import DialogForm from '../../components/DialogForm';

import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { green } from '@mui/material/colors';

import AddCardIcon from '@mui/icons-material/AddCard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import StoreIcon from '@mui/icons-material/Store';

const days = [
	'M',
	'T',
	'W',
	'TH',
	'F',
	'ST',
];

const QRCode = props => {
	const [userData, setUserData] = React.useState( null );
	const [isSubjectDialogOpen, setIsSubjectDialogOpen] = React.useState( false );
	const [rows, setRows] = React.useState( [] );

	const renderedRows = React.useMemo(() => {
		const tempRenderedRows = [];

		rows?.forEach( row => {
			tempRenderedRows.push(
				<div key={uniqid()} className="border-bottom w-full h-fit min-h-[50px] py-3 text-center text-uppercase d-flex">
					<div className="qams-col p-auto text-truncate">{ row.student.id }</div>
					<div className="qams-col p-auto text-truncate">{ `${row.student.lastName} ${row.student.firstName}` }</div>
					<div className="qams-col p-auto text-truncate">{ row.strand }</div>
					<div className="qams-col p-auto text-truncate">{ row.section }</div>
					<div className="qams-col p-auto text-truncate">{ row.timein }</div>
					<div className="qams-col p-auto text-truncate">{ row.timeout }</div>
				</div>
				);
		});

		return tempRenderedRows;
	}, [rows]);

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

	const getTimeRecords = () => {
		Axios.get(
			`${window.API_BASE_ADDRESS}/master/time-records/userType/student/id/${Cookies.get('userId')}`, 
			window.requestHeader
		)
		.then( res => setRows( res.data ))
		.catch( err => {
			console.error( err );
		});
	}


	// React.useEffect(() => {
	// 	const refreshData = setInterval(() => handleUserDataFetching(), 2000);
	// 	getTimeRecords();

	// 	return () => clearInterval( refreshData );
	// }, []);
	
	React.useEffect(() => {
		handleUserDataFetching();
		getTimeRecords();
	}, []);


	return(
		<div className="student-dashboard row d-flex py-3">
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
							{ renderedRows }
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


export default QRCode;