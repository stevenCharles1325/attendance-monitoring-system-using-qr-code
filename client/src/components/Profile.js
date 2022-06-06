import React from 'react';
import uniqid from 'uniqid';
import Cookies from 'js-cookie';

import CloseIcon from '@mui/icons-material/Close';

import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';

import { useSelector } from 'react-redux';

const Profile = props => {
	const { userRole } = useSelector( state => state.form );
	
	return(
		<Dialog
	        open={props?.open}
	        onClose={props?.handleClose}
		>
			<div className="w-[100vw] h-fit min-w-[300px] max-w-[500px] bg-[#464545] d-flex p-4 position-relative">
				<ProfilePic/>
				<div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
					<TextField sx={{ width: '5cm' }} disabled defaultValue={userRole} label="Role" variant="standard"/>
					<br/>
					<TextField sx={{ width: '5cm' }} disabled defaultValue={Cookies.get('userId')} label="Username" variant="standard"/>
				</div>
				<div className="position-absolute top-0 end-0">
					<IconButton onClick={props?.handleClose}>
						<CloseIcon/>
					</IconButton>
				</div>
			</div>
		</Dialog>
	);
}

const ProfilePic = props => {
	const [image, setImage] = React.useState( null );
	const [isUploading, setIsUploading] = React.useState( false );

	const handleUpload = React.useCallback(e => {
		if( isUploading ) return;
		e.stopPropagation();

		const fileInput = document.createElement('input');
		fileInput.setAttribute('type', 'file');
		fileInput.setAttribute('accept', 'image/*');

		if( props.imageLimit === Infinity ){
			fileInput.setAttribute('multiple', '');
		}

		fileInput.addEventListener('input', e => {
			if( e?.target?.files ){
				setImage( e?.target?.files?.[ 0 ] );
			}
		});

		fileInput.click();
	}, [isUploading]);

	React.useEffect(() => {
		if( image ){
			setIsUploading( true );
		}
	}, [image]);

	return(
		<div className={`position-relative w-fit h-fit ${!isUploading ? 'image-upload' : null}`}>
			{
				isUploading
					?	<div className="position-absolute z-[100] w-full h-full d-flex justify-content-center align-items-center">
							<CircularProgress color="secondary"/>
						</div>
					: null
			}
			<Avatar sx={{ width: '150px', height: '150px' }} onClick={handleUpload} className="shadow"/>
		</div>
	);
}

export default Profile;