import { configureStore } from '@reduxjs/toolkit';

// slices
import formReducer from '../features/form/formSlice';

export default configureStore({
	reducer: {
		form: formReducer
	}
});

