import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
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

import { handleNavigateTo } from '../features/navigation/navigationSlice';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import Spacer from './Spacer';
import Alert from '@mui/material/Alert';
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
	const { 
		userId, 
		userPass, 
		userBday, 
		userRole 
	} = useSelector( state => state.form );

	const initMessage = { text: null, variant: null };

	const [message, setMessage] = React.useState( initMessage );
	const [navigate, setNavigateTo] = React.useState( null );
	const [content, setContent] = React.useState( null );

	const dispatch = useDispatch();
	const [action, setAction] = React.useState( null );

	const handleSignin = () => setAction('signin');
	const handleSignup = () => setAction('signup');

	const signin = (
		<SigninForm 
			userId={userId} 
			userPass={userPass} 
			userBday={userBday}
			userRole={userRole}
			setMessage={val => setMessage( val )}
			handleSignin={() => handleSignin()}
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
			setMessage={val => setMessage( val )}
			handleUserId={e => dispatch(handleUserId( e.target.value ))}
			handleUserPass={e => dispatch(handleUserPass( e.target.value ))}
			handleUserBday={e => dispatch(handleUserBday( e.target.value ))}
			// handleVerification={() => handleVerification()}
			setFormType={val => props?.setFormType?.( val )}
		/>
	);	

	React.useEffect(() => {
		if( message.text ) setTimeout(() => setMessage( initMessage ), 2000);
	}, [message]);

	React.useEffect(() => {
		if( props?.formType === 'signin' ){
			setTimeout(() => setContent( signin ), 1000);	
		}
		else if( props?.formType === 'signup' ){
			setTimeout(() => setContent( signup ), 1000);	
		}

		setContent( <FormLoading/> );
	}, [props?.formType]);

	React.useEffect(() => {
		switch( action ){
			case 'signin':
				// do this
				Axios.post(`${window.API_BASE_ADDRESS}/auth/sign-in`, {
					username: userId,
					password: userPass
				})
				.then( res => {
					Cookies.set('token', res.data.accessToken);
					Cookies.set('rtoken', res.data.refreshToken);

					dispatch(handleUserRole( res.data.role ));
					dispatch(handleNavigateTo( `app/${res?.data?.role}/dashboard` ));
				})
				.catch( err => {
					if( err?.response?.status === 403 && err?.response?.data?.message ){
						setMessage({
							text: err.response.data.message,
							variant: 'error'
						});
					}
				});
				break;

			case 'signup':
				break;

			default:
				return;
		}
		
		setAction( null );
	}, [userId, userPass, userBday, userRole, action]);

	return(
		<div className="form pt-3">
			{ 
				message.text && 
				(<div style={{ position: 'absolute', top: '0', left: '0', width: '100%' }}>
					<Alert severity={message.variant}>{ message.text }</Alert>
				</div>)
			}
			{ navigate }
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

	const password = React.useRef();

	const handleEnter = e => {
		if( e.key === 'Enter' ) props?.handleSignin?.();
	}

	React.useEffect(() => {
		if( password.current ){
			password.current.addEventListener('keydown', e => handleEnter( e ));
		}

		return () => {
			if( password.current ){
				password.current.removeEventListener('keydown', e => handleEnter( e ));
			}
		}
	}, [password]);

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
					ref={password}
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

				<QamsButton size="small" variant="contained" onClick={() => props?.handleSignin?.()}>
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
	const [action, setAction] = React.useState( null );

	const dispatch = useDispatch();

	const handleVerification = async id => {
		try{
			const { role } = await Axios.post(`${window.API_BASE_ADDRESS}/verify/user/${id}`) 
			dispatch(props.handleUserRole( role ));

			props?.setMessage({
				text: 'Account has been verified!',
				variant: 'success'
			});

			setIsApproved( true );
			setActiveStep( 1 );
			setAction( null );
		}
		catch( err ){
			props?.setMessage({
				text: 'Account does not exist!',
				variant: 'error'
			});

			setIsApproved( false );
			setActiveStep( 0 );
			setAction( null );
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

	const handleEnter = approval => e => {
		if( e.key === 'Enter' ){
			if( approval ){
				// In progress...
			}
			else{
				setAction('verify');
			}
		} 
	}

	React.useEffect(() => {
		window.addEventListener('keydown', handleEnter( isApproved ));

		return () => window.removeEventListener('keydown', handleEnter( isApproved ));
	}, [isApproved]);

	React.useEffect(() => {
		if( action === 'verify' ){
			handleVerification( userId );
		}
	}, [userId, action]);

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
			<br/>
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
						: <QamsButton size="small" variant="contained" onClick={() => setAction('verify')}>
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