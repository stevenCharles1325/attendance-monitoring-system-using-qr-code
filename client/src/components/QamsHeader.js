import React from 'react';

import Clock from './Clock';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const Header = props => {
	return(
		<>
			<div style={{ width: '100%' }} className="p-0 my-4">
				<Divider textAlign="left">
					<Typography variant="h6" sx={{ color: 'var(--text-color)' }}>
						{ props.title }
					</Typography>
				</Divider>
			</div>
		</>
	);
}

export default Header;