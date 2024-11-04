import { z } from 'zod';
import Select from 'react-select'
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, set, useForm } from 'react-hook-form';
import styles from './Modal.module.css'
import { customStyles, ITEM_VENDA_MODAL_AGENDADOS } from './Modal';
import { api } from '../../../services/axios';
import { toast } from 'react-toastify';

interface OBJETO_SELECT {
    value: string; 
    label: string;
}

interface PROPRIEDADES {
    itens_agendados: ITEM_VENDA_MODAL_AGENDADOS;
    optionsEntregadores: OBJETO_SELECT[];
    optionsVeiculos: OBJETO_SELECT[];
    setAbaCard: ( abaCard: number ) => void;
}

export default function FormularioAtualizacao({ itens_agendados , optionsEntregadores , optionsVeiculos , setAbaCard }: PROPRIEDADES) {
       
    const schema = z.object({
        dbedEntregador: z.array(z.string()),
        dbedVeiculo: z.array(z.string()),
        dbedPontos: z.string()
    })

    type FORMULARIO_MODAL = z.infer<typeof schema>;

    const { reset, register , control , handleSubmit ,  formState: { errors } } = useForm<FORMULARIO_MODAL>({        
        resolver: zodResolver(schema),
        defaultValues: {
            dbedEntregador: [],
            dbedPontos: '',
            dbedVeiculo: []
        }
    })

    async function handleSubmitForm(data: FORMULARIO_MODAL ){
        const response = await api.put("entregas/modal/agendados",{
            params: {
                sequencial_entrega: itens_agendados.sequencial
            }, body: data
        })

        if( response.data.Status == 200 ){
            toast.success( response.data.Mensagem )
            setAbaCard(0)
        }else{
            toast.error( response.data.Erro.causa )
        }
    }

  return (
    <form className={`${styles["row-item-agendado"]} ${ styles["right-to-left"]}`} >

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

                <div className={styles["form-control"]}>
                    <Controller
                        control={control}
                        name='dbedVeiculo'
                        render={({field}) => {  
                            return(
                                <Select
                                options={  optionsVeiculos }
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
                    <input {...register("dbedPontos")} type="text" className={ styles["input-form"]} value={ itens_agendados.pontos }/>
                </span>

                <a onClick={handleSubmit(handleSubmitForm)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </a>
            </form>
  )
}
