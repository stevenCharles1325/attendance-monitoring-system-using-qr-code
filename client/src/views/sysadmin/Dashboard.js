import React from 'react';

import Divider from '@mui/material/Divider';
import Calendar from 'react-calendar';
import Menu from '../../components/Menu';
import Clock from '../../components/Clock';

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


import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBox from '@mui/icons-material/AccountBox';
import Folder from '@mui/icons-material/Folder';
import Assessment from '@mui/icons-material/Assessment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SsidChart from '@mui/icons-material/SsidChart';
import Feed from '@mui/icons-material/Feed';
import ListAlt from '@mui/icons-material/ListAlt';

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

	return(
		<div className="sysadmin-dashboard">
			<Menu 
				items={items}
			/>
			<div 
				style={{ width: '100%', height: 'fit-content' }} 
				className="p-0 m-0 row d-flex justify-content-center align-items-center"
			>	
				<Clock/>
				<div style={{ width: '100%'}}>
					<Divider/>
				</div>
				<div style={{ width: '100%' }} className="p-0 m-0 my-5 row d-flex justify-content-center align-items-center">
					<div className="my-3 col-lg-4 d-flex justify-content-center align-items-center">
						<PieGraph/>
					</div>

					<div className="my-3 col-lg-4 d-flex justify-content-center align-items-center">
						<BarGraph/>
					</div>

					<div className="my-3 col-lg-4 d-flex justify-content-center align-items-center">
						<Calendar className="calendar" />			
					</div>
				</div>
			</div>
		</div>
	);
}

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


const items = [
	{
		text: 'Dashboard',
		icon: <DashboardIcon/>
	},
	{
		text: 'Account',
		icon: <AccountBox/>,
		collapsable: true,
		subList: [
			{
				text: 'Students Account',
				icon: <AccountCircle/>
			},
			{
				text: 'Teachers Account',
				icon: <AccountCircle/>
			}
		]
	},
	{
		text: 'Records',
		icon: <Folder/>,
		collapsable: true,
		subList: [
			{
				text: 'Students Record',
				icon: <ListAlt/>
			},
			{
				text: 'Teachers Record',
				icon: <ListAlt/>
			},
			{
				text: 'Attendance Record',
				icon: <ListAlt/>
			}
		]
	},
	{
		text: 'Reports',
		icon: <Assessment/>,
		collapsable: true,
		subList: [
			{
				text: 'Graph',
				icon: <SsidChart/>
			},
			{
				text: 'School Form 2',
				icon: <Feed/>
			}
		]
	}
];



export default Dashboard;