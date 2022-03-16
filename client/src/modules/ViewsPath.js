/* ========================================

	A View Class for all routes in the app.
	Remember that the first argument must be
	the root, and root is always required.

==========================================*/

export default class ViewPaths{
	#generateViewPaths( root, viewNames ){
		const handleGeneratePaths = root => path => {
			return root === '/' 
				? `${root}${path}`
				: `${root}/${path}`;
		}

		return viewNames.map( viewName => 
			viewName.indexOf('/') >= 0
				? handleGeneratePaths( this.root )( viewName.replaceAll('/', '') )
				: handleGeneratePaths( this.root )( viewName )
		);

	}

	constructor( root, ...args ){
		// Reformating root in case it has forward slashes in both left and right.
		this.root = root?.replaceAll?.('/') !== '' ? `/${root}` : '/';

		// Generating the right format for views path;
		this.viewsPaths = this.#generateViewPaths(this.root, [ ...args ]);
		
		this.signInIndex = null;
		this.signUpIndex = null;
		this.homeIndex = null;
	}

	get home(){
		return this.homeIndex;
	}

	get signUp(){
		return this.signUpIndex;
	}

	get signIn(){
		return this.signInIndex;
	}

	printPaths(){
		console.log( this.viewsPaths );
	}

	getPaths(){
		return this.viewsPaths;
	}

	validate( route ){
		return !route ? false : this.views.includes( route );
	}

	exit(){
		return this.signIn;
	}

	isRoot( route ){
		return !route ? false : route === this.root;
	}
}