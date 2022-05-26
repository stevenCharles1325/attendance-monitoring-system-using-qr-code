import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import uniqid from 'uniqid';

import Pagination from '@mui/material/Pagination';

/*
	Attendance:
	{
		studentNo: <String>,
		firstName: <String>,
		middleName: <String>,
		lastName: <String>,
		attendance: <Array of Objects> :
			[
				{
					teacherId: <String>,
					subjectId: <String>,
					date: <Date>,
					remark: <String>
				}
			]
	}

*/

const days = {
	'Mon': 0,
	'Tue': 1,
	'Wed': 2,
	'Thu': 3,
	'Fri': 4,
	'Sat': 5,
};


const StudentsAttendance = props => {
	const [profDBID, setProfDBID] = React.useState( null );
	const [attendance, setAttendance] = React.useState( [] );
	const [page, setPage] = React.useState( 1 );

	const getTeacherStudentsAttendance = React.useCallback(() => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/teacher/${profDBID}/students/attendance`, window.requestHeader)
		.then( res => {
			setAttendance([ ...res.data ]);
		})
		.catch( err => {
			throw err;
		});
	}, [profDBID]);

	const getProfDBID = async () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/teacher/${Cookies.get('userId')}`, window.requestHeader)
		.then( res => {
			setProfDBID( res.data.id );
		})
		.catch( err => {
			throw err;
		});
	}

	const generateAttendance = React.useCallback(() => {
		const studentList = {};
		const flatList = [];

		const initAttRecord = fullName => ({
			fullName,
			weekAttendance: [ 0, 0, 0, 0, 0, 0 ],
			lateCount: 0,
			absentCount: 0
		});

		const getDay = date => new Date( date ).toString().split(' ')[ 0 ];

		attendance.forEach( attndc => {
			const studentNo = attndc.studentNo;
			const isStudentInList = studentList[ studentNo ];

			if( isStudentInList ){
				const dayIndex = days[getDay( attndc.date )];
				const isAbsent = attndc.remark === 'absent';
				const isLate = attndc.remark === 'late';

				if( isLate ){
					studentList[ studentNo ].weekAttendance[ dayIndex ] = 1;
					studentList[ studentNo ].lateCount += 1;
				}
				else if( isAbsent ){
					studentList[ studentNo ].absentCount += 1;
				}
			}
			else{
				studentList[ studentNo ] = initAttRecord( attndc.fullName );
			}
		});

		Object.values( studentList )
			.forEach( item => {
				const temp = [];

				temp.push( item.fullName );
				temp.push( ...item.weekAttendance );
				temp.push( item.lateCount );
				temp.push( item.absentCount );

				flatList.push( temp );
			});

		return flatList;
	}, [attendance]);

	React.useEffect(() => {
		getProfDBID();
	}, []);

	React.useEffect(() => {
		getTeacherStudentsAttendance();
	}, [profDBID]);

	React.useEffect(() => {

	}, [attendance]);

	return(
		<div className="w-full h-full bg-white overflow-auto">
			<div className="w-full min-w-[1000px] h-full d-flex flex-column">
				<div className="border-bottom shadow h-fit">
					<Row
						data={[
							'name',
							'm',
							't',
							'w',
							'th',
							'f',
							's',
							'absent',
							'tardy',
							'remarks',
						]}
					/>
				</div>
				<div className="flex-grow-1 overflow-auto">
					{
						generateAttendance().map( data => <Row key={uniqid()} data={data}/>)
					}
				</div>
				<div className="w-full h-[50px] shadow border-top d-flex justify-content-center align-items-center">
					<div className="w-fit h-fit">
						<Pagination count={attendance.length} page={page} onChange={(_, val) => setPage( val )}/>
					</div>
				</div>
			</div>
		</div>
	);	
}

const Row = props => {
	return(
		<div className='w-full d-flex justify-content-around align-items-center text-uppercase m-0 font-bold py-3'>
			<p className="col-3 text-center text-truncate">{ props?.data?.[ 0 ] }</p>
			<div className="col-3 text-center d-flex justify-content-around align-items-center">
				<p>{ props?.data?.[ 1 ] }</p>
				<p>{ props?.data?.[ 2 ] }</p>
				<p>{ props?.data?.[ 3 ] }</p>
				<p>{ props?.data?.[ 4 ] }</p>
				<p>{ props?.data?.[ 5 ] }</p>
				<p>{ props?.data?.[ 6 ] }</p>
			</div>
			<div className="col-3 d-flex justify-content-around align-items-center">
				<p>{ props?.data?.[ 7 ] }</p>
				<p>{ props?.data?.[ 8 ] }</p>
			</div>
			<p className="col-3 text-center text-truncate">{ props?.data?.[ 9 ] }</p>
		</div>
	);
}

export default StudentsAttendance;