// import styles from './Modal.module.css'
import styles from './FormularioAtualizacao.module.css'
import { z } from 'zod';
import Select from 'react-select'
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { customStyles, ITEM_VENDA_MODAL_AGENDADOS } from './Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../../../services/axios';
import LoadingSubmit from '../../../../components/loadingSubmit';

interface OBJETO_SELECT {
    value: string; 
    label: string;
}

interface PROPRIEDADES {
    itens_agendados: ITEM_VENDA_MODAL_AGENDADOS;
    optionsEntregadores: OBJETO_SELECT[];
    optionsVeiculos: OBJETO_SELECT[];
    setAbaCard: ( abaCard: number ) => void;
    setAtualiza: ( atualiza: any ) => void;
}

export default function FormularioAtualizacao({ itens_agendados , optionsEntregadores , optionsVeiculos , setAbaCard , setAtualiza }: PROPRIEDADES) {

    const [ loadingSubmit , setLoadingSubmit ] = useState( false )

    const schema = z.object({
        dbedEntregador: z.string(),
        dbedVeiculo: z.string(),
        dbedPontos: z.string()
    })

    type FORMULARIO_MODAL = z.infer<typeof schema>;

    const { register , control , handleSubmit , setValue } = useForm<FORMULARIO_MODAL>({        
        resolver: zodResolver(schema),
        defaultValues: {
            dbedEntregador: '',
            dbedPontos: '',
            dbedVeiculo: ''
        }
    })

    async function handleSubmitForm(data: FORMULARIO_MODAL ){
        setLoadingSubmit( true )

        const response = await api.put("entregas/modal/agendados",{
            params: {
                sequencial_entrega: itens_agendados.sequencial
            }, body: data
        })

        if( response.data.Status == 200 ){
            toast.success( response.data.Mensagem )
            setAbaCard(0)
            setAtualiza( ( state: boolean ) => !state )
        }else{
            toast.error( response.data.Erro.causa )
        }

        setLoadingSubmit( false )
    }

    useEffect(() => {
        setValue("dbedEntregador", itens_agendados.cod_entregador)
        setValue("dbedVeiculo", itens_agendados.cod_veiculo)
        setValue("dbedPontos", itens_agendados.pontos)
    },[ itens_agendados ])

    return (
        <form className={`${styles["row-item-agendado"]} ${ styles["right-to-left"]}`} >

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
                                menuPortalTarget={document.body}
                                styles={{
                                    ...customStyles,
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }) // Define um z-index alto
                                }}
                                value={ optionsEntregadores.find((c) => c.value === field.value) }                                          
                                onChange={(val) => {field.onChange(val?.value)}} 
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
                                menuPortalTarget={document.body}
                                styles={{
                                    ...customStyles,
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }) // Define um z-index alto
                                }}
                                value={ optionsVeiculos.find((c) => c.value === field.value) }                                          
                                onChange={ (val) => {field.onChange(val?.value)} }
                            />
                        )
                    }}                                        
                />
            </div>

            <span>
                <input {...register("dbedPontos")} type="text" className={ styles["input-form"]} />
            </span>

            <a onClick={handleSubmit(handleSubmitForm)}>
                { !loadingSubmit ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                    : <LoadingSubmit/>
                }
            </a>
        </form>
    )
}
