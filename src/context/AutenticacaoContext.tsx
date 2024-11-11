import { createContext, useEffect, useState } from "react";
import { api } from "../services/axios";

interface USUARIO {
    seq_tenant?: number;
    login?: string;
    type_user?: number;
    seq_entregador?: number;
    nome_empresa?: string;
}

interface PROVEDOR_AUTENTICACAO{
    children: JSX.Element;
}

interface CONTEXTO extends USUARIO {
    autenticacao: (usuario: string, senha: string) => Promise<void>;
    logout: () => void;
}

export function setUserLocalStorage(usuario: USUARIO | null){

    sessionStorage.setItem("user", JSON.stringify(usuario))

}

export function getUserLocalStorage(){

    const jsonUsuario = sessionStorage.getItem("user");

    if(!jsonUsuario){
        return null;
    }

    const usuarioLS = JSON.parse(jsonUsuario);

    return usuarioLS ?? null;

}

export const AuthContext = createContext<CONTEXTO>({} as CONTEXTO)

export const AuthProvider = ({ children }: PROVEDOR_AUTENTICACAO) => {  

    const[usuario, setUsuario] = useState<USUARIO | null>()

    async function autenticacao( usuario: string, senha: string ) {
        
        const response = await api.get('login/', {
            params:{
                usuario: usuario,
                senha: senha
            }
        }) 

        const dadosLogin  = {   
            seq_tenant: response.data.Usuario[0].seq_tenant,
            login: response.data.Usuario[0].login,
            type_user: response.data.Usuario[0].type_user,
            seq_entregador: response.data.Usuario[0].seq_entregador,
            nome_empresa: response.data.Usuario[0].nome_empresa,
        }

        console.log( "Dados:" , dadosLogin )

        setUsuario(dadosLogin);
        setUserLocalStorage(dadosLogin);                
        
    }

    function logout(){
        setUsuario(null);
        setUserLocalStorage(null);
    }

    useEffect(() =>{
    
        const usuarioLS = getUserLocalStorage();
        if (usuarioLS) {
            setUsuario(usuarioLS);
        }

    }, []);

    return(
        <AuthContext.Provider value={{...usuario, autenticacao, logout}}>
            { children }
        </AuthContext.Provider>
    )
}