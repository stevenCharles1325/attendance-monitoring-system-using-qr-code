import { createSlice } from '@reduxjs/toolkit';

export const accountSlice = createSlice({
	name: 'account',
	initialState: {
		id: '',
		role: '',
		firstName: '',
		middleName: '',
		lastName: '',
		birthDate: '',
		lrn: '',
		email: '',
		gender: '',
		section: null,
		strand: null,
		strandName: '',
		subjects: [],
		sectionName: {
			name: null,
			parent: null
		},
		userType: null
	},
	reducers: {
		handleId: (state, action) => {
			state.id = action.payload
		},
		handleRole: (state, action) => {
			state.role = action.payload
		},
		handleFirstName: (state, action) => {
			state.firstName = action.payload
		},
		handleMiddleName: (state, action) => {
			state.middleName = action.payload
		},
		handleLastName: (state, action) => {
			state.lastName = action.payload
		},
		handleBirthDate: (state, action) => {
			state.birthDate = action.payload
		},
		handleSection: (state, action) => {
			state.section = action.payload
		},
		handleStrand: (state, action) => {
			state.strand = action.payload
		},
		handleSubjects: (state, action) => {
			state.subjects = action.payload
		},
		handleStrandName: (state, action) => {
			state.strandName = action.payload
		},
		handleSectionName: (state, action) => {
			state.sectionName.name = action.payload
		},
		handleSectionParent: (state, action) => {
			state.sectionName.parent = action.payload
		},
		handleUserType: (state, action) => {
			state.userType = action.payload
		},
		handleLrn: (state, action) => {
			state.lrn = action.payload
		},
		handleEmail: (state, action) => {
			state.email = action.payload
		},
		handleGender: (state, action) => {
			state.gender = action.payload
		},
		handleClear: state => {
			state.id = '';
			state.role = '';
			state.firstName = '';
			state.middleName = '';
			state.lastName = '';
			state.birthDate = '';
			state.section = null;
			state.strand = null;
			state.strandName = '';
			state.lrn = '';
			state.email = '';
			state.gender = '';
			state.subjects = [];
			state.sectionName = {
				name: null,
				parent: null
			};
			state.userType = null;
		}
	}
});

export const { 
	handleId, 
	handleRole,
	handleFirstName,
	handleMiddleName,
	handleLastName,
	handleBirthDate,
	handleSection,
	handleStrand,
	handleStrandName,
	handleSectionName,
	handleSectionParent,
	handleSubjects,
	handleUserType,
	handleClear,
	handleLrn,
	handleEmail,
	handleGender,
} = accountSlice.actions;

export default accountSlice.reducer;

