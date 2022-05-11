import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';

import { QrReader } from 'react-qr-reader';
import { QRCode } from 'react-qrcode-logo';

// Generetor icons
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Scanner icons
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import CloseIcon from '@mui/icons-material/Close';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const HideButtons = props => {
	return (
		<div 
			style={{ 
				width: '100%', 
				height: '100%',
			}}

			className="d-flex justify-content-center align-items-center"
		>
			{ props?.children }
		</div>
	);
}

const Scanner = props => {
	const [open, setOpen] = React.useState( false );
	const qrRef = React.useRef( null );
	const [qrSize, setQrSize] = React.useState( 0 );

	const handleResize = () => {
		setQrSize( qrRef.current?.clientWidth );
	}

	React.useEffect(() => {
		window.addEventListener('resize', handleResize);

		return() => window.removeEventListener('resize', handleResize);
	}, []);

	return(
		<div className="qr-component-box" ref={qrRef}>
			{
				open
				? <div className="position-relative d-flex justify-content-center align-items-center"> 
					<QrReader
						constraints={{ facingMode: 'environment' }}
						containerStyle={{
							width: '100%',
							maxWidth: '300px',
							height: '100%'
						}}
						videoContainerStyle={{
							width: '100%',
							height: '100%'
						}}
					    onResult={(result, error) => {
				        	if( result ) props?.onScan?.( result.text );
						}}
					/>
					<div className="position-absolute top-0 end-0">
						<Tooltip title="Close" arrow>
							<IconButton onClick={() => setOpen( false )}>
								<CloseIcon/>
							</IconButton>
						</Tooltip>
					</div>
				</div>
				: <HideButtons>
					<Tooltip title="Scan" arrow>
						<IconButton onClick={() => setOpen( true )}>
							<DocumentScannerIcon/>
						</IconButton>
					</Tooltip>
				</HideButtons>
			}
		</div>
	);
}

const Generator = props => {
	const [open, setOpen] = React.useState( false );
	const qrRef = React.useRef( null );
	const [qrSize, setQrSize] = React.useState( 0 );

	const handleResize = () => {
		setQrSize( qrRef.current?.clientWidth );
	}

	React.useEffect(() => {
		window.addEventListener('resize', handleResize);

		return() => window.removeEventListener('resize', handleResize);
	}, []);

	return(
		<div 
			className="qr-component-box" 
			ref={qrRef}
		>
			{
				open
				? <div className="position-relative"> 
					<QRCode
						size={qrSize ? qrSize - 50 : qrRef.current?.clientWidth - 50}
						// size={qrRef.current?.clientWidth - 50}
						eyeRadius={1}
						logoWidth={80}
						logoOpacity={0.5}
						value={props.value}
						logoImage="/images/logo/cctLogo_new.png" 
					/>
					<div className="position-absolute top-0 end-0">
						<Tooltip title="Close" arrow>
							<IconButton onClick={() => setOpen( false )}>
								<CloseIcon/>
							</IconButton>
						</Tooltip>
					</div>
				</div>
				: <HideButtons>
					<Tooltip title="Open" arrow>
						<IconButton onClick={() => setOpen( true )}>
							<VisibilityOffIcon/>
						</IconButton>
					</Tooltip>
				</HideButtons>
			}
		</div>
	);
}

export const QR = { Scanner, Generator };