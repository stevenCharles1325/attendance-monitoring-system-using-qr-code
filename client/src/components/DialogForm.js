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
			open={props?.open} 
			onClose={props?.close}
			fullScreen={fullScreen}
		>
	        <DialogTitle>{ props?.formTitle ?? '' }</DialogTitle>
	        <DialogContent>
				<DialogContentText>
					{ props?.infoMessage ?? '' }
				</DialogContentText>
				{ props?.fields }
		    </DialogContent>
	        <DialogActions>
				<Button onClick={props?.close}>Cancel</Button>
				<Button onClick={() => handleFormProcess(props?.close)}>Process</Button>
	        </DialogActions>
		</Dialog>
	);
}

export default DialogForm;