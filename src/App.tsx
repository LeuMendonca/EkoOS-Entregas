import { useEffect } from "react";
import Login from "./pages/login/Login"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import PageConsultaEntregadores from './pages/entregadores/consulta/PageConsultaEntregadores.tsx'
import Layout from './pages/layout/Layout.tsx'
import PageHome from './pages/home/PageHome.tsx'
import PageCadastroEntregador from './pages/entregadores/cadastro/PageCadastroEntregador.tsx'
import PageConsultaVeiculo from './pages/veiculos/consulta/PageConsultaVeiculo.tsx'
import PageCadastroVeiculo from './pages/veiculos/cadastro/PageCadastroVeiculo.tsx'
import PageConsultaEntregas from './pages/entregas/consulta/PageConsultaEntregas.tsx'
import PageEntregadores from "./pages/entregadores/PageEntregadores.tsx";
import PageVeiculos from "./pages/veiculos/PageVeiculos.tsx";

const router = createBrowserRouter([
  {
      path: '/login',
      element: <Login/>
  },
  {
      path: '/',
      element: <Layout/>,
      children: [
          {
            path: '/home',
            element: <PageHome/>
          },
          {
            path: '/entregadores',
            element: <PageEntregadores/>
          },
          {
            path: '/veiculos',
            element: <PageVeiculos/>
          },
          {
            path: '/entregas',
            element: <PageConsultaEntregas/>
          }
      ]
  }
])

function App() {
  return (
    <>
      <RouterProvider router={ router }/>
      <ToastContainer />
    </>
  )
}

export default App
