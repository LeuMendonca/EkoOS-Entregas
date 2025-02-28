import { useEffect, useRef, useState } from 'react';
import styles from './Modal.module.css'
import Select from 'react-select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ProdutoAgendado from './ProdutoAgendado';
import { api } from '../../../../services/axios';
import { SESSAO } from '../PageAgendamentosEntregas';
import { useOutletContext } from 'react-router-dom';
import LoadingModal from '../../../../components/loadingModal';
import LoadingSubmit from '../../../../components/loadingSubmit';

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
    sessao: SESSAO;
}

interface VENDA_MODAL {
    sequencial: number;
    pedido: string;
    cliente: string;
    tipo_entrega: string;
    data_venda: string;
    itens_agendar: ITEM_VENDA_MODAL[];
    itens_agendados: ITEM_VENDA_MODAL_AGENDADOS[];
    observacao: string;
    endereco: string;
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

interface CONTEXT_OUTLET {
    statusSidebar: boolean
}

export const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'transparent', // Fundo do controle do Select (diferente do fundo da tela)
      borderColor: '#ccc',     // Borda clara para contraste
      color: '#231a1e',
      width: '100%' ,
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#7a7d8a',   // Borda ao passar o mouse
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#231a1e', // Cor do texto da opção selecionada
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'transparent', // Fundo do menu de opções
      zIndex: 9999
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#DDD' : '#fff', // Cor das opções, mudando no hover
      color: state.isFocused ? 'black' : '#000', // Texto claro para contraste
      '&:active': {
        backgroundColor: '#DDD',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#2c2f3a', // Cor do texto do placeholder
    }),
  };

