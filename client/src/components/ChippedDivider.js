import React from 'react';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

export default function ChippedDivider({ label, aligment, variant }){
	return(
		<Root>
			<Divider textAlign={aligment}>
				<Chip label={label} variant={variant}/>
			</Divider>
		</Root>
	);
}