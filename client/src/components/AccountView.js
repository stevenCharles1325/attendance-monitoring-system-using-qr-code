import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import uniqid from 'uniqid';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';

import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCardIcon from '@mui/icons-material/AddCard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Badge from '@mui/material/Badge';

const AccountView = props => {
	const [filteredItems, setFilteredItems] = React.useState( [] );
	const [anchorEl, setAnchorEl] = React.useState( null );
	const [selectedFilter, setSelectedFilter] = React.useState( [] );
	const [searchText, setSearchText] = React.useState( '' );

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

	const Row = React.useCallback(({ index, style }) => (
			<div id={uniqid()} style={style} className="account-view-item px-4 d-flex justify-content-between align-items-center">
				{
					filteredItems[ index ]?.map(( content, index ) => (
						<h6 key={uniqid()} id={content} className="col-sm">
							{ content }
						</h6>
					))
				}
			</div>
		));

	React.useEffect(() => {
		if( props?.items ){
			const tempFilteredItems = [];

			props?.items?.forEach?.( item => {
				if(item[ props?.searchIndex ?? 0 ].includes( searchText )){
					if( selectedFilter.length ){
						selectedFilter.forEach( filter => {
							if( item.includes( filter ) ){
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
	}, [props, selectedFilter, searchText]);

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
						selectedFilter?.map(( filterName, index ) => (
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
									itemCount={props?.items?.length}
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
					<div className="account-view-add-user">
						<IconButton>
							<AddCircleOutlineIcon/>
						</IconButton>
					</div>
					<div className="account-view-add-section">
						<IconButton>
							<AddCardIcon/>
						</IconButton>
					</div>
					<div className="account-view-add-strand">
						<IconButton>
							<AddBusinessIcon/>
						</IconButton>
					</div>
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
				<Paper sx={{ width: 300, height: 300, maxHeight: 300, overflow: 'auto' }} elevation={0}>
					<MenuList dense>
						{
							props?.filter?.map(({text, isSectionName}, index ) => (
								isSectionName
									? <Divider 
										key={uniqid()} 
										textAlign="left" 
										sx={{ color: 'var( --text-color )' }}
									>
										{ text }
									</Divider>
									: <MenuItem key={uniqid()}>
										<FormGroup>
											<FormControlLabel 
												control={
													<Checkbox 
														size="small" 
														checked={selectedFilter.includes( text )}
														onChange={() => handleSelectFilter( text )}
													/>} 
												label={text}
											/>
										</FormGroup>
									</MenuItem> 
							))
						}
					</MenuList>
				</Paper>
			</Menu>
		</div>
	);
}

const AccountHeader = props => {
	return(
		props?.header
		? <div style={{ height: '100%' }} className="px-4 d-flex justify-content-between align-items-center">
			{
				props.header.map((content, index) => (
					<h5 key={uniqid()} className="col-sm" style={{ color: 'var(--text-color)'}}>{ content }</h5>
				))
			}
		</div>
		: null
	);
}


export default AccountView;