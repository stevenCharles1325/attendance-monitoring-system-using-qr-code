import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';

const Profile = props => {
	return(
		<Dialog
	        fullScreen
	        open={props?.open}
	        onClose={props?.handleClose}
		>
			<div className="w-full h-full bg-white row">
				<div className="col-md-4 p-5 h-fit d-flex flex-column align-items-center">
					<Avatar sx={{ width: 120, height: 120 }} className="shadow"/>
					<div className="border rounded default-bg shadow w-full h-[300px] mt-5">
						{
							props?.data?.studentNo
								?	<div>

									</div>
								: null
						}
					</div>
				</div>	
				<div className="col-md-8 p-5">
					<div className="border rounded default-bg shadow w-full h-full">

					</div>
				</div>
				<div className="col-12 d-flex justify-content-end">
					<Button onClick={props?.handleClose}>
						close
					</Button>
				</div>
			</div>
		</Dialog>
	);
}



export default Profile;