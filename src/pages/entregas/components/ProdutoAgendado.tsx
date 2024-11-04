import styles from './Modal.module.css'
import { ITEM_VENDA_MODAL_AGENDADOS } from './Modal';
import { useEffect, useState } from 'react';
import FormularioAtualizacao from './FormularioAtualizacao';


interface PROPRIEDADES {
    itens_agendados: ITEM_VENDA_MODAL_AGENDADOS;
    optionsEntregadores: OBJETO_SELECT[];
    optionsVeiculos: OBJETO_SELECT[];
}

interface OBJETO_SELECT {
    value: string; 
    label: string;
}

export default function ProdutoAgendado({ itens_agendados , optionsEntregadores , optionsVeiculos }: PROPRIEDADES) {

    const [ abaCard , setAbaCard ] = useState(1)

    useEffect(() => {
        setAbaCard( 1 )
    },[])

    return (
        <>
            { abaCard == 0 ?
                <div className={`${styles["row-item-pendente"]}`}>
                    <span className={`${styles['input-form']} ${styles["disabled-input"]}`}>{itens_agendados.sequencial_item}</span>
                    <span className={`${styles['input-form']} ${styles["disabled-input"]}`}>{itens_agendados.cod_produto}</span>
                    <span className={`${styles['input-form']} ${styles['input-form-text']} ${styles["disabled-input"]}`}>{itens_agendados.desc_produto}</span>
                    <span className={`${styles['input-form']} ${styles["disabled-input"]}`}>{itens_agendados.quantidade}</span>
                    <span className={`${styles['input-form']} ${styles['input-form-text']} ${styles["disabled-input"]}`}>{itens_agendados.entregador}</span>
                    <span className={`${styles['input-form']} ${styles['input-form-text']} ${styles["disabled-input"]}`}>{ itens_agendados.veiculo }</span>
                    <span>
                        <a onClick={() => setAbaCard( 1 )}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                        </a>
                    </span>
                </div>
            
            : 
            
            <FormularioAtualizacao
                itens_agendados={itens_agendados}
                optionsEntregadores = { optionsEntregadores }
                optionsVeiculos = { optionsVeiculos }
                setAbaCard={setAbaCard}
            />
        }
        </>
  )
}
