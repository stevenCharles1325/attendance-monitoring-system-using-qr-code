import React from 'react';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Calendar from 'react-calendar';
import Clock from '../../components/Clock';
import DialogForm from '../../components/DialogForm';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

import 'react-calendar/dist/Calendar.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,	
  ArcElement
);

const Dashboard = props => {
	const [settingOpen, setSettingOpen] = React.useState( false );
	const [tabIndex, setTabIndex] = React.useState( 0 );

	return(
		<div className="sysadmin-dashboard row d-flex justify-content-center align-items-center">
			<div className="px-5 d-flex justify-content-between align-items-center">
				<Clock/>
				<IconButton onClick={() => setSettingOpen( true )}> 
					<AppRegistrationIcon/>
				</IconButton>
			</div>
			<div style={{ width: '100%' }} className="p-0 m-0">
				<Divider textAlign="right">
					<Typography variant="h6" sx={{ color: 'var(--text-color)' }}>
						Dasboard
					</Typography>
				</Divider>
			</div>
			<div style={{ width: '100%'}} className="p-0 m-0 my-5 row ">
				<div className="p-0 m-0 my-3 col-lg-4 d-flex justify-content-center">
					<PieGraph/>
				</div>

				<div className="p-0 m-0 my-3 col-lg-4 d-flex justify-content-center">
					<BarGraph/>
				</div>

				<div className="p-0 m-0 my-3 col-lg-4 d-flex justify-content-center">
					<Calendar className="calendar" />			
				</div>
			</div>
			<DialogForm 
				open={settingOpen} 
				close={() => setSettingOpen( false )}
			/>
		</div>
	);
}

// const TabSettings = props => {
// 	return()
// }

const PieGraph = props => {
	const data = {
	        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
	        datasets: [
	            {
	                label: `Annual Data`,
	                data: [1, 500, 300, 25, 300, 200, 200],
	                fill: false,
	                backgroundColor: ['rgb(100, 100, 100)', 'rgb(196, 196, 196)'],
	                borderColor: 'rgba(255, 255, 255, 0.5)'
	            }
	        ] 
		}

	return(
		<div className="graph-container pie border rounded p-3">
			<Pie
				data={data}
				width={400} 
				height={400} 
				options={{ maintainAspectRatio: false }}
			/>
		</div>
	);
}

const BarGraph = props => {
	const data = {
	        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
	        datasets: [
	            {
	                label: `Annual Data`,
	                data: [1, 500, 300, 25, 300, 200, 200],
	                fill: false,
	                backgroundColor: ['rgb(100, 100, 100)', 'rgb(196, 196, 196)'],
	                borderColor: 'rgba(255, 255, 255, 0.5)'
	            }
	        ] 
		}

	return (
		<div className="graph-container bar border rounded p-3">
			<Bar 
				data={data}
				width={400} 
				height={400} 
				options={{ maintainAspectRatio: false }}
			/>
		</div>
	);
}


export default Dashboard;