import React, {ChangeEvent, useState} from 'react';
import {addUser} from "../table/tableSlice";
import { useAppDispatch } from '../../app/hooks';
import './form.scss'

const Form = () => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthday: '',
    })

    return (
        <div id='form'>
            <h2>User Form</h2>
            <input type="text"
                   value={formData.firstName}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: e.target.value})}
                   placeholder='First name'/>
            <input type="text" value={formData.lastName}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: e.target.value})}
                   placeholder='Last name'/>
            <input type="date"
                   value={formData.birthday}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, birthday: e.target.value})}
                   placeholder='Birthday'/>
            <button onClick={() => dispatch(addUser(formData))}>Save</button>
        </div>
    )
}

export default Form