import { z } from "zod"
import styles from "./Login.module.css"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { usuarioAutenticado } from "../../../context/useAutenticacao";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import animation from '../../../components/animation.module.css'

export default function Login() {

    const AutenticacaoContext = usuarioAutenticado();
    const navigate = useNavigate()

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
        }
    }
    return (
        <section className={`${styles.login}  ${ animation.introX }`}>
                
            <div className={ styles.titles }>
                <h2>EkoOS Entregas</h2>
                <h3>Login</h3>
            </div>
            
            <form onSubmit={ handleSubmit(handleSubmitFormulario) }>
                <div className={ `${styles.formControl}` }>
                    
                    <div className={ styles['input-container']}>
                        <input 
                            type="text"
                            placeholder="Usuário"
                            className={styles.input}
                            {...register("dbedUsuario")}
                            autoComplete="off"
                        />
                        <span className={styles["border-animation"]}></span>
                    </div>
                    
                    { errors.dbedUsuario &&
                    <span className={ styles.textError}> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                        {errors.dbedUsuario.message}
                    </span>}
                </div>
                
                
                <div className={ styles.formControl}>
                    <div className={ styles['input-container']}>
                        <input 
                            type="password"
                            placeholder="Senha"
                            className={styles.input}
                            {...register("dbedSenha")}
                            autoComplete="off"
                        />
                        <span className={styles["border-animation"]}></span>
                    </div>
                    { errors.dbedSenha &&
                        <span className={ styles.textError}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                            { errors.dbedSenha.message }
                        </span>
                    }
                </div>

                <button type="submit">
                    Acessar
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                </button>
            </form>
        </section>
    )
}
