import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const ChangePasswordForm = props => {
	const defaultRepeatHelperText = 'This must match the new password';

	const [error, setError] = React.useState( null );
	const [currPassHlprTxt, setCurrPassHlprTxt] = React.useState( '' );
	const [newPassHlprTxt, setNewPassHlprTxt] = React.useState( '' );
	const [rptPassHlprTxt, setRptPassHlprTxt] = React.useState( defaultRepeatHelperText );
	const [codeHlprTxt, setCodeHlprTxt] = React.useState( '' );

	const [currPass, setCurrPass] = React.useState( '' );
	const [newPass, setNewPass] = React.useState( '' );
	const [rptPass, setRptPass] = React.useState( '' );
	const [code, setCode] = React.useState( '' );

	const [successMsg, setSuccessMsg] = React.useState( null );

	// This can be REGULAR, VERIFICATION, FORGOTPASS
	const [formType, setFormType] =	React.useState( 'regular' );

	const handleOnChange = (e, type) => {
		switch( type ){
			case 'currPass':
				return setCurrPass( e.target.value );

			case 'newPass':
				return setNewPass( e.target.value );

			case 'rptPass':
				return setRptPass( e.target.value );

			case 'code':
				return setCode( e.target.value );

			default:
				return console.warn('Change-password-form needs on-change type for handleOnChange function');
		}
	}

	const sendVerificationCode = async () => {
		Axios.get(
			`${window.API_BASE_ADDRESS}/master/user-forgot-password/get-code/id/${Cookies.get('userId')}`,
			window.requestHeader
		)
		.then( res => {
			setSuccessMsg( res.data.message );
		})
		.catch( err => {
			console.log( err );			
		});
	}

	const handleVerification = () => {
		Axios.post(
			`${window.API_BASE_ADDRESS}/master/user-forgot-password/code-verification/id/${Cookies.get('userId')}`,
			{ code },
			window.requestHeader
		)
		.then(() => {
			setFormType('forgotpass');
		})
		.catch( err => {
			if( err?.response?.data?.message ){
				setError('code');
				setCodeHlprTxt( err.response.data.message );
			}
		})
	}

	const handleUpdatePassword = async () => {
		if( newPass !== rptPass ){
			setError('rptPass');
			return setRptPassHlprTxt('Does not match with the new password!');
		}

		if( currPass === newPass ){
			setError('newPass');
			return setNewPassHlprTxt('New password and current password are equal!');
		}

		Axios.put(
			`${window.API_BASE_ADDRESS}/master/change-user-password/id/${Cookies.get('userId')}`, 
			{ currPass, newPass },
			window.requestHeader
		)
		.then(() => {
			clearAllFields();
			setSuccessMsg('Successfully changed the password!');
		})
		.catch( err => {
			if( err?.response?.data?.message ){
				setError('currPass');
				setCurrPassHlprTxt( err.response.data.message );
			}
		});
	}

	const handleUpdatePasswordV2 = async () => {
		Axios.post(
			`${window.API_BASE_ADDRESS}/master/change-user-password-from-forgot-password/id/${Cookies.get('userId')}`, 
			{ newPass },
			window.requestHeader
		)
		.then(() => {
			clearAllFields();
			setSuccessMsg('Successfully changed the password!');
			setFormType('regular')
		})
		.catch( err => {
			if( err?.response?.data?.message ){
				setError('newPass');
				setNewPassHlprTxt( err.response.data.message );
			}
		});
	}

	const clearAllFields = () => {
		setCurrPass( '' );
		setNewPass( '' );
		setRptPass( '' );
	}

	const resetErrorsAndMessages = () => {
		setSuccessMsg( null );
		setError( null );
		setCurrPassHlprTxt( '' );
		setNewPassHlprTxt( '' );
		setRptPassHlprTxt( defaultRepeatHelperText );
	}

	const forms = {
		'regular' : (
			<ChangePassMainForm
				error={error}
				currPass={currPass}
				newPass={newPass}
				rptPass={rptPass}
				currPassHlprTxt={currPassHlprTxt}
				newPassHlprTxt={newPassHlprTxt}
				rptPassHlprTxt={rptPassHlprTxt}
				handleOnChange={handleOnChange}
				setFormType={setFormType}
			/>
		),
		'verification' : (
			<VerificationForm
				code={code}
				codeHlprTxt={codeHlprTxt}
				error={error}
				setCode={setCode}
				setFormType={setFormType}
				handleVerification={handleVerification}
			/>
		),
		'forgotpass' : (
			<ForgotPasswordForm
				newPass={newPass}
				setFormType={setFormType}
				setNewPass={setNewPass}
				handleUpdatePasswordV2={handleUpdatePasswordV2}
			/>
		),
	}

	React.useEffect(() => {
		if( error || currPassHlprTxt || rptPassHlprTxt || successMsg ){
			setTimeout(() => resetErrorsAndMessages(), 3000 );
		}
	}, [error, currPassHlprTxt, rptPassHlprTxt, successMsg]);

	React.useEffect(() => {
		if( formType === 'verification' ){
			if( newPass.length ) setNewPass( '' );

			sendVerificationCode();
		}
	}, [formType, newPass]);

	return(
		<div className="change-password-form-box d-flex justify-content-center align-items-center">
			<div className="change-password-form border rounded d-flex flex-column">
				<div className="col-12 p-3 text-capitalize">
					<h5>change password</h5>
				</div>
				{ 
					successMsg && 
					 <Alert severity="success">
					 	{ successMsg }
				      </Alert>
				}
				<div className="flex-grow-1 border-top col-12 d-flex flex-column justify-content-around align-items-center">
					{/* content goes here */}
					{ forms[ formType ] }
				</div>
			</div>
		</div>
	);
}

