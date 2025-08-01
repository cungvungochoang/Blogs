import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import requestApi from '../helpers/api';
import * as actions from '../redux/actions';

const Dashboard = () => {
    const dispatch = useDispatch();
    const [dashboardData, setDashboardData] = useState({});

    useEffect(() => {
        const promiseUsers = requestApi('/users', 'GET');
        const promisePosts = requestApi('/posts', 'GET');
        dispatch(actions.controlLoading(true));
        Promise.all([promiseUsers, promisePosts]).then((res) => {
            setDashboardData({...dashboardData, totalUsers:res[0].data.total, totalPosts:res[1].data.total});
            dispatch(actions.controlLoading(false));
        }).catch((err) => {
            console.error(err);
            dispatch(actions.controlLoading(false));
        })
    }, []);

  return (
    <div id="layoutSidenav_content">
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Dashboard</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                    <div className="row">
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-primary text-white mb-4">
                                <div className="card-body">Total Users:
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">                                
                                        {dashboardData.totalUsers}
                                    </span>
                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    <Link to="/users" className="small text-white stretched-link">View Details</Link>
                                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-warning text-white mb-4">
                                <div className="card-body">Total Posts:
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">                                
                                        {dashboardData.totalPosts}
                                    </span>
                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                <Link to="/posts" className="small text-white stretched-link">View Details</Link>
                                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-xl-3 col-md-6">
                            <div className="card bg-success text-white mb-4">
                                <div className="card-body">Success Card</div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    <a className="small text-white stretched-link" href="#">View Details</a>
                                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-danger text-white mb-4">
                                <div className="card-body">Danger Card</div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    <a className="small text-white stretched-link" href="#">View Details</a>
                                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div> */}
                    </div>            
                </div>
            </main>
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
  )
}

export default Dashboard
