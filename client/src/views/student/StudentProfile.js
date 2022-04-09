import React from 'react';
import Axios from 'axios';

import Avatar from '@mui/material/Avatar';

const StudentProfile = props => {
	return(
		<div className="student-profile d-flex flex-column justify-content-around align-items-center">
			<div className="student-profile-top-board row border rounded d-flex justify-content-center align-items-center">
				<div className="col-md-3 d-flex justify-content-center align-items-center">
					<Avatar sx={{ width: '150px', height: '150px' }} alt="user-image"/>
				</div>
				<div style={{ height: 'fit-content' }} className="col-md-8">
					
				</div>
			</div>

			<div className="student-profile-bottom-board">
			</div>
		</div>
	);
}

export default StudentProfile;