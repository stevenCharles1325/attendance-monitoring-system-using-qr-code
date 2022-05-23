import React from 'react';
import uniqid from 'uniqid';
import Axios from 'axios';
import Cookies from 'js-cookie';
import debounce from 'lodash.debounce';

import { useSnackbar } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
import { 
	handleId, 
	handleRole,
	handleFirstName,
	handleMiddleName,
	handleLastName,
	handleBirthDate,
	handleSection,
	handleStrand,
	handleStrandName,
	handleSectionName,
	handleSectionParent,
	handleUserType,
	handleClear,
	handleLrn,
	handleEmail,
	handleGender,
	handleSubjects,
	handleTeachers,
	handleSchoolStartDate
} from '../../features/account/accountSlice';

import Calendar from 'react-calendar';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';

import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCardIcon from '@mui/icons-material/AddCard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';
import FemaleIcon from '@mui/icons-material/Female';
import NumbersIcon from '@mui/icons-material/Numbers';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import KeyIcon from '@mui/icons-material/Key';
import CakeIcon from '@mui/icons-material/Cake';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Card from '../../components/Card';
import QamsHeader from '../../components/QamsHeader';
import DialogForm from '../../components/DialogForm';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

import 'react-calendar/dist/Calendar.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,	
  ArcElement,
  PointElement,
  LineElement,
);

const filterer = createFilterOptions();
const genderOptions = [
	'I prefer not to say',
	'Male',
	'Female',
	'Non-binary',
	'Transgender',
	'Intersex',
];

const validEmailAddress = [
	'gmail.com',
	'citycollegeoftagaytay.edu.ph',
	// Add valid email address here
];

