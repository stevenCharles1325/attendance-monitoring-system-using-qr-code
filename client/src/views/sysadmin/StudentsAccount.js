import React from 'react';
import Axios from 'axios';

import AccountView from '../../components/AccountView';

const StudentsAccount = props => {
	const [items, setItems] = React.useState( [] );
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
		<div className="students-account d-flex justify-content-center align-items-center">
			<AccountView 
				statusSwitchOn
				userType="student"
				header={['Student No', 'First name', 'Middle Name', 'Last name', 'Section', 'Strand', 'status']}
				renderItemsKey={['studentNo', 'firstName', 'middleName', 'lastName', 'section', 'strand', 'status']}
				searchIndex={1}
				filter={strands}
				items={items}
				strands={strands}
				refresh={() => refresh()}
			/>
		</div>
	);
}

export default StudentsAccount;