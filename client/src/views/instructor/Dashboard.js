import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import debounce from 'lodash.debounce';

// import { QrReader } from 'react-qr-reader';
import { QR } from '../../components/QR';
import { useSelector, useDispatch } from 'react-redux';

import Menu from '../../components/Menu';
import Schedule from './Schedule';
import LabeledText from '../../components/LabeledText';

import Avatar from '@mui/material/Avatar';
import QamsHeader from '../../components/QamsHeader';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ButtonBase from '@mui/material/ButtonBase';

import AddCardIcon from '@mui/icons-material/AddCard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

import CreditCardIcon from '@mui/icons-material/CreditCard'; // section store
import StoreIcon from '@mui/icons-material/Store'; // strand icon
import ArticleIcon from '@mui/icons-material/Article';
import { useSnackbar } from 'notistack';

const Dashboard = props => {
	const [userData, setUserData] = React.useState( null );
	const [qrData, setQrData] = React.useState( '' );
	const [isTimein, setIsTimein] = React.useState( true );
	const [isCameraDenied, setIsCameraDenied] = React.useState( null );
	
	const handleUserDataFetching = () => {
		Axios.get(
			`${window.API_BASE_ADDRESS}/master/get-single-user/type/teacher/id/${Cookies.get('userId')}`, 
			window.requestHeader
		)
		.then( res => setUserData( res.data ))
		.catch( err => {
			console.error( err );
		});
	}

	React.useEffect(() => {
		handleUserDataFetching();
	}, []);

	return(
		<div className="student-dashboard row d-flex py-3">
			<QamsHeader title="Dashboard"/>
			<div className="w-full d-flex flex-wrap justify-content-center">
				<CountCard
					title="Total handle strands"
					icon={StoreIcon}
					data={{
						count: userData?.strand?.length,
						countLabel: 'strands'
					}}
				/>

				<CountCard
					title="Total handle sections"
					icon={CreditCardIcon}
					data={{
						count: userData?.section?.length,
						countLabel: 'sections'
					}}
				/>

				<CountCard
					title="Total handle subjects"
					icon={ArticleIcon}
					data={{
						count: userData?.subjects?.length,
						countLabel: 'subjects'
					}}
				/>
			</div>
			<div className="flex-grow-1 d-flex flex-column justify-content-around align-items-center">
				<div className="w-[80%] min-w-[350] h-[500px] my-2">
					<Schedule/>
				</div>
			</div>
		</div>
	);
}

const CountCard = props => {
	return(
		<ButtonBase className="rounded m-3" onClick={props?.onClick}>
			<div className="d-flex flex-column justify-content-start align-items-start w-[250px] h-fit min-h-[150px] text-[#5b5d5a] rounded shadow bg-white overflow-hidden">
				<div className="w-full h-[35px] border-bottom bg-[#6a6c68] text-white shadow">
					<p className="text-left text-truncate text-capitalize px-3 py-1 tracking-wide">{ props?.title }</p>
				</div>
				{
					props?.icon
						?	<div className="p-3">
								<props.icon fontSize="large"/>
							</div>
						: null
				}
				{
					props?.data
						?	<div className="px-3 pb-3">
								<p><b>{ props?.data?.count }</b> /{ props?.data?.countLabel }</p>
							</div>
						: null
				}
			</div>
		</ButtonBase>
	);
}


export default Dashboard;