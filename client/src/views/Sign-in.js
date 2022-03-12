import React from 'react';

import Form from '../components/Form';
import Typography from '@mui/material/Typography';

const SignIn = () => {
	return(
		<div className="sign-in d-flex">
			<div 
				style={{ height: '100%' }} 
				className="sign-in-side d-flex justify-content-center align-items-center"
			>
				<div className="sign-in-card">
					<Form formType="signin"/>
				</div>
			</div>
			<div 
				style={{ width: '60%', height: '100%' }} 
				className="py-5 sign-in-decor d-flex justify-content-center align-items-start app-text-color text-center"
			>
				<div style={{ height: 'fit-content'}}>
					<img width="200px" height="200px" src="images/logo/cctLogo_new.png" alt="CCT image"/>
					<Typography variant="h4" component="div">
						City College of Tagaytay
					</Typography>
					<Typography variant="h6" component="div">
						QR Attendance Monitoring System
					</Typography>
				</div>
			</div>
		</div>
	);
}


export default SignIn;