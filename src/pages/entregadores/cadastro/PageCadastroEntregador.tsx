import { useForm } from 'react-hook-form'
import styles from './PageCadastroEntregador.module.css'
import animation from '../../../components/animation.module.css'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../../../services/axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

interface PROPRIEDADES {
    setAba: ( aba: number ) => void;
    codigoEntregador: number;
}

export default function PageCadastroEntregador({ setAba , codigoEntregador }: PROPRIEDADES) {

    const schema = z.object({
        dbedNome: z.string().trim().min(1,'Nome do entregador é obrigatório!'),
        dbedEmail: z.string().trim(),
        dbedContato: z.string().trim(),
        dbedUsuario: z.string().trim().min(1,'Usuário é obrigatório!'),
        dbedSenha: z.string().trim().min(1,'Senha é obrigatório!')
    })

    type CADASTRO_ENTREGADOR = z.infer<typeof schema>

    const { register, handleSubmit , reset , setValue } = useForm<CADASTRO_ENTREGADOR>({
        resolver: zodResolver(schema),
        defaultValues: {
            dbedContato: '',
            dbedEmail: '',
            dbedNome: '',
            dbedSenha: '',
            dbedUsuario: ''
        }
    })

    async function handleSubmitForm( data: CADASTRO_ENTREGADOR ){

        if( codigoEntregador <= 0 ){
            
            const response = await api.post('entregadores/',{
                body: data
            })
    
            console.log( response )
    
            if( response.data.Status == 200 ){
                toast.success(response.data.Mensagem,{position: 'bottom-right'});
                reset()
            }else{
                toast.error( response.data.Erro.causa,{position: 'bottom-right'} )
            }

        }else{
            
            const response = await api.put('entregadores/',{
                params: {
                    codigo_entregador: codigoEntregador
                },
                body: data
            })
    
            if( response.data.Status == 200 ){
                toast.success(response.data.Mensagem,{position: 'bottom-right'});
                reset()
            }else{
                toast.error( response.data.Erro.causa,{position: 'bottom-right'} )
            }
        }
        
    }
    
    async function getEntregador(){
        const response = await api.get("entregadores/edit",{
            params: {
                codigo_entregador: codigoEntregador
            }
        })

        console.log( response.data )

        if( response.data.Status == 200 ){
            setValue("dbedNome", response.data.Entregador[0].nome )
            setValue("dbedUsuario", response.data.Entregador[0].usuario )
            setValue("dbedSenha", response.data.Entregador[0].senha )
            setValue("dbedEmail", response.data.Entregador[0].email )
            setValue("dbedContato", response.data.Entregador[0].fone )
        }
    }

    useEffect(() => {
        if( codigoEntregador > 0 ){
            getEntregador();
        }
    },[ codigoEntregador ])

    return (
        <div className={ styles.banner }>
            <div className={styles.banner}>
                <div className={styles.tabela}>
                    <form onSubmit={handleSubmit(handleSubmitForm)} id={styles.formulario} className={ animation.introY}>
                        <button onClick={() => setAba(0)} className={ styles['btn-return'] }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
                        </button>

                        <legend>Cadastrar Entregador</legend>

                        <div>
                            <label>Nome:</label>
                            <input { ...register('dbedNome')} className={styles.camponome} type="text"></input>
                        </div>

                        <div>
                            <label>Contato:</label>
                            <input { ...register('dbedContato') } className={styles.campousuario} type="text"></input>
                        </div>

                        <div>
                            <label>E-mail:</label>
                            <input { ...register('dbedEmail') } className={styles.campousuario} type="text"></input>
                        </div>

                        <div>
                            <label>Usuario:</label>
                            <input { ...register('dbedUsuario') } className={styles.campousuario} type="text"></input>
                        </div>

                        <div>
                            <label>Senha:</label>
                            <input { ...register('dbedSenha' )} className={styles.camposenha} type="password"></input>
                        </div>

                        <div className={styles.botoes}>
                            <input className={styles.botaocadastrar} type="submit" value={ codigoEntregador > 0 ? 'Atualizar' : 'Cadastrar'}/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
    }
