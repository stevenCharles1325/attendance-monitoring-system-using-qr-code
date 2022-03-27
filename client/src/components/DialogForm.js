import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const DialogForm = props => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const handleFormProcess = fn => {
		props?.onProcess?.();
		return fn;
	}

	return(
		<Dialog 
			fullWidth={props?.fullWidth}
			open={props?.open} 
			maxWidth="md"
			onClose={props?.close}
			fullScreen={fullScreen}
		>
	        {
	        	props?.titleOn
	        		? <DialogTitle>{ props?.formTitle ?? '' }</DialogTitle>
	        		: null
	        }
	        <DialogContent>
	        	{
	        		props?.contextTextOn
	        			? <DialogContentText>
							{ props?.infoMessage ?? '' }
						</DialogContentText>
						: null
	        	}
				{ props?.content }
		    </DialogContent>
	        <DialogActions>
				<Button onClick={props?.close}>{ props?.closeLabel ?? 'Cancel' }</Button>
				{
					props?.processBtnOff
						? null
						: <Button onClick={() => handleFormProcess(props?.close)}>Process</Button>
				}
	        </DialogActions>
		</Dialog>
	);
}

export default DialogForm;