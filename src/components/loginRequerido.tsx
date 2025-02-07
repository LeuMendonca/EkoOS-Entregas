import { usuarioAutenticado } from "../context/useAutenticacao";
import PageLogin from "../pages/login/PageLogin";


export const LoginRequerido = ({ children }: {children: JSX.Element|JSX.Element[]}) => {

    const autenticacao = usuarioAutenticado();

    if(!autenticacao.login){
        return(
            <PageLogin/>
        )
    }

    return children;

}