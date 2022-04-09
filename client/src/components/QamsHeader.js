import React from 'react';

import Clock from './Clock';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const Header = props => {
	return(
		<>
			<div className="px-5 d-flex justify-content-between align-items-center">
				<Clock/>
			</div>
			<div style={{ width: '100%' }} className="p-0 m-0">
				<Divider textAlign="right">
					<Typography variant="h6" sx={{ color: 'var(--text-color)' }}>
						{ props.title }
					</Typography>
				</Divider>
			</div>
		</>
	);
}

export default Header;