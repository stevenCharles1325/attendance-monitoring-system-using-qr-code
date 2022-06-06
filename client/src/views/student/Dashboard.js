import React from 'react';
import uniqid from 'uniqid';
import Axios from 'axios';
import Cookies from 'js-cookie';

import { QR } from '../../components/QR';
import { useSelector, useDispatch } from 'react-redux';

import Menu from '../../components/Menu';
import LabeledText from '../../components/LabeledText';
import Attendance from './Attendance';

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

const Dashboard = props => {
	const [userData, setUserData] = React.useState( null );
	const [isSubjectDialogOpen, setIsSubjectDialogOpen] = React.useState( false );

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

	const createRow = data => (
		<div key={uniqid()} className="h-[35px] my-2 text-center text-capitalize d-flex">
			<div className="col-3 text-truncate">{ data.subject.name }</div>
			<div className="col-3 text-truncate">{ data.firstName + ' ' +	 data.lastName }</div>
			<div className="col-4 text-truncate d-flex justify-content-around">
				{
					data.subject.days.map(( day, index ) => (
						<Avatar key={uniqid()} sx={{ width: '35px', height: '35px', bgcolor: day ? green[500] : null }} >
							{ days[ index ] }
						</Avatar>
					))
				}
			</div>
			<div className="col-2 text-truncate">{ data.subject.start + ' - ' + data.subject.end }</div>
		</div>
	);

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
		<div className="student-dashboard row d-flex py-3">
			<QamsHeader title="Dashboard"/>
			<div className="w-full d-flex px-5 flex-wrap justify-content-start">
				<CountCard
					title="Total subjects"
					icon={StoreIcon}
					data={{
						count: userData?.teachers?.length,
						countLabel: 'subjects'
					}}
					onClick={() => setIsSubjectDialogOpen( true )}
				/>
			</div>
			<div className="flex-grow-1 d-flex justify-content-center align-items-center">
				<Attendance/>
				{/*<div className="student-dashboard-info-box row d-flex justify-content-center align-items-center border">
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
*/}			</div>
			<DialogForm
				fullWidth
				processBtnOff
				open={isSubjectDialogOpen}
				close={() => setIsSubjectDialogOpen( false )}
			>
				<div className="w-full h-full min-h-[300px] min-w-[800px]">
					<div className="h-[40px] text-center text-capitalize font-bold d-flex">
						<div className="col-3">Subject Name</div>
						<div className="col-3">Assigned teacher</div>
						<div className="col-4">day</div>
						<div className="col-2">time</div>
					</div>
					<Divider/>
					<div className="h-[260px] h-fit overflow-auto">
						{ userData?.teachers?.map( teacher => createRow( teacher ))}
					</div>
				</div>
			</DialogForm>
		</div>
	);
}

const CountCard = props => {
	return(
		<ButtonBase className="rounded m-3" onClick={props?.onClick}>
			<div className="d-flex flex-column justify-content-start align-items-start w-[250px] h-fit min-h-[150px] text-[#5b5d5a] rounded shadow bg-white overflow-hidden">
				<div className="w-full h-[35px] border-bottom bg-[#6a6c68] text-white shadow">
					<p className="text-left text-truncate text-capitalize px-3 py-1 tracking-wide">{ props?.title }</p>
				</div>
				{
					props?.icon
						?	<div className="p-3">
								<props.icon fontSize="large"/>
							</div>
						: null
				}
				{
					props?.data
						?	<div className="px-3 pb-3">
								<p><b>{ props?.data?.count }</b> /{ props?.data?.countLabel }</p>
							</div>
						: null
				}
			</div>
		</ButtonBase>
	);
}



export default Dashboard;