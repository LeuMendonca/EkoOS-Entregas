import { useEffect, useState } from 'react'
import { api } from '../../../services/axios'
import styles from './PageConsulta.module.css'
import animation from '../../../components/animation.module.css'
import { toast } from 'react-toastify'
import { SESSAO } from '../PageEntregadores'

interface ENTREGADORES {
    sequencial: number,
	nome_entregador: string,
	usuario: string,
	senha: string
}

interface PROPRIEDADES {
    setCodigoEntregador: ( codigoEntregador: number ) => void;
    setAba: ( aba: number ) => void;
    sessao: SESSAO;
}

export default function PageConsultaEntregadores({ setCodigoEntregador , setAba , sessao }: PROPRIEDADES) {

    const [ entregadores , setEntregadores ] = useState<ENTREGADORES[]>([])

    async function getEntregadores(){
        const response = await api.get("entregadores/")

        setEntregadores( response.data )
    }

    async function deleteEntregador( sequencial_entregador: number ){
        const response = await api.delete("entregadores/",{
            params: {
                sequencial_entregador,
                seq_tenant: sessao.seq_tenant,
                seq_tenant_user: sessao.seq_tenant_user,
            }
        })

        if( response.data.Status == 200 ){
            toast.success( response.data.Mensagem )
            getEntregadores()
        }else{
            toast.error( response.data.Erro.causa )
        }
    }

    useEffect(() => {
        getEntregadores();
    },[])

    return (
        <div className={styles.banner}>
            <div className={styles.tabela}>

                <button
                    className={ styles['button-novo']} 
                    onClick={() => {setAba( 1 );setCodigoEntregador(0)}}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                    Novo Entregador
                </button>


                <div className={ `${styles['header-table']} ${animation.introX}` }>
                    <span>Código</span>
                    <span className={ styles['input-nome']}>Nome do Entregador</span>
                    <span>Ações</span>
                </div>

                <div className={`${styles['body-table']} ${ animation.introY}`}>
                    {
                        entregadores && 
                            entregadores.map( entregador => (
                                <div className={ styles['row-item']}>
                                    <span>{ entregador.sequencial }</span>
                                    <span className={ styles['input-nome']}>{ entregador.nome_entregador }</span>
                                    <span >
                                        <div className={ styles["btn-acoes"]}>
                                            <a className={ styles["btn-edit"]} onClick={() => { setCodigoEntregador( entregador.sequencial); setAba(1); }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                                                Editar    
                                            </a>

                                            <a onClick={() => deleteEntregador( entregador.sequencial )} className={ styles.trashIcon }>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                                Excluir
                                            </a>
                                        </div> 
                                    </span>
                                </div>
                            ))
                    }
                </div>
            </div>
        </div>
  )
}



