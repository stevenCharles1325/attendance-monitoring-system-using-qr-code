import React from 'react';
import AccountView from '../../components/AccountView';

const StudentsAccount = props => {
	return(
		<div className="students-account d-flex justify-content-center align-items-center">
			<AccountView 
				// addUserOn
				// addStrandOn
				// addSectionOn
				statusSwitchOn
				userType="student"
				header={['ID', 'Full name', 'Section', 'Status']}
				searchIndex={1}
				filter={[
					{
						text: 'Section',
						isSectionName: true
					},
					{
						text: 'B-1' 
					},
					{
						text: 'B-2'
					}
				]}
				items={[]}
			/>
		</div>
	);
}

export default StudentsAccount;