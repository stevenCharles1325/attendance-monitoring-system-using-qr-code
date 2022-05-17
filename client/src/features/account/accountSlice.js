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
		schoolStartDate: '',
		section: null,
		strand: null,
		strandName: '',
		subjects: [],
		teachers: [],
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
		handleSchoolStartDate: (state, action) => {
			state.schoolStartDate = action.payload
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
		handleTeachers: (state, action) => {
			state.teachers = action.payload
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
			state.schoolStartDate = '';
			state.section = null;
			state.strand = null;
			state.strandName = '';
			state.lrn = '';
			state.email = '';
			state.gender = '';
			state.subjects = [];
			state.teachers = [];
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
	handleSchoolStartDate,
	handleSubjects,
	handleUserType,
	handleClear,
	handleLrn,
	handleEmail,
	handleGender,
	handleTeachers
} = accountSlice.actions;

export default accountSlice.reducer;

