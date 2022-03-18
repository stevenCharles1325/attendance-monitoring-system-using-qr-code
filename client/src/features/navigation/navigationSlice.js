import { createSlice } from '@reduxjs/toolkit';

export const navigationSlice = createSlice({
	name: 'navigation',
	initialState: {
		to: null
	},
	reducers: {
		handleNavigateTo: (state, action) => {
			state.to = action.payload
		}
	}
});

export const { handleNavigateTo } = navigationSlice.actions;

export default navigationSlice.reducer;

