import { useEffect, useState } from 'react';
import styles from './PageConsultaVeiculo.module.css'
import animation from '../../../components/animation.module.css'
import { api } from '../../../services/axios';
import { toast } from 'react-toastify';
import { SESSAO } from '../PageVeiculos';

interface PROPRIEDADES {
    setCodigoVeiculo: ( codigoVeiculo: number ) => void;
    setAba: ( aba: number ) => void;
    sessao: SESSAO;
}

interface VEICULOS {
    sequencial: number;
    nome_veiculo: string;
    placa_veiculo: string;
}

export default function PageConsultaVeiculo({ setAba , setCodigoVeiculo , sessao }: PROPRIEDADES) {
    
    const [ veiculos , setVeiculos ] = useState<VEICULOS[]>([])

    async function getVeiculos(){
        const response = await api.get("veiculos/")

        setVeiculos( response.data )
    }

    async function deleteVeiculo( sequencial_veiculo: number ){
        const response = await api.delete("veiculos/",{
            params: {
                sequencial_veiculo: sequencial_veiculo,
                seq_tenant: sessao.seq_tenant,
                seq_tenant_user: sessao.seq_tenant_user
            }
        })

        if( response.data.Status == 200 ){
            toast.success( response.data.Mensagem ,{position: 'bottom-right'})
            getVeiculos()
        }else{
            toast.error( response.data.Erro.causa ,{position: 'bottom-right'})
        }
    }

    useEffect(() => {
        getVeiculos();
    },[])
    
    return (
    <div className={styles.banner}>
        <div className={styles.tabela}>

            
            <button className={ styles['button-novo']} onClick={() => {setAba( 1 );setCodigoVeiculo(0)}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-plus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                Novo Veículo
            </button>

            <div className={ `${styles['header-table']} ${animation.introX}` }>
                <span>Código</span>
                <span className={ styles['input-nome']}>Nome</span>
                <span>Placa</span>
                <span>Ações</span>
            </div>

            <div className={ `${styles['body-table']} ${animation.introY}` }>
                {
                    veiculos && 
                        veiculos.map( veiculo => (
                            <div className={ styles['row-item']}>
                                <span>{ veiculo.sequencial }</span>
                                <span className={ styles['input-nome']}>{ veiculo.nome_veiculo }</span>
                                <span>{ veiculo.placa_veiculo }</span>
                                <span >
                                    <div className={ styles["btn-acoes"]}>
                                        <a onClick={() => deleteVeiculo( veiculo.sequencial )} className={ styles.trashIcon }>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                            Excluir
                                        </a>

                                        <a className={ styles["btn-edit"]} onClick={() => { setCodigoVeiculo( veiculo.sequencial); setAba(1); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                                            Editar    
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
