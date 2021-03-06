import { configureStore } from '@reduxjs/toolkit';

// slices
import formReducer from '../features/form/formSlice';
import navigationReducer from '../features/navigation/navigationSlice';
import accountReducer from '../features/account/accountSlice';

export default configureStore({
	reducer: {
		form: formReducer,
		navigation: navigationReducer,
		account: accountReducer
	}
});

