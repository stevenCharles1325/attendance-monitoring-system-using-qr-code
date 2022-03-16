import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';


/* ========================================================================
+	IMPORTANT NOTE!
+		- Make sure that 'viewPaths' contains the same order as 'views',
+		as it matches the pathname and set the view to the index of the
+		matched pathname.
==========================================================================*/

const Authentication = props => {
	const [view, setView] = React.useState( null ); // This will contain the requested view.
	const [content, setContent] = React.useState( props?.loading );

	/* ====================================================
	+	These are lists containing each pathnames of views.
	+	Ex: [ '/sign-up', '/sign-in' ]
	======================================================*/
	const viewPaths = props?.viewPaths; 
	const gatePaths = props?.gatePaths;


	/* ====================================================
	+	These are lists containing each view.
	+	Ex: [ <SignIn />, <SignUp /> ]
	======================================================*/
	// const views = props?.views;
	// const gateViews = props?.gateViews;

	const verify = async token => {
		const success = () => {
			viewPaths.forEach(( viewPath, index ) => {
				if( viewPath === window.location.pathname ){
					return;
				}
				else if( index === viewPaths.length - 1 ){
					return setView( viewPaths[ 0 ] );
				}
			});
		}

		const error = () => {
			gatePaths.forEach(( gatePath, index ) => {
				if( gatePath === window.location.pathname ){
					return;
				}
				else if( index === gatePaths.length - 1 ){
					return setView( gatePaths[ 0 ] );
				}
			});
		}

		if( props?.verificationEndpoint ){
			Axios.get( props.verificationEndpoint, {
				 headers: {
	                'authorization': `Bearer ${token}`
	            }
			})
			.then( res => {
				if( props?.onSuccess ) props.onSuccess( res );
				
				// set view to request view
				// If request view is sign-in or sign-up then go to home
				// else redirect to request view
				
				success();
			})
			.catch( err => {
				if( props?.onError ) props.onError( err );

				// if error is 401 then go to sign-in or sign-up
				if( err?.response?.status === 401 ){
					error();
				}
			});
		}
		else{
			error();
		}
	}

	React.useEffect(() => {
		const token = Cookies.get('token');

		verify( token );
	}, []);

	React.useEffect(() => {
		if( view && props?.status !== 'off' ){ 
			setTimeout(() => setContent( props.children ), 1000);
			props?.setRedirectTo?.( <Navigate to={view}/> );
		}

	}, [view]);

	return (
		<>
			{ props?.status === 'off' ? props.children : content }
		</>
	);
}

export default Authentication;