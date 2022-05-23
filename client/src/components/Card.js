import React from 'react';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

const Card = props => {
	return(
		<div className="w-fit h-fit shadow p-3 m-3 bg-white rounded">
			<div className="w-full h-full min-w-[250px] max-w-[600px] min-h-[100px]">
				{/*<h1 className="text-truncate mb-2 text-left text-capitalize font-bold"></h1>*/}
				<div className="d-flex justify-content-start mb-2 tracking-[1px]">
					<Chip avatar={props?.chipIcon} label={props?.title} variant={props?.chipVariant} color={props?.chipColor ?? 'info'} className="shadow-md"/>
				</div>
				<Divider/>
				<div className="text-[13px]">
					<p className="text-left mt-2 text-[#646464] tracking-[1px]">{ props?.description }</p>
					{
						props?.children
					}
					<br/>
					{
						props?.buttonOff
							? null
							: <div className="w-full h-fit d-flex justify-content-end">
									<Button size="small" variant="outlined" onClick={props?.onClick}>
										{ props?.buttonLabel }
									</Button>
							</div>
					}
				</div>
			</div>
		</div>
	);
}


export default Card;