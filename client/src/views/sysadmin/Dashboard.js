import React from 'react';
import uniqid from 'uniqid';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

import Calendar from 'react-calendar';
import Clock from '../../components/Clock';
import DialogForm from '../../components/DialogForm';

import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

import 'react-calendar/dist/Calendar.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,	
  ArcElement
);

const requestHeader = {
  'headers': {
    'authorization': `Bearer ${Cookies.get('token')}`
  }
}

const Dashboard = props => {
	// const [settingOpen, setSettingOpen] = React.useState( false );
	// const [select, setSelect] = React.useState( null );
	// const [sections, setSections] = React.useState( [] );
	// const [tabIndex, setTabIndex] = React.useState( 0 );
	// const [schoolYears, setSchoolYears] = React.useState( [] );
	// const [schoolYearItems, setSchoolYearItems] = React.useState( [] );
	// const [searchText, setSearchText] = React.useState( '' );

	// const { enqueueSnackbar } = useSnackbar();

	// const syInitState = {
	// 	id: null,
	// 	from: 0,
	// 	to: 0,
	// 	involvedSections: []
	// }

	// const reducer = ( state, { type, payload }) => {
	// 	switch( type ){
	// 		case 'id':
	// 			state.id = payload;
	// 			return state;

	// 		case 'from':
	// 			state.from = payload;
	// 			return state;

	// 		case 'to':
	// 			state.to = payload;
	// 			return state;

	// 		case 'involvedSections':
	// 			state.involvedSections = [ ...payload ];
	// 			return state;

	// 		case 'clear':
	// 			return { ...syInitState };

	// 		default:
	// 			return state;
	// 	}
	// }

	// const initSemester = activeSemester => {
	// 	return [
	// 		{
	// 			name: '1st Semester',
	// 			isActive: activeSemester === 1,
	// 			onSwitch: () => handleSwitchSemester( 1 )
	// 		},
	// 		{
	// 			name: '2nd Semester',
	// 			isActive: activeSemester === 2,
	// 			onSwitch: () => handleSwitchSemester( 2 )
	// 		},
	// 		{
	// 			name: '3rd Semester',
	// 			isActive: activeSemester === 3,
	// 			onSwitch: () => handleSwitchSemester( 3 )
	// 		}
	// 	];
	// }
	// const [syState, dispatch] = React.useReducer( reducer, syInitState );

	// const [semesterSwitch, setSemesterSwitch] = React.useState( [] );

	

	// const handleSwitchSemester = semesterNumber => {
	// 	Axios.put(`${window.API_BASE_ADDRESS}/master/activate/semester/${semesterNumber}`, null, requestHeader)
	// 	.then(() => {
	// 		setSemesterSwitch(() => [ ...initSemester( semesterNumber ) ]);
	// 	})
	// 	.catch( err => {
	// 		enqueueSnackbar('Error while switching semester', { variant: 'error' });
	// 		console.error( err );
	// 	});
	// }

	// const handleTabChange = (_, index) => setTabIndex( index );
	
	// const handleSchoolYearChecker = sy => cb => {
	// 	if( sy.from <= 0 || sy.to <= 0 ){
	// 		return enqueueSnackbar('From and To must have a value from 1 and above', { variant: 'error', preventDuplicate: true });
	// 	}
	// 	else if( !sy.involvedSections.length ){
	// 		return enqueueSnackbar('Sections must have a value', { variant: 'error', preventDuplicate: true });
	// 	}
	// 	else if( sy.from > sy.to ){
	// 		return enqueueSnackbar('Incorrect format! From must be less-than To', { variant: 'error', preventDuplicate: true });
	// 	}
	// 	else if( sy.from === sy.to ){
	// 		return enqueueSnackbar('From and To must not be the same', { variant: 'error', preventDuplicate: true });
	// 	}
	// 	else{
	// 		return cb( sy );
	// 	}
	// }

	// const handleSchoolYearEdit = ({ _id, from, to, involvedSections }) => {
	// 	setSelect( _id );

	// 	dispatch({ type: 'id', payload: _id });
	// 	dispatch({ type: 'from', payload: from });
	// 	dispatch({ type: 'to', payload: to });
	// 	dispatch({ type: 'involvedSections', payload: involvedSections });
	// } 
	
	// const getSemesters = () => {
	// 	Axios.get(`${window.API_BASE_ADDRESS}/master/get-items/type/semester`)
	// 	.then( res => setSemesterSwitch([ ...initSemester( res.data.activeSemester ) ]))
	// 	.catch( err => {
	// 		enqueueSnackbar('Error while getting semester', { variant: 'error' });
	// 		console.error( err );
	// 	});
	// }

	// const getSections = async () => {
	// 	Axios.get(`${window.API_BASE_ADDRESS}/master/get-items/type/section`)
	// 	.then( res => {
	// 		setSections(() => [ ...res.data ]);			
	// 	})
	// 	.catch( err => {
	// 		console.error( err );
	// 	});
	// }

	// const getSchoolYears = async () => {
	// 	Axios.get(`${window.API_BASE_ADDRESS}/master/get-items/type/school-year`)
	// 	.then( res => {
	// 		setSchoolYears([ ...res.data ]);
	// 	})
	// 	.catch( err => {
	// 		console.error( err );
	// 	});
	// }

	// const handleAddSchoolYear = sy => {
	// 	delete sy.id;

	// 	Axios.post(`${window.API_BASE_ADDRESS}/master/add/type/school-year`, sy, requestHeader)
	// 	.then( res => {
	// 		getSchoolYears();
	// 		enqueueSnackbar( res.data.message, { variant: 'success' });
	// 	})
	// 	.catch( err => {
	// 		if( err?.response?.data?.message ){
	// 			enqueueSnackbar( err.response.data.message, { variant: 'error' });
	// 		}

	// 		console.error( err );
	// 	});

	// 	dispatch({ type: 'clear' });
	// }

	// const handleSaveSchoolYear = ({ id, from, to, involvedSections }) => {

	// 	Axios.post(`${window.API_BASE_ADDRESS}/master/edit/type/school-year/id/${id}`,
	// 	{ from, to, involvedSections }, requestHeader)
	// 	.then( res => {
	// 		getSchoolYears();
	// 		enqueueSnackbar( res.data.message, { variant: 'success' });
	// 	})
	// 	.catch( err => {
	// 		if( err?.response?.data?.message ){
	// 			enqueueSnackbar( err.response.data.message, { variant: 'error' });
	// 		}

	// 		console.error( err );
	// 	});

	// 	setSelect( null );
	// 	dispatch({ type: 'clear' });
	// }

	// const handleDeleteSchoolYear = id => {

	// 	Axios.delete(`${window.API_BASE_ADDRESS}/master/delete/type/school-year/id/${id}`, requestHeader)
	// 	.then( res => {
	// 		dispatch({ type: 'clear' });
	// 		setSelect( null );

	// 		getSchoolYears();
	// 		enqueueSnackbar( res.data.message, { variant: 'success' });
	// 	})
	// 	.catch( err => {
	// 		if( err?.response?.data?.message ){
	// 			enqueueSnackbar( err.response.data.message, { variant: 'error' });
	// 		}

	// 		console.error( err );
	// 	});
	// }

	// const SemesterTab = () => {
	// 	return(
	// 		<div 
	// 			style={{
	// 				width: '100%',
	// 			}}
	// 			className="sem-sy-tab d-flex flex-column justify-content-center align-items-center"
	// 		>
	// 			{
	// 				semesterSwitch.map( semSwitch => (
	// 					<div key={uniqid()} className="semester-tab-semester my-4 col-12 d-flex flex-row justify-content-start align-items-center">
	// 						<div className="col-6 text-center">
	// 							<b>{ semSwitch.name }</b>
	// 						</div>
	// 						<div style={{ width: '200px' }} className="semester-switch row">
	// 							<div className="col-3 d-flex justify-content-center align-items-center">
	// 								Off
	// 							</div>
	// 							<div className="col-5 d-flex justify-content-center align-items-center">
	// 								<Switch checked={semSwitch.isActive} onChange={semSwitch.onSwitch}/>
	// 							</div>
	// 							<div className="col-3 d-flex justify-content-center align-items-center">
	// 								On
	// 							</div>
	// 						</div>
	// 					</div>
	// 					))
	// 			}
	// 		</div>
	// 	);
	// }

	// const SchoolYearTab = () => {

	// 	return(
	// 		<div
	// 			style={{
	// 				width: '100%',
	// 			}}
	// 			className="sem-sy-tab row p-0 m-0"
	// 		>
	// 			<div className="sy-left-panel p-0 m-0 col-6 d-flex flex-column justify-content-center align-items-center">
	// 				<p style={{ color: 'rgba(0, 0, 0, 0.5)'}}>Maximum of 4 school-years</p>
	// 				<TextField 
	// 					defaultValue={syState.from}
	// 					sx={{ width: '60%' }} 
	// 					type="number" 
	// 					variant="standard" 
	// 					label="From" 
	// 					helperText="When will this school-year start?"
	// 					onChange={e => dispatch({ type: 'from', payload: e.target.value })}
	// 				/>
	// 				<br/>
	// 				<TextField 
	// 					defaultValue={syState.to}
	// 					sx={{ width: '60%' }} 
	// 					type="number" 
	// 					variant="standard" 
	// 					label="To" 
	// 					helperText="When will this school-year end?"
	// 					onChange={e => dispatch({ type: 'to', payload: e.target.value })}
	// 				/>
	// 				<br/>
	// 				<Autocomplete 
	// 					defaultValue={syState.involvedSections}
	// 					sx={{ width: '60%' }} 
	// 					multiple 
	// 					options={sections.map( sec => sec.name )} 
	// 					onChange={(_, values) => dispatch({ type: 'involvedSections', payload: values })}
	// 					renderInput={params => (
	// 						<TextField {...params} label="Select sections" variant="standard" helperText="Sections in this school-year"/>
	// 					)}
	// 				/>
	// 				<br/>
	// 				<br/>
	// 				<Button 
	// 					disabled={schoolYearItems.length === 4 && !select}
	// 					onClick={() => handleSchoolYearChecker( syState )( select ? handleSaveSchoolYear : handleAddSchoolYear )}
	// 					variant="outlined"
	// 				>
	// 					Process school-year
	// 				</Button>
	// 				<br/>
	// 			</div>
	// 			<div className="sy-right-panel col-6 p-0 m-0 row d-flex flex-column">
	// 				{/*<div style={{ height: '50px' }} className="col-12 d-flex justify-content-start align-items-center">
	// 					<Box sx={{ display: 'flex', alignItems: 'center' }}>
	// 						<SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
	// 						<TextField
	// 							defaultValue={searchText}
	// 							variant="standard"
	// 							onChange={e => setSearchText( e.target.value )}
	// 						/>
	// 					</Box>
	// 				</div>*/}
	// 				<div 
	// 					style={{
	// 						overflow: select ? 'hidden' : 'auto'
	// 					}} 
	// 					className="sy-item-panel row d-flex flex-grow-1 justify-content-center align-items-center"
	// 				>
	// 					{ schoolYearItems }
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// }

	// const TabSettings = props => {
	// 	return(
	// 			<div style={{ width: '100%', height: '100%' }}>
	// 				<div className="border-bottom">
	// 					<Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
	// 		        <Tab label="Semester Settings"/>
	// 		        <Tab label="School Year Settings"/>
	// 		      </Tabs>
	// 	      </div>
	// 	    	<div className="sem-sy-tabs">
	// 	    		{ [<SemesterTab/>, <SchoolYearTab/>][ tabIndex ] }
	// 	    	</div>  
	//       </div>
	// 	);
	// }

	// React.useEffect(() => {
	// 	getSections();
	// 	getSemesters();
	// 	getSchoolYears();
	// }, []);

	// React.useEffect(() => {
	// 	const filteredSchoolYears = searchText.length
	// 		? schoolYears.filter( sc => `${sc.from}-${sc.to}` === searchText.replaceAll(' ','') || sc.involvedSections.includes( searchText.toUpperCase() ))
	// 		: schoolYears;

	// 	setSchoolYearItems(filteredSchoolYears.map( sc => (
	// 		<div key={uniqid()} className={`sy-item col-10 m-2 p-3 border rounded shadow ${select === sc._id ? 'sy-selected-item' : ''}`}>
	// 			<h6>{ sc.from } - { sc.to }</h6>
	// 			<Divider/>
	// 			<p style={{ color: 'rgba(0, 0, 0, 0.4)'}}>Sections:</p>
	// 			<div style={{ height: '65%' }} className="d-flex flex-wrap flex-grow-1 overflow-auto">
	// 				{
	// 					sc.involvedSections.map( is => (
	// 							<Chip key={uniqid()} label={is} size="small" sx={{ color: 'var( --text-color )', margin: '3px'}}/>
	// 						))
	// 				}
	// 			</div>
	// 			{
	// 				!select
	// 					? <div className="sy-item-hover-btns">
	// 							<IconButton onClick={() => handleSchoolYearEdit( sc )}>
	// 								<EditIcon/>
	// 							</IconButton>

	// 							<IconButton onClick={() => handleDeleteSchoolYear( sc._id )}>
	// 								<DeleteIcon/>
	// 							</IconButton>
	// 						</div>
	// 					: null
	// 			}
	// 		</div>
	// 	)));
	// }, [searchText, schoolYears, select]);

	return(
		<div className="sysadmin-dashboard row d-flex justify-content-center align-items-center">
			<div className="px-5 d-flex justify-content-between align-items-center">
				<Clock/>
				{/*<IconButton onClick={() => setSettingOpen( true )}> 
					<AppRegistrationIcon/>
				</IconButton>*/}
			</div>
			<div style={{ width: '100%' }} className="p-0 m-0">
				<Divider textAlign="right">
					<Typography variant="h6" sx={{ color: 'var(--text-color)' }}>
						Dasboard
					</Typography>
				</Divider>
			</div>
			<div style={{ width: '100%'}} className="p-0 m-0 my-5 row ">
				<div className="p-0 m-0 my-3 col-lg-4 d-flex justify-content-center">
					<PieGraph/>
				</div>

				<div className="p-0 m-0 my-3 col-lg-4 d-flex justify-content-center">
					<BarGraph/>
				</div>

				<div className="p-0 m-0 my-3 col-lg-4 d-flex justify-content-center">
					<Calendar className="calendar" />			
				</div>
			</div>
			{/*<DialogForm 
				fullWidth
				processBtnOff
				closeLabel="close"
				open={settingOpen} 
				content={<TabSettings/>}
				close={() => setSettingOpen( false )}
			/>*/}
		</div>
	);
}


const PieGraph = props => {
	const data = {
	        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
	        datasets: [
	            {
	                label: `Annual Data`,
	                data: [1, 500, 300, 25, 300, 200, 200],
	                fill: false,
	                backgroundColor: ['rgb(100, 100, 100)', 'rgb(196, 196, 196)'],
	                borderColor: 'rgba(255, 255, 255, 0.5)'
	            }
	        ] 
		}

	return(
		<div className="graph-container pie border rounded p-3">
			<Pie
				data={data}
				width={400} 
				height={400} 
				options={{ maintainAspectRatio: false }}
			/>
		</div>
	);
}

const BarGraph = props => {
	const data = {
	        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
	        datasets: [
	            {
	                label: `Annual Data`,
	                data: [1, 500, 300, 25, 300, 200, 200],
	                fill: false,
	                backgroundColor: ['rgb(100, 100, 100)', 'rgb(196, 196, 196)'],
	                borderColor: 'rgba(255, 255, 255, 0.5)'
	            }
	        ] 
		}

	return (
		<div className="graph-container bar border rounded p-3">
			<Bar 
				data={data}
				width={400} 
				height={400} 
				options={{ maintainAspectRatio: false }}
			/>
		</div>
	);
}


export default Dashboard;