const Dashboard = props => {
	const [isCardDrawerOpen, setIsCardDrawerOpen] = React.useState( true );
	const [semesterSwitch, setSemesterSwitch] = React.useState( [] );
	const semester = React.useMemo(() => semesterSwitch?.reduce?.((prev, curr, index) => curr.isActive ? curr : prev, []), [semesterSwitch]);
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();


	// Form variables
	const [formType, setFormType] = React.useState( '' );
	const [formTitle, setFormTitle] = React.useState( '' );
	const [formMessage, setFormMessage] = React.useState( '' );
	const [formContent, setFormContent] = React.useState( null );
	const isFormOpen = React.useMemo(() => !!formContent, [formContent]);

	const initSemester = activeSemester => {
		return [
			{
				name: '1st Semester',
				isActive: activeSemester === 1,
				sem: 1,
				onSwitch: () => handleSwitchSemester( 1 )
			},
			{
				name: '2nd Semester',
				isActive: activeSemester === 2,
				sem: 2,
				onSwitch: () => handleSwitchSemester( 2 )
			}
		];
	}

	const getSemesters = () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/get-items/type/semester`)
		.then( res => setSemesterSwitch([ ...initSemester( res.data.activeSemester ) ]))
		.catch( err => {
			enqueueSnackbar('Error while getting semester', { variant: 'error' });
			console.error( err );
		});
	}

 	const handleSwitchSemester = semesterNumber => {
		Axios.put(`${window.API_BASE_ADDRESS}/master/activate/semester/${semesterNumber}`, null, window.requestHeader)
		.then(() => {
			setSemesterSwitch(() => [ ...initSemester( semesterNumber ) ]);
		})
		.catch( err => {
			enqueueSnackbar('Error while switching semester', { variant: 'error' });
			console.error( err );
		});
	}


	const handleFormContent = formContentType => {
		switch( formContentType ){
			case 'teacher':
				setFormTitle('Add a Teacher');
				setFormMessage('Please fill up the form to add a new Teacher');
				setFormContent(() => <PersonForm formType={formContentType} semester={semester} close={() => setFormContent( null )}/>);
				break;

			case 'student':
				setFormTitle('Add a Student');
				setFormMessage('Please fill up the form to add a new Student');
				setFormContent(() => <PersonForm formType={formContentType} semester={semester} close={() => setFormContent( null )}/>);
				break;

			case 'section':
				setFormTitle('Add a Section');
				setFormMessage('Please fill up the form to add a new Section');
				// setFormContent(<SectionForm/>);
				break;

			default:
				setFormContent( null );
				break;
		}
	}

	React.useEffect(() => {
		getSemesters();
	}, []);

	React.useEffect(() => {
		if( !isFormOpen ){
			dispatch(handleClear());
			setFormTitle( null );
			setFormMessage( null );
		}
	}, [isFormOpen]);


	return(
		<div className="sysadmin-dashboard row d-flex justify-content-center align-items-center">
			<Collapse collapsedSize="190px" in={isCardDrawerOpen}>
				<div className="d-flex flex-wrap">
 					<Card 
						title="Students"
						chipIcon={<AccessibilityIcon className="text-white"/>}
						description="Click this card to add students."
						buttonLabel="Add Students"
						onClick={() => handleFormContent('student')}
					/>
					<Card 
						title="Teachers"
						chipIcon={<AccessibilityIcon className="text-white"/>}
						description="Click this card to add teachers."
						buttonLabel="Add Teachers"
						onClick={() => handleFormContent('teacher')}
					/>
					<Card 
						title="Sections"
						chipIcon={<CreditCardIcon className="text-white"/>}
						description="Click this card to add Sections."
						buttonLabel="Add Sections"
						onClick={() => handleFormContent('section')}
					/>
					<Card 
						title="Semester"
						chipIcon={<DashboardIcon className="text-white"/>}
						description="Click to modify the active Semester."
						buttonLabel="Add Semester"
						buttonOff
					>
						{
							semesterSwitch.map( semSwitch => (
								<div key={uniqid()} className="semester-tab-semester my-4 col-12 d-flex flex-row justify-content-start align-items-center">
									<div className="col-6 text-center">
										<b>{ semSwitch.name }</b>
									</div>
									<div style={{ width: '200px' }} className="semester-switch row">
										<div className="col-3 d-flex justify-content-center align-items-center">
											Off
										</div>
										<div className="col-5 d-flex justify-content-center align-items-center">
											<Switch checked={semSwitch.isActive} onChange={semSwitch.onSwitch}/>
										</div>
										<div className="col-3 d-flex justify-content-center align-items-center">
											On
										</div>
									</div>
								</div>
								))
						}
					</Card>
				</div>
			</Collapse>
			<div className="d-flex justify-content-center align-items-center">
				<IconButton onClick={() => setIsCardDrawerOpen( isCardDrawerOpen => !isCardDrawerOpen )}>
					{
						isCardDrawerOpen
							? <ExpandLessIcon/>
							: <ExpandMoreIcon/>
					}
				</IconButton>
			</div>
			<div style={{ width: '100%'}} className="p-0 m-0 my-5 row">
				<div className="p-0 m-0 my-3 col-lg-4 d-flex justify-content-center">
					<LineGraph/>
				</div>

				<div className="p-0 m-0 my-3 col-lg-4 d-flex justify-content-center">
					<LineGraph/>
				</div>

				<div className="p-0 m-0 my-3 col-lg-4 d-flex justify-content-center">
					<Calendar className="calendar"/>			
				</div>
			</div>
 			<DialogForm
				titleOn
				contextTextOn
				open={isFormOpen} 
				formTitle={formTitle}
				infoMessage={formMessage}
				processBtnOff
				close={() => setFormContent( null )}
				// onProcess={()}
			>
				{ formContent }
			</DialogForm>
		</div>	
	);
}

const PersonForm = props => {
	const {
		id,
		role,
		firstName,
		middleName,
		lastName,
		birthDate,
		email,
		gender,
		lrn,
		section,
		strand,
		strandName,
		sectionName,
		schoolStartDate,
		userType,
		subjects,
		teachers
	} = useSelector( state => state.account );

	const [teacherList, setTeacherList] = React.useState( [] );
	const [strands, setStrands] = React.useState( [] );
	const [selectedSubjects, setSelectedSubjects] = React.useState( [] );
	const [selectedTeachers, setSelectedTeachers] = React.useState( [] );

	const idLabel = React.useMemo(() => props?.formType === 'student' ? 'Student' : 'Employee', [props]);
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();
	
	const isEmailValid = email => {
		for( let eadd of validEmailAddress ){
			const splittedEmail = email.split( '@' );

			if( splittedEmail.length > 2 ) return false;
			if( splittedEmail[ 0 ] === eadd ) return false;

			if( splittedEmail[ 1 ] === eadd ) return true;
		}

		return false;
	}

	// Getter functions
	const getStrand = async () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/get-items/type/strand`)
		.then( res => {
			console.log( res.data );
			setStrands(() => [ ...res.data ]);			
		})
		.catch( err => {
			console.error( err );
		});
	}

	const getTeachers = async() => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/get-users/type/teacher`)
		.then( res => {
			setTeacherList( res.data );
		})
		.catch( err => {
			throw err;
		});
	}

	// Setter functions
	const handleAddStudent = () => {
		if(!isEmailValid( email )) 
			return enqueueSnackbar('Email is invalid', { variant: 'error', preventDuplicate: true });

		if( !selectedTeachers?.length )
			return enqueueSnackbar('Teacher list is empty', { variant: 'error', preventDuplicate: true });

		Axios.post(`${window.API_BASE_ADDRESS}/master/add/type/student`,  
			{
				studentNo: id,
				firstName,
				middleName,
				lastName,
				birthDate,
				section,
				strand,
				lrn,
				email,
				gender,
				teachers: selectedTeachers,
				schoolStartDate: new Date( schoolStartDate ).toDateString()
			},
			window.requestHeader
		)
		.then( res => {
			enqueueSnackbar( res.data.message, { variant: 'success', preventDuplicate: true });

			props?.close?.();
		})
		.catch( err => {
			enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error', preventDuplicate: true });
		});
	}

	const handleAddTeacher = () => {
		if(!isEmailValid( email )) 
			return enqueueSnackbar('Email is invalid', { variant: 'error', preventDuplicate: true });

		if( !selectedSubjects.length ){
			return enqueueSnackbar('At least 1 subject is required', { variant: 'error', preventDuplicate: true });
		}

		Axios.post(`${window.API_BASE_ADDRESS}/master/add/type/teacher`,  
			{
				employeeNo: id,
				firstName,
				middleName,
				lastName,
				birthDate,
				section,
				strand,
				lrn,
				email,
				gender,
				subjects: selectedSubjects
			},
			window.requestHeader
		)
		.then( res => {
			enqueueSnackbar( res.data.message, { variant: 'success', preventDuplicate: true });

			props?.close?.();
		})
		.catch( err => {
			enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error', preventDuplicate: true });
		});
	}

	const findChildrenIndexOf = ( name, list, isChildren = false ) => {
		let returnedIndex = -1;

		if( !list || !list?.length || !name ) return returnedIndex;

		list.forEach(( item, index ) => {
			if( isChildren ){
				if( item.sections.includes( name ) ){
					returnedIndex = index;
					return;
				}
			}
			else{
				if( item.name === name ){
					returnedIndex = index;
					return;
				}
			}
		});

		return returnedIndex;
	}

	const generateSectionList = () => {
		if( !strands ) return [];

		if( strand instanceof Array ){
			const tempSections = [];

			if( strand.length ){
				strand.forEach( strnd => {
					tempSections.push( ...strands?.[findChildrenIndexOf( strnd, strands )]?.sections );
				});

				return tempSections;
			}
			else{
				return strands.map( fltr => fltr.sections ).reduce(( prev, curr ) => [ ...prev, ...curr ], []);
			}
		}
		else{
			return strand && strand?.length
				? strands?.[ findChildrenIndexOf( strand, strands ) ]?.sections ?? []
				: strands.map( fltr => fltr.sections ).reduce(( prev, curr ) => [ ...prev, ...curr ], []) ?? []
		}
	}

	const generateStrandList = () => {
		if( !strands ) return [];
		
		if( section instanceof Array ){
			const tempStrands = [];

			if( section.length ){
				section.forEach( sctn => {
					if( strands?.[findChildrenIndexOf( sctn, strands, true )]?.name )
						tempStrands.push( strands[findChildrenIndexOf( sctn, strands, true )].name );
				});

				return tempStrands;
			}
			else{
				return strands.map( fltr => fltr.name );
			}
		}
		else{
			return section && section?.length 
				? [ strands?.[ findChildrenIndexOf( section, strands, true ) ]?.name ] ?? [] 
				: strands.map( fltr => fltr.name ) ?? []
		}
	}

	const memoizedStrandGenerator = React.useCallback(() => generateStrandList(), [ section, strands ]);
	const memoizedSectionGenerator = React.useCallback(() => generateSectionList(), [ strand, strands ]);

	// React.useEffect(() => {
	// 	console.log( subjectsCntxt );
	// }, [subjectsCntxt])

	React.useEffect(() => {
		getStrand();
		getTeachers();
	}, []);

	React.useEffect(() => {
		console.log( selectedTeachers );
	}, [selectedTeachers]);

	return(
		<>
				<IconField 
					Icon={KeyIcon} 
					defaultValue={id}
					label={`${idLabel} ID`}
					onChange={e => dispatch(handleId( e.target.value ))}
				/>
				{
					props?.formType === 'student'
						? <IconField 
								Icon={NumbersIcon}
								defaultValue={lrn}
								label="LRN"
								onChange={e => dispatch(handleLrn( e.target.value ))}
							/>
						: null
				}
				<IconField 
					Icon={DriveFileRenameOutlineIcon} 
					defaultValue={firstName} 
					label="First name"
					onChange={e => dispatch(handleFirstName( e.target.value ))}
				/>
				<IconField 
					Icon={DriveFileRenameOutlineIcon} 
					defaultValue={middleName} 
					label="Middle name"
					onChange={e => dispatch(handleMiddleName( e.target.value ))}
				/>
				<IconField 
					Icon={DriveFileRenameOutlineIcon} 
					defaultValue={lastName} 
					label="Last name"
					onChange={e => dispatch(handleLastName( e.target.value ))}
				/>
				<IconField 
					Icon={AlternateEmailIcon} 
					defaultValue={email} 
					label="Email"
					type="email"
					onChange={e => dispatch(handleEmail( e.target.value ))}
				/>
				<IconField 
					Icon={CakeIcon} 
					defaultValue={birthDate} 
					label="Birth-date" 
					type="date"
					onChange={e => dispatch(handleBirthDate( e.target.value ))}
				/>
				{
					props?.formType === 'student'
						? <IconField 
								Icon={CalendarMonthIcon} 
								defaultValue={schoolStartDate} 
								label="School Starting Day" 
								type="date"
								onChange={e => dispatch(handleSchoolStartDate( e.target.value ))}
							/>
						: null
				}
				<Box sx={{ display: 'flex', alignItems: 'flex-end', margin: '30px 0 30px 0'}}>
					<FemaleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
					<Autocomplete
						value={gender}
						freeSolo
						selectOnFocus
						handleHomeEndKeys
						options={genderOptions}
						renderOption={(props, option) => <li {...props}>{ option }</li>}
						getOptionLabel={(option) => {
					        // Value selected with enter, right from the input
					        if( typeof option === 'string' ) {
					          return option;
					        }
					      	
					        // Add "xxx" option created dynamically
					        if( option.inputValue ) {
					          return option.inputValue;
					        }
					      
					        // Regular option
					        return option.title;
						}}
						filterOptions={(options, params) => {
					        const filtered = filterer(options, params);

					        const { inputValue } = params;

					        // console.log( options );
					        // Suggest the creation of a new value
					        const isExisting = options.some((option) => inputValue === option);
					        if (inputValue !== '' && !isExisting) {
										filtered.push( inputValue );
					        }

					        return filtered;
						}}
						renderInput={(params) => 
							<TextField 
								{...params} 
								label="Gender"
								placeholder="Select or Type Gender"
								variant="standard"
								fullWidth
								sx={{ width: 500 }}
							/>
						}
						onChange={(_, newValue) => {
							// console.log( newValue );
							if (typeof newValue === 'string') {
								dispatch(handleGender( newValue ));
							} else if (newValue && newValue.inputValue) {
								// Create a new value from the user input
								dispatch(handleGender( newValue.inputValue ));
							} else {
								// console.log( newValue );
								dispatch(handleGender( newValue ));
							}
						}}
					/>
				</Box>
				<IconAutocomplete 
					defaultValue={props?.formType === 'student' ? section : section ?? []}
					multiple={props?.formType !== 'student' ? true : false}
					list={memoizedSectionGenerator()}
					Icon={CreditCardIcon}
					label="Section"
					placeholder="Add section"
					onChange={(_, newValue) => dispatch(handleSection( newValue ))}
				/>
				<IconAutocomplete 
					defaultValue={props?.formType === 'student' ? strand : strand ?? []}
					multiple={props?.formType !== 'student' ? true : false}
					list={memoizedStrandGenerator()}
					Icon={StoreIcon}
					label="Strand"
					placeholder="Add strand"
					onChange={(_, newValue) => dispatch(handleStrand( newValue ))}
				/>
				{
					props?.formType === 'student'
						? <TeacherBox teachers={teacherList} onChange={setSelectedTeachers} semester={props?.semester}/>
						: <SubjectBox strand={strand} setInstructorSubject={setSelectedSubjects} semester={props?.semester}/>
				}
				<br/>
				<div className="col-12 d-flex justify-content-center align-items-center">
					<Button variant="outlined" onClick={props?.formType === 'student' ? handleAddStudent : handleAddTeacher}>
						Add { props?.formType }
					</Button>
				</div>
		</>
	);
}

const SubjectBox = props => {
	const [renderedSubjects, setRenderedSubjects] = React.useState( [] );
	const [subjects, setSubjects] = React.useState( [] );
	const [selected, setSelected] = React.useState( [] );

	const handleSubjectSetup = ( data, doRemove ) => {
		if( doRemove ){
			setSelected( selected => [ ...selected.filter( slctd => slctd.id !== data.id ) ]);
		}
		else{
			setSelected( slctd => {
				if(slctd.map(slctd => slctd.id ).includes( data.id )){
					return [ ...slctd?.filter?.( slctd2 => slctd2.id !== data.id ), data ]
				}
				else{
					return [ ...slctd, data ];
				}
			});
		}
	}

	const handleStrandSubjects = async () => {
		// Axios.get(
		// 	`${window.API_BASE_ADDRESS}/master/get-subject-from-strand/strands/${props?.strand?.join?.(',')}`, 
		// 	window.requestHeader
		// )
		// .then( res => setSubjects([ ...res.data ]))
		// .catch( err => {
		// 	throw err;
		// });
		const { semester } = props;
		const subjectsAccum = [];

		props?.strand?.forEach( strnd => {
			const currStrand = window.STRANDS[ strnd ];
			const isStrandExist = !!currStrand;	

			if( isStrandExist ){
				subjectsAccum.push( ...currStrand[ semester.sem ] );
			}
		});

		setSubjects([ ...subjectsAccum ]);
	}

	React.useEffect(() => {
		if( props?.strand?.length )
			handleStrandSubjects();
	}, [props?.strand]);

	const renderSubject = React.useCallback(( ) => {
		const tempRenderedSubjects = [];

		subjects.forEach(( subject, index ) => {
			tempRenderedSubjects.push(
				<Subject 
					key={uniqid()}
					subject={subject}
					onChange={handleSubjectSetup}
				/>
			);
		});

		setRenderedSubjects([ ...tempRenderedSubjects ]);
	}, [subjects]);

	// const memoizedUpdate = React.useCallback(() => {
	// 	props?.setInstructorSubject?.([ ...selected ]);
	// }, [selected]);
	React.useEffect(() => renderSubject(), [subjects]);	
	React.useEffect(() => {
		props?.setInstructorSubject?.([ ...selected ]);
	}, [selected]);
	
	// React.useEffect(() => {
	// 	return () => setSubjects( [] );
	// }, []);

	return(
		<div style={{ width: '100%', maxWidth: '530px', height: 'fit-content' }}>
			{
				subjects.length
					?	<>
							<Divider/>
							<br/>
							<h5>Subjects:</h5>
						</>
					: null
			}
			{ renderedSubjects }
		</div>
	);
} 

const Subject = ({ subject, onChange }) => {
	const [id, setId] = React.useState( uniqid() );
	const [start, setStart] = React.useState( '07:00' );
	const [end, setEnd] = React.useState( '18:00' );
	const [isSelected, setIsSelected] = React.useState( false );

	const data = React.useMemo(() => ({
		id,
		name: subject,
		start,
		end,
	}), [subject, start, end]);

	const handleOnClick = doSelect => {
		setIsSelected( doSelect );
	}

	React.useEffect(() => {
		onChange( data, !isSelected );
	}, [data, isSelected]);

	return(
		<div 
			className={`col-12 border ${isSelected ? 'border-success' : null} d-flex justify-content-between align-items-center p-3 my-2 rounded`}
		>
			<div className="col-6">
				<p>
					{ subject }
				</p>
			</div>
			<div className="col-4">
				<div className="mb-3">
					<TextField 
						disabled={!isSelected}
						type="time" 
						label="Start" 
						value={start}
						onChange={e => setStart( e.target.value )}
					/>
				</div>
				<div className="mt-3">
					<TextField 
						disabled={!isSelected}
						type="time" 
						label="End" 
						value={end}
						onChange={e => setEnd( e.target.value )}
					/>
				</div>
			</div>
			<div className="col-1">
				{
					!isSelected
						? <IconButton onClick={() => handleOnClick( true )}>
							<AddIcon/>
						</IconButton>
						: <IconButton onClick={() => handleOnClick( false )}>
							<DeleteIcon/>
						</IconButton>
				}
			</div>
		</div>
	);
}

const TeacherBox = props => {
	const [searchText, setSearchText] = React.useState( '' );
	const [searchedTeachers, setSearchedTeachers] = React.useState( [] );
	const [selectedTeachers, setSelectedTeachers] = React.useState( [] );

	const id = React.useMemo(() => uniqid(), []);
	// const [selectedSubjects, setSelectedSubjects] = React.useState( [] );

	const isNotTeachersEmpty = !!props?.teachers?.length;

	const checkIfSubjectAlreadyExist = id => {
		for( let teacher of selectedTeachers ){
			if( teacher.id === id )
				return true;
		}

		return false;
	}

	const checkIfSubjectMatched = ( subjects, searchTxt ) => {
		for( let subject of subjects ){
			if( subject.toLowerCase().includes( searchTxt.toLowerCase() ) )
				return true;
		}

		return false;
	}

	const handleSelectSubjectAndTeacher = ( id, teacher, subjectIndex ) => {
		const isSubjectAlreadySelected = checkIfSubjectAlreadyExist( id );
		// const isSubjectAlreadySelected = selectedSubjects.includes( teacher.subjects[ subjectIndex ].name );

		// console.log( isSubjectAlreadySelected );

		if( !isSubjectAlreadySelected /*&& !isSubjectAlreadySelected*/ ){
			setSelectedTeachers( selectedTeachers => 
				[ 
					...selectedTeachers, 
					{
						id,
						teacherId: teacher._id,
						subjectIndex
					}
				]);

			// setSelectedSubjects( selectedSubjects => [ ...selectedSubjects, teacher.subjects[ subjectIndex ].name ])
		}
		else{
			const filteredSelectedTeachers = selectedTeachers
				.filter( tchr => tchr.id !== id );

			// const filteredSelectedSubjects = selectedSubjects.filter( subjectName => subjectName !== teacher.subjects[ subjectIndex ].name )

			setSelectedTeachers([ ...filteredSelectedTeachers ]);
			// setSelectedSubjects([ ...filteredSelectedSubjects ]);
		}
	}

	// Searching
	React.useEffect(() => {
		const tempSearchedTeachers = [];

		props?.teachers?.forEach( teacher => {
			const { firstName, lastName, middleName, subjects } = teacher;
			const fullName = `${lastName}${firstName}${middleName}`.toLowerCase();

			const isFirstNameMatched = firstName.toLowerCase().includes( searchText );
			const isLastNameMatched = lastName.toLowerCase().includes( searchText );
			const isMiddleNameMatched = middleName.toLowerCase().includes( searchText );

			const isFullNameMatched = fullName.includes( searchText );
			const isSubjectMathced = checkIfSubjectMatched(teacher.subjects.map( subject => subject.name ), searchText);

			if( isFirstNameMatched || isLastNameMatched || 
				isMiddleNameMatched || isSubjectMathced ||
				isFullNameMatched
			 ){
				tempSearchedTeachers.push( teacher );
			}
		});

		setSearchedTeachers([ ...tempSearchedTeachers ]);
	}, [searchText, props]);

	const memoizedOnChangeHandler = React.useCallback(() => {
		const selectedTeacherWithProperSubjects = [];

		selectedTeachers?.forEach(({ teacherId, subjectIndex }) => {
			props.teachers.forEach(({ _id, firstName, lastName, middleName, subjects }) => {
				if( teacherId === _id ){
					selectedTeacherWithProperSubjects.push({
						teacherId,
						firstName,
						lastName,
						middleName,
						subject: subjects[ subjectIndex ]
					});
				}
			});
		});

		props?.onChange?.( selectedTeacherWithProperSubjects ); 
	}, [selectedTeachers]);

	const debouncedOnChangeHandler = debounce(memoizedOnChangeHandler, 500);

	React.useEffect(() => debouncedOnChangeHandler(), [selectedTeachers]);
	// React.useEffect(() => console.log( selectedTeachers ), [selectedTeachers]);

	return(
		<>
			<Divider/>
			<div className="mt-3 p-5 w-full max-w-[530px] h-fit border shadow">
				<h5>Teachers:</h5>
				<div className="w-full">
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
						<TextField 
							label=""
							variant="standard"
							value={searchText}
							onChange={e => setSearchText( e.target.value.toLowerCase() )}
						/>
					</Box>
					<br/>
					{ 
						searchedTeachers.map(( teacher, index ) => (
							<div key={uniqid()} style={{ color: 'var( --text-color )' }} className="w-full my-3 p-2 px-3 w-full h-fit border rounded">
								<p className="mb-2 text-capitalize"><b>{ `${teacher.lastName} ${teacher.firstName}` }</b></p>
								<Divider variant="middle"/>
								<p className="mt-2">subjects:</p>
								{
									teacher?.subjects?.map?.(( subject, index ) => (
										<CustomChip
											key={uniqid()}
											name={subject.name} 
											color={
												selectedTeachers
													.filter(({ teacherId }) => teacherId === teacher._id )
													.reduce(( prev, curr ) => [ ...prev, curr.subjectIndex ], [])
													.includes( index ) 
														? 'success' 
														: 'primary'
											}
											onClick={id => handleSelectSubjectAndTeacher( teacher._id + index, teacher, index )}
										/>
									))
								}
							</div>
						)) 
					}
				</div>
			</div>	
		</>
	);
}

const CustomChip = props => {
	return(
		<div className="m-1">
			<Chip 
				variant="outlined"
				label={props.name} 
				color={props.color}
				onClick={props?.onClick}
			/>
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
			<Bar
				data={data}
				width={400} 
				height={400} 
				options={{ maintainAspectRatio: false }}
			/>
		</div>
	);
}

const LineGraph = props => {
	const data = {
	        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
	        datasets: [
	            {
	                label: `Annual Data`,
	                data: [1, 500, 300, 25, 300, 200, 200],
	                fill: false,
	                backgroundColor: ['#f95555', '#3087ff'],
	            }
	        ] 
		}

	return (
		<div className="graph-container bar border rounded p-3">
			<Line
				data={data}
				options={{ maintainAspectRatio: false }}
			/>
		</div>
	);
}

const IconField = ({ Icon, label, type, onChange, params, placeholder, defaultValue }) => {
	return(
		<Box sx={{ display: 'flex', alignItems: 'flex-end', margin: '30px 0 30px 0'}}>
			<Icon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
			<TextField
				{...params}
				fullWidth
				sx={{ width: 500 }}
				label={type === 'date' ? '' : label} 
				variant="standard" 
				type={type ?? 'text'} 
				helperText={type === 'date' ? label : ''}
        placeholder={placeholder ?? ''}
        onChange={onChange}
				defaultValue={defaultValue}
			/>
		</Box>
	);
}


const IconAutocomplete = ({ list, multiple, Icon, label, placeholder, defaultValue, onChange, freeSolo }) => {
	return(
		<Autocomplete
			value={defaultValue}
			multiple={multiple}
			freeSolo={freeSolo ?? false}
			options={list}
			renderTags={(value, getTagProps) =>
				value.map((option, index) => (
					<Chip variant="outlined" label={option} {...getTagProps({ index })} />
				))
			}
			onChange={onChange}
			renderInput={(params) => (
				<IconField
				  params={params}
				  Icon={Icon}
				  label={label}
				  placeholder={placeholder}
				/>
			)}
	    />
	);
}

export default Dashboard;