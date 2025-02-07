import { useEffect, useState } from 'react';
import { api } from '../../../services/axios'
import styles from './PageConsultaEntregas.module.css'
import animation from '../../../components/animation.module.css'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from 'react-select'
import Pagination from '../../components/Pagination';
import ModalConsulta from './components/ModalConsulta';
import { getUserLocalStorage } from '../../../context/AutenticacaoContext';

interface OBJETO_SELECT {
    value: string;
    label: string;
}

interface VENDAS {
    sequencial_entrega: number;
    sequencial_item: number;
    pedido: string;
    cliente: string;
    endereco: string;
    produto: string;
    data_entrega: string;
    nome_entregador: string;
    nome_veiculo: string;
    status: string;
    obs: string;
    tipo_entrega: string;
}

interface SESSAO{
    seq_tenant: string;
    login: string;
    type_user: string;
    nome_empresa: string;
}

const status = [
    {value: '' , label: 'Selecione...'},
    {value: 'PENDENTE', label: 'Pendente' },
    {value: 'AGENDADO', label: 'Agendado' },
    {value: 'FINALIZADO', label: 'Finalizado'},
    {value: 'CANCELADO', label: 'Cancelado'},
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

export default function PageConsultaEntregas() {

    const inicializaSessao = {
        seq_tenant: '',
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
                login: sessao.login,
                type_user: sessao.type_user, 
                nome_empresa: sessao.nome_empresa, 
            }

            setSessao(dadosSessao)

        } 

    }, [])

    // Ferramentas para o modal de consulta
    const [ isActive , setIsActive ] = useState(false)
    const [ sequencialEntrega, setSequencialEntrega ] = useState(0)

    const [ vendas , setVendas ] = useState<VENDAS[]>([])

    const [ offset , setOffset ] = useState(0)
    const [ totalVendas , setTotalVendas ] = useState(0)

    const [ optionsEntregadores , setOptionsEntregadores ] = useState<OBJETO_SELECT[]>([])
    const [ optionsVeiculos , setOptionsVeiculos ] = useState<OBJETO_SELECT[]>([])
    
    const schema = z.object({
        dbedVeiculo: z.string().optional(),
        dbedEntregador: z.string().optional(),
        dbedLoja: z.string().optional(),
        dbedDataEntrega: z.string().optional(),
        dbedVenda: z.string().optional(),
        dbedStatus: z.string().optional()
    })

    type BUSCA_FORMULARIO = z.infer<typeof schema>

    const { register, handleSubmit , reset , control } = useForm<BUSCA_FORMULARIO>({
        resolver: zodResolver(schema),
        defaultValues: {
            dbedDataEntrega: '',
            dbedEntregador: '',
            dbedLoja: '',
            dbedStatus: '',
            dbedVeiculo: '',
            dbedVenda: ''
        }
    })

    async function submitFormPesquisa( data: BUSCA_FORMULARIO ){
        const response = await api.get("entregas/consultar-agendamentos",{
            params: {
                query_veiculo: data.dbedVeiculo,
                query_entregador: data.dbedEntregador,
                query_data_entrega: data.dbedDataEntrega,
                query_venda: data.dbedVenda,
                query_status: data.dbedStatus,
                offset
            }
        })

        if( response.data.Status == 200 ){
            setVendas( response.data.Vendas )
            setTotalVendas( response.data.TotalVendas )
        }
    }

    async function getAgendamentos(){
        const response = await api.get("entregas/consultar-agendamentos",{
            params: {
                query_veiculo: '',
                query_entregador: '',
                query_data_entrega: '',
                query_venda: '',
                query_status: '',
                offset
            }
        })

        if( response.data.Status == 200 ){
            setVendas( response.data.Vendas )
            setTotalVendas( response.data.TotalVendas )
        }
    }

    async function limparFiltros(){
        reset();
        getAgendamentos();
    }

    async function verVenda( sequencial: number ){
        setIsActive( true )
        setSequencialEntrega( sequencial )
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

    useEffect(() => {
        getEntregadoresOptions()
        getVeiculoOptions()
        getAgendamentos()
    },[ offset ])

    return (
        <>
            { +sessao.seq_tenant > 0 && 
            <div className={ styles["banner"]}>
                <div className={ styles.section}>
                    <form id={styles.pesquisa} onSubmit={handleSubmit(submitFormPesquisa)} className={ animation.introX}>
                        <div className={ styles['row-input']}>
                            <div className={styles["form-control"]}>
                                <label>Veiculo:</label>
                                <Controller
                                    control={control}
                                    name="dbedVeiculo"
                                    render={({field}) => {  
                                        return(
                                            <Select
                                                options={optionsVeiculos}
                                                styles={customStyles}
                                                menuPortalTarget={document.body}
                                                placeholder="Selecione..."
                                                value={ optionsVeiculos.find((c) => c.value === field.value) }                                          
                                                onChange={(val) => {field.onChange(val?.value)}} 
                                            />
                                        )
                                    }}                                        
                                />
                                
                            </div>
                            
                            <div className={styles["form-control"]}>
                                <label>Entregador</label>
                                <Controller
                                    control={control}
                                    name="dbedEntregador"
                                    render={({field}) => {  
                                        return(
                                            <Select
                                                options={optionsEntregadores}
                                                styles={customStyles}
                                                menuPortalTarget={document.body}
                                                placeholder="Selecione..."
                                                value={ optionsEntregadores.find((c) => c.value === field.value) }                                          
                                                onChange={(val) => {field.onChange(val?.value)}}  
                                            />
                                        )
                                    }}                                        
                                />
                                
                            </div>

                            <div className={styles["form-control"]}>
                                <label htmlFor=""><b>Data de Entrega</b></label>
                                <input {...register("dbedDataEntrega")} type="date" className={ styles['input-form-control']} />
                            </div>

                            <div className={ styles["form-control"]} style={{ flex: 1}}>
                                <label>Venda</label>
                                
                                <input {...register("dbedVenda")} type="text" className={ styles['input-form-control'] }/>
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
                        </div>
                        
                        <div className={ styles["row-btn"]}>
                            <button onClick={() => limparFiltros()} className={ styles['btn-clear']}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-refresh-ccw"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                                Limpar
                            </button>
                            <button className={ styles['btn-submit']}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                Pesquisar
                            </button>
                        </div>
                    </form >

                    <div className={`${styles.tabela} ${ animation.introY }`}>

                        <div className={ styles['header-table']}>
                            <span>Pedido</span>
                            <span className={ styles['text-left']}>Cliente</span>
                            <span>Status</span>
                            <span>Tipo Entrega</span>
                            <span className={ styles['text-left']}>Produto</span>
                            <span>Entregador</span>
                            <span>Data Entrega</span>
                            <span style={{ textAlign: 'center'}}>Ações</span>
                        </div>

                        {
                            vendas && 
                                vendas.map( venda =>  (
                                    <div className={ styles['row-item'] }>
                                        <span>{ venda.pedido }</span>
                                        <span className={ styles['text-left']}>{ venda.cliente }</span>
                                        <span>{ venda.status }</span>
                                        <span>{ venda.tipo_entrega }</span>
                                        <span className={ styles['text-left']}>{ venda.produto }</span>
                                        <span>{ venda.nome_entregador }<br/>{ venda.nome_veiculo }</span>
                                        <span>{ venda.data_entrega ? venda.data_entrega : 'N/A'}</span>
                                        <span style={{justifySelf: 'end'}}>
                                            <a onClick={() => verVenda( venda.sequencial_entrega )}>
                                                <span className={ styles['btn-ver-mais'] }>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                                    Ver mais
                                                </span>
                                            </a> 
                                        </span>
                                    </div>
                                ))
                        }

                        { !vendas && 
                            <div className={ styles['info-null']}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                                <span>Nenhuma entrega foi localizada!</span>
                            </div>
                        }
                        
                    </div>

                    { vendas && 
                        <Pagination
                            total_registros={ totalVendas }
                            setOffset={setOffset}
                        />
                    }
                </div>

                
            <ModalConsulta
                isActive={ isActive }
                setIsActive={ setIsActive }
                sequencialEntrega={ sequencialEntrega }
                />
                </div>
            }
        </>
    )
}
