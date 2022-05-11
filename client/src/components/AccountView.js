import React from 'react';
import Axios from 'axios';
import uniqid from 'uniqid';
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useSnackbar } from 'notistack';
import { FixedSizeList as List } from 'react-window';
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
	handleTeachers
} from '../features/account/accountSlice';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import MuiList from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';


import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch'
import Badge from '@mui/material/Badge';

import SearchIcon from '@mui/icons-material/Search';
import KeyIcon from '@mui/icons-material/Key';
import CakeIcon from '@mui/icons-material/Cake';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCardIcon from '@mui/icons-material/AddCard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';
import FemaleIcon from '@mui/icons-material/Female';
import NumbersIcon from '@mui/icons-material/Numbers';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Grow from '@mui/material/Grow';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import DialogForm from './DialogForm';

/*
	@param { boolean } statusSwitchOn
	@param { int } searchIndex
	@param { string } userType
	@param { array } header
	@param { array } filter
	@param { array } filter
	@param { array } item
*/

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


const AccountView = props => {
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
		userType,
		subjects,
		teachers
	} = useSelector( state => state.account );

	const [semesterSwitch, setSemesterSwitch] = React.useState( [] );

	const [filter, setFilter] = React.useState( [] );
	const [filteredItems, setFilteredItems] = React.useState( [] );
	const [filterAnchorEl, setFilterAnchorEl] = React.useState( null );
	const [settingsAnchorEl, setSettingsAnchorEl] = React.useState( null );
	const [selectedFilter, setSelectedFilter] = React.useState( [] );
	const [filterIndexes, setFilterIndexes] = React.useState( {} );
	const [searchText, setSearchText] = React.useState( '' );

	const [openDialogForm, setOpenDialogForm] = React.useState( false );
	const [formType, setFormType] = React.useState( null );

	const { enqueueSnackbar } = useSnackbar();
	const filterOpen = Boolean( filterAnchorEl );
	const settingOpen = Boolean( settingsAnchorEl );
	const dispatch = useDispatch();

	// form states
	const idLabel = props?.userType === 'student' ? 'Student' : 'Employee';
	const infoMessageFor = props?.userType;

	const [formTitle, setFormTitle] = React.useState( null );
	const [infoMessage, setInfoMessage] = React.useState( null );
	const [content, setContent] = React.useState( [] );
	const [instructorSubject, setInstructorSubject] = React.useState( [] );

	const [userData, setUserData] = React.useState( null );
	const isOpenProfileView = React.useMemo(() => !!userData, [ userData ]);
	const handleClearUserDataContent = () => setUserData( null );

	const [teacherList, setTeacherList] = React.useState( [] );
	const [selectedTeachers, setSelectedTeachers] = React.useState( [] );

	const handleGetTeachers = async() => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/get-users/type/teacher`)
		.then( res => {
			setTeacherList( res.data );
		})
		.catch( err => {
			throw err;
		});
	}

	const handleChangeSelectedTeacher = selected => {
		setSelectedTeachers([ ...selected ]);
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
		if( !props?.filter ) return [];

		if( strand instanceof Array ){
			const tempSections = [];

			if( strand.length ){
				strand.forEach( strnd => {
					tempSections.push( ...props.filter[findChildrenIndexOf( strnd, props.filter )].sections );
				});

				return tempSections;
			}
			else{
				return props.filter.map( fltr => fltr.sections ).reduce(( prev, curr ) => [ ...prev, ...curr ], []);
			}
		}
		else{
			return strand && strand?.length
				? props?.filter?.[ findChildrenIndexOf( strand, props.filter ) ]?.sections ?? []
				: props.filter.map( fltr => fltr.sections ).reduce(( prev, curr ) => [ ...prev, ...curr ], []) ?? []
		}
	}

	const generateStrandList = () => {
		if( !props?.filter ) return [];
		
		if( section instanceof Array ){
			const tempStrands = [];

			if( section.length ){
				section.forEach( sctn => {
					if( props?.filter?.[findChildrenIndexOf( sctn, props.filter, true )]?.name )
						tempStrands.push( props.filter[findChildrenIndexOf( sctn, props.filter, true )].name );
				});

				return tempStrands;
			}
			else{
				return props.filter.map( fltr => fltr.name );
			}
		}
		else{
			return section && section?.length 
				? [ props?.filter?.[ findChildrenIndexOf( section, props.filter, true ) ]?.name ] ?? [] 
				: props.filter.map( fltr => fltr.name ) ?? []
		}
	}

	const memoizedStrandGenerator = React.useCallback(() => generateStrandList(), [ section, props ]);
	const memoizedSectionGenerator = React.useCallback(() => generateSectionList(), [ strand, props ]);

	const isEmailValid = email => {
		for( let eadd of validEmailAddress ){
			const splittedEmail = email.split( '@' );

			if( splittedEmail.length > 2 ) return false;
			if( splittedEmail[ 0 ] === eadd ) return false;

			if( splittedEmail[ 1 ] === eadd ) return true;
		}

		return false;
	}

	const handleAddStudent = () => {
		if(!isEmailValid( email )) 
			return enqueueSnackbar('Email is invalid', { variant: 'error', preventDuplicate: true });

		if( !teachers?.length )
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
				teachers
			},
			window.requestHeader
		)
		.then( res => {
			enqueueSnackbar( res.data.message, { variant: 'success', preventDuplicate: true });
			handleDialogFormClose();

			props?.refresh?.();
		})
		.catch( err => {
			enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error', preventDuplicate: true });
		});
	}

	const handleAddTeacher = () => {
		if(!isEmailValid( email )) 
			return enqueueSnackbar('Email is invalid', { variant: 'error', preventDuplicate: true });

		if( !instructorSubject.length ){
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
				subjects: instructorSubject.map( sbjct => ({ name: sbjct.name, start: sbjct.start, end: sbjct.end }))
			},
			window.requestHeader
		)
		.then( res => {
			enqueueSnackbar( res.data.message, { variant: 'success', preventDuplicate: true });
			handleDialogFormClose();

			props?.refresh?.();
		})
		.catch( err => {
			enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error', preventDuplicate: true });
		});
	}

	const handleAddStrand = () => {
		Axios.post(`${window.API_BASE_ADDRESS}/master/add/type/strand`,  
			{
				name: strandName,
				subjects: subjects
			},
			window.requestHeader
		)
		.then( res => {
			enqueueSnackbar( res.data.message, { variant: 'success', preventDuplicate: true });
			handleDialogFormClose();

			props?.refresh?.();
		})
		.catch( err => {
			enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error', preventDuplicate: true });
		});
	}

	const handleAddSection = () => {
		Axios.post(`${window.API_BASE_ADDRESS}/master/add/type/section`,  
			{ ...sectionName },
			window.requestHeader
		)
		.then( res => {
			enqueueSnackbar( res.data.message, { variant: 'success', preventDuplicate: true });
			handleDialogFormClose();

			props?.refresh?.();
		})
		.catch( err => {
			enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error', preventDuplicate: true });
		});
	}

	const initSemester = activeSemester => {
		return [
			{
				name: '1st Semester',
				isActive: activeSemester === 1,
				onSwitch: () => handleSwitchSemester( 1 )
			},
			{
				name: '2nd Semester',
				isActive: activeSemester === 2,
				onSwitch: () => handleSwitchSemester( 2 )
			}
		];
	}

	const handleFilterExpand = index => {
		const tempFilter = filter;

		tempFilter[ index ].isOpen = !tempFilter[ index ].isOpen;
		setFilter([ ...tempFilter ]);
	}

	const getSemesters = () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/get-items/type/semester`)
		.then( res => setSemesterSwitch([ ...initSemester( res.data.activeSemester ) ]))
		.catch( err => {
			enqueueSnackbar('Error while getting semester', { variant: 'error' });
			console.error( err );
		});
	}

	const handleSettingsOpen = e => {
		setSettingsAnchorEl( e.currentTarget );
	}

	const handleSettingsClose = () => {
		setSettingsAnchorEl( null );
	}	

	const handleFilterOpen = e => {
		setFilterAnchorEl( e.currentTarget );
	}

	const handleFilterClose = () => {
		setFilterAnchorEl( null );
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

	const handleSelectFilter = text => {
		let tempSelectedFilter = [ ...selectedFilter ];

		if(tempSelectedFilter.includes( text )){
			tempSelectedFilter = [ ...tempSelectedFilter.filter( filter => filter !== text ) ];
		}
		else{
			tempSelectedFilter = [ ...tempSelectedFilter, text ];
		}

		tempSelectedFilter = Array.from( new Set( tempSelectedFilter ) );
		setSelectedFilter([ ...tempSelectedFilter ]);
	}

	const handleUserAddFormType = type => fn => {
		setFormType( type );

		return fn;
	}

	const handleDialogFormClose = () => {
		dispatch(handleClear());
		setOpenDialogForm( false );
	}

	const handleRowSwitch = async ( e, id ) => {
		const status = e.target.checked ? 'activated' : 'deactivated';

		Axios.put(`${window.API_BASE_ADDRESS}/master/user-status-switch/status/${status}/id/${id}`, null, window.requestHeader)
		.then(() => props?.refresh?.())
		.catch( err => {
			enqueueSnackbar( 
				err?.response?.data?.message ?? 'Please try again!',
				{ variant: 'error', preventDuplicate: true }
			);

			console.error( err );
		});
	}

	const Row = React.useCallback(({ index, style }) => {
			const index1 = index;
			const keys = Object.keys(filteredItems[ index1 ]);

			return( 
				<div 
					id={uniqid()} 
					style={{...style, backgroundColor: index % 2 === 0 ? 'white' : '#f6f6f6'}} 
					className="cursor-pointer account-view-item px-4 d-flex justify-content-between align-items-center"
					onDoubleClick={() => setUserData( filteredItems[ index1 ] )}
				>
					{
						props?.renderItemsKey?.map?.(( key, index ) => (
							props?.statusSwitchOn && key === 'status'
								? <div key={uniqid()}className="qams-row col-sm d-flex justify-content-center text-capitalize"> 
									<FormGroup>
										<FormControlLabel 
											control={
												<Switch 
													checked={
														filteredItems[ index1 ][ key ] === 'activated' 
															? true 
															: false
														}
													onChange={e => handleRowSwitch(e, filteredItems[ index1 ]._id)}
													size="small"
													color="default"
												/>
											} 
											label={filteredItems[ index1 ][ key ] === 'activated' ? 'active' : 'inactive'}
										/>
								    </FormGroup>
							    </div>
							    : <div 
							    	key={uniqid()} 
							    	id={filteredItems[ index1 ][ key ]} 
							    	className={`qams-row text-capitalize d-flex justify-content-${index === 0 ? 'start' : 'center'} col-sm`}
							    >
									{ 
										filteredItems[ index1 ][ key ] instanceof Array 
											? filteredItems[ index1 ][ key ].join(', ') 
											: filteredItems[ index1 ][ key ] 
									}
								</div>
						))
					}
				</div>
			)
		});

	const filtering = items => {
		const tempFilteredItems = [];
		const tempSelectedFilters = selectedFilter.map( reformatText );

		items?.forEach?.(( item, index ) => {
			const keys = Object.values(props?.items?.[ index ]).map( reformatText );

			for( let key of keys ){
				if( typeof key === 'string' ){
					if( !searchText.length || (searchText.length && key.includes(reformatText( searchText )))){
						if( tempSelectedFilters.length ){
							const applyFilter = () => {
								for( let section of item.section ){
									if( tempSelectedFilters.includes(reformatText( section )) ){
										tempFilteredItems.push( item );
										return;
									}
								}

								for( let strand of item.strand ){
									if( tempSelectedFilters.includes(reformatText( strand )) ){
										tempFilteredItems.push( item );
										return;
									}
								}
							}

							applyFilter();
						}
						else{
							tempFilteredItems.push( item );
							break;
						}

						break;
					}
				}
			}
		});

		setFilteredItems(() => [ ...tempFilteredItems ]);
	}

	const memoizedFiltering = React.useCallback(() => filtering( props?.items ), [ props?.items, selectedFilter, searchText ]);

	React.useEffect(() => {
		if( openDialogForm ){
			const personForm = [
				<IconField 
					Icon={KeyIcon} 
					key={uniqid()}
					defaultValue={id}
					label={`${idLabel} ID`}
					onChange={e => dispatch(handleId( e.target.value ))}
				/>,
				props?.userType === 'student'
					? <IconField 
							Icon={NumbersIcon}
							key={uniqid()}
							defaultValue={lrn}
							label="LRN"
							onChange={e => dispatch(handleLrn( e.target.value ))}
						/>
					: null,
				<IconField 
					Icon={DriveFileRenameOutlineIcon} 
					key={uniqid()}
					defaultValue={firstName} 
					label="First name"
					onChange={e => dispatch(handleFirstName( e.target.value ))}
				/>,
				<IconField 
					Icon={DriveFileRenameOutlineIcon} 
					key={uniqid()}
					defaultValue={middleName} 
					label="Middle name"
					onChange={e => dispatch(handleMiddleName( e.target.value ))}
				/>,
				<IconField 
					Icon={DriveFileRenameOutlineIcon} 
					key={uniqid()}
					defaultValue={lastName} 
					label="Last name"
					onChange={e => dispatch(handleLastName( e.target.value ))}
				/>,
				<IconField 
					Icon={AlternateEmailIcon} 
					key={uniqid()}
					defaultValue={email} 
					label="Email"
					type="email"
					onChange={e => dispatch(handleEmail( e.target.value ))}
				/>,
				<IconField 
					Icon={CakeIcon} 
					key={uniqid()}
					defaultValue={birthDate} 
					label="Birth-date" 
					type="date"
					onChange={e => dispatch(handleBirthDate( e.target.value ))}
				/>,
				<Box key={uniqid()} sx={{ display: 'flex', alignItems: 'flex-end', margin: '30px 0 30px 0'}}>
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
								console.log( newValue );
								dispatch(handleGender( newValue ));
							}
						}}
					/>
				</Box>,
				<IconAutocomplete 
					defaultValue={formType === 'student' ? section : section ?? []}
					multiple={formType !== 'student' ? true : false}
					key={uniqid()}
					list={memoizedSectionGenerator()}
					Icon={CreditCardIcon}
					label="Section"
					placeholder="Add section"
					onChange={(_, newValue) => dispatch(handleSection( newValue ))}
				/>,
				<IconAutocomplete 
					defaultValue={formType === 'student' ? strand : strand ?? []}
					multiple={formType !== 'student' ? true : false}
					key={uniqid()}
					list={memoizedStrandGenerator()}
					Icon={StoreIcon}
					label="Strand"
					placeholder="Add strand"
					onChange={(_, newValue) => dispatch(handleStrand( newValue ))}
				/>,
				formType === 'student'
					? <TeacherBox key={uniqid()} teachers={teacherList} onChange={handleChangeSelectedTeacher}/>
					: <SubjectBox key={uniqid()} strand={strand} setInstructorSubject={setInstructorSubject}/>
			];

			const sectionForm = [
				<IconField 
					key={uniqid()} 
					label="Section name"
					Icon={DriveFileRenameOutlineIcon} 
					onChange={e => dispatch(handleSectionName( e.target.value ))}
				/>,
				<IconAutocomplete 
					key={uniqid()}
					list={props?.filter?.map?.( fltr => fltr.name ) ?? []}
					Icon={StoreIcon}
					label="Member of Strand"
					placeholder="Strand"
					onChange={(_, newValue) => dispatch(handleSectionParent( newValue ))}
				/>
			];

			const strandForm = [
				<IconField 
					key={uniqid()} 
					label="Section strand"
					Icon={DriveFileRenameOutlineIcon} 
					onChange={e => dispatch(handleStrandName( e.target.value ))}
				/>,
				<IconAutocomplete 
					multiple={true}
					key={uniqid()}
					Icon={MenuBookIcon}
					freeSolo={true}
					list={[]}
					label="Subjects"
					placeholder="Add a subject"
					onChange={(_, newValue) => dispatch(handleSubjects(newValue.map( val => val.toUpperCase() )))}
				/>
			];

			setFormTitle( `Add a ${formType}` );
			setInfoMessage( `Adding a ${infoMessageFor} requires you to fill all fields` );
			setContent( 
				formType === 'section' 
					? sectionForm
					: formType === 'strand'
						? strandForm
						: personForm
			);
		}
		else{
			setFormTitle( null );
			setInfoMessage( null );
			setContent( [] );
		}
	}, [openDialogForm, formType, props, section, strand]);

	React.useEffect(() => {
		if( props?.filter?.length ){
			const tempFilterIndexes = {};

			const tempFilterKeys = props.filter.map(( fltr, index ) => {
				tempFilterIndexes[ fltr.name ] = index;
				fltr["isOpen"] = false;
				return fltr;
			});

			setFilterIndexes({ ...tempFilterIndexes });			
			setFilter([ ...tempFilterKeys ]);
		}
	}, [props.filter]);

	React.useEffect(() => {
		memoizedFiltering();
		if( props?.userType ){
			dispatch(handleUserType( props?.userType ));
		}
	}, [props, selectedFilter, searchText]);

	React.useEffect(() => {
		getSemesters();
		handleGetTeachers();
	}, []);

	React.useEffect(() => dispatch(handleTeachers([ ...selectedTeachers ])), [selectedTeachers]);
	React.useEffect(() => console.log( teachers ), [teachers]);

	return(
		<div className="account-view border rounded d-flex flex-column">
			<div className="account-view-top-bar px-3 border-bottom d-flex justify-content-between align-items-center">
				<div className="col-3">
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
						<TextField 
							label=""
							id="input-with-sx" 
							variant="standard"
							onChange={e => setSearchText( e.target.value )}
						/>
					</Box>
				</div>
				<div className="col-7 text-center d-flex" style={{ overflow: 'auto' }}>
					{
						selectedFilter?.map?.(( filterName, index ) => (
							<Chip 
								key={uniqid()} 
								label={filterName} 
								sx={{ margin: '0 5px 0 5px', color: 'var( --text-color )'}}
								onDelete={() => handleSelectFilter( filterName )}
							/>
						))
					}
				</div>
				<div className="col-2 d-flex justify-content-end">
					<IconButton	id="filter-btn" onClick={handleFilterOpen}>
						<FilterAltIcon/>
					</IconButton>
					{
					props?.semSettingsOn
						? <IconButton id="semswitch-btn" onClick={handleSettingsOpen}>
							<SettingsIcon/>
						</IconButton>
						: null
					}
				</div>
				
			</div>
			<div className="account-view-content-box flex-grow-1 d-flex flex-column">
				{/*All accounts go here*/}
				<div style={{ width: '100%', height: '50px'}} className="m-0 p-0 border-bottom shadow-sm">
					<AccountHeader header={props?.header}/>
				</div>
				<div style={{ width: '100%' }} className="flex-grow-1">
					<AutoSizer>
						{
							({ height, width }) => (
								<List
									height={height}
									width={width}
									itemSize={50}
									itemCount={filteredItems?.length}
								>
									{ Row }
								</List>
							)
						}
					</AutoSizer>
				</div>
			</div>
			<div className="account-view-bot-bar px-3 border-top d-flex justify-content-between align-items-center">
				<div className="col-3">
					<Badge badgeContent={filteredItems.length} showZero>
						<PersonOutlineIcon color="action"/>
					</Badge>
					{/*<h5 className="m-0 p-0">Total: { filteredItems.length }</h5>*/}
				</div>
				
				{/*<div className="col-7 d-flex justify-content-center">
					<Pagination count={11} siblingCount={0} variant="outlined" />
				</div>*/}
				
				<div className="col-5 d-flex justify-content-end">
					<ButtonGroup  size="small" sx={{ color: 'black' }}>
						<Button onClick={() => handleUserAddFormType( props?.userType )(setOpenDialogForm( true ))}>
							Add { props?.userType }
						</Button>

						<Button onClick={() => handleUserAddFormType( 'section' )(setOpenDialogForm( true ))}>
							Add Section
						</Button>

						<Button onClick={() => handleUserAddFormType( 'strand' )(setOpenDialogForm( true ))}>
							Add Strand
						</Button>
					</ButtonGroup>
					{/*{
						props?.addUserOn
							? <div className="account-view-add-user" onClick={() => handleUserAddFormType( props?.userType )(setOpenDialogForm( true ))}>
								<IconButton>
									<AddCircleOutlineIcon/>
								</IconButton>
							</div>
							: null
					}
					{
						props?.addSectionOn
							? <div className="account-view-add-section" onClick={() => handleUserAddFormType( 'section' )(setOpenDialogForm( true ))}>
								<IconButton>
									<AddCardIcon/>
								</IconButton>
							</div>
							: null
					}
					{
						props?.addStrandOn
							? <div className="account-view-add-strand" onClick={() => handleUserAddFormType( 'strand' )(setOpenDialogForm( true ))}>
								<IconButton>
									<AddBusinessIcon/>
								</IconButton>
							</div>
							: null
					}*/}
				</div>
			</div>

			{/*FILTER*/}
			<Menu
				open={filterOpen}
				anchorEl={filterAnchorEl}
				onClose={handleFilterClose}
				MenuListProps={{
					'aria-labelledby': 'filter-btn',
				}}
			>
				<Paper sx={{ width: 400, height: 'fit-content', maxHeight: 300, overflow: 'auto' }} elevation={0}>
					<MuiList sx={{ width: '100%', minWidth: '100%'}} dense>
						{
							filter?.map?.(( fltr, index ) => (
								<React.Fragment key={uniqid()}>
									<ListItemButton 
										onClick={() => fltr.sections.length ? handleFilterExpand( index ) : handleSelectFilter( fltr.name )}
									>
										<Checkbox 
											checked={selectedFilter.includes( fltr.name )} 
											onChange={() => handleSelectFilter( fltr.name )}
											onClick={e => e.stopPropagation()}
										/>
										<ListItemText primary={fltr.name}/>
										{
											fltr.sections.length
												? filter[ index ].isOpen ? <ExpandMore/> : <ExpandLess/>
												: null
										}
									</ListItemButton>
									{
										fltr.sections.length 
											? <Collapse in={filter[ index ].isOpen} timeout="auto" unmountOnExit>
										        <MuiList component="div" disablePadding>
										          {
										          	fltr?.sections?.map?.( sctn => (
										          		<ListItemButton 
										          			sx={{ backgroundColor: 'rgba(0, 0, 0, 0.4)'}}
										          			key={uniqid()} sx={{ pl: 4 }} 
										          			onClick={() => handleSelectFilter( sctn )}
										          		>
																		<Checkbox checked={selectedFilter.includes( sctn )} onChange={() => handleSelectFilter( sctn )}/>
												            <ListItemText primary={sctn}/>
																	</ListItemButton>
										          		))
										          }
										        </MuiList>
											</Collapse>
											: null
									}
								</React.Fragment>
								))
						}
					</MuiList>
				</Paper>
			</Menu>

			{/*SEMESTER SETTINGS*/}
			<Menu
				open={settingOpen}
				anchorEl={settingsAnchorEl}
				onClose={handleSettingsClose}
				MenuListProps={{
					'aria-labelledby': 'filter-btn',
				}}
			>
				<Paper 
					sx={{ 
						width: 400, 
						height: 'fit-content', 
						maxHeight: 300, 
						overflow: 'auto', 
						color: 'var( --text-color )'
					}} 
					elevation={0}
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
				</Paper>
			</Menu>

			<DialogForm 
				titleOn
				contextTextOn
				open={openDialogForm} 
				formTitle={formTitle}
				infoMessage={infoMessage}
				close={() => handleDialogFormClose()}
				onProcess={
					formType === 'section' 
						?  handleAddSection
						: formType === 'strand'
							? handleAddStrand
							: formType === 'student'
								? handleAddStudent
								: handleAddTeacher 
				}
			>
				{ content }
			</DialogForm>
			<ProfileView 
				userType={props?.userType} 
				open={isOpenProfileView} 
				onClose={handleClearUserDataContent} 
				profileData={userData}
			/>
		</div>
	);
}

