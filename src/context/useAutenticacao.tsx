import { useContext } from "react";
import { AuthContext } from "./AutenticacaoContext";

export const usuarioAutenticado = () => {
    const context = useContext(AuthContext);
    return context;
}