// import { Route, Routes } from 'react-router-dom'
// import './App.css';
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import Register from './components/Register';
// import Main from './layouts/Main';        
// import PrivateRoutes from './layouts/PrivateRoutes';
// import PublicRoutes from './layouts/PrivateRoutes';

// function App() {
//   return (
//     <Routes>
//       <Route element={<Main />}>
//         <Route element={<PrivateRoutes />}>
//           <Route path='/' element={<Dashboard />} />
//         </Route>
//       </Route>
//       <Route element={<PublicRoutes />}>
//         <Route path='/login' element={<Login />} />
//         <Route path='/register' element={<Register />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;
//================================================================
import './App.css';
import './css/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import Main from './layouts/Main';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoutes from './layouts/PrivateRoutes';
import PublicRoutes from './layouts/PublicRoutes';
import Layout from './layouts/Layout';
import UserList from './components/user/UserList';
import UserAdd from './components/user/UserAdd';
import UserUpdate from './components/user/UserUpdate';
import PageNotFound from './components/PageNotFound';
import Profile from './components/Profile';
import PostList from './components/post/PostList';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<Main />}>
          <Route element={<PrivateRoutes />}>
            <Route path='/' element={<Dashboard />} />
            <Route path='/users' element={<UserList />} />
            <Route path='/users/add' element={<UserAdd />} />
            <Route path='/users/edit/:id' element={<UserUpdate />} />
            <Route path='/profile' element={<Profile />} />
              <Route path='/posts' element={<PostList />} />
          </Route>
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
      </Route>
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
