import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';

import Avatar from '@mui/material/Avatar';

const Profile = props => {
	const [userData, setUserData] = React.useState( null );

	const handleUserDataFetching = () => {
		Axios.get(
			`${window.API_BASE_ADDRESS}/master/get-single-user/type/${ props?.userType }/id/${ Cookies.get('userId') }`, 
			window.requestHeader
		)
		.then( res => setUserData( res.data ))
		.catch( err => {
			console.error( err );
		});
	}

	React.useEffect(() => handleUserDataFetching(), []);

	return(
		<div className="profile d-flex flex-column align-items-center">
			<div className="profile-top-board p-4 mt-4 row border rounded d-flex justify-content-around align-items-center">
				<div className="col-md-3 d-flex justify-content-center align-items-center">
					<Avatar sx={{ width: '150px', height: '150px' }} alt="user-image"/>
				</div>
				{
					userData
						? <div style={{ height: 'fit-content' }} className="col-md-8 text-capitalize">
							<h1>{ userData?.lastName + ', ' + userData?.firstName + ' ' + (userData?.middleName?.[ 0 ] ? userData?.middleName?.[ 0 ] + '.' : '') }</h1>
							<h5 style={{ color: '#a0a2a0' }}>
								{ 
									props?.userType === 'student'
										? window.availableStrandNames[userData?.strand?.[ 0 ]] ?? 'N/A'
										: userData?.strand?.join?.(', ') ?? 'N/A' 
								}
							</h5>
							<br/>
							{
								props?.userType === 'student'
									? <>
										<p className="m-0"><b>Student No.:</b> { userData?.studentNo } </p>
										<p className="m-0"><b>LRN:</b> { userData?.lrn } </p>
									</>
									: <p className="m-0"><b>Employee No.:</b> { userData?.employeeNo } </p>
							}
							
							<p className="m-0"><b>Email:</b> { userData?.email } </p>
						</div>
						: null
				}
			</div>

			<div className="profile-bottom-board d-flex flex-column border rounded p-4 my-4 text-capitalize">
				<div className="border-bottom">
					<h5>basic information</h5>
				</div>
				<div className="flex-grow-1 row d-flex px-3 my-2">
					<div className="col-md-4 d-flex flex-column justify-content-center align-items-start">
						<p className="my-2"><b>First Name:</b> { userData?.firstName } </p>
						<p className="my-2"><b>Middle Name:</b> { !userData?.middleName?.length ? 'N/A' : userData?.middleName } </p>
						<p className="my-2"><b>Last Name:</b> { userData?.lastName } </p>
					</div>

					<div className="col-md-4 d-flex flex-column justify-content-center align-items-start">
						{
							props?.userType === 'student'
								? <>
									<p className="my-2"><b>Student No.:</b> { userData?.studentNo } </p>
									<p className="my-2"><b>LRN:</b> { userData?.lrn } </p>
								</>
								: <p className="my-2"><b>Employee No.:</b> { userData?.employeeNo } </p>
						}
						
						<p className="my-2"><b>Year & Section:</b> { userData?.section?.join(', ') } </p>
					</div>

					<div className="col-md-4 d-flex flex-column justify-content-center align-items-start">
						<p className="my-2"><b>Gender:</b> { userData?.gender } </p>
						<p className="my-2"><b>Date of Birth:</b> { userData?.birthDate } </p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;