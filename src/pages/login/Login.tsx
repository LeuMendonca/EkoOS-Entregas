// import Image from "next/image"
import styles from "./Login.module.css"
import imageLogin  from "../../img/image-login.jpg"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { usuarioAutenticado } from "../../context/useAutenticacao"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export default function Login() {

    const navigate = useNavigate()

    const AutenticacaoContext = usuarioAutenticado();

    const schema = z.object({
        dbedUsuario: z.string().trim().min(1,'Usuário obrigatório!'),
        dbedSenha: z.string().trim().min(1,'Senha obrigatória!'),
    })

    type LOGIN = z.infer<typeof schema>

    const { register, handleSubmit , formState: { errors }} = useForm<LOGIN>({
        resolver: zodResolver(schema),
        defaultValues: {
            dbedUsuario: '',
            dbedSenha: ''
        }
    })

    async function handleSubmitFormulario( data: LOGIN ){
        try {
            await AutenticacaoContext.autenticacao( data.dbedUsuario , data.dbedSenha )
            navigate('/entregas')
        } catch( error ) {
            toast.error("Usuário inexistente!")
            console.log( error )
        }
    }

    return (
        <div className={styles.containerCenter}>
            <img src={ imageLogin } className={ styles['img-login'] }/>
            <section className={styles.login}>
                
                <div className={ styles.titles }>
                    <h2>EkoOS Entregas</h2>
                    <h3>Login</h3>
                </div>
                
                <form onSubmit={ handleSubmit(handleSubmitFormulario) }>
                    <div className={ styles.formControl}>
                        <input 
                            type="text"
                            placeholder="Usuário"
                            className={styles.input}
                            {...register("dbedUsuario")}
                        />
                        { errors.dbedUsuario &&
                        <span className={ styles.textError}> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                            {errors.dbedUsuario.message}
                        </span>}
                    </div>
                    
                    
                    <div className={ styles.formControl}>
                        <input 
                            type="password"
                            placeholder="Senha"
                            className={styles.input}
                            {...register("dbedSenha")}
                        />
                        { errors.dbedSenha &&
                            <span className={ styles.textError}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                                { errors.dbedSenha.message }
                            </span>
                        }
                    </div>
                    

                    <button type="submit">
                      Acessar
                    </button>
                </form>
            </section>
        </div>
    );
}
