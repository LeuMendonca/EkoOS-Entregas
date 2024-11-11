import { usuarioAutenticado } from "../context/useAutenticacao";
import Login from "../pages/login/Login";


export const LoginRequerido = ({ children }: {children: JSX.Element|JSX.Element[]}) => {

    const autenticacao = usuarioAutenticado();

    if(!autenticacao.login){
        return(
            <Login/>
        )
    }

    return children;

}