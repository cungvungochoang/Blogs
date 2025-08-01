import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../redux/actions';
import requestApi from '../helpers/api';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Profile = () => {
    const [profileData, setProfileData] = useState({});
    const [isSelectedFile, setSelectedFile] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.controlLoading(true));
        requestApi('/users/profile', 'GET').then((res) => {
            console.log("Profile data: ", res.data);
            setProfileData({...res.data, avatar: process.env.REACT_APP_API_URL + '/' + res.data.avatar});
            dispatch(actions.controlLoading(false));
        }).catch((error) => {
            console.log("Error: ", error);
            dispatch(actions.controlLoading(false));
        });
    }, []);
    
    const onImageChange = (e) => {
        if(e.target.files[0]){
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = (e) => {
                setProfileData({...profileData, avatar: reader.result, file: file});
                setSelectedFile(true);
            }
            reader.readAsDataURL(file);
        }
    }

    const handleUpdateAvatar = () => {
        const formData = new FormData();
        formData.append('avatar', profileData.file);
        dispatch(actions.controlLoading(true));
        requestApi('/users/upload-avatar', 'POST', formData, 'json', 'multipart/form-data').then((res) => {
            console.log("Update avatar: ", res);
            dispatch(actions.controlLoading(false));
            toast.success('Update avatar successfully!');
        }).catch((error) => {
            console.log("Error: ", error);
            dispatch(actions.controlLoading(false));
        });
    }
    
  return (
    <div id="layoutSidenav_content">
        <div className="container-fluid px-4">
            <h1 className="mt-4">User profile</h1>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item"><Link to='/'>Dashboard</Link></li>
                <li className="breadcrumb-item active">Upload avatar</li>
            </ol> 
            <div className='card mb-4'>
                <div className='card-header'>
                    <h3 className='fas fa-plus me-1'></h3>
                    Update avatar
                </div>
                <div className='card-body'>
                    <div className='row mb-3'>
                        <div className='col-md-4'>
                            <img src={ '../assets/images/avt_default.png'} className='img-thumbnail' alt='User Avatar'></img>
                            <div className='input-file float-start'>
                                <label htmlFor='file' className='btn btn-primary mt-3'>Choose avatar</label>
                                <input type='file' className='form-control' id='file' name='avatar' onChange={onImageChange} accept='image/*'/>
                            </div>
                            {isSelectedFile && <button className='btn btn-sm float-end btn-success' onClick={handleUpdateAvatar}>Upload</button>}
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile
