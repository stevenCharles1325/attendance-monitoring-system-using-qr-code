import React from 'react';
import Cookies from 'js-cookie';

import CloseIcon from '@mui/icons-material/Close';

import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import ProfilePic from './ProfilePic';

import { useSelector } from 'react-redux';

import { styled } from '@mui/material/styles';

const ProfileTextField = styled( TextField )(() => ({
	'& .MuiInputLabel-root.Mui-disabled' : {
		color: 'white'
	},
	'& .MuiInputBase-input.Mui-disabled' : {
		'WebkitTextFillColor': 'rgba(255, 255, 255, 0.38)'
	},
	'& .MuiInput-root:before': {
		'borderBottom': '1px solid rgba(255, 255, 255, 0.29)'
	}
}));


const Profile = props => {
	const { userRole } = useSelector( state => state.form );
	
	return(
		<Dialog
	        open={props?.open}
	        onClose={props?.handleClose}
		>
			<div className="w-full h-fit min-w-[200px] max-w-[500px] bg-[#464545] p-4 position-relative">
				<div className="row w-full h-full p-0 m-0">
					<div className="col-md-5 my-2 d-flex justify-content-center align-items-center">
						<ProfilePic/>
					</div>
					<div className="col-md-7 my-2">
						<div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
							<ProfileTextField sx={{ width: '5cm' }} disabled defaultValue={userRole} label="Role" variant="standard"/>
							<br/>
							<ProfileTextField sx={{ width: '5cm' }} disabled defaultValue={Cookies.get('userId')} label="Username" variant="standard"/>
						</div>
					</div>
				</div>
				<div className="position-absolute top-0 end-0 w-fit h-fit">
					<IconButton onClick={props?.handleClose}>
						<CloseIcon sx={{ color: 'white' }}/>
					</IconButton>
				</div>
			</div>
		</Dialog>
	);
}


export default Profile;