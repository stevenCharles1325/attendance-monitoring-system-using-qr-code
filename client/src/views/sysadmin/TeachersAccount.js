import React from 'react';
import Axios from 'axios';

import AccountView from '../../components/AccountView';

const TeachersAccount = props => {
	const [items, setItems] = React.useState( [] );
	const [strands, setStrands] = React.useState( [] );

	const getItems = async () => {
		Axios.get(`${window.API_BASE_ADDRESS}/master/get-users/type/teacher`)
		.then( res => {
			setItems(() => [ ...res.data ]);
		})
		.catch( err => {
			console.error( err );
		});
	}

	const getStrand = async () => {
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
		getStrand();
	}

	React.useEffect(() => {
		getItems();
		getStrand();
	}, []);


	return(
		<div className="teachers-account d-flex justify-content-center align-items-center">
			<AccountView 
				statusSwitchOn
				buttonsOff
				userType="teacher"
				header={['Employee No', 'First name', 'Middle Name', 'Last name', 'Section', 'Strand', 'status']}
				renderItemsKey={['employeeNo', 'firstName', 'middleName', 'lastName', 'section', 'strand', 'status']}
				searchIndex={1}
				filter={strands}
				items={items}
				strands={strands}
				refresh={() => refresh()}
			/>
		</div>
	);
}

export default TeachersAccount;