const AccountHeader = props => {
	return(
		props?.header
		? <div style={{ height: '100%' }} className="px-4 d-flex justify-content-between align-items-center">
			{
				props.header.map((content, index) => (
					<div 
						key={uniqid()} 
						className={`d-flex justify-content-${index === 0 ? 'start' : 'center'} col-sm text-capitalize`} 
						style={{ color: 'var(--text-color)', fontWeight: 'bold'}}
					>
						{ content }
					</div>
				))
			}
		</div>
		: null
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


const SubjectBox = props => {
	const [renderedSubjects, setRenderedSubjects] = React.useState( [] );
	const [subjects, setSubjects] = React.useState( [] );
	const [selected, setSelected] = React.useState( [] );

	const handleAddSubject = ( name, index ) => {
		setSelected( selected => [ ...selected, { name, index, start: '07:00', end: '18:00' }]);
	}

	const handleRemoveSubject = ( name, index ) => {
		const tempSubjects = selected.filter( slctd => slctd.index !== index );
		setSelected([ ...tempSubjects ]);
	}

	const handleClock = ( value, index, isStart = true ) => {
		const tempSubjects = selected.map( slctd => {
			if( slctd.index === index ){
				if( isStart ){
					slctd.start = value.lenght ? '7:00' : value;
				}
				else{
					slctd.end = value.lenght ? '18:00' : value;
				}
			}

			return slctd;
		});

		setSelected(() => [ ...tempSubjects ]);
	}

	const handleStrandSubjects = async () => {
		Axios.get(
			`${window.API_BASE_ADDRESS}/master/get-subject-from-strand/strands/${props?.strand?.join?.(',')}`, 
			window.requestHeader
		)
		.then( res => setSubjects([ ...res.data ]))
		.catch( err => {
			throw err;
		});
	}

	React.useEffect(() => {
		if( props?.strand?.length )
			handleStrandSubjects();
	}, [props]);

	React.useEffect(() => {
		if( subjects?.length ){
			const tempRenderedSubjects = [];

			subjects.forEach(( subject, index ) => {
				tempRenderedSubjects.push(
					<div 
						key={uniqid()} 
						className={`col-12 border ${selected?.map?.( item => item?.index )?.includes?.( index ) ? 'border-success' : null} d-flex justify-content-between align-items-center p-3 my-2 rounded`}
					>
						<div className="col-6">
							<p>
								{ subject }
							</p>
						</div>
						<div className="col-4">
							<div className="mb-3">
								<TextField 
									disabled={!selected?.map?.( item => item?.index )?.includes?.( index )}
									type="time" 
									label="Start" 
									defaultValue={selected?.filter?.( slctd => slctd.index === index )?.[ 0 ]?.start ?? '07:00'}
									onChange={e => handleClock( e.target.value, index )}
								/>
							</div>
							<div className="mt-3">
								<TextField 
									disabled={!selected?.map?.( item => item?.index )?.includes?.( index )}
									type="time" 
									label="End" 
									defaultValue={selected?.filter?.( slctd => slctd.index === index )?.[ 0 ]?.end ?? '18:00'}
									onChange={e => handleClock( e.target.value, index, false )}
								/>
							</div>
						</div>
						<div className="col-1">
							{
								!selected?.map?.( item => item?.index )?.includes?.( index )
									? <IconButton onClick={() => handleAddSubject( subject, index )}>
										<AddIcon/>
									</IconButton>
									: <IconButton onClick={() => handleRemoveSubject( subject, index )}>
										<DeleteIcon/>
									</IconButton>
							}
						</div>
					</div>	
				);
			});

			setRenderedSubjects([ ...tempRenderedSubjects ]);
		}
	}, [subjects, selected]);

	React.useEffect(() => props?.setInstructorSubject?.([ ...selected ]), [selected]);

	return(
		<div style={{ width: '100%', maxWidth: '530px', height: 'fit-content' }}>
			{
				renderedSubjects.length
					? <>
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


const TeacherBox = props => {
	const [searchText, setSearchText] = React.useState( '' );
	const [searchedTeachers, setSearchedTeachers] = React.useState( [] );
	const [selectedTeachers, setSelectedTeachers] = React.useState( [] );
	// const [selectedSubjects, setSelectedSubjects] = React.useState( [] );

	const isNotTeachersEmpty = !!props?.teachers?.length;

	const checkIfSubjectAlreadyExist = (id, subjectIndex) => {
		for( let teacher of selectedTeachers ){
			if( teacher.teacherId === id && teacher.subjectIndex === subjectIndex )
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

	const handleSelectSubjectAndTeacher = (teacher, subjectIndex) => {
		const isSubjectAlreadySelected = checkIfSubjectAlreadyExist( teacher._id, subjectIndex );
		// const isSubjectAlreadySelected = selectedSubjects.includes( teacher.subjects[ subjectIndex ].name );

		// console.log( isSubjectAlreadySelected );

		if( !isSubjectAlreadySelected /*&& !isSubjectAlreadySelected*/ ){
			setSelectedTeachers( selectedTeachers => 
				[ 
					...selectedTeachers, 
					{
						teacherId: teacher._id,
						subjectIndex
					}
				]);

			// setSelectedSubjects( selectedSubjects => [ ...selectedSubjects, teacher.subjects[ subjectIndex ].name ])
		}
		else{
			const filteredSelectedTeachers = selectedTeachers
				.filter( tchr => 
					( tchr.teacherId !== teacher._id && tchr.subjectIndex === subjectIndex ) ||
					( tchr.teacherId === teacher._id && tchr.subjectIndex !== subjectIndex )
				);

			// const filteredSelectedSubjects = selectedSubjects.filter( subjectName => subjectName !== teacher.subjects[ subjectIndex ].name )

			setSelectedTeachers([ ...filteredSelectedTeachers ]);
			// setSelectedSubjects([ ...filteredSelectedSubjects ]);
		}
	}

	React.useEffect(() => {
		const tempSearchedTeachers = [];

		props?.teachers?.forEach( teacher => {
			const { firstName, lastName, middleName, subjects } = teacher;
			const fullName = `${lastName}${firstName}${middleName}`;

			const isFirstNameMatched = firstName.includes( searchText );
			const isLastNameMatched = lastName.includes( searchText );
			const isMiddleNameMatched = middleName.includes( searchText );

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

		selectedTeachers?.forEach(({ teacherId, subjectIndex}) => {
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
	}, [selectedTeachers, props]);

	const debouncedOnChangeHandler = debounce(memoizedOnChangeHandler, 500);

	React.useEffect(() => debouncedOnChangeHandler(), [selectedTeachers, props]);

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
							onChange={e => setSearchText( e.target.value )}
						/>
					</Box>
					<br/>
					{ 
						searchedTeachers.map((teacher, index) => (
							<div key={uniqid()} style={{ color: 'var( --text-color )'}} className="w-full my-3 p-2 px-3 w-full h-fit border rounded">
								<p className="mb-2 text-capitalize"><b>{ `${teacher.lastName} ${teacher.firstName}` }</b></p>
								<Divider variant="middle"/>
								<p className="mt-2">subjects:</p>
								{
									teacher?.subjects?.map?.(( subject, index ) => (
										<div key={uniqid()} className="m-1">
											<Chip 
												variant="outlined"
												label={subject.name} 
												color={
													selectedTeachers
														.filter(({ teacherId }) => teacherId === teacher._id )
														.reduce(( prev, curr ) => [ ...prev, curr.subjectIndex ], [])
														.includes( index ) 
															? 'success' 
															: 'primary'
												}
												onClick={() => handleSelectSubjectAndTeacher( teacher, index )}
											/>
										</div>
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

const ProfileView = props => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const { 
		_id,
		lrn,
		email,
		state,
		status,
		gender,
		strand,
		section,
		teachers,
		subjects,
		lastName,
		studentNo,
		employeeNo,
		firstName,
		middleName,
	} = React.useMemo(() => props?.profileData ?? {}, [ props ]);
	
	return(
		<Dialog fullScreen={fullScreen} open={props?.open} onClose={props?.onClose}>
			<Box sx={{ width: '100%', minWidth: '500px', height: '550px' }}>
				<div className="w-full h-full p-5 overflow-auto">
					<div className="w-full d-flex justify-content-center align-items-center">
						<Avatar sx={{ width: '100px', height: '100px' }}/>
					</div>
					<br/>
					<Divider variant="middle"/>
					<br/>
					<div className="border shadow p-5">
						{
							props?.userType === 'teacher'
								? <>
									<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">Employee No:</b> { employeeNo }</p>
								</>
								: <>
									<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">student No:</b> { studentNo }</p>
									<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">lrn:</b> { lrn }</p>
								</>
						}
					</div>
					<br/>
					<Divider variant="middle"/>
					<br/>
					<div className="border shadow p-5">
						<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">first name:</b> { firstName }</p>
						<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">last name:</b> { lastName }</p>
						<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">middle name:</b> { middleName }</p>
					</div>
					<br/>
					<Divider variant="middle"/>
					<br/>
					<div className="border shadow p-5">
						<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">email:</b> { email }</p>
						<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">gender:</b> { gender }</p>
						<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">strand:</b> { strand }</p>
						<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">section:</b> { section }</p>
						{
							props?.userType === 'teacher'
								? <div>
									<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">subjects:</b></p>
									 { 
									 	subjects?.map?.(({ name }) => (
									 		<div key={uniqid()} className="m-1">
										 		<Chip label={name}/>
									 		</div>
									 	)) 
									 }
								</div>
								: <div>
									<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">teachers:</b></p>
									 { 
									 	teachers?.map?.(({ firstName, lastName, middleName }) => (
									 		<div key={uniqid()} className="m-1">
										 		<Chip key={uniqid()} label={`${lastName} ${firstName} ${middleName ?? ''}`}/>
									 		</div>
									 	)) 
									 }
								</div>
						}
						
					</div>
					<br/>
					<Divider variant="middle"/>
					<br/>
					<div className="border shadow p-5">
						<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">state:</b> { state }</p>
						<p><b className="text-uppercase text-[#656565] mr-4 text-ellipsis">status:</b> { status }</p>
					</div>
					<br/>
					<Divider variant="middle"/>
					<br/>
					<div className="d-flex justify-content-end align-items-center">
						<Button onClick={props?.onClose}>Close</Button>
					</div>
				</div>
			</Box>
		</Dialog>
	);
}


const reformatText = text => typeof text === 'string' ? text?.toLowerCase()?.replaceAll?.(' ', '') : text;

export default AccountView;