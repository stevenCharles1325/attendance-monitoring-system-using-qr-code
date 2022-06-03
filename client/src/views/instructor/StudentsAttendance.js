import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import uniqid from 'uniqid';

import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// Animation
import Grow from '@mui/material/Grow';

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

		const initAttRecord = (fullName, id) => ({
			fullName,
			weekAttendance: [ 0, 0, 0, 0, 0, 0 ],
			lateCount: 0,
			absentCount: 0,
			remark: <Remarks id={id}/>
		});

		const getDay = date => new Date( date ).toString().split(' ')[ 0 ];

		attendance.forEach( attndc => {
			const studentNo = attndc.studentNo;
			const isStudentInList = studentList[ studentNo ];


			if( isStudentInList ){
				const dayIndex = days[getDay( attndc.date )];
				const isAbsent = attndc.remark === 'absent';
				const isLate = attndc.remark === 'late';

				studentList[ studentNo ].weekAttendance[ dayIndex ] = 1;
				if( isLate ){
					studentList[ studentNo ].lateCount += 1;
				}
				else if( isAbsent ){
					studentList[ studentNo ].absentCount += 1;
				}
			}
			else{
				studentList[ studentNo ] = initAttRecord( attndc.fullName, studentNo );

				const dayIndex = days[getDay( attndc.date )];
				const isAbsent = attndc.remark === 'absent';
				const isLate = attndc.remark === 'late';

				studentList[ studentNo ].weekAttendance[ dayIndex ] = 1;
				if( isLate ){
					studentList[ studentNo ].lateCount += 1;
				}
				else if( isAbsent ){
					studentList[ studentNo ].absentCount += 1;
				}
			}
		});

		Object.values( studentList )
			.forEach( item => {
				const temp = [];

				temp.push( item.fullName );
				temp.push( ...item.weekAttendance );
				temp.push( item.lateCount );
				temp.push( item.absentCount );
				temp.push( item.remark );

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

	// React.useEffect(() => {

	// }, [attendance]);

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
			<div className="col-3 text-center text-truncate">{ props?.data?.[ 9 ] }</div>
		</div>
	);
}


const Remarks = props => {
	const [numberRemark, setNumberRemark] = React.useState( 0 );
	const title = [
		'No Longer in School',
		'Transferred In/Out',
		'Shifting In/Out',
	];
	const [text, setText] = React.useState( '' );
	const data = React.useMemo(() => ({
		category: numberRemark,
		content: text
	}), [text, numberRemark]);

	const label = React.useMemo(() => ['reason', 'name of school', 'track/strand/program'], []);

	const handleClear = () => {
		setNumberRemark( 0 );
		setText( '' );
	}

	const handleChange = React.useCallback(() => {
		Axios.put(`${window.API_BASE_ADDRESS}/master/student/remark/${props?.id}`, data, window.requestHeader)
		.catch( err => {
			throw err;
		})
	}, [data, props]);

	const handleReset = React.useCallback(() => {
		Axios.put(`${window.API_BASE_ADDRESS}/master/student/remark/${props?.id}`, 
			{
				category: 0,
				content: null
			}, 
			window.requestHeader)
		.catch( err => {
			throw err;
		})

		handleClear();
	}, [props]);

	const handleStudentRemark = () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/get-student/remark/${props?.id}`, window.requestHeader)
		.then( res => {
			const { category, content } = res.data;

			setNumberRemark( category ?? 0 );
			setText( content ?? '' );
		})
		.catch( err => {
			throw err;
		})
	}

	React.useEffect(() => handleStudentRemark(), []);

	return(
		<div className="w-full h-[60px] d-flex align-items-center transition-all">
			<div className="w-full d-flex justify-content-center align-items-center transition-all">
				{
					[ 1, 2, 3 ].map(( num, index ) => (
						<div key={uniqid()} className={`transition-all ${numberRemark === 0 || numberRemark === index + 1 ? 'd-unset' : 'hidden'}`}>
							<Tooltip title={title[ index ]} arrow>
								<IconButton 
									style={{ backgroundColor: '#377fc8' }}
									className="w-[40px] h-[40px] text-white mx-2" 
									onClick={() => setNumberRemark( index + 1 )}
								>
									<p className="m-0 text-[15px]">{ num }</p>
								</IconButton>
							</Tooltip>
						</div>
					))
				}
				<div className={`${numberRemark === 0 ? 'hidden' : 'd-unset px-2'} overflow-hidden transition-all`}>
					<FormControl sx={{ m: 1, width: '90%' }} variant="standard">
						<InputLabel htmlFor="standard-adornment-password">{ label[ numberRemark - 1 ] }</InputLabel>
						<Input
							onBlur={() => props?.onChange?.( text )}
							value={text}
							size="small"
							onBlur={handleChange}
							onChange={e => setText( e.target.value )}
							endAdornment={
								<InputAdornment position="end">
									<div className="bg-white">
										<IconButton
											onClick={handleClear}
										>
											<ChangeCircleIcon/>
										</IconButton>
										<IconButton
											onClick={handleReset}
										>
											<HighlightOffIcon/>
										</IconButton>
									</div>
								</InputAdornment>
							}
						/>
					</FormControl>
				</div>
			</div>

			{/*<TextField
				label=""
				onChange={() => null}
			/>*/}
		</div>
	);
}

export default StudentsAttendance;