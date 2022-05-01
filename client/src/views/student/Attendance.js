import React from 'react';
import Axios from 'axios';
import uniqid from 'uniqid';

import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
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
]

const Attendance = props => {
	const [date, setDate] = React.useState( new Date() );	
	const [month, setMonth] = React.useState( null );
	const [calDate, setCalDate] = React.useState( null );
	const [days, setDays] = React.useState( null );

	React.useEffect(() => {
		setMonth( date.getMonth() );
		setCalDate( date.toDateString() );
		renderDate();
	}, []);

	const renderDate = () => {
		const tempDays = [];

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

		const createDay = (dayNumber, notInMonth = false, isToday = false) => ( attendanceVal = 0 ) =>{
			tempDays.push(
				<Day
					key={uniqid()}
					notInMonth={notInMonth}
					isToday={isToday}
					dayNumber={dayNumber}
					attendanceVal={attendanceVal}
				/>
			);
		}

		for (let prevDay = firstDayIndex; prevDay > 0; prevDay--) {
			createDay( prevLastDay - prevDay + 1 , true )();
		}

		for (let currDay = 1; currDay <= lastDay; currDay++) {
			const isToday = currDay === new Date().getDate() && date.getMonth() === new Date().getMonth();

			createDay( currDay, false, isToday )( 80 );
		}

		for (let nextDay = 1; nextDay <= nextDays; nextDay++) {
			createDay( nextDay, true )();
		}

		setDays([ ...tempDays ]);
	}

	const updateDate = () => {
		setMonth(() => date.getMonth());
		setCalDate(() => date.toDateString());
		renderDate();
	}

	const handleDateIncrease = () => {
		date.setMonth( date.getMonth() + 1 );
		updateDate();
	}
	
	const handleDateDecrease = () => {
		date.setMonth( date.getMonth() - 1 );
		updateDate();
	}

	return(
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
						<p style={{ color: 'var( --text-color )'}}>{ calDate }</p>
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
	);
}

const Day = ({ dayNumber, notInMonth, isToday, attendanceVal }) => {
	return (
		<div className={`position-relative attendance-box-day border d-flex justify-content-center align-items-center ${ notInMonth ? 'attendance-box-past-next-day' : null } ${isToday ? 'attendance-box-day-today' : null}`}>
			{ dayNumber }
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