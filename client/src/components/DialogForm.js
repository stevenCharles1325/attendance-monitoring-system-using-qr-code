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

	const handleFormProcess = fn1 => fn2 => {
		fn1?.();
		return fn2;
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
				{ props?.children }
		    </DialogContent>
	        <DialogActions>
				<Button onClick={props?.close}>{ props?.closeLabel ?? 'Cancel' }</Button>
				{
					props?.processBtnOff
						? null
						: <Button onClick={() => handleFormProcess( props?.onProcess )( props?.close )()}>Process</Button>
				}
				{
					props?.onDelete
						? <Button 
							onClick={() => {
								let isConfirmed = window.confirm('Are you sure you want to delete this user?');

								if( isConfirmed ) return handleFormProcess( props?.onDelete )( props?.close )();

								return;
							}}
							>
								Delete
							</Button>
						: null 
				}
	        </DialogActions>
		</Dialog>
	);
}

export default DialogForm;