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

import Autocomplete from '@mui/material/Autocomplete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCardIcon from '@mui/icons-material/AddCard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StoreIcon from '@mui/icons-material/Store';

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

const AccountView = props => {
	const initState = {
		id: '',
		role: '',
		firstName: '',
		middleName: '',
		lastName: '',
		birthDate: '',
		section: [],
		strand: [],
		strandName: '',
		sectionName: ''
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

			case 'section':
				state.section = [ ...state.section, payload ];
				return state;

			case 'strand':
				state.strand = [ ...state.strand, payload ];
				return state;

			case 'strandName':
				state.strandName = payload;
				return state;

			case 'sectionName':
				state.sectionName = payload;
				return state;

			case 'clear':
				return { ...initState };

			default:
				return state;
		}
	}

	const [state, dispatch] = React.useReducer( reducer, initState );

	const [filteredItems, setFilteredItems] = React.useState( [] );
	const [anchorEl, setAnchorEl] = React.useState( null );
	const [selectedFilter, setSelectedFilter] = React.useState( [] );
	const [searchText, setSearchText] = React.useState( '' );

	const [openDialogForm, setOpenDialogForm] = React.useState( false );
	const [formType, setFormType] = React.useState( null );

	const { enqueueSnackbar } = useSnackbar();
	const filterOpen = Boolean( anchorEl );

	const handleFilterOpen = e => {
		setAnchorEl( e.currentTarget );
	}

	const handleFilterClose = () => {
		setAnchorEl( null );
	}

	const handleSelectFilter = text => {
		if(selectedFilter.includes( text )){
			setSelectedFilter( selectedFilter => selectedFilter.filter( filter => filter !== text ));
		}
		else{
			setSelectedFilter( selectedFilter => [ ...selectedFilter, text ]);
		}
	}

	const handleUserAddFormType = type => fn => {
		setFormType( type );

		return fn;
	}

	const handleDialogFormClose = fn => {
		dispatch({ type: 'clear' });
		setOpenDialogForm( false );
	}

	const addFormGenerator = type => {
		const idLabel = type === 'student' ? 'Student' : 'Employee';
		const infoMessageFor = type;

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
				multiple={type !== 'student' ? true : false}
				key={uniqid()}
				list={props?.sections ?? []}
				Icon={CreditCardIcon}
				label="Section"
				placeholder="Add section"
				onChange={(_, newValue) => dispatch({ type: 'section', payload: newValue })}
			/>,
			<IconAutocomplete 
				multiple={type !== 'student' ? true : false}
				key={uniqid()}
				list={props?.strands ?? []}
				Icon={StoreIcon}
				label="Strand"
				placeholder="Add strand"
				onChange={(_, newValue) => dispatch({ type: 'strand', payload: newValue })}
			/>
		];

		const requestHeader = {
			'headers': {
				'authorization': `Bearer ${Cookies.get('token')}`
			}
		}

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
				props?.refresh?.();
			})
			.catch( err => {
				enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error', preventDuplicate: true });
			});

			handleDialogFormClose();
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
				props?.refresh?.();
			})
			.catch( err => {
				enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error', preventDuplicate: true });
			});

			handleDialogFormClose();
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
				props?.refresh?.();
			})
			.catch( err => {
				enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error', preventDuplicate: true });
			});

			handleDialogFormClose();
		}

		const handleAddSection = () => {
			Axios.post(`${window.API_BASE_ADDRESS}/master/add/type/section`,  
				{
					name: state.sectionName,
				},
				requestHeader
			)
			.then( res => {
				enqueueSnackbar( res.data.message, { variant: 'success', preventDuplicate: true });
				props?.refresh?.();
			})
			.catch( err => {
				enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error', preventDuplicate: true });
			});

			handleDialogFormClose();
		}

		switch( type ){
			case 'student':
				return {
					formTitle: 'Add a Student',
					infoMessage: `Adding a ${infoMessageFor} requires you to fill all fields`,
					fields: generateFields(),
					onProcess: handleAddStudent
				};

			case 'teacher':
				return {
					formTitle: 'Add a Teacher',
					infoMessage: `Adding a ${infoMessageFor} requires you to fill all fields`,
					fields: generateFields()
				};

			case 'section':
				return {
					formTitle: 'Add a Section',
					infoMessage: `Adding a ${infoMessageFor} requires you to fill this field`,
					fields: [
						<IconField 
							key={uniqid()} 
							label="Section name"
							Icon={DriveFileRenameOutlineIcon} 
							onChange={e => dispatch({ type: 'sectionName', payload: e.target.value })}
						/>
					],
					onProcess: handleAddSection
				};	

			case 'strand':
				return {
					formTitle: 'Add a Strand',
					infoMessage: `Adding a ${infoMessageFor} requires you to fill this field`,
					fields: [
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
				<div id={uniqid()} style={style} className="account-view-item px-4 d-flex justify-content-between align-items-center">
					{
						props?.renderItemsKey?.map?.(( key, index ) => (
							props?.statusSwitchOn && key === 'status'
								? <div key={uniqid()} className="qams-row col-sm d-flex justify-content-center text-capitalize"> 
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

	React.useEffect(() => {
		if( props?.items ){
			const tempFilteredItems = [];

			props?.items?.forEach?.(( item, index )=> {
				const keys = Object.keys(props?.items?.[ index ]);
	
				if(item[keys[ props?.searchIndex ?? 0 ]].toLowerCase().includes( searchText.toLowerCase() )){
					if( selectedFilter.length ){
						selectedFilter.forEach( filter => {
							if( item.section.includes( filter ) || item.strand.includes( filter )){
								tempFilteredItems.push( item );
							}
						})
					}
					else{
						tempFilteredItems.push( item );
					}
				}
			});

			setFilteredItems([ ...tempFilteredItems ]);
		}
	}, [props?.items, selectedFilter, searchText]);

	return(
		<div className="account-view border rounded d-flex flex-column">
			<div className="account-view-top-bar px-3 border-bottom d-flex justify-content-between align-items-center">
				<div className="col-3">
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
						<TextField 
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
			<Menu
				open={filterOpen}
				anchorEl={anchorEl}
				onClose={handleFilterClose}
				MenuListProps={{
					'aria-labelledby': 'filter-btn',
				}}
			>
				<Paper sx={{ width: 300, height: 'fit-content', maxHeight: 300, overflow: 'auto' }} elevation={0}>
					<MenuList dense>
						{
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
						}
					</MenuList>
				</Paper>
			</Menu>
			<DialogForm 
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
			multiple={multiple}
	        options={list.map( item => item.name )}
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


export default AccountView;