import { createSlice } from '@reduxjs/toolkit';

export const formSlice = createSlice({
	name: 'form',
	initialState: {
		userId: '',
		userPass: '',
		userBday: '',
		userRole: ''
	},
	reducers: {
		handleUserId: (state, action) => {
			state.userId = action.payload
		},
		handleUserPass: (state, action) => {
			state.userPass = action.payload
		},
		handleUserBday: (state, action) => {
			state.userBday = action.payload
		},
		handleUserRole: (state, action) => {
			state.userRole = action.payload
		}
	}
});

export const { 
	handleUserId, 
	handleUserPass, 
	handleUserBday, 
	handleUserRole 
} = formSlice.actions;

export default formSlice.reducer;

