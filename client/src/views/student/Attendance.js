import React from 'react';
import Axios from 'axios';
import uniqid from 'uniqid';
import Cookies from 'js-cookie';

import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/styles';
import { useTheme } from '@mui/material/styles';

import CircularProgress from '@mui/material/CircularProgress';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckIcon from '@mui/icons-material/Check';


const monthTable = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december'
];

// const ScheduleDialog = styled( Dialog )({
// 	backgroundColor: 'white',
// 	borderRadius: '24px',
// 	color: 'white',
// 	'&:hover': {
// 		backgroundColor: 'rgba(255, 0, 0, 0.4)'
// 	}
// });

const Attendance = props => {
	const [date, setDate] = React.useState( new Date() );	
	const [month, setMonth] = React.useState( null );
	const [year, setYear] = React.useState( null );
	const [calDate, setCalDate] = React.useState( null );
	const [days, setDays] = React.useState( null );
	const [attendance, setAttendance] = React.useState( null );
	const [userData, setUserData] = React.useState( null );

	const [attendanceDateData, setAttendanceDateData] = React.useState( null );

	const getUserDataFetching = () => {
		Axios.get(
			`${window.API_BASE_ADDRESS}/master/get-single-user/type/student/id/${Cookies.get('userId')}`, 
			window.requestHeader
		)
		.then( res => setUserData( res.data ))
		.catch( err => {
			console.error( err );
		});
	}

	const getAttendance = async () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/students-attendance/id/${Cookies.get('userId')}`)
		.then( res => setAttendance( res.data ))
		.catch( err => {
			throw err;
		});
	}

	React.useEffect(() => {
		setMonth( () => date.getMonth() );
		setYear( () => date.getFullYear() );
		setCalDate( () => date.toDateString() );
		getAttendance();
		getUserDataFetching();
	}, []);

	React.useEffect(() => {
		renderDate();
	}, [month, year, userData, attendance]);

	const renderDate = React.useCallback(() => {
		if( !month || !year || !attendance || !userData ) return;

		const tempDays = [];
		date.setDate(1);

		const lastDay = new Date(
		    date.getFullYear(),
		    date.getMonth() + 1,
		    0
		).getDate();

		const prevLastDay = new Date(
			date.getFullYear(),
			date.getMonth(),
			0
		).getDate();

		const firstDayIndex = date.getDay();

		const lastDayIndex = new Date(
			date.getFullYear(),
			date.getMonth() + 1,
			0
		).getDay();

		const nextDays = 7 - lastDayIndex - 1;

		function getDate(){
			return ( callback ) => {
				const thisDate = new Date( ...arguments ).toDateString();

				for( let attdnc of attendance.attendance ){
					if( thisDate === attdnc.date ){
						return callback( attdnc );
					}
				}
			}
		}

		function getAttendanceValue(){
			const numberOfSubjects = userData.teachers.length;
			const attendanceVal = (100 / numberOfSubjects) * attendance.attendance.length;

			return attendanceVal;
		}  

		const getDataOfDate = data => {
			setAttendanceDateData({ userData, attendance: data });
		}

		const createDay = (dayNumber, notInMonth = false, isToday = false) => ( attendanceVal = 0 ) =>{
			tempDays.push(
				<Day
					key={uniqid()}
					notInMonth={notInMonth}
					isToday={isToday}
					dayNumber={dayNumber}
					attendanceVal={attendanceVal}
					onClick={() => getDate(  year, month, dayNumber )( getDataOfDate )}
				/>
			);
		}

		for (let prevDay = firstDayIndex; prevDay > 0; prevDay--) {
			const dayNumber = prevLastDay - prevDay + 1; 
			const attendanceVal = getDate(  year, month, dayNumber )( getAttendanceValue );

			createDay( dayNumber, true )( attendanceVal );
		}

		for (let currDay = 1; currDay <= lastDay; currDay++) {
			const isToday = currDay === new Date().getDate() && date.getMonth() === new Date().getMonth();
			const attendanceVal = getDate(  year, month, currDay )( getAttendanceValue );

			createDay( currDay, false, isToday )( attendanceVal );
		}

		for (let nextDay = 1; nextDay <= nextDays; nextDay++) {
			const attendanceVal = getDate(  year, month, nextDay )( getAttendanceValue );

			createDay( nextDay, true )( attendanceVal );
		}

		setDays([ ...tempDays ]);
	}, [month, year, userData, attendance]);

	const updateDate = () => {
		setMonth(() => date.getMonth());
		setYear( date.getFullYear() );
		setCalDate(() => date.toDateString());
		renderDate();
	}

	const handleDateIncrease = () => {
		let newDate = date.setMonth( date.getMonth() + 1 );
		setDate(new Date( newDate ));
		updateDate();
	}
	
	const handleDateDecrease = () => {
		let newDate = date.setMonth( date.getMonth() - 1 );
		setDate(new Date( newDate ));
		updateDate();
	}

	return(
		<>
			<div className="w-100 h-100 d-flex justify-content-center align-items-center">
				<div className="attendance-box rounded d-flex flex-column overflow-hidden shadow">
					<div className="attendance-box-header border-bottom py-3 d-flex justify-content-between align-items-center">
						<div>
							<IconButton onClick={handleDateDecrease}>
								<ChevronLeftIcon/>
							</IconButton>
						</div>
						<div className="text-center">
							<h1 className="text-capitalize text-dark">{ Object.values( monthTable )?.[ month ] }</h1>
							{/*<p style={{ color: 'var( --text-color )'}}>{ calDate }</p>*/}
						</div>
						<div>
							<IconButton onClick={handleDateIncrease}>
								<ChevronRightIcon/>
							</IconButton>
						</div>
					</div>
					<div className="d-flex justify-content-around align-items-center py-2 text-secondary border-bottom">
						<p className="m-0">Sun</p>
						<p className="m-0">Mon</p>
						<p className="m-0">Tue</p>
						<p className="m-0">Wed</p>
						<p className="m-0">Thu</p>
						<p className="m-0">Fri</p>
						<p className="m-0">Sat</p>
					</div>
					<div className="flex-grow-1 d-flex flex-wrap">
						{ days }
					</div>
				</div>
			</div>
			<DayScheduleDialog data={attendanceDateData} open={!!attendanceDateData} onClose={() => setAttendanceDateData( null )}/>
		</>
	);
}

const DayScheduleDialog = props => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


	return(
		<Dialog
			open={props?.open}
			onClose={props?.onClose}
		>
			{ console.log( props?.data ) }
		</Dialog>
	);
}

const Day = ({ dayNumber, notInMonth, isToday, attendanceVal, onClick }) => {
	return (
		<div className={`position-relative attendance-box-day d-flex justify-content-center align-items-center`}>
			<div className="position-absolute top-50 start-50 translate-middle z-10">
				<IconButton 
					disabled={notInMonth}
					sx={{ 
						width: '50px', 
						height: '50px', 
						color: notInMonth 
							? 'rgba(0, 0, 0, 0.3)' 
							: isToday 
								? 'rgba(0, 0, 0, 0.7)'
								: 'rgba(0, 0, 0, 0.5)',
						backgroundColor: isToday ? '#ddbdb8' : 'rgba(0, 0, 0, 0.09)',
					}}
					onClick={onClick}
				>
					{ dayNumber }
				</IconButton>
			</div>
			<div className={`position-absolute w-100 h-100 d-flex ${ attendanceVal === 100 ? 'justify-content-start align-items-start' : 'justify-content-center align-items-center'}`}>
				{
					attendanceVal > 1
						? attendanceVal === 100
							? <CheckIcon/>
							: <CircularProgress variant="determinate" value={attendanceVal}/>
						: null
				}
			</div>
		</div>
	);
}


export default Attendance;