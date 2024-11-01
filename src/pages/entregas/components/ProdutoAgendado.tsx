import { Controller, useForm } from 'react-hook-form';
import styles from './Modal.module.css'
import { customStyles, ITEM_VENDA_MODAL_AGENDADOS } from './Modal';
import { useState } from 'react';
import { z } from 'zod';
import Select from 'react-select'
import { zodResolver } from '@hookform/resolvers/zod';

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

    const [ abaCard , setAbaCard ] = useState(0)
    
    const schema = z.object({
        dbedEntregador: z.array(z.string()),
        dbedVeiculo: z.string(),
        dbedPontos: z.string()
    })

    type FORMULARIO_MODAL = z.infer<typeof schema>;

    const { reset, register , control , handleSubmit ,  formState: { errors } } = useForm<FORMULARIO_MODAL>({        
        resolver: zodResolver(schema),
        defaultValues: {
            dbedEntregador: [],
            dbedPontos: '',
            dbedVeiculo: ''
        }
    })

    return (
        <>
            { abaCard == 0 ?
                <div className={`${styles["row-item-agendado"]}`}>
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
            : <div className={`${styles["row-item-agendado"]} ${ styles["right-to-left"]}`}>
            <span>
                <input type="text" className={ `${styles["input-form"]} ${styles["disabled-input"]}`}value={ itens_agendados.sequencial_item }/>
            </span>

            <span>
                <input type="text" className={ `${styles["input-form"]} ${styles["disabled-input"]}`}value={ itens_agendados.cod_produto }/>
            </span>

            <span>

                <input type="text" className={ `${ styles['input-form']} ${ styles['disabled-input'] } ${ styles["input-form-text"]}` } value={ itens_agendados.desc_produto }/>

            </span>

            <span>
                <input type="text" className={ `${styles["input-form"]} ${styles["disabled-input"]}`}value={ itens_agendados.quantidade }/>
            </span>

            <div className={styles["form-control"]}>
                <Controller
                    control={control}
                    name='dbedEntregador'
                    render={({field}) => {  
                        return(
                            <Select
                                options={  optionsEntregadores }
                                isMulti
                                styles={customStyles}
                                value={field.value?.map( ( value: any ) => optionsEntregadores.find(option => option.value === value)!).filter(Boolean) || []}
                                onChange={(option: readonly OBJETO_SELECT[]) => {
                                    if (option === null) {
                                        field.onChange(null);
                                        return;
                                    }                                                                  
                                    field.onChange(option.map((el) => el.value));
                                }}
                            />
                        )
                    }}                                        
                />
            </div>

            <span>
                <input type="text" className={ styles["input-form"]} value={ itens_agendados.pontos }/>
            </span>

            <a onClick={() => setAbaCard( 0 )}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
            </a>
        </div>
        }
        </>
  )
}
