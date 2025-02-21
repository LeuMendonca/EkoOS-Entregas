import { useForm } from 'react-hook-form'
import styles from './PageCadastroEntregador.module.css'
import animation from '../../../components/animation.module.css'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../../../services/axios'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { SESSAO } from '../PageEntregadores'
import Loading from '../../../components/loading'
import LoadingSubmit from '../../../components/loadingSubmit'

interface PROPRIEDADES {
    setAba: ( aba: number ) => void;
    codigoEntregador: number;
    sessao: SESSAO;
}

export default function PageCadastroEntregador({ setAba , codigoEntregador , sessao }: PROPRIEDADES) {

    const [ loading , setLoading ] = useState( false )
    const [ loadingSubmit , setLoadingSubmit ] = useState( false )

    const schema = z.object({
        dbedNome: z.string().trim().min(1,'Nome do entregador é obrigatório!'),
        dbedEmail: z.string().trim(),
        dbedContato: z.string().trim(),
        dbedUsuario: z.string().trim().min(1,'Usuário é obrigatório!'),
        dbedSenha: z.string().trim().min(1,'Senha é obrigatório!'),
        dbedStatus: z.boolean(),
    })

    type CADASTRO_ENTREGADOR = z.infer<typeof schema>

    const { register, handleSubmit , reset , setValue } = useForm<CADASTRO_ENTREGADOR>({
        resolver: zodResolver(schema),
        defaultValues: {
            dbedContato: '',
            dbedEmail: '',
            dbedNome: '',
            dbedSenha: '',
            dbedUsuario: '',
            dbedStatus: true
        }
    })

    async function handleSubmitForm( data: CADASTRO_ENTREGADOR ){

        setLoadingSubmit( true )

        if( codigoEntregador <= 0 ){
            
            const response = await api.post('entregadores/',{
                params: {
                    seq_tenant: sessao.seq_tenant,
                    seq_tenant_user: sessao.seq_tenant_user,
                },
                body: data
            })
    
            if( response.data.Status == 200 ){
                toast.success(response.data.Mensagem,{position: 'bottom-right'});
                reset()
                setAba(0)
            }else{
                toast.error( response.data.Erro.causa,{position: 'bottom-right'} )
            }

        }else{
            
            const response = await api.put('entregadores/',{
                params: {
                    seq_tenant: sessao.seq_tenant,
                    seq_tenant_user: sessao.seq_tenant_user,
                    codigo_entregador: codigoEntregador
                },
                body: data
            })
    
            if( response.data.Status == 200 ){
                toast.success(response.data.Mensagem,{position: 'bottom-right'});
                reset()
                setAba(0)
            }else{
                toast.error( response.data.Erro.causa,{position: 'bottom-right'} )
            }
        }

        setLoadingSubmit( false )
        
    }
    
    async function getEntregador(){
        setLoading( true )

        const response = await api.get("entregadores/edit",{
            params: {
                codigo_entregador: codigoEntregador
            }
        })

        if( response.data.Status == 200 ){
            setValue("dbedNome", response.data.Entregador[0].nome )
            setValue("dbedUsuario", response.data.Entregador[0].usuario )
            setValue("dbedSenha", response.data.Entregador[0].senha )
            setValue("dbedEmail", response.data.Entregador[0].email )
            setValue("dbedContato", response.data.Entregador[0].fone )
            setValue("dbedStatus" , response.data.Entregador[0].status )
        }

        setLoading( false )
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
                        { loading && <Loading/> }
                        <button onClick={() => setAba(0)} className={ styles['btn-return'] }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                        </button>

                        <legend>Cadastrar Entregador</legend>

                        <div>
                            <label>Nome:</label>
                            <input 
                                autoComplete='off' 
                                { ...register('dbedNome')} 
                                className={styles.camponome} 
                                type="text"
                            />
                        </div>

                        <div>
                            <label>Contato:</label>
                            <input 
                                autoComplete='off' 
                                { ...register('dbedContato') }
                                className={styles.campousuario} 
                                type="text"
                            />
                        </div>

                        <div>
                            <label>E-mail:</label>
                            <input 
                                autoComplete='off' 
                                { ...register('dbedEmail') }
                                className={styles.campousuario} 
                                type="text"
                            />
                        </div>

                        <div>
                            <label>Usuario:</label>
                            <input 
                                autoComplete='off' 
                                { ...register('dbedUsuario') }
                                className={styles.campousuario} 
                                type="text"
                            />
                        </div>

                        <div>
                            <label>Senha:</label>
                            <input 
                                autoComplete='off' 
                                { ...register('dbedSenha' )}
                                className={styles.camposenha} 
                                type="password"
                            />
                        </div>

                        <div>
                            <div className={`${styles["checkbox-wrapper-8"]}`}>
                                <input {...register("dbedStatus")} className={`${styles["tgl"]} ${styles["tgl-skewed"]}`} id="cb3-8" type="checkbox"/>
                                <label className={`${styles["tgl-btn"]}`} data-tg-off="INATIVO" data-tg-on="ATIVO" htmlFor="cb3-8"></label>
                            </div>
                        </div>

                        <div className={styles.botoes}>
                            <button 
                                className={styles.botaocadastrar} 
                            >   
                                { !loadingSubmit ? 
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                                        Salvar
                                    </>
                                    : <>
                                        Salvando
                                        <LoadingSubmit/>
                                    </>
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
    }
