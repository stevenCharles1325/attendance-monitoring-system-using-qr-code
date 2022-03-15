import React from 'react';
import { QRCode } from 'react-qrcode-logo';

import Menu from '../../components/Menu';
import LabeledText from '../../components/LabeledText';

import Avatar from '@mui/material/Avatar';


const Dashboard = props => {
	const studentQr = React.useRef();

	return(
		<div className="student-dashboard">
			<Menu/>
			<div style={{ width: '100%' }} className="row d-flex m-0 p-0 flex-row justify-content-center align-items-start">
				<div className="col-md-4">
					<div ref={studentQr} className="qr-box shadow-right">
						<QRCode
							qrStyle="dots"
							eyeRadius={10}
							logoWidth={80}
							logoOpacity={0.5}
							value={props.id ?? 'sample'}
							logoImage="/images/logo/cctLogo_new.png" 
						/>
						{/*<ResponsiveQR percent={100} parent={studentQr}/>*/}
					</div>
				</div>
				<div style={{ height: 'fit-content' }} className="m-3 p-3 row shadow-right col-md-4 student-dashboard-info-box">
					<div className="col-12 row">
						<div className="col-md-4 d-flex align-items-center">
							<Avatar sx={{ width: 150, height: 150 }}/>
						</div>
						<div className="col-md-8 d-flex justify-content-center align-items-center">
							<div className="col-12">
								<LabeledText label="Name" content="Steven Charles P. Palabyab"/>
								<LabeledText label="Year & Section" content="BSIT 4-5"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


export default Dashboard;