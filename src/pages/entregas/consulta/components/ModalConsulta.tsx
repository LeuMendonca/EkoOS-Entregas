import { useEffect, useState } from 'react'
import styles from './ModalConsulta.module.css'
import { api } from '../../../../services/axios';
import { toast } from 'react-toastify';

interface PROPRIEDADES {
    setIsActive: ( isActive: boolean ) => void;
    isActive: boolean;
    sequencialEntrega: number;
}

interface ITEM_ENTREGA {
    nome_entregador: string;
    nome_veiculo: string;
    produto: string;
    pontos: number;
}

interface ENTREGA {
    pedido: string;
    cliente: string;
    endereco: string;
    tipo_entrega: string;
    status: string;
    itens: ITEM_ENTREGA[]
}

export default function ModalConsulta({ sequencialEntrega , setIsActive , isActive }: PROPRIEDADES) {

    const [ entrega , setEntrega ] = useState<ENTREGA>({} as ENTREGA)

    async function getEntrega(){
        const response = await api.get("entregador/consultar-agendamentos-modal",{
            params: {
                sequencial_entrega: sequencialEntrega
            }
        })

        console.log( response.data )
        if( response.data.Status == 200 ){
            setEntrega( response.data.Entrega[0] )
        }else{
            toast.error( response.data.Erro.causa )
        }
    }

    useEffect(() => {
        getEntrega();
    },[ sequencialEntrega ])

    return (
        <div className={ `${styles["modal-container"]} ${ isActive && styles.active}` }>
            <button onClick={() => setIsActive( false )} type='button' className={ styles.btnCloseModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <div className={ styles["section-entrega"]}>
                <h2>Dados da Entrega</h2>
                <div className={ styles.clienteEndereco }>
                    <span>Cliente: { entrega.cliente}</span>
                        
                    <span>Endereço: { entrega.endereco }</span>
                </div>

                <div className={ styles.statusTipoEntrega }>
                    <span>Status: { entrega.status }</span>
                    <span>Tipo da Entrega: { entrega.tipo_entrega}</span>
                </div>
            </div>

            <div className={ styles["section-itens"]}>
                <h2>Itens da Entrega</h2>
                { entrega.itens ?
                    entrega.itens.map( ( item ) => (
                        <div className={ styles.rowItem }>
                            <span className={ styles['span-produto']}>{ item.produto }</span>
                            <span>{ item.nome_entregador }</span>
                            <span>{ item.pontos } pontos</span>
                            <span>{ item.nome_veiculo }</span>
                        </div>
                    ))
                    : 'Nao há nada'
                }
            </div>
        </div>      
    )
}
