import React from 'react';

import Form from '../components/Form';
import Typography from '@mui/material/Typography';

const Gate = () => {
	const [formType, setFormType] = React.useState('signin');

	return(
		<div className="gate d-flex">
			<div 
				style={{ height: '100%', minHeight: '570px' }} 
				className="gate-side d-flex justify-content-center align-items-center"
			>
				<div className="gate-card">
					<Form formType={formType} setFormType={val => setFormType( val )}/>
				</div>
			</div>
			<div 
				style={{ width: '60%', height: '100%' }} 
				className="py-5 gate-decor d-flex justify-content-center align-items-start app-text-color text-center"
			>
				<div style={{ height: 'fit-content'}}>
					<img width="200px" height="200px" src="/images/logo/cctLogo_new.png" alt="CCT image"/>
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


export default Gate;