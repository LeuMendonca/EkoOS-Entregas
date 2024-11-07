// import styles from './Modal.module.css'
import styles from './ProdutoAgendado.module.css'
import { ITEM_VENDA_MODAL_AGENDADOS } from './Modal';
import { useEffect, useState } from 'react';
import FormularioAtualizacao from './FormularioAtualizacao';
import { toast } from 'react-toastify';
import { api } from '../../../../services/axios';


interface PROPRIEDADES {
    itens_agendados: ITEM_VENDA_MODAL_AGENDADOS;
    optionsEntregadores: OBJETO_SELECT[];
    optionsVeiculos: OBJETO_SELECT[];
    setAtualiza: ( atualiza: any ) => void;
    index: number;
}

interface OBJETO_SELECT {
    value: string; 
    label: string;
}


export default function ProdutoAgendado({ itens_agendados , optionsEntregadores , optionsVeiculos , setAtualiza , index }: PROPRIEDADES) {

    const [ abaCard , setAbaCard ] = useState(0)

    async function deleteItemEntregador(){
        const response = await api.delete("entregas/modal/agendados",{
            params: {
                sequencial: itens_agendados.sequencial
            }
        })

        if( response.data.Status == 200 ){
            toast.success( response.data.Mensagem)
            setAtualiza( (state: boolean ) => !state )
        }else{
            toast.error( response.data.Erro.causa )
        }
    }

    useEffect(() => {
        setAbaCard( 0 )
    },[])

    return (
        <>
            { index == 0 && (
                    <div className={`${styles["row-header-item"]}`}>
                        <span>Cód.Produto</span>
                        <span>Descrição Produto</span>
                        <span>Quantidade</span>
                        <span>Entregador</span>
                        <span>Veículo</span>
                        <span>Pontuação</span>
                    </div>
                
            )}

            { abaCard == 0 ?
                <div className={`${styles["row-item-agendado"]}`}>
                    {/* <span className={`${styles['input-form']} ${styles["disabled-input"]}`}>{itens_agendados.sequencial_item}</span> */}
                    <span className={`${styles['input-form']} ${styles["disabled-input"]}`}>{itens_agendados.cod_produto}</span>
                    <span className={`${styles['input-form']} ${styles['input-form-text']} ${styles["disabled-input"]}`}>{itens_agendados.desc_produto}</span>
                    <span className={`${styles['input-form']} ${styles["disabled-input"]}`}>{itens_agendados.quantidade}</span>
                    <span className={`${styles['input-form']} ${styles['input-form-text']} ${styles["disabled-input"]}`}>{itens_agendados.entregador}</span>
                    <span className={`${styles['input-form']} ${styles['input-form-text']} ${styles["disabled-input"]}`}>{ itens_agendados.veiculo }</span>
                    <span className={`${styles['input-form']} ${styles['input-form-text']} ${styles["disabled-input"]}`}>{ itens_agendados.pontos }</span>
                    <span className={ styles["span-icons"]}>
                        <a onClick={() => setAbaCard( 1 )}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                        </a>

                        <a onClick={() => deleteItemEntregador()} id={styles["trash-icon"]}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </a>
                    </span>
                </div>
            
            : 
            
            <FormularioAtualizacao
                itens_agendados={itens_agendados}
                optionsEntregadores = { optionsEntregadores }
                optionsVeiculos = { optionsVeiculos }
                setAbaCard={setAbaCard}
                setAtualiza={setAtualiza}
            />
        }
        </>
  )
}