const ForgotPasswordForm = props => {
	return (
		<>
			<TextField 
				value={props.newPass}
				type="password"
				sx={{ width: '60%' }} 
				label="Enter your new password" 
				variant="standard"
				onChange={e => props.setNewPass( e.target.value )}
			/>
			<Button variant="contained" size="small" onClick={props.handleUpdatePasswordV2}>Change password</Button>
		</>
	);
}


const VerificationForm = props => {
	return (
		<>	
			<p className="px-3">Please wait. A success message will appear if the vericiation code has been sent to your email address.</p>
			<TextField 
				value={props.code}
				sx={{ width: '60%' }} 
				error={props.error === 'code'} 
				helperText={props.codeHlprTxt} 
				label="Verification code" 
				variant="standard"
				onChange={e => props.setCode( e.target.value )}
			/>
			<Button variant="contained" size="small" onClick={props.handleVerification}>Verified</Button>
		</>
	);
}

const ChangePassMainForm = props => {
	return (
		<>
			<TextField 
				value={props.currPass}
				type="password"
				sx={{ width: '60%' }} 
				error={props.error === 'currPass'} 
				helperText={props.currPassHlprTxt} 
				label="Current Password" 
				variant="standard"
				onChange={e => props.handleOnChange( e, 'currPass' )}
			/>
			<TextField 
				value={props.newPass}
				type="password"
				sx={{ width: '60%' }} 
				error={props.error === 'newPass'} 
				helperText={props.newPassHlprTxt} 
				label="New Password" 
				variant="standard"
				onChange={e => props.handleOnChange( e, 'newPass' )}
			/>
			<TextField 
				value={props.rptPass}
				type="password"
				sx={{ width: '60%' }} 
				error={props.error === 'rptPass'} 
				helperText={props.rptPassHlprTxt} 
				label="Repeat New Password" 
				variant="standard"
				onChange={e => props.handleOnChange( e, 'rptPass' )}
			/>
			<div className="col-12 row d-flex justify-content-around">
				<div className="col-sm-4 d-flex justify-content-center">
					<Button variant="standard" size="small" onClick={() => props.setFormType('verification')}>forgot password</Button>
				</div>
				<div className="col-sm-4 d-flex justify-content-center">
					<Button variant="contained" onClick={props.handleUpdatePassword}>update password</Button>
				</div>
			</div>
		</>
	);
}

export default ChangePasswordForm;