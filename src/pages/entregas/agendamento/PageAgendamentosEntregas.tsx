import { useEffect, useState } from 'react'
import styles from './PageAgendamentosEntregas.module.css'
import animation from '../../../components/animation.module.css'
import { api } from '../../../services/axios';
import Select from 'react-select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Pagination from '../../components/Pagination';
import Modal from './components/Modal';
import DropdownButton from '../../components/DropdownButton';
import { getUserLocalStorage } from '../../../context/AutenticacaoContext';
import Loading from '../../../components/loading';

const status = [
    { value: '' , label: 'Todos'},
    { value: 'EM ABERTO' , label: 'Em Aberto'},
    { value: 'FINALIZADO' , label: 'Finalizado'}
]

const tipo_entrega = [
    { value: '' , label: 'Selecione...'},
    { value: 'E' , label: 'Entrega'},
    { value: 'R' , label: 'Recolhimento'},
    { value: 'T' , label: 'Troca'},
]

const customStyles = {
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
      color: '#b0b3c5', // Cor do texto do placeholder
    }),
  };

export interface SESSAO{
    seq_tenant: string;
    seq_tenant_user: string;
    login: string;
    type_user: string;
    nome_empresa: string;
}

interface VENDAS {
    sequencial: number;
    pedido: number;
    cliente: string;
    endereco: string;
    status: string;
    data_venda: string;
    tipo_entrega: string;
}

interface OBJETO_SELECT {
    value: string;
    label: string;
}

