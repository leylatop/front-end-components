
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { routers } from "./router";
import { Title } from "./components/Title";
import { useState } from "react";

const ThemeToggleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      d="M12 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm5.657 2.343a1 1 0 011.414 0l1.414 1.414a1 1 0 11-1.414 1.414L17.657 5.757a1 1 0 010-1.414zM12 18a6 6 0 100-12 6 6 0 000 12zm0 2a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm7.071-3.071a1 1 0 011.414 0l1.414 1.414a1 1 0 11-1.414 1.414l-1.414-1.414a1 1 0 010-1.414zM4.929 4.929a1 1 0 010 1.414L3.515 7.757a1 1 0 11-1.414-1.414L3.515 4.93a1 1 0 011.414 0zM4 12a1 1 0 011-1h2a1 1 0 110 2H5a1 1 0 01-1-1zm12 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-7.071 7.071a1 1 0 010 1.414l-1.414 1.414a1 1 0 11-1.414-1.414l1.414-1.414a1 1 0 011.414 0z"
    />
  </svg>
);

const TopBar = () => {
  return (
    <div className='flex w-full p-4 border-b'>
      <h1 className='text-4xl primary-color'>Front-End Component PlayGround</h1>
    </div>
  )
}


const NavBar = () => {
  const location = useLocation();

  return (
    <div className='flex flex-col p-4 flex-shrink-0 border-r'>
      {
        routers.map((router, index) => {
          const isActive = location.pathname === router.path
          return (
            <div className='h-6'>
              <Link className={ isActive ? 'primary-color' : ''} key={index} to={router.path}>{router.name}</Link>
            </div>
          )
        })
      }
    </div>
  )
}

const Main = () => {
  return (
    <div className='p-6'>
      <Routes>
        {
          routers.map((router, index) => {
            return (
              <Route key={index} path={router.path} element={<>
                <Title>{router.name}</Title>
                <router.component />
              </>} />
            )
          })
        }
      </Routes>
    </div>
  )
}

const App = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className='flex flex-col w-full h-full'>
      <button onClick={toggleTheme} className="absolute right-4 top-4 p-2 rounded-full dark:bg-gray-800">
        <ThemeToggleIcon />
      </button>
      <TopBar />
      <div className='flex flex-grow'>
        <BrowserRouter basename='/'>
          <NavBar />
          <Main />
        </BrowserRouter>
      </div>
    </div>
  )
}


export default App
