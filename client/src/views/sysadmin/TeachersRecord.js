import React from 'react';
import Axios from 'axios';

import AccountView from '../../components/AccountView';

const TeachersRecord = props => {
	const [items, setItems] = React.useState( [] );
	const [sections, setSections] = React.useState( [] );
	const [strands, setStrands] = React.useState( [] );

	const getItems = async () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/get-users/type/student`)
		.then( res => {
			setItems(() => [ ...res.data ]);
		})
		.catch( err => {
			console.error( err );
		});
	}

	const getSections = async () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/get-items/type/section`)
		.then( res => {
			setSections(() => [ ...res.data ]);			
		})
		.catch( err => {
			console.error( err );
		});
	}

	const getStrands = async () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/get-items/type/strand`)
		.then( res => {
			setStrands(() => [ ...res.data ]);
		})
		.catch( err => {
			console.error( err );
		});
	}

	const refresh = () => {
		getItems();
		getSections();
		getStrands();
	}

	React.useEffect(() => {
		getItems();
		getSections();
		getStrands();
	}, []);


	return(
		<div className="students-account d-flex justify-content-center align-items-center">
			<AccountView 
				addUserOn
				addStrandOn
				addSectionOn
				statusSwitchOn
				userType="student"
				header={['Student No', 'First name', 'Middle Name', 'Last name', 'Section', 'Strand']}
				renderItemsKey={['studentNo', 'firstName', 'middleName', 'lastName', 'section', 'strand']}
				searchIndex={1}
				filter={[
					{
						name: 'Sections',
						isSectionName: true
					},
					...sections,
					{
						name: 'Strands',
						isSectionName: true	
					},
					...strands
				]}
				items={items}
				sections={sections}
				strands={strands}
				refresh={() => refresh()}
			/>
		</div>
	);
}

export default TeachersRecord;