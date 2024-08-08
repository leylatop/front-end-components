
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { routers } from "./router";
import { Title } from "./components/Title";

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
  return (
    <div className='flex flex-col w-full h-full'>
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
