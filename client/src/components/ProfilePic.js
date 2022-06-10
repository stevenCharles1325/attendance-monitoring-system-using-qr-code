import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';

import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';

const ProfilePic = props => {
	const [image, setImage] = React.useState( props?.imageSrc );
	const [imageSrc, setImageSrc] = React.useState( `/images/user/${Cookies.get('userId')}.png` );
	const [isUploading, setIsUploading] = React.useState( false );

	const getUserImageSrc = () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/get-profile-picture/userId/${Cookies.get('userId')}`, window.requestHeader)
		.then( res => {
			setImageSrc( res.data.imageSrc );
		})
		.catch( err => {
			throw err;
		});
	}

	const handleSelection = React.useCallback(e => {
		if( isUploading || props?.disabled ) return;
		e.stopPropagation();

		const fileInput = document.createElement('input');

		fileInput.setAttribute('type', 'file');
		fileInput.setAttribute('accept', 'image/*');

		fileInput.addEventListener('input', e => {
			if( e?.target?.files ){
				setImage( e?.target?.files?.[ 0 ] );
			}
		});

		fileInput.click();
	}, [isUploading, props]);

	const handleUpload = React.useCallback(() => {
		if( !image ) return;

		const formData = new FormData();
		formData.append('userPicture', image );

		Axios.put(`${window.API_BASE_ADDRESS}/master/update-profile-picture/userId/${Cookies.get('userId')}`, formData, window.requestHeader)
		.then( res => {
			setIsUploading( false );
			setImageSrc( res.data.imageSrc );
		})
		.catch(err => {
			throw err;
		});
	}, [image]);

	React.useEffect(() => {
		if( image ){
			setIsUploading( true );
		}
	}, [image]);

	React.useEffect(() => {
		if( isUploading ){
			setTimeout(() => {
				handleUpload();
			}, 1000);
		}
	}, [isUploading, image]);

	React.useEffect(() => {
		if( imageSrc ){
			const getProfilePic = setInterval(() => getUserImageSrc(), 1500);

			return () => clearInterval( getProfilePic );
		}
	}, [imageSrc]);

	React.useEffect(() => getUserImageSrc(), []);

	return(
		<div className={`position-relative w-fit h-fit ${!isUploading && !props?.disabled ? 'image-upload' : null}`}>
			{
				isUploading
					?	<div className="position-absolute z-[100] w-full h-full d-flex justify-content-center align-items-center">
							<CircularProgress color="secondary"/>
						</div>
					: null
			}
			<Avatar 
				sx={{ width: props?.width ?? '150px', height: props?.height ?? '150px', border: props?.openBorder ? '4px solid rgba(0, 0, 0, 0.2)' : null }} 
				onClick={handleSelection} 
				className="shadow"
				src={imageSrc}
			/>
		</div>
	);
}


export default ProfilePic;