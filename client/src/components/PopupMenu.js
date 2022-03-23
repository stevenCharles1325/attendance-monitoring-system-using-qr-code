import React from 'react';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

const PopupMenu = props => {
	const open = Boolean( props?.anchorEl );

	return(
		<Menu
			open={open}
			anchorEl={props?.anchorEl}
			onClose={props?.onClose}
			MenuListProps={{
				'aria-labelledby': 'filter-btn',
			}}
			anchorOrigin={{
	          vertical: 'bottom',
	          horizontal: 'right',
	        }}
	        transformOrigin={{
	          vertical: 'top',
	          horizontal: 'right',
	        }}
		>
			<Paper sx={{ width: 300, height: 'fit-content', maxHeight: 300, overflow: 'auto' }} elevation={0}>
				<MenuList dense>
					{
						props?.menuItems?.map(({ icon, name, onClick }, index ) => (
							<MenuItem onClick={onClick}>
								<ListItemIcon>
									{ icon }
								</ListItemIcon>
								 <ListItemText>{ name }</ListItemText>
							</MenuItem>
						))
					}
				</MenuList>
			</Paper>
		</Menu>
	);
}

export default PopupMenu;