export default function PageAgendamentosEntregas() {

    const inicializaSessao = {
        seq_tenant: '',
        seq_tenant_user: '',
        login: '',
        type_user: '',
        nome_empresa: '',
    }

    const[sessao, setSessao] = useState<SESSAO>(inicializaSessao)

    useEffect(() => {
        
        const sessao = getUserLocalStorage();

        if (sessao) {

            const dadosSessao = {   
                seq_tenant: sessao.seq_tenant,
                seq_tenant_user: sessao.seq_tenant_user,
                login: sessao.login,
                type_user: sessao.type_user, 
                nome_empresa: sessao.nome_empresa, 
            }

            setSessao(dadosSessao)

        } 

    }, [])

    const [ vendas , setVendas ] = useState<VENDAS[]>([])
    const [ loading , setLoading ] = useState( true )
    const [ isActive, setIsActive ] = useState(false);
    const [ sequencialEntrega , setSequencialEntrega ] = useState(0)
    const [ atualiza , setAtualiza ] = useState( false )

    const [ offset , setOffset ] = useState(0)
    const [ totalVendas , setTotalVendas ] = useState(0)

    const [ optionsEntregadores , setOptionsEntregadores ] = useState<OBJETO_SELECT[]>([])
    const [ optionsVeiculos , setOptionsVeiculos ] = useState<OBJETO_SELECT[]>([])

    const schema = z.object({
        dbedPedido: z.string().optional(),
        dbedStatus: z.string().optional(),
        dbedTipoEntrega: z.string().optional(),
        dbedCliente: z.string().optional()
    })

    type BUSCA_FORMULARIO = z.infer<typeof schema>

    const { register, handleSubmit , reset , control } = useForm<BUSCA_FORMULARIO>({
        resolver: zodResolver(schema),
        defaultValues: {
            dbedPedido: '',
            dbedStatus: 'EM ABERTO',
            dbedTipoEntrega: '',
            dbedCliente: ''
        }
    })

    async function submitForm( data: BUSCA_FORMULARIO){

        setLoading( true )

        const response = await api.get("entregas/",{
            params: {
                query_tipoEntrega: data.dbedTipoEntrega,
                query_pedido: data.dbedPedido,
                query_status: data.dbedStatus,
                query_cliente: data.dbedCliente,
                offset
            }
        })

        if( response.data.Status == 200 ){
            setVendas( response.data.Vendas )
            setTotalVendas( response.data.TotalVendas )
        }

        setLoading( false )
    }

    async function getEntregas(){
        setLoading( true )

        const response = await api.get("entregas/",{
            params: {
                query_tipoEntrega: '',
                query_pedido: '',
                query_status: 'EM ABERTO',
                query_cliente: '',
                offset
            }
        })

        if( response.data.Status == 200 ){
            setVendas( response.data.Vendas )
            setTotalVendas( response.data.TotalVendas )
        }

        setLoading( false )
    }

    async function getEntregadoresOptions(){


        const response = await api.get("entregadores/options")

        if( response.data.Status == 200 ){
            setOptionsEntregadores( response.data.Entregadores )
        }
    }

    async function getVeiculoOptions(){
        const response = await api.get("veiculos/options")

        if( response.data.Status == 200 ){
            setOptionsVeiculos( response.data.Veiculos )
        }
    }

    async function limparFiltros(){
        reset();
        getEntregas();
    }

    useEffect(() => {

        getEntregas();
        getEntregadoresOptions();
        getVeiculoOptions();

    },[ isActive , offset , atualiza ])

    return (
        <>  
            { loading && 
                <Loading/>
            }

            { +sessao.seq_tenant > 0 ? 
            <div className={styles.banner}>
                <div className={ styles.section}>
                    <form id={styles.pesquisa} className={ animation.introX } onSubmit={handleSubmit(submitForm)}>
                        <div className={ styles["row-input"]}>
                            <div className={ styles["form-control"]}>
                                <label>Cliente</label>
                                
                                <input {...register("dbedCliente")} type="text" className={` ${styles['input-form-control']} ${ styles['input-cliente']}`}/>
                            </div>

                            <div className={ styles["form-control"]}>
                                <label>Número do Pedido</label>
                                
                                <input {...register("dbedPedido")} type="text" className={ styles['input-form-control'] }/>
                            </div>

                            <div className={ styles['form-control']}>
                                <label>Status</label>
                                <Controller
                                    control={control}
                                    name="dbedStatus"
                                    render={({field}) => {  
                                        return(
                                            <Select
                                                options={status}
                                                styles={customStyles}
                                                menuPortalTarget={document.body}
                                                placeholder="Selecione..."
                                                value={ status.find((c) => c.value === field.value) }                                          
                                                onChange={(val) => {field.onChange(val?.value)}} 
                                            />
                                        )
                                    }}                                        
                                />
                            </div>

                            <div className={ styles['form-control']}>
                                <label>Tipo da Entrega</label>
                                <Controller
                                    control={control}
                                    name="dbedTipoEntrega"
                                    render={({field}) => {  
                                        return(
                                            <Select
                                                options={tipo_entrega}
                                                styles={customStyles}
                                                menuPortalTarget={document.body}
                                                placeholder="Selecione..."
                                                value={ tipo_entrega.find((c) => c.value === field.value) }                                          
                                                onChange={(val) => {field.onChange(val?.value)}} 
                                            />
                                        )
                                    }}                                        
                                />
                            </div>
                        </div>

                        <div className={ styles["row-btn"]}>
                            <button 
                                onClick={() => limparFiltros()} 
                                className={styles['btn-limpar']}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-refresh-ccw"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                                    Limpar
                            </button>
                            <button className={styles['btn-search']}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                Pesquisar
                            </button>
                            
                        </div>
                    </form >

                    <div className={`${styles.tabela} ${ animation.introY }`}>

                        <div className={ styles['header-table']}>
                            <span>Pedido/Entrega</span>
                            <span className={ styles['text-left']}>Cliente</span>
                            <span>Endereço</span>
                            <span>Tipo</span>
                            <span>Data</span>
                            <span>Status</span>
                            <span>Ações</span>
                        </div>

                        {
                            vendas && 
                                vendas.map( venda =>  (
                                    <div className={ styles['row-item']}>
                                        <span>{ venda.pedido } / { venda.sequencial }</span>
                                        <span className={styles['text-left']}>{ venda.cliente }</span>
                                        <span>{ venda.endereco }</span>
                                        <span>{ venda.tipo_entrega }</span>
                                        <span>{ venda.data_venda}</span>
                                        <span>{ venda.status }</span>
                                        <span>
                                            <DropdownButton
                                                setIsActive={ setIsActive }
                                                setSequencialEntrega={ setSequencialEntrega }
                                                sequencialEntrega={ venda.sequencial}
                                                tipoEntrega={ venda.tipo_entrega }
                                                status={ venda.status }
                                                setAtualiza={ setAtualiza }
                                                sessao={ sessao }
                                            />
                                        </span>
                                    </div>
                                ))
                        }

                        { !vendas && 
                            <div className={ styles['info-null']}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                                <span>Nenhuma venda foi localizada!</span>
                            </div>
                        }
                    </div>
                    
                    { vendas &&
                        <Pagination
                            total_registros = { totalVendas }
                            setOffset={setOffset}
                        />
                    }
                </div>

                <Modal
                    setIsActive={ setIsActive }
                    isActive={ isActive }
                    sequencialEntrega={ sequencialEntrega }
                    optionsEntregadores={optionsEntregadores}
                    optionsVeiculos={optionsVeiculos}
                    sessao={ sessao }
                />

            </div> : <></>
            }
        </>
    )
}
