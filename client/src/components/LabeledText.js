import React from 'react';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const isMobile = () => /iPhone|iPad|iPod|Android/i.test( navigator.userAgent );

const LabeledText = ({ label, content, type }) => {
	const [classes, setClasses] = React.useState( "labeled-text m-0 my-4 p-0 py-3 px-2".split(' ') );
	const [currentContent, setCurrentContent] = React.useState( content );
	const [isEdit, setIsEdit] = React.useState( false );

	const handleClick = () => {
		if( !isMobile() ) return;
		
		const tempClasses = [ ...classes ];

		if( !tempClasses.includes('labeled-text-selected') ){
			tempClasses.push('labeled-text-selected');
		}
		else{
			tempClasses.pop();
		}
	}

	const handleChangeContent = e => {
		setCurrentContent( e.target.value );
	}

	return(
		<div className={classes.join(' ')} onClick={handleClick}>
			<span style={{ width: 'fit-content' }} className="m-0 p-0">
				{ label }
			</span>
			{
				isEdit
					? <TextField 
						type={type ?? 'text'}
						variant="standard" 
						sx={{ width: '100%' }} 
						defaultValue={content} 
						onChange={handleChangeContent}
					/>
					: (
						<span style={{ width: 'fit-content' }} className="m-0 p-0">
							{ currentContent }
						</span>
						)
			}
			<div className="labeled-text-edit-btn">
				{
					isEdit
						? (
							<>
								<IconButton onClick={() => setIsEdit( false )}>
									<SaveIcon/>
								</IconButton>
								<IconButton onClick={() => setIsEdit( false )}>
									<CloseIcon/>
								</IconButton>
							</>
							)
						: (
							<IconButton onClick={() => setIsEdit( true )}>
								<EditIcon/>
							</IconButton>
							)
				}
			</div>
		</div>
	);
}

export default LabeledText;