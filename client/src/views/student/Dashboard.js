import React from 'react';
import { QRCode } from 'react-qrcode-logo';

import Menu from '../../components/Menu';
import LabeledText from '../../components/LabeledText';

import Avatar from '@mui/material/Avatar';



const Dashboard = props => {
	const studentQr = React.useRef();

	return(
		<div className="student-dashboard row">
			<div className="row col-md-6 d-flex flex-column justify-content-around align-items-center">
				<div className="student-dashboard-item p-4 col-lg-9 m-2">
					<FieldBox label="Name" content="Steven Charles Poblete Palabyab"/>			
				</div>
				<div className="student-dashboard-item p-4 col-lg-9 m-2">
					<FieldBox label="Name" content="Steven Charles Poblete Palabyab"/>			
				</div>
			</div>
			<div className="col-md-6 d-flex flex-column justify-content-around align-items-center">
				<div className="student-dashboard-item-full col-lg-9 m-2 d-flex justify-content-center align-items-center">
					<QRCode
						qrStyle="dots"
						eyeRadius={10}
						logoWidth={80}
						logoOpacity={0.5}
						value={props.id ?? '1801201'}
						logoImage="/images/logo/cctLogo_new.png" 
					/>				
				</div>
			</div>
		</div>
	);
}

const FieldBox = props => {
	return(
		<div className="field-box px-3 d-flex flex-row justify-content-start align-items-center">
			<b>{ props?.label }</b>
			<p>{ props?.content }</p>
		</div>
	);
}


export default Dashboard;