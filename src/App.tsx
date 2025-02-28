import Login from "./pages/login/PageLogin.tsx"
import {  ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Layout from './pages/layout/Layout.tsx'
import PageEntregadores from "./pages/entregadores/PageEntregadores.tsx";
import PageVeiculos from "./pages/veiculos/PageVeiculos.tsx";
import PageAgendamentosEntregas from "./pages/entregas/agendamento/PageAgendamentosEntregas.tsx";
import PageConsultaEntregas from "./pages/entregas/consulta/PageConsultaEntregas.tsx";
import { LoginRequerido } from "./components/loginRequerido.tsx";
import PageGerentes from "./pages/gerentes/PageGerentes.tsx";

const router = createBrowserRouter([
  {
      path: '/login',
      element: <Login/>
  },
  {
      path: '/',
      element: <LoginRequerido><Layout/></LoginRequerido>,
      children: [
          {
            path: '/entregadores',
            element: <PageEntregadores/>
          },
          {
            path: '/gerentes',
            element: <PageGerentes/>
          },
          {
            path: '/veiculos',
            element: <PageVeiculos/>
          },
          {
            path: '/entregas',
            element: <PageAgendamentosEntregas/>,
            
          },
          
          {
            path: '/consultar-entregas',
            element: <PageConsultaEntregas/>

          }
      ]
  }
])

function App() {
  return (
    <>
        <RouterProvider router={ router }/>
        <ToastContainer autoClose={ 1500 } position="bottom-right"/>
    </>
  )
}

export default App
