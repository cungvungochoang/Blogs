import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import requestApi from '../helpers/api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux'   
import * as actions from '../redux/actions';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginData, setLoginData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if(isSubmitted) {
            validateForm();
        }
    }, [loginData]);

    const onChange = (event) => {
        let target = event.target;
        setLoginData({
            ...loginData, 
            [target.name]: target.value
        });
    }

    const onSubmit = () => {
        console.log(loginData);
        let valid = validateForm();
        if(valid){
            console.log('request login api');
            dispatch(actions.controlLoading(true));
            requestApi('/auth/login', 'POST', loginData).then((res) => {
                console.log(res);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                toast.success("Log in successfully!", {position: "top-right"});
                dispatch(actions.controlLoading(false));
                navigate('/');
            }).catch((error) => {
                console.log(error);
                dispatch(actions.controlLoading(false));
                if(typeof error.response !== "undefined") {
                    if(typeof error.status !== 201) {
                        toast.error(error.response.data.message, {position: "top-right"});   
                    }  
                    else{
                        toast.error("Server is down. Please try again later!", {position: "top-right"})
                    }
                }
            });
        }
        setIsSubmitted(true);   
    }   

    const validateForm = () => {
        let isValid = true;
        const errors = {};        
        if(loginData.email === '' || loginData.email === undefined){
            errors.email = "Please enter a valid email";
        }else{
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!valid.test(loginData.email)) {
                errors.email = "Email is not valid";
                isValid = false;
            }
        }
        if(loginData.password ===  '' || loginData.password === undefined){
            errors.password = "Please enter password";
        }
        if(Object.keys(errors).length > 0){
            setFormErrors(errors);
            isValid = false;
        }else{
            setFormErrors({});
        }
        return isValid;
    }

  return (
    <div id="layoutAuthentication" className="bg-primary">
        <div id="layoutAuthentication_content">
            <main>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="card shadow-lg border-0 rounded-lg mt-5">
                                <div className="card-header"><h3 className="text-center font-weight-light my-4">Login</h3></div>
                                <div className="card-body">
                                    <form>
                                        <div className="form-floating mb-3">
                                            <input className="form-control" name='email' type="email" onChange={onChange} placeholder="name@example.com" />
                                            <label>Email address</label>
                                            {formErrors.email && <p style={{color:"red"}}>{formErrors.email}</p> }
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input className="form-control" name='password' type="password" onChange={onChange} placeholder="Password" />
                                            <label>Password</label>
                                            {formErrors.password && <p style={{color:"red"}}>{formErrors.password}</p> }
                                        </div>
                                        {/* <div className="form-check mb-3">
                                            <input className="form-check-input" id="inputRememberPassword" type="checkbox" value="" />
                                            <label className="form-check-label" for="inputRememberPassword">Remember Password</label>
                                        </div> */}
                                        <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                                            <a className="small" href="password.html">Forgot Password?</a>
                                            <button className="btn btn-primary" type='button' onClick={onSubmit}>Login</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="card-footer text-center py-3">
                                    <div className="small">
                                        <Link to="/register">Need an account? Sign up!</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        <div id="layoutAuthentication_footer">
            <footer className="py-4 bg-light mt-auto">
                <div className="container-fluid px-4">
                    <div className="d-flex align-items-center justify-content-between small">
                        <div className="text-muted">Copyright &copy; Your Website 2021</div>
                        <div>
                            <a href="#">Privacy Policy</a>
                            &middot;
                            <a href="#">Terms &amp; Conditions</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
  )
}

export default Login
