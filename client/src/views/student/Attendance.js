import React from 'react';
import Axios from 'axios';
import uniqid from 'uniqid';
import Cookies from 'js-cookie';
import DateDiff from 'date-diff';

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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

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
	const [days, setDays] = React.useState( [] );
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

		// const fetchAttendanceInterval = 1000; // 1sec
		
		// const fetchAttendance = setInterval(() => {
		// 	getAttendance();
		// }, fetchAttendanceInterval);
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

		function getDate( month, day, year ){
			return ( callback ) => {
				const thisDate = new Date(`${monthTable[ month ].slice(0, 3)} ${day} ${year}`).toDateString();

				for( let attdnc of attendance.attendance ){
					if( thisDate === attdnc.date ){
						return callback( attendance.attendance );
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

		const createDay = ({ dayNumber, notInMonth = false, isToday = false, dayCategory }) => ( attendanceVal = 0 ) =>{
			tempDays.push(
				<Day
					key={uniqid()}
					notInMonth={notInMonth}
					isToday={isToday}
					dayNumber={dayNumber}
					dayCategory={dayCategory}
					attendanceVal={attendanceVal}
					onClick={() => getDate( month, dayNumber, year )( getDataOfDate )}
				/>
			);
		}

		for (let prevDay = firstDayIndex; prevDay > 0; prevDay--) {
			const dayNumber = prevLastDay - prevDay + 1; 
			const attendanceVal = getDate( month, dayNumber, year )( getAttendanceValue );

			createDay({ dayNumber, notInMonth: true, dayCategory: 'past' })( attendanceVal );
		}

		for (let currDay = 1; currDay <= lastDay; currDay++) {
			const isToday = currDay === new Date().getDate() && date.getMonth() === new Date().getMonth();
			const attendanceVal = getDate( month, currDay, year )( getAttendanceValue );

			const today = new Date();
			const schoolDateStart = new Date( userData.schoolStartDate );
			const thisDate = new Date(`${monthTable[ month ].slice(0, 3)} ${currDay} ${year}`);

			const dateDiff = new DateDiff( thisDate, today );
			const schoolStartDiff = new DateDiff( thisDate, schoolDateStart );

			const dayCategory = schoolStartDiff.days() >= 0
				? dateDiff.days() > 0  
					? 'future'
					: dateDiff.days() <= -1
						? 'past'
						: 'current'
				: null;

			createDay({ dayNumber: currDay, notInMonth: false, isToday, dayCategory })( attendanceVal );
		}

		for (let nextDay = 1; nextDay <= nextDays; nextDay++) {
			const attendanceVal = getDate( month, nextDay, year )( getAttendanceValue );

			createDay({ dayNumber: nextDay, notInMonth: true, dayCategory: 'future' })( attendanceVal );
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
	const subjectIds = React.useMemo(() => props?.data?.attendance?.map?.( attd => attd.subjectId ), [props]);

	return(
		<Dialog
			open={props?.open}
			onClose={props?.onClose}
			fullScreen={fullScreen}
		>
			<div className="w-[100%] max-w-[600px] min-w-[300px] h-[100%] max-h-[600px] min-h-[300px] p-5 d-flex flex-column justify-content-center align-items-center">
				{
					props?.data?.userData?.teachers?.map?.( teacher => {
						if(subjectIds.includes( teacher.subject.id )){
							return(
								<div key={uniqid()} className="shadow p-2 m-2 bg-[#a4a4a4] text-[white] rounded w-full h-fit d-flex flex-column justify-content-between align-items-center">
									<div className="w-100 d-flex flex-row justify-content-between align-items-center border-bottom">
										<p className="col-11 text-truncate">{ teacher.subject.name }</p>
										<div className="col-1 d-flex justify-content-center">
											<CheckCircleOutlineIcon sx={{ color: 'green' }}/>
										</div>
									</div>
									<div className="p-2 w-100">
										<p><b>Teacher: </b>{ teacher.lastName + ' ' + teacher.firstName }</p>
										<p><b>Start: </b>{ teacher.subject.start }</p>
										<p><b>End: </b>{ teacher.subject.end }</p>
									</div>
								</div>
							)
						}
						else{
							return(
								<div key={uniqid()} className="shadow p-2 m-2 bg-[#a4a4a4] text-[white] rounded w-full h-fit d-flex flex-column justify-content-between align-items-center">
									<div className="w-100 d-flex flex-row justify-content-between align-items-center border-bottom">
										<p className="col-11 text-truncate">{ teacher.subject.name }</p>
									</div>
									<div className="p-2 w-100">
										<p><b>Teacher: </b>{ teacher.lastName + ' ' + teacher.firstName }</p>
										<p><b>Start: </b>{ teacher.subject.start }</p>
										<p><b>End: </b>{ teacher.subject.end }</p>
									</div>
								</div>
							)
						}
					})
				}
				<div className="w-100 d-flex justify-content-end">				
					<Button onClick={props?.onClose}>
						close
					</Button>
				</div>				
			</div>
		</Dialog>
	);
}

const Day = ({ dayNumber, notInMonth, isToday, attendanceVal, dayCategory, onClick }) => {
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
						backgroundColor: isToday ? 'rgba(221, 189, 184, 0.5)' : 'rgba(0, 0, 0, 0.04)',
					}}
					onClick={onClick}
				>
					{ dayNumber }
				</IconButton>
			</div>
			<div className={`position-absolute w-100 h-100 d-flex ${ dayCategory === 'current' ? 'justify-content-center align-items-center' : 'justify-content-start align-items-start'}`}>
				{/*{
					attendanceVal > 1
						? attendanceVal === 100
							? <CheckIcon/>
							: <CircularProgress variant="determinate" value={attendanceVal}/>
						: null
				}*/}
				{

					dayCategory
						? dayCategory === 'past'
							? attendanceVal > 0 && attendanceVal < 100
								? <PriorityHighIcon/>
								: attendanceVal === 0
									? <CloseIcon/>
									: null
							: dayCategory === 'future'
								? null
								: <CircularProgress variant="determinate" value={attendanceVal}/>
						: null
				}
			</div>
		</div>
	);
}


export default Attendance;