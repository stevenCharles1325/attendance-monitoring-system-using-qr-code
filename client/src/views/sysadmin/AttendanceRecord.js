import React from 'react';
import Axios from 'axios';
import uniqid from 'uniqid';

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const AttendanceRecord = props => {
	const [renderedAttendance, setRenderedAttendance] = React.useState( [] );
	const [strandSections, setStrandSections] = React.useState( null );
	const [attendances, setAttendances] = React.useState( [] );
	const [strands, setStrands] = React.useState( [] );

	const getStrands = async () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/get-items/type/strand`, window.requestHeader)
		.then( res => setStrands([ ...res.data ]))
		.catch( err => {
			throw err;
		});
	}

	const getAttendance = async () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/attendances`, window.requestHeader)
		.then( res => setAttendances([ ...res.data ]))
		.catch( err => {
			throw err;
		});
	}

	React.useEffect(() => {
		getStrands();
		getAttendance();
	}, []);

	React.useEffect(() => {
		if( strands.length && attendances.length ){
			const tempStrandSections = {};

			strands.forEach( strand => {
				tempStrandSections[ strand.name ] = { sections: {}};

				strand.sections.forEach( section => {
					tempStrandSections[ strand.name ].sections[ section ] = { subjects: {}};

					const semester1Subjects = window.STRANDS[ strand.name ]['1'];
					const semester2Subjects = window.STRANDS[ strand.name ]['2'];

					semester1Subjects.forEach( subject => {
						tempStrandSections[ strand.name ].sections[ section ].subjects[ subject ] = [];						

						attendances.forEach( attndc => {
							if( attndc.subject === subject ){
								tempStrandSections[ strand.name ].sections[ section ].subjects[ subject ].push( attndc );								
							}
						});
					});					

					semester2Subjects.forEach( subject => {
						tempStrandSections[ strand.name ].sections[ section ].subjects[ subject ] = [];			

						attendances.forEach( attndc => {
							if( attndc.subject === subject ){
								tempStrandSections[ strand.name ].sections[ section ].subjects[ subject ].push( attndc );								
							}
						});
					});
				});
			});

			setStrandSections({ ...tempStrandSections });
		}
	}, [strands, attendances]);


	React.useEffect(() => {
		const tempRenderedAttendance = [];

		if( strandSections ){
			Object.keys( strandSections ).forEach( strand => {
				Object.keys( strandSections[ strand ].sections ).forEach( section => {
					Object.keys( strandSections[ strand ].sections[ section ].subjects ).forEach( subject => {
						tempRenderedAttendance.push(
							<Attendance
								key={uniqid()}
								strand={strand}
								section={section}
								subject={subject}
								attendance={strandSections[ strand ].sections[ section ].subjects[ subject ]}
							/>
						);
					});
				});
			});
		}

		setRenderedAttendance([ ...tempRenderedAttendance ]);
	}, [strandSections]);

	return(
		<div className="w-full h-full bg-white d-flex flex-column">
			<div className="w-full h-[50px] text-capitalize d-flex justify-content-around align-items-center shadow border font-bold px-3">			
				<div className="col-4">strand</div>
				<div className="col-4">section name</div>
				<div className="col-4">subject</div>
			</div>
			<div className="w-full h-[100px] flex-grow-1 overflow-auto">
				{ renderedAttendance }
			</div>
		</div>
	);
}


const Attendance = props => {
	return(
		<Accordion>
			<AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
	          <div className="w-full d-flex justify-content-around align-items-center px-3">
	          	<div className="col-4 text-truncate text-capitalize">{ props?.strand }</div>
							<div className="col-4 text-truncate text-capitalize">{ props?.section }</div>
							<div className="col-4 text-truncate text-capitalize">{ props?.subject }</div>
	          </div>
	        </AccordionSummary>
	        <AccordionDetails className="bg-[#f1f1f1]">
	        	<div className="w-full h-[300px] overflow-auto">
		        	<div key={uniqid()} className="w-full h-[40px] font-bold d-flex border-bottom justify-content-around align-items-center px-3">
								<div className="col-3 text-truncate text-capitalize">Student No</div>
								<div className="col-3 text-truncate text-capitalize">Full name</div>
								<div className="col-3 text-truncate text-capitalize">subject</div>
								<div className="col-3 text-truncate text-capitalize text-right">remark</div>
			        </div>
			        {
			        	props?.attendance?.map( att => (
			        		<div key={uniqid()} className="w-full h-[40px] d-flex border-bottom border-top justify-content-around align-items-center px-3 py-4 text-[#656565]">
										<div className="col-3 text-truncate text-capitalize">{ att?.studentNo }</div>
										<div className="col-3 text-truncate text-capitalize">{ att?.fullName }</div>
										<div className="col-3 text-truncate text-capitalize">{ att?.subject }</div>
										<div className="col-3 text-truncate text-capitalize text-right">{ att?.remark }</div>
					        </div>
			        	))
			        }
	        	</div>
	        </AccordionDetails>
		</Accordion>
	);
}

export default AttendanceRecord;