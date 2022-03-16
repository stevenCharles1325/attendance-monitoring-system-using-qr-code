import React from 'react';
import Axios from 'axios';

import { 
	useSelector, 
	useDispatch 
} from 'react-redux';

import { 
	handleUserId, 
	handleUserPass, 
	handleUserBday,
	handleUserRole
} from '../features/form/formSlice';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

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

const steps = ['Verification', 'Create account'];
let stepCount = 0;

const Form = props => {
	const initMessage = { text: null, variant: null };

	const { 
		userId, 
		userPass, 
		userBday, 
		userRole 
	} = useSelector( state => state.form );
	// const [message, setMessage] = React.useState( initMessage );
	const [content, setContent] = React.useState( null );

	const dispatch = useDispatch();
	const handleSignin = () => {
		// In progress...
	}

	const handleSignup = () => {
		// In progress...
	}

	const handleVerification = async () => {
		try{
			const { role } = await Axios.post(`${window.API_BASE_ADDRESS}/verify/user/${userId}`) 
			dispatch(handleUserRole( role ));

			return 1;
		}
		catch( err ){
			return 0;
		}
		// return await Axios.post(`${window.API_BASE_ADDRESS}/verify/user/${userId}`)
		// .then( res => {
		// 	dispatch(handleUserRole( res.role ));
		// 	// setMessage({ text: res.message, variant: 'success' });

		// 	return 1;
		// })
		// .catch( err => {
		// 	// if( err?.response?.data?.message ){
		// 	// 	setMessage({ text: err.response.data.message, variant: 'error' });
		// 	// }
		// 	// else{
		// 	// 	setMessage({ text: 'Please try again!', variant: 'error' });
		// 	// }

		// 	return 0;
		// });
	}

	const signin = (
		<SigninForm 
			userId={userId} 
			userPass={userPass} 
			userBday={userBday}
			userRole={userRole}
			handleUserId={e => dispatch(handleUserId( e.target.value ))}
			handleUserPass={e => dispatch(handleUserPass( e.target.value ))}
			handleUserBday={e => dispatch(handleUserBday( e.target.value ))}
			setFormType={val => props?.setFormType?.( val )}
		/> 
	);

	const signup = (
		<SignupForm 
			userId={userId} 
			userPass={userPass} 
			userBday={userBday}
			userRole={userRole}
			handleUserId={e => dispatch(handleUserId( e.target.value ))}
			handleUserPass={e => dispatch(handleUserPass( e.target.value ))}
			handleUserBday={e => dispatch(handleUserBday( e.target.value ))}
			handleVerification={() => handleVerification()}
			setFormType={val => props?.setFormType?.( val )}
		/>
	);	

	// React.useEffect(() => {
	// 	if( message.text ) setTimeout(() => setMessage( initMessage ), 10000);
	// }, [message]);

	React.useEffect(() => {
		if( props?.formType === 'signin' ){
			setTimeout(() => setContent( signin ), 1000);	
		}
		else if( props?.formType === 'signup' ){
			setTimeout(() => setContent( signup ), 1000);	
		}

		setContent( <FormLoading/> );
	}, [props?.formType]);


	return(
		<div className="form">
			{ content }
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
				<QamsButton size="small" variant="contained" onClick={() => props?.setFormType?.( 'signup' )}>
					Sign-up
				</QamsButton>

				<QamsButton size="small" variant="contained">
					Sign-in
				</QamsButton>
			</div>		

			{/*<div className="text-center">	
				<Typography variant="caption" color="inherit" component="div">
					Forgot password?
				</Typography>
			</div>	*/}
		</div>
	);
}


// Signing-up users are prompted with a verification form first.
const SignupForm = props => {
	const { userId, userPass, handleUserId, handleUserPass } = props;
	const [content, setContent] = React.useState( null );
	const [activeStep, setActiveStep] = React.useState( 0 );

	const [isApproved, setIsApproved] = React.useState( false );

	const TrueSignup = () => (
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
	);

	const Verification = () => (
		<div 
			style={{ height: '20%', color: 'white' }} 
			className="d-flex flex-column justify-content-between align-items-center"
		>
			<TextField
				defaultValue={userId}
				onChange={e => handleUserId( e )}
				sx={{ width: '90%' }} 
				label="School Number" 
				variant="filled"
				helperText="Employee or Student Number"
			/>
			<br/>
			<TextField 
				type="date"
				defaultValue={userPass}
				onChange={e => handleUserPass( e )}
				sx={{ width: '90%' }} 
				helperText="Birth-date" 
				variant="filled"
			/>
		</div>	
	);

	const verify = async fn => {
		const returnVal = await fn();
		setActiveStep( returnVal );
	}

	React.useEffect(() => {
		setContent( isApproved ? <TrueSignup/> : <Verification/> );
	}, [isApproved]);

	return(
		<div className="form-sign-up d-flex flex-column justify-content-around align-items-center">
			<div 
				style={{ 
					width: 'fit-content', 
					borderLeft: '4px solid #D9B5B5',
				}} 
				className="text-center px-2"
			>
				<Typography variant="h2" color="var(--text-color)" component="div">
					Sign-up
				</Typography>
			</div>
			<div className="container-fluid">
				<SignUpSteps activeStep={activeStep}/>
			</div>
			{ content }
			<div 
				style={{ width: '100%' }}
				className="my-3 d-flex flex-row justify-content-around align-items-center"
			>			
				<QamsButton size="small" variant="contained" onClick={() => props?.setFormType?.( 'signin' )}>
					Sign-in
				</QamsButton>

				{
					isApproved
						? <QamsButton size="small" variant="contained">
							Sign-up
						</QamsButton>
						: <QamsButton size="small" variant="contained" onClick={() => verify(props?.handleVerification)}>
							Verify
						</QamsButton>
				}
			</div>
		</div>
	);
}


const SignUpSteps = props => {
	return(
		<Stepper activeStep={props?.activeStep}>
			{
				steps.map( label => (
					<Step key={label}>
						<StepLabel >
							{ label }
						</StepLabel>
					</Step>
				))
			}
		</Stepper>
	);
}

export default Form;