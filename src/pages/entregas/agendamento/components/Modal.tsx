import { useEffect, useState } from 'react';
import styles from './Modal.module.css'
import Select from 'react-select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ProdutoAgendado from './ProdutoAgendado';
import { api } from '../../../../services/axios';

interface OBJETO_SELECT {
    value: string; 
    label: string;
}

interface PROPRIEDADES {
    setIsActive: ( isActive: boolean ) => void;
    isActive: boolean;
    sequencialEntrega: number;
    optionsEntregadores: OBJETO_SELECT[];
    optionsVeiculos: OBJETO_SELECT[];
}

interface VENDA_MODAL {
    sequencial: number;
    pedido: string;
    cliente: string;
    tipo_entrega: string;
    data_venda: string;
    itens_agendar: ITEM_VENDA_MODAL[];
    itens_agendados: ITEM_VENDA_MODAL_AGENDADOS[];
}

interface ITEM_VENDA_MODAL {
    sequencial_entrega: number;
    sequencial_item: number;
    codigo: number;
    produto: string;
    quantidade: number;
}

export interface ITEM_VENDA_MODAL_AGENDADOS {
    sequencial: number;
    sequencial_item: number;
    cod_produto: number;
    desc_produto: string;
    quantidade: number;
    cod_entregador: string;
    entregador: string;
    cod_veiculo: string;
    veiculo: string;
    pontos: string;
}

export const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#2c2f3a', // Fundo do controle do Select (diferente do fundo da tela)
      borderColor: '#5a5d6a',     // Borda clara para contraste
      color: 'white',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#7a7d8a',   // Borda ao passar o mouse
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'white', // Cor do texto da opção selecionada
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#2c2f3a', // Fundo do menu de opções
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#3a3d4a' : '#2c2f3a', // Cor das opções, mudando no hover
      color: state.isFocused ? 'white' : '#b0b3c5', // Texto claro para contraste
      '&:active': {
        backgroundColor: '#4a4d5a',
      },
    }),
    placeholder: (provided:any) => ({
      ...provided,
      color: '#b0b3c5', // Cor do texto do placeholder
    }),
  };

