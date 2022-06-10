import React from 'react';
import Axios from 'axios';
import uniqid from 'uniqid';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { handleNavigateTo } from '../features/navigation/navigationSlice';

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MenuOpen from '@mui/icons-material/MenuOpen';
import PowerSettingsNew from '@mui/icons-material/PowerSettingsNew';
import Grow from '@mui/material/Grow';

import AccountCircle from '@mui/icons-material/AccountCircle';
import Collapse from '@mui/material/Collapse';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import Profile from './Profile';
import ProfilePic from './ProfilePic';


const QamsMenu = props => {
	const { userRole } = useSelector( state => state.form );
	const navigateTo = useSelector( state => state.navigation.to );
	const dispatch = useDispatch();

	const [drawer, setDrawer] = React.useState( false );
	const [dropDowns, setDropDowns] = React.useState( {} );
	const [active, setActive] = React.useState( Cookies.get('active-menu') ?? props?.items?.[ userRole ]?.[0]?.text );
	const [isProfileOpen, setIsOpenProfile] = React.useState( false );
	const location = useLocation();

	const [accElement, setAccElement] = React.useState( null );
	const openAccMenu = Boolean( accElement );

	const handleAccMenuClick = event => {
		setAccElement( event.currentTarget );
	}

	const handleAccMenuClose = () => {
		setAccElement( null );
	}

	const handleLogOut = async () => {
		const token = Cookies.get('token');

		Axios.delete(`${window.API_BASE_ADDRESS}/master/sign-out/token/${token}`, window.requestHeader)
		.then(() => {
			Cookies.remove('token');
			Cookies.remove('rtoken');

			window.location.href = '/app/gate';
		})
		.catch( err => console.error( err ));
	}

	const handleOpenProfile = () => setIsOpenProfile( isProfileOpen => !isProfileOpen );

	const toggleDrawer = (open) => (event) => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setDrawer( open );
	};

	const handleCollapsableListClick = index => {
		let tempDropDowns = dropDowns;

		tempDropDowns[ index ] = !tempDropDowns[ index ];

		setDropDowns(() => ({ ...tempDropDowns }));
		tempDropDowns = null;
	}

	const isSelected = title => active === title 
		? { backgroundColor: 'rgba(0, 0, 0, 0.3)', color: 'white' } 
		: { backgroundColor: 'white', color: 'black' };

	const handleActiveItem = title => fn => () => {
		Cookies.set('active-menu', title);
		setActive( title );
		
		return fn?.();
	}	

	React.useEffect(() => {
		if( props?.items?.[ userRole ]?.length ){
			let tempDropDowns = {};

			props.items[ userRole ].forEach(({ collapsable }, index) => {
				if( collapsable	) tempDropDowns[ index ] = false;
			});

			setDropDowns(() => ({ ...tempDropDowns }));
			tempDropDowns = null;
		}

	}, [props?.items, userRole]);
 
	const list = () => (
		<Box
			sx={{ width: 250 }}
			role="presentation"
			onKeyDown={toggleDrawer( false )}
			className="transition-all"
		>	
			<div className="my-2 row col-12 d-flex justify-content-center align-items-center">
				<div className="col-3">
					<Avatar src="/images/logo/cct-shs-logo.jpg"/>
				</div>
				<div className="col-8">
					<Typography variant="h6" gutterBottom>
						CCT SHS
					</Typography>
				</div>
			</div>
			<Divider/>
			{
				!drawer
					?	<Grow in={!drawer} timeout={500}>
							<div>
								<br/>
								<div className="my-2 col-12 d-flex flex-column">
									<div className="col-12 d-flex justify-content-center align-items-center">
										<ProfilePic openBorder disabled width="100px" height="100px"/>
									</div>
									<br/>
									<div 
										className="col-12 d-flex justify-content-center align-items-center"
									>
										<h1 className="font-bold tracking-wide text-[#383735]">{ props?.username ?? 'User' }</h1>
									</div>
								</div>
								<br/>
								<Divider sx={{ margin: '5px' }} variant="inset"/>
							</div>
						</Grow>
					: null
			}
			<br/>
			<List>
				{props?.items?.[ userRole ]?.map?.(({ text, icon, onClick, collapsable, subList }, index) => (
					collapsable	=== true 
						? <React.Fragment key={uniqid()}>
							<ListItemButton onClick={() => handleCollapsableListClick( index )}>
								<ListItemIcon>
									{ icon }
								</ListItemIcon>
								<ListItemText primary={text} />
								{dropDowns[ index ] ? <ExpandLess /> : <ExpandMore />}
							</ListItemButton>
							<Collapse in={dropDowns[ index ]} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
									{ subList.map(({ text, icon, onClick }, index) => (
										<ListItemButton 
											key={uniqid()} 
											sx={{ pl: 4 }} 
											onClick={handleActiveItem( text )( onClick )}
											sx={isSelected( text )}
										>
											<ListItemIcon>
												{ icon }
											</ListItemIcon>
											<ListItemText primary={text} />
										</ListItemButton>
									))}
								</List>
							</Collapse>
						</React.Fragment>
						: <ListItem 
							button 
							key={uniqid()} 
							onClick={handleActiveItem( text )( onClick )} 
							sx={isSelected( text )}
						>
							<ListItemIcon>
								{ icon }
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
				))}
			</List>
		</Box>
	);
	
	return(
		<div className="menu-view d-flex flex-column">
			{
				location.pathname === props?.hideOn
					? null
					: (
						<div className="bg-black text-white w-full h-50px min-h-[50px] d-flex justify-content-center align-items-center">
							<div style={{ width: 'fit-content' }} className="mx-3">
								<IconButton onClick={() => setDrawer( !drawer )}>
									<MenuOpen sx={{ color: 'white' }}/>
								</IconButton>
							</div>
							<div className="col-5">
								<Typography variant="h6">
									{ props.title ?? 'menu' }
								</Typography>
							</div>
							<div style={{ width: '100%' }} className="mx-3 d-flex justify-content-end">
								<IconButton onClick={handleAccMenuClick}>
									<SettingsIcon sx={{ color: 'white' }}/>
								</IconButton>
							</div>
						</div>
					)
			}
			<div className="flex-grow-1 w-full h-[50px] d-flex position-relative">
				{
					location.pathname !== props?.hideOn
						?	<div className="menu-box w-fit bg-white shadow border">
								<Collapse in={!drawer} orientation="horizontal" collapsedSize={window.document.body.clientWidth > 400 ? "60px" : '0px'}>
									{ list() }
								</Collapse>
							</div>
						: null
				}
				<div className="flex-grow-1 overflow-hidden">
					{ props?.children }
				</div>
			</div>
			<Menu
				id="menu-account-menu"
				anchorEl={accElement}
				open={openAccMenu}
				onClose={handleAccMenuClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				<MenuItem onClick={handleOpenProfile}>Profile</MenuItem>
				<MenuItem onClick={handleLogOut}>Sign-out</MenuItem>
			</Menu>
			<Profile open={isProfileOpen} handleClose={handleOpenProfile}/>
		</div>
	);	
}

export default QamsMenu;
