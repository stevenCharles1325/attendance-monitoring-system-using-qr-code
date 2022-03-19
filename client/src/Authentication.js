import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { Navigate, useLocation } from 'react-router-dom';


/* ========================================================================
+	IMPORTANT NOTE!
+		- Make sure that 'viewPaths' contains the same order as 'views',
+		as it matches the pathname and set the view to the index of the
+		matched pathname.
==========================================================================*/

const Authentication = props => {
	const [view, setView] = React.useState( null ); // This will contain the requested view.
	const [userLevel, setUserLevel] = React.useState( null );
	const [content, setContent] = React.useState( props?.loading );
	const [status, setStatus] = React.useState( null );
	const location = useLocation();

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
		const success = () => setStatus(() => 'success');
		const error = () => setStatus(() => 'error');

		if( props?.verificationEndpoint ){
			Axios.get( props.verificationEndpoint, {
				 headers: {
	                'authorization': `Bearer ${token}`
	            }
			})
			.then( res => {
				if( res?.data?.user?.role ){
					if( props?.setRole ) props.setRole( res.data.user.role );
					
					setUserLevel( res.data.user.role );
				}

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
		let { pathname } = location;

		pathname = pathname[ pathname.length - 1 ] === '/' && pathname !== '/' 
			? pathname.slice(0, pathname.length - 1 )
			: pathname;

		if( status === 'success' ){
			if(viewPaths.includes( pathname ) || (pathname === props?.root || pathname === '/')){
				if( userLevel && props?.userLevels ){
					if( props.userLevels[ userLevel ] ){

						const availablePaths = viewPaths.slice( 
							props?.userLevels?.[ userLevel ]?.[ 0 ], 
							props?.userLevels?.[ userLevel ]?.[ 1 ] 
						);

						const indexOfUserPath = availablePaths.indexOf( pathname );

						if( indexOfUserPath >= 0 ){
							return setView( pathname );
						}
						else if( props?.root === pathname || pathname === '/' ){
							return setView( availablePaths[ 0 ] );
						}
						else{
							return setContent( props?.pageNotFound );
						}
					}
				}

				return setView( pathname );
			}
			else{
				return setContent( props?.pageNotFound );
			}

			setStatus( null );
		}
		else if( status === 'error' ){
			gatePaths.forEach(( gatePath, index ) => {
				if( gatePath === pathname ){
					return setView( gatePaths[ index ] );
				}
				else if( index === gatePaths.length - 1 ){
					return setView( gatePaths[ 0 ] );
				}
			});

			setStatus( null );
		}

	}, [status, userLevel, viewPaths, gatePaths, location]);

	React.useEffect(() => {
		const token = Cookies.get('token');

		verify( token );
	}, []);

	React.useEffect(() => {
		if( view && props?.status !== 'off' ){ 
			setTimeout(() => setContent( props.children ), 1000);
			props?.setRedirectTo?.( view );
		}

	}, [view]);


	return (
		<>
			{ props?.status === 'off' ? props.children : content }
		</>
	);
}

export default Authentication;