import React from 'react';
import Axios from 'axios';
import uniqid from 'uniqid';
import Cookies from 'js-cookie';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useSnackbar } from 'notistack';
import { FixedSizeList as List } from 'react-window';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
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

import Autocomplete from '@mui/material/Autocomplete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCardIcon from '@mui/icons-material/AddCard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';

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

const requestHeader = {
  'headers': {
    'authorization': `Bearer ${Cookies.get('token')}`
  }
}

const AccountView = props => {
	const [semesterSwitch, setSemesterSwitch] = React.useState( [] );

	const [filter, setFilter] = React.useState( [] );
	const [filteredItems, setFilteredItems] = React.useState( [] );
	const [filterAnchorEl, setFilterAnchorEl] = React.useState( null );
	const [settingsAnchorEl, setSettingsAnchorEl] = React.useState( null );
	const [selectedFilter, setSelectedFilter] = React.useState( [] );
	const [filterIndexes, setFilterIndexes] = React.useState( {} );
	const [searchText, setSearchText] = React.useState( '' );
	const [section, setSection] = React.useState( null );
	const [strand, setStrand] = React.useState( null );

	const [openDialogForm, setOpenDialogForm] = React.useState( false );
	const [formType, setFormType] = React.useState( null );

	const { enqueueSnackbar } = useSnackbar();
	const filterOpen = Boolean( filterAnchorEl );
	const settingOpen = Boolean( settingsAnchorEl );

	const initState = {
		id: '',
		role: '',
		firstName: '',
		middleName: '',
		lastName: '',
		birthDate: '',
		section: props?.userType === 'student' ? '' : [],
		strand: props?.userType === 'student' ? '' : [],
		strandName: '',
		sectionName: {
			name: null,
			parent: null
		}
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
			},
			{
				name: '3rd Semester',
				isActive: activeSemester === 3,
				onSwitch: () => handleSwitchSemester( 3 )
			}
		];
	}

	const reducer = ( state, { type, payload }) => {
		switch( type ){
			case 'id':
				state.id = payload;
				return state;

			case 'role':
				state.role = payload;
				return state;

			case 'firstName':
				state.firstName = payload;
				return state;

			case 'middleName':
				state.middleName = payload;
				return state;

			case 'lastName':
				state.lastName = payload;
				return state;

			case 'birthDate':
				state.birthDate = payload;
				return state;

			case 'strand':
				state.strand = payload;
				return state;

			case 'section':
				state.section = payload;
				return state;

			case 'strandName':
				state.strandName = payload;
				return state;

			case 'sectionName':
				state.sectionName.name = payload;
				return state;

			case 'sectionParent':
				state.sectionName.parent = payload;
				return state;

			case 'clear':
				return { ...initState };

			default:
				return state;
		}
	}

	const [state, dispatch] = React.useReducer( reducer, initState );

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
		Axios.put(`${window.API_BASE_ADDRESS}/master/activate/semester/${semesterNumber}`, null, requestHeader)
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

	const handleDialogFormClose = fn => {
		dispatch({ type: 'clear' });
		setOpenDialogForm( false );
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
					tempStrands.push( ...props.filter[findChildrenIndexOf( sctn, props.filter )].name );
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

	const handleSectionAndStrandChanges = ( type, value ) => {
		dispatch({ type: type, payload: value });

		type === 'section' 
			? setSection(() => value )
			: setStrand(() => value );
	}

	const addFormGenerator = type => {
		const idLabel = type === 'student' ? 'Student' : 'Employee';
		const infoMessageFor = type;

		// const memoizedFieldsGenerator = React.useCallback(, [ state ]);
		const generateFields = () => [
			<IconField 
				Icon={KeyIcon} 
				key={uniqid()} 
				label={`${idLabel} ID`}
				onChange={e => dispatch({ type: 'id', payload: e.target.value })}
			/>,
			<IconField 
				Icon={DriveFileRenameOutlineIcon} 
				key={uniqid()} 
				label="First name"
				onChange={e => dispatch({ type: 'firstName', payload: e.target.value })}
			/>,
			<IconField 
				Icon={DriveFileRenameOutlineIcon} 
				key={uniqid()} 
				label="Middle name"
				onChange={e => dispatch({ type: 'middleName', payload: e.target.value })}
			/>,
			<IconField 
				Icon={DriveFileRenameOutlineIcon} 
				key={uniqid()} 
				label="Last name"
				onChange={e => dispatch({ type: 'lastName', payload: e.target.value })}
			/>,
			<IconField 
				Icon={CakeIcon} 
				key={uniqid()} 
				label="Birth-date" 
				type="date"
				onChange={e => dispatch({ type: 'birthDate', payload: e.target.value })}
			/>,
			<IconAutocomplete 
				defaultValue={section}
				multiple={type !== 'student' ? true : false}
				key={uniqid()}
				list={memoizedSectionGenerator()}
				Icon={CreditCardIcon}
				label="Section"
				placeholder="Add section"
				onChange={(_, newValue) => handleSectionAndStrandChanges( 'section', newValue )}
			/>,
			<IconAutocomplete 
				defaultValue={strand}
				multiple={type !== 'student' ? true : false}
				key={uniqid()}
				list={memoizedStrandGenerator()}
				Icon={StoreIcon}
				label="Strand"
				placeholder="Add strand"
				onChange={(_, newValue) => handleSectionAndStrandChanges( 'strand', newValue )}
			/>
		];

		const handleAddStudent = () => {
			Axios.post(`${window.API_BASE_ADDRESS}/master/add/type/student`,  
				{
					studentNo: state.id,
					firstName: state.firstName,
					middleName: state.middleName,
					lastName: state.lastName,
					birthDate: state.birthDate,
					section: state.section,
					strand: state.strand
				},
				requestHeader
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
			Axios.post(`${window.API_BASE_ADDRESS}/master/add/type/teacher`,  
				{
					employeeNo: state.id,
					firstName: state.firstName,
					middleName: state.middleName,
					lastName: state.lastName,
					birthDate: state.birthDate,
					section: state.section,
					strand: state.strand
				},
				requestHeader
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
					name: state.strandName,
				},
				requestHeader
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
				{ ...state.sectionName },
				requestHeader
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

		switch( type ){
			case 'student':
				return {
					formTitle: 'Add a Student',
					infoMessage: `Adding a ${infoMessageFor} requires you to fill all fields`,
					content: generateFields(),
					onProcess: handleAddStudent
				};

			case 'teacher':
				return {
					formTitle: 'Add a Teacher',
					infoMessage: `Adding a ${infoMessageFor} requires you to fill all fields`,
					content: generateFields()
				};

			case 'section':
				return {
					formTitle: 'Add a Section',
					infoMessage: `Adding a ${infoMessageFor} requires you to fill this field`,
					content: [
						<IconField 
							key={uniqid()} 
							label="Section name"
							Icon={DriveFileRenameOutlineIcon} 
							onChange={e => dispatch({ type: 'sectionName', payload: e.target.value })}
						/>,
						<IconAutocomplete 
							key={uniqid()}
							list={props?.filter?.map?.( fltr => fltr.name ) ?? []}
							Icon={StoreIcon}
							label="Member of Strand"
							placeholder="Strand"
							onChange={(_, newValue) => dispatch({ type: 'sectionParent', payload: newValue })}
						/>					],
					onProcess: handleAddSection
				};	

			case 'strand':
				return {
					formTitle: 'Add a Strand',
					infoMessage: `Adding a ${infoMessageFor} requires you to fill this field`,
					content: [
						<IconField 
							key={uniqid()} 
							label="Section strand"
							Icon={DriveFileRenameOutlineIcon} 
							onChange={e => dispatch({ type: 'strandName', payload: e.target.value })}
						/>
					],
					onProcess: handleAddStrand
				};			

			default:
				return;
		}
	}


	const Row = React.useCallback(({ index, style }) => {
			const index1 = index;
			const keys = Object.keys(filteredItems[ index1 ]);

			return( 
				<div 
					id={uniqid()} 
					style={{...style, backgroundColor: index % 2 === 0 ? 'white' : '#f6f6f6'}} 
					className="account-view-item px-4 d-flex justify-content-between align-items-center"
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
									{ filteredItems[ index1 ][ key ] }
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

	React.useEffect(() => memoizedFiltering(), [props?.items, selectedFilter, searchText]);
	React.useEffect(() => getSemesters(), []);

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
					{
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
					}
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
									<ListItemButton onClick={() => handleFilterExpand( index )}>
										<Checkbox checked={selectedFilter.includes( fltr.name )} onChange={() => handleSelectFilter( fltr.name )}/>
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
										          		<ListItemButton key={uniqid()} sx={{ pl: 4 }}>
															<Checkbox onChange={() => handleSelectFilter( sctn )}/>
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

						{/*{
							props?.filter?.map(({ name, isSectionName }, index ) => (
								isSectionName
									? <Divider 
										key={uniqid()} 
										textAlign="left" 
										sx={{ color: 'var( --text-color )' }}
									>
										{ name }
									</Divider>
									: <MenuItem key={uniqid()} onClick={() => handleSelectFilter( name )}>
										<FormGroup>
											<FormControlLabel 
												control={
													<Checkbox 
														size="small" 
														checked={selectedFilter.includes( name )}
														onChange={() => handleSelectFilter( name )}
													/>
												} 
												label={name}
											/>
										</FormGroup>
									</MenuItem> 
							))
						}*/}
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
				close={() => handleDialogFormClose()}
				{ ...addFormGenerator( formType ) }
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
				{ ...params } 
				fullWidth
				sx={{ width: 500 }}
				label={type === 'date' ? '' : label} 
				variant="standard" 
				type={type ?? 'text'} 
				helperText={type === 'date' ? label : ''}
	            placeholder={placeholder ?? ''}
	            onChange={onChange}
			/>
		</Box>
	);
}

const IconAutocomplete = ({ list, multiple, Icon, label, placeholder, defaultValue, onChange }) => {
	return(
		<Autocomplete
			value={defaultValue}
			multiple={multiple}
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

const reformatText = text => typeof text === 'string' ? text?.toLowerCase()?.replaceAll?.(' ', '') : text;


export default AccountView;