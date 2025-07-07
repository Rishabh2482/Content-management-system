import ContentProvider from './context/Contentcontext';
import AuthProvider from './context/Authcontext';
import './App.css';
import Sidebar from './component/Sidebar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import Signup from './component/Signup';
import Privateroute from './component/Privateroute';
import Addcontext from './component/Addcontext';
import Editcontext from './component/Editcontext';
import Viewcontext from './component/Viewcontext';

// Addcontext,Editcontext,Viewcontext these are actualy content not context(by typing mistake understand context as content)
function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <div className='app-container'>
          <Sidebar/>
          <main className='main-content'>
            <Routes>
              <Route path='/login' element={<Login/>} />
              <Route path='/signup' element={<Signup/>} />
              <Route path='/add' element={
                <Privateroute>
                  <Addcontext />
                </Privateroute>
              }/>
              <Route path='/edit/:id' element={
                <Privateroute>
                  <Editcontext />
                </Privateroute>
              }/>
              <Route path='/view' element={<Viewcontext/>}/>
              <Route path='/' element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