export default function Modal({ isActive , setIsActive , sequencialEntrega , optionsEntregadores , optionsVeiculos }: PROPRIEDADES) {

    const [ venda , setVenda ] = useState<VENDA_MODAL>({} as VENDA_MODAL)
    const [ atualiza , setAtualiza ] = useState(false)

    async function getVendaModal(){
        
        const response = await api.get("entregas/modal",{
            params: {
                sequencial_entrega: sequencialEntrega,
            }
        })

        if( response.data.Status == 200 ){
            setVenda( response.data.Venda[0] )
        }
    }

    const schemaFormItem = z.object({
        dbedVeiculo: z.string().min(1 , 'Veículo obrigatório!'),
        dbedDataEntrega: z.string().min( 1 , 'Data da entrega obrigatória!')
    })

    function adicionaCamposDinamicos(schema: z.ZodObject<any>) {
        const novosCampos: { [key: string]: z.ZodTypeAny } = {};
        
        if( venda.itens_agendar){
            venda.itens_agendar.map( item => {
                const sequencialItemKey = `dbedSequencialItem${ item.sequencial_item }`
                novosCampos[sequencialItemKey] = z.string().optional()
    
                const codigoProdutoKey = `dbedCodigoProduto${ item.sequencial_item }`
                novosCampos[codigoProdutoKey] = z.string().optional()
    
                const DescricaoProdutoKey = `dbedDescricaoProduto${ item.sequencial_item }`
                novosCampos[DescricaoProdutoKey] = z.string().optional()
    
                const entregadorKey = `dbedEntregadorItem${item.sequencial_item}`;
                novosCampos[entregadorKey] = z.array(z.string().optional()).optional();
                
                const quantidadeKey = `dbedQuantidadeItem${item.sequencial_item}`;
                novosCampos[quantidadeKey] = z.string().optional()
    
                const pontosKey = `dbedPontosItem${item.sequencial_item}`;
                novosCampos[pontosKey] = z.string().optional()
            })
        }
        
    
        return schema.extend(novosCampos);
    }

    const schemaFormItemDinamico = adicionaCamposDinamicos(schemaFormItem )

    type FORMULARIO_MODAL = z.infer<typeof schemaFormItemDinamico>;

    const { reset, register , control , handleSubmit ,  formState: { errors } } = useForm<FORMULARIO_MODAL>({        
        resolver: zodResolver(schemaFormItemDinamico),
        defaultValues: {
            dbedVeiculo: '',
            dbedDataEntrega: ''
        }
    })

    async function handleSubmitModal( data: FORMULARIO_MODAL ){

        const response = await api.post("entregas/modal",{
            params: {
                sequencial_entrega: sequencialEntrega
            },
            body: data
        })

        if( response.data.Status == 200 ){
            toast.success( response.data.Mensagem )
            setAtualiza( state => !state )
            reset();
        }else{
            toast.error( response.data.Erro.causa )
        }
    }

    async function deleteItemEntrega( sequencial: number ){
        const response = await api.delete("entregas/modal",{
            params: {
                sequencial: sequencial
            }
        })

        if( response.data.Status == 200 ){
            toast.success( response.data.Mensagem)
            setAtualiza( state => !state )
        }else{
            toast.error( response.data.Erro.causa )
        }
    }

    useEffect(() => {
        if( sequencialEntrega > 0){
            getVendaModal()
        }

    },[ sequencialEntrega , atualiza , isActive ])
    
    return (
        <div>
            <form 
                className={ isActive ? `${styles.modal} ${styles.active}` : styles.modal }
                onSubmit={handleSubmit(handleSubmitModal)}
            >
                <button type='button' onClick={() => { setIsActive( false );reset() }} className={ styles['btn-close-modal']}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-move-left"><path d="M6 8L2 12L6 16"/><path d="M2 12H22"/></svg>
                </button>
                <h3>Agendamento da Entrega {sequencialEntrega} </h3>

                <header>
                    <div className={ styles["row-1"]}>
                        <span><b>Número Pedido:</b> { venda.pedido }</span>
                        <span><b>Data:</b> { venda.data_venda }</span>
                    </div>
                    <span><b>Cliente:</b> { venda.cliente }</span>

                    <span className={ styles["span-tipo-entrega"]}>{ venda.tipo_entrega }</span>
                </header>

                {/* Itens não preenchidos */}
                <section className={ styles["section-itens"]}>
                    <h2>Agendamentos Pendentes</h2>
                    { venda.itens_agendar ? (
                        venda.itens_agendar.map( ( item , index ) => (
                            <>
                                { index == 0 && 
                                    <div className={ styles["row-header"]}>
                                        <span >Sequencial</span>
                                        <span >Cód.Produto</span>
                                        <span >Descrição Produto</span>
                                        <span >Quantidade</span>
                                        <span >Entregadores</span>
                                        <span >Pontuação</span>
                                    </div>
                                }

                                <div className={ styles["row-item"]}>
                                    <span>
                                        <input { ...register(`dbedSequencialItem${ item.sequencial_item }`)} type="text" className={ `${styles["input-form"]} ${styles["disabled-input"]}`} value={ item.sequencial_item }/>
                                    </span>

                                    <span>
                                        <input { ...register(`dbedCodigoProduto${ item.sequencial_item}`)} type="text" className={ `${styles["input-form"]} ${styles["disabled-input"]}`}value={ item.codigo }/>
                                    </span>

                                    <span>

                                        <input { ...register(`dbedDescricaoProduto${ item.sequencial_item}`)} type="text" className={ `${ styles['input-form']} ${ styles['disabled-input'] } ${ styles["input-form-text"]}` } value={ item.produto }/>

                                    </span>

                                    <span>
                                        <input { ...register(`dbedQuantidadeItem${ item.sequencial_item}`)} type="text" className={ `${styles["input-form"]} ${styles["disabled-input"]}`}value={ item.quantidade }/>
                                    </span>

                                    <div className={styles["form-control"]}>
                                        <Controller
                                            control={control}
                                            name={`dbedEntregadorItem${ item.sequencial_item}`}
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
                                        <input { ...register(`dbedPontosItem${ item.sequencial_item }`)} type="text" className={ styles["input-form"]}/>
                                    </span>

                                    <a onClick={() => deleteItemEntrega( +item.sequencial_item )} id={ styles["trash-icon"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    </a>
                                </div>
                            </>
                        )))
                    : 
                        <div className={ styles['div-null-itens'] }>
                            Todos os itens foram agendados ! 
                        </div>
                    }
                </section>

                <section  className={ styles["section-itens"]}>
                    <h2>Agendamentos Realizados</h2>

                    { venda.itens_agendados ? (
                        venda.itens_agendados.map( ( item , index ) => (
                            <ProdutoAgendado
                                itens_agendados={item}
                                optionsEntregadores={ optionsEntregadores}
                                optionsVeiculos={optionsVeiculos}
                                setAtualiza={ setAtualiza }
                                index={ index }
                            />
                            
                        )))
                    : 
                        <div className={ styles['div-null-itens'] }>
                            Nenhum agendamento realizado!
                        </div>
                    }
                </section>

                <section className={ styles["section-entrega"]}>
                    <div className={styles["form-control"]}>
                        <label htmlFor=""><b>Veículo</b></label>
                        <Controller
                            control={control}
                            name="dbedVeiculo"
                            render={({field}) => {  
                                return(
                                    <Select
                                        name="colors"
                                        options={optionsVeiculos}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        
                                        styles={ customStyles }
                                        value={ optionsVeiculos.find((c) => c.value === field.value) }                                          
                                        onChange={(val) => {field.onChange(val?.value)}} 
                                    />
                                )
                            }}                                        
                        />
                        { errors.dbedVeiculo && 
                            <span className={ styles["msg-erro"] }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                                {errors.dbedVeiculo && typeof errors.dbedVeiculo.message === 'string' && errors.dbedVeiculo.message}
                            </span> 
                        }
                    </div>

                    <div className={styles["form-control"]}>
                        <label htmlFor=""><b>Data de Entrega</b></label>
                        <input { ...register('dbedDataEntrega' )} type="date"/>
                        { errors.dbedDataEntrega &&
                            <span className={ styles["msg-erro"] }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                                { errors.dbedDataEntrega && typeof errors.dbedDataEntrega.message == 'string' && errors.dbedDataEntrega.message }
                            </span>
                        }   
                    </div>
                </section>

                <section className={ styles["section-button"]}>
                    <button className={ styles["btn-finalizar"]} type="submit"><b>Finalizar</b></button>
                </section>
            </form>
        </div>
  )
}
