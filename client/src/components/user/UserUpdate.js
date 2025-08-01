import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import requestApi from '../../helpers/api';
import * as actions from '../../redux/actions';
import { toast } from 'react-toastify';


const UserUpdate = () => {
    const params = useParams();
    const dispatch = useDispatch();
    console.log("User id: ", params.id);
    const { register, setValue, handleSubmit, formState: { errors } } = useForm();

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(actions.controlLoading(true));
        try{
            const getDetailUser = async () => {
                const res = await requestApi(`/users/${params.id}`, 'GET');
                console.log("res => ", res);
                dispatch(actions.controlLoading(false));  
                const fields = ['firstName', 'lastName', 'status'];
                fields.forEach((field) => setValue(field, res.data[field]));               
            }
            getDetailUser();
        }
        catch(error){
            console.log("error => ", error);
            toast.error('Can not get user data!');
            dispatch(actions.controlLoading(false));
        }
    }, []);

    const handleSubmitFormUpdateUser = async (data) => {
        console.log(data);
        dispatch(actions.controlLoading(true));
        try{
            const res = await requestApi(`/users/${params.id}`, 'PUT', data);
            console.log(res);
            toast.success('User updated successfully!');
            dispatch(actions.controlLoading(false));
            setTimeout(() => navigate('/users'), 2000);
        }catch(error){
            console.log(error);
            toast.error('Can not update user!');
            dispatch(actions.controlLoading(false));
        }
    }



  return (
    <div id="layoutSidenav_content">
        <div className="container-fluid px-4">
            <h1 className="mt-4">Update User</h1>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item"><Link to='/'>Dashboard</Link></li>
                <li className="breadcrumb-item"><Link to='/users'>Users</Link></li>
                <li className="breadcrumb-item active">Update user</li>
            </ol> 
            <div className='card mb-4'>
                <div className='card-header'>
                    <h3 className='fas fa-plus me-1'></h3>
                    Update
                </div>
                <div className='card-body'>
                    <div className='row mb-3'>
                        <form>
                        <div className='col-md-6'>
                            <div className='mb-3 mt-3'> 
                                <label className='form-label'>First Name</label>
                                <input {...register('firstName', {required: 'First name is required.'})} type='text' className='form-control' placeholder='Enter first name' />
                                {errors.firstName && <p style={{color:"red"}}>{errors.firstName.message}</p> }
                            </div>
                            <div className='mb-3'> 
                                <label className='form-label'>Last Name</label>
                                <input {...register('lastName', {required: 'Last name is required.'})} type='text' className='form-control' placeholder='Enter last name' />
                                {errors.lastName && <p style={{color:"red"}}>{errors.lastName.message}</p> }
                            </div>
                            {/* <div className='mb-3 mt-3'> 
                            <label className='form-label'>Email</label>
                            <input {...register('email', {required: 'Email is required.', 
                                pattern:{
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: 'Invalid email address.'
                                }})} 
                            type='text' className='form-control' placeholder='Enter email' />
                            {errors.email && <p style={{color:"red"}}>{errors.email.message}</p> }
                            </div>
                            <div className='mb-3'> 
                            <label className='form-label'>Password</label>
                            <input {...register('password', {required: 'Password is required.'})} type='password' className='form-control' placeholder='Enter password' />
                            {errors.password && <p style={{color:"red"}}>{errors.password.message}</p> }
                            </div> */}
                            <div className='mb-3 mt-3'> 
                                <label className='form-label'>Status</label>
                                <select {...register('status', {required: 'Status is required.'})} className='form-select'>
                                    <option value='1'>Active</option>
                                    <option value='2'>Inactive</option>
                                </select>
                            </div>
                        </div>
                        <button type='submit' onClick={handleSubmit(handleSubmitFormUpdateUser)} className='btn btn-primary mt-3'>Update user</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserUpdate
