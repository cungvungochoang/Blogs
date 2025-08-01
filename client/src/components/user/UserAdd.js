import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; 
import { useDispatch } from 'react-redux';
import requestApi from '../../helpers/api'
import * as actions from '../../redux/actions';
import { toast } from 'react-toastify';

const UserAdd = () => {
  const { register, handleSubmit, formState:{errors} } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmitFormAddUser = async (data) => {
    try{
      const res = await requestApi(`/users`, 'POST', data);
      dispatch(actions.controlLoading(true));
      console.log(res);
      toast.success("Add user successfully!", {position: "top-right", autoClose: 2000});
      setTimeout(() => navigate(`/users`), 3000);
    }
    catch(error){
      console.log(error);
      toast.failed("Error occured, please try again!", {position: "top-right", autoClose: 2000});
    }
  }
  return (
    <div id="layoutSidenav_content">
      <div className="container-fluid px-4">
        <h1 className="mt-4">New User</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item"><Link to='/'>Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to='/users'>Users</Link></li>
          <li className="breadcrumb-item active">Add user</li>
        </ol> 
        <div className='card mb-4'>
          <div className='card-header'>
            <h3 className='fas fa-plus me-1'></h3>
            Add
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
                  <div className='mb-3 mt-3'> 
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
                  </div>
                  <div className='mb-3 mt-3'> 
                    <label className='form-label'>Status</label>
                    <select {...register('status', {required: 'Status is required.'})} className='form-select'>
                      <option value='1'>Active</option>
                      <option value='2'>Inactive</option>
                    </select>
                  </div>
                </div>
                <button type='submit' onClick={handleSubmit(handleSubmitFormAddUser)} className='btn btn-primary mt-3'>Add user</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserAdd
