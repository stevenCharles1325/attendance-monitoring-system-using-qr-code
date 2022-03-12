import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';


/* ========================================================================
+	IMPORTANT NOTE!
+		- Make sure that 'viewPaths' contains the same order as 'views',
+		as it matches the pathname and set the view to the index of the
+		matched pathname.
==========================================================================*/

const Authentication = props => {
	const [view, setView] = React.useState( null ); // This will contain the requested view.

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
	const views = props?.views;
	const gateViews = props?.gateViews;


	const verify = async token => {
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
				viewPaths.forEach(( viewPath, index ) => {
					if( viewPath === window.location.pathname ){
						return setView( views[ index ] );
					}
					else if( index === viewPaths.length - 1 ){
						return setView( views[ 0 ] );
					}
				});

			})
			.catch( err => {
				if( props?.onError ) props.onError( err );

				// if error is 401 then go to sign-in or sign-up
				if( err?.response?.status === 401 ){
					gatePaths.forEach(( gatePath, index ) => {
						if( gatePath === window.location.pathname ){
							return setView( gateViews[ index ] );
						}
						else if( index === gatePaths.length - 1 ){
							return setView( gateViews[ 0 ] );
						}
					});
				}
			});
		}
	}

	React.useState(() => {
		const token = Cookies.get('token');

		verify( token );
	}, []);

	return { view };
}
