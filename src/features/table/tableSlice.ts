import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../app/store";

interface Input {
    val: string,
    edit?: boolean
}

export interface UserInterface {
    firstName: Input
    lastName: Input
    birthday: Input,
}

export interface Table {
    list: Array<UserInterface>,
}


const initialState: Table = {
    list: [{
        firstName: {val: 'John', edit: false},
        lastName: {val: 'Doe', edit: false},
        birthday: {val: '25-06-1990', edit: false}
    }],
}

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        addUser: (state, action) => {
            const data = {...action.payload};
            for(let k in data) {
                data[k] = {
                    val: data[k],
                    edit: false
                }
            }
            state.list.push(data)
            localStorage.setItem('listData', JSON.stringify(state.list))
            return state
        },
        toggleEdit: (state, action: PayloadAction<{idx: number, key: string }>) => {
            const data = action.payload
            // @ts-ignore
            state.list[data.idx][data.key].edit = !state.list[data.idx][data.key].edit
            localStorage.setItem('listData', JSON.stringify(state.list))

            return state
        },
        inputChange: (state, action: PayloadAction<{idx: number, key: string, value: string}>) => {
            const data = action.payload;
            // @ts-ignore
            state.list[data.idx][data.key].val = data.value;
            localStorage.setItem('listData', JSON.stringify(state.list))

            return state
        },
        editListRow: (state, action: PayloadAction<{idx: number, key: string, value: string}>) => {
            const data: any = action.payload
            // @ts-ignore
            state.list[data.idx][data.key].val = data.value
            localStorage.setItem('listData', JSON.stringify(state.list))

            return state
        },
        deleteRow: (state, action: PayloadAction<Array<number>>) => {
            state.list = state.list.filter((el, i) => !action.payload.includes(i))
            localStorage.setItem('listData', JSON.stringify(state.list))

            return state
        },
        reorderList: (state, action: PayloadAction<Array<UserInterface>>) => {

            state.list = action.payload

            return state
        }
    }
});

export const editData = (data: any): AppThunk => (dispatch) => {
    console.log(data)
    dispatch(editListRow(data))
    dispatch(toggleEdit(data))
};

export const { addUser, toggleEdit, editListRow, inputChange, deleteRow, reorderList } = tableSlice.actions;

export default tableSlice.reducer;