export default function Modal({ isActive , setIsActive , sequencialEntrega , optionsEntregadores , optionsVeiculos , sessao }: PROPRIEDADES) {

    const [ loading , setLoading ] = useState( false )
    const [ loadingSubmit , setLoadingSubmit ] = useState( false )
    const [ venda , setVenda ] = useState<VENDA_MODAL>({} as VENDA_MODAL)
    const [ atualiza , setAtualiza ] = useState(false)

    const accordionRef = useRef<HTMLDivElement>(null); // Especifica o tipo como HTMLDivElement

    const [ showAccordion , setShowAccordion ] = useState( false )

    const [ showNumeroIndicador , setShowNumeroIndicador ] = useState( false )
    const [ numeroIndicador , setNumeroIndicador] = useState( 0 )
    const contextOutlet = useOutletContext<CONTEXT_OUTLET | null >()

    async function getVendaModal(){

        setLoading( true )
        
        const response = await api.get("entregas/modal",{
            params: {
                sequencial_entrega: sequencialEntrega,
            }
        })

        if( response.data.Status == 200 ){
            setVenda( response.data.Venda[0] )
        }

        setLoading( false )
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

    const { reset, register , control , setValue , handleSubmit ,  formState: { errors } } = useForm<FORMULARIO_MODAL>({        
        resolver: zodResolver(schemaFormItemDinamico),
        defaultValues: {
            dbedVeiculo: '',
            dbedDataEntrega: ''
        }
    })

    async function handleSubmitModal( data: FORMULARIO_MODAL ){

        setLoadingSubmit( true )
        const response = await api.post("entregas/modal",{
            params: {
                sequencial_entrega: sequencialEntrega,
                seq_tenant: sessao.seq_tenant,
                seq_tenant_user: sessao.seq_tenant_user,
            },
            body: data
        })

        if( response.data.Status == 200 ){
            toast.success( response.data.Mensagem )
            setAtualiza( state => !state )
            reset();
            setShowNumeroIndicador( true )
            setNumeroIndicador( response.data.TotalInserido )
            
            setTimeout(() => {
                setShowNumeroIndicador( false )
            },1000)

        }else{
            toast.error( response.data.Erro.causa )
        }
        setLoadingSubmit( false )
    }

    async function deleteItemEntrega( sequencial: number ){

        setLoading( true )
        const response = await api.delete("entregas/modal",{
            params: {
                sequencial: sequencial,
                seq_tenant: sessao.seq_tenant,
                seq_tenant_user: sessao.seq_tenant_user,
            }
        })

        if( response.data.Status == 200 ){
            toast.success( response.data.Mensagem)
            setAtualiza( state => !state )
        }else{
            toast.error( response.data.Erro.causa )
        }
        setLoading( false )
    }

    useEffect(() => {
        if( sequencialEntrega > 0){
            getVendaModal()
        }

    },[ sequencialEntrega , atualiza , isActive ])

    useEffect(() => {

        const hoje = new Date();
        const dataHoje = `${hoje.getFullYear()}-${String(hoje.getUTCMonth() + 1).padStart(2, '0')}-${String(hoje.getUTCDate()).padStart(2, '0')}`;
        
        setValue('dbedDataEntrega', dataHoje)
    },[])
    
    return (
        <div>
            <form 
                className={ isActive ? `${styles.modal} ${styles.active} ${ contextOutlet?.statusSidebar ? styles['modal-sidebar-open'] : styles['modal-sidebar-close'] }` : styles.modal }
                onSubmit={handleSubmit(handleSubmitModal)}
                >
                { loading && <LoadingModal/>}
                <button type='button' onClick={() => { setIsActive( false );reset() }} className={ styles['btn-close-modal']}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-move-left"><path d="M6 8L2 12L6 16"/><path d="M2 12H22"/></svg>
                </button>
                <h3>Agendamento da Entrega { venda.pedido } / { venda.sequencial } </h3> 

                <header>

                    <div className={ styles["row-1"]}>
                        <div className={ styles["div-info-entrega-header"]}>
                            Cliente
                            <span>{ venda.cliente }</span>
                        </div>

                        <div className={ styles["div-info-entrega-header"]}>
                            Endereço 
                            <span>{ venda.endereco }</span>
                        </div>
                        <div className={ styles["div-info-entrega-header"]}>
                            Data
                            <span>{ venda.data_venda }</span>
                        </div>
                    </div>

                    <div className={ styles["div-info-entrega-header"]}>
                        Observação: <span>{ venda.observacao }</span>
                    </div>

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
                                                        options={  optionsEntregadores.filter( item => item.value != '') }
                                                        isMulti
                                                        placeholder='Selecione...'
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
                    <div className={ styles["header-itens"]}>
                        <h2 onClick={() => setShowAccordion( state => !state)}>Agendamentos Realizados { showNumeroIndicador && <span className={  styles.numberIndicador }>+{ numeroIndicador }</span> }</h2>

                        <button type='button' onClick={() => setShowAccordion( state => !state)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                        </button>
                    </div>
                    <div ref={accordionRef} className={styles["accordion-itens"]} style={{
                        maxHeight: showAccordion ? accordionRef.current?.scrollHeight || 0 : 0
                    }}>
                        { venda.itens_agendados ? (
                            venda.itens_agendados.map( ( item , index ) => (
                                <ProdutoAgendado
                                    itens_agendados={item}
                                    optionsEntregadores={ optionsEntregadores}
                                    optionsVeiculos={optionsVeiculos}
                                    setAtualiza={ setAtualiza }
                                    index={ index }
                                    sessao={ sessao }
                                />
                                
                            )))
                        : 
                            <div className={ styles['div-null-itens'] }>
                                Nenhum agendamento realizado!
                            </div>
                        }
                    </div>
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
                                        noOptionsMessage={() => 'Nenhum veículo encontrado!'}
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
                    <button className={ styles["btn-finalizar"]} type="submit">
                    { !loadingSubmit ? 
                        <>
                            Agendar
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                        </>
                    : 
                        <>
                            Agendando
                            <LoadingSubmit/>
                        </>
                    }
                    </button>
                </section>
            </form>
        </div>
  )
}
