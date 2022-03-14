import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { handleUserId, handleUserPass, handleUserBday } from '../features/form/formSlice';

import Spacer from './Spacer';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { styled } from '@mui/styles';

const QamsButton = styled( Button )({
	backgroundColor: 'rgba(0, 0, 0, 0.6)',
	borderRadius: '24px',
	color: 'white',
	'&:hover': {
		backgroundColor: 'rgba(255, 0, 0, 0.4)'
	}
});


const Form = props => {
	const { userId, userPass, userBday } = useSelector( state => state.form );
	const dispatch = useDispatch();

	const handleSignin = () => {
		// In progress...
	}

	const handleSignup = () => {
		// In progress...
	}

	const handleVerification = () => {
		// In progress...
	}

	React.useEffect(() => console.log( userId ), [userId]);

	return(
		<div className="form">
			{
				props?.formType === 'signin' 
					? <SigninForm 
						userId={userId} 
						userPass={userPass} 
						userBday={userBday}
						handleUserId={e => dispatch(handleUserId({ payload: e.target.value }))}
						handleUserPass={e => dispatch(handleUserPass({ payload: e.target.value }))}
						handleUserBday={e => dispatch(handleUserBday({ payload: e.target.value }))}
					/> 
					: props?.formType === 'signup'
						? <SignupForm 
							userId={userId} 
							userPass={userPass} 
							userBday={userBday}
							handleUserId={e => dispatch(handleUserId({ payload: e.target.value }))}
							handleUserPass={e => dispatch(handleUserPass({ payload: e.target.value }))}
							handleUserBday={e => dispatch(handleUserBday({ payload: e.target.value }))}
						/>
						: <FormLoading/>
			}
		</div>
	);
}


const FormLoading = () => (
	<div 
		style={{ width: '100%', height: '100%' }}
		className="d-flex justify-content-center align-items-center"
	>
		<CircularProgress color="inherit"/>
	</div>
);


const SigninForm = props => {
	const { userId, userPass, handleUserId, handleUserPass } = props;

	return(
		<div className="form-sign-in d-flex flex-column justify-content-around align-items-center">
			<div 
				style={{ 
					width: 'fit-content', 
					borderLeft: '4px solid #D9B5B5',
				}} 
				className="text-center px-2"
			>
				<Typography variant="h2" color="var(--text-color)" component="div">
					Sign-in
				</Typography>
			</div>
			<div 
				style={{ height: '20%', color: 'white' }} 
				className="d-flex flex-column justify-content-between align-items-center"
			>
				<TextField
					defaultValue={userId}
					onChange={e => handleUserId( e )}
					sx={{ width: '90%' }} 
					label="Username" 
					variant="filled"
				/>
				<br/>
				<TextField 
					type="password"
					defaultValue={userPass}
					onChange={e => handleUserPass( e )}
					sx={{ width: '90%' }} 
					label="Password" 
					variant="filled"
				/>
			</div>
			<div 
				style={{ width: '100%' }}
				className="my-3 d-flex flex-row justify-content-around align-items-center"
			>			
				<QamsButton size="small" variant="contained">
					Sign-up
				</QamsButton>

				<QamsButton size="small" variant="contained">
					Sign-in
				</QamsButton>
			</div>		

			<div className="text-center">	
				<Typography variant="caption" color="inherit" component="div">
					Forgot password?
				</Typography>
			</div>	
		</div>
	);
}


// Signing-up users are prompted with a verification form first.
const SignupForm = props => {
	return(
		<div className="form-sign-up">

		</div>
	);
}

export default Form;