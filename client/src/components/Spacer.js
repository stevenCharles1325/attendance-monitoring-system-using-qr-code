export default function Spacer( props ){
	return(
		<>
			<div 
				style={{ 
					width: '100%', 
					height: `${props.height}px`,
					backgroundColor: 'transparent'
				}} 
			/>
		</>
	);	
}