import React from 'react';
import uniqid from 'uniqid';
import Cookie from 'js-cookie';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Collapse from '@mui/material/Collapse';
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

import AccountCircle from '@mui/icons-material/AccountCircle';


const Menu = props => {
	const { userRole } = useSelector( state => state.form );

	const [drawer, setDrawer] = React.useState( false );
	const [dropDowns, setDropDowns] = React.useState( {} );
	const [active, setActive] = React.useState( Cookie.get('active-menu') ?? props?.items?.[ userRole ]?.[0]?.text );
	const location = useLocation();

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
		Cookie.set('active-menu', title);
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
		>	
			<div className="my-2 row col-12 d-flex justify-content-center align-items-center">
				<div className="col-3">
					<Avatar src="images/logo/cct-shs-logo.jpg"/>
				</div>
				<div className="col-8">
					<Typography variant="h6" gutterBottom>
						CCT SHS
					</Typography>
				</div>
			</div>
			<Divider/>
			<br/>
			<div className="my-2 col-12 d-flex flex-column">
				<div className="col-12 d-flex justify-content-center align-items-center">
					<Avatar sx={{ width: 100, height: 100, border: '4px solid rgba(0, 0, 0, 0.2)' }}/>
				</div>
				<br/>
				<div 
					className="col-12 d-flex justify-content-center align-items-center"
				>
					<h6>{ props?.username ?? 'User' }</h6>
				</div>
			</div>
			<br/>
			<Divider sx={{ margin: '5px' }} variant="inset"/>
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
		<div className="view-box d-flex flex-column">
			{
				location.pathname === '/app/gate'
					? null
					: (
						<div className="menu d-flex justify-content-start align-items-center">
							<Drawer
								anchor="left"
								open={drawer}
								onClose={toggleDrawer( false )}
							>
								{ list() }
							</Drawer>
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
								<IconButton>
									<PowerSettingsNew sx={{ color: 'white' }}/>
								</IconButton>
							</div>
						</div>
					)
			}
			<div className="view-content flex-grow-1">
				{ props?.children }
			</div>
		</div>
	);	
}

export default Menu;
