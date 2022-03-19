import React from 'react';
import AccountView from '../../components/AccountView';

const StudentsAccount = props => {
	return(
		<div className="students-account d-flex justify-content-center align-items-center">
			<AccountView 
				header={['ID', 'Full name', 'Section']}
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
				items={[
					['1', 'tae', 'B-5'],
					['2', 'tang', 'B-2'],
					['3', 'ihi', 'B-3'],
					['4', 'tanga', 'B-2'],
				]}
			/>
		</div>
	);
}

export default StudentsAccount;