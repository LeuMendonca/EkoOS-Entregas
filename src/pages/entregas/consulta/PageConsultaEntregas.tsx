import { useEffect, useState } from 'react';
import { api } from '../../../services/axios'
import styles from './PageConsultaEntregas.module.css'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from 'react-select'
import Pagination from '../../components/Pagination';
import ModalConsulta from './components/ModalConsulta';

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

const status = [
    {value: 'P', label: 'PENDENTE' },
    {value: 'A', label: 'AGENDADO' },
    {value: 'F', label: 'FINALIZADO'},
    {value: 'R', label: 'EM ROTA'},
    {value: 'C', label: 'CANCELADO'},
    {value: 'AD', label: 'ADIADO'},
]



const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#2c2f3a', // Fundo do controle do Select (diferente do fundo da tela)
      borderColor: '#5a5d6a',     // Borda clara para contraste
      color: 'white',
      width: '200px' ,
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
      zIndex: 9999
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#3a3d4a' : '#2c2f3a', // Cor das opções, mudando no hover
      color: state.isFocused ? 'white' : '#b0b3c5', // Texto claro para contraste
      '&:active': {
        backgroundColor: '#4a4d5a',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#b0b3c5', // Cor do texto do placeholder
    }),
};

export default function PageConsultaEntregas() {

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
            <div className={ styles["banner"]}>
                <div className={ styles.section}>
                    <form id={styles.pesquisa} onSubmit={handleSubmit(submitFormPesquisa)}>
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

                        <div className={ styles["form-control"]}>
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

                        <input className={styles.botaopesquisar} type="submit" value="Pesquisar"></input>
                        <input onClick={() => limparFiltros()} className={styles.botaopesquisar} type="button" value="Limpar"></input>
                    </form >

                    <div className={styles.tabela}>
                        <table className={ styles.table }>

                            <thead>
                                <tr>
                                    <th scope="col">Pedido</th>
                                    <th scope="col">CLIENTE</th>
                                    <th scope="col">STATUS</th>
                                    <th scope='col'>TIPO ENTREGA</th>
                                    <th scope='col'>PRODUTO</th>
                                    <th scope='col'>ENTREGADOR</th>
                                    <th scope='col'>DATA ENTREGA</th>
                                    <th scope="col">AÇÕES</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    vendas && 
                                        vendas.map( venda =>  (
                                            <tr>
                                                <td scope="row">{ venda.pedido }</td>
                                                <td scope="row">{ venda.cliente }</td>
                                                <td scope="row">{ venda.status }</td>
                                                <td scope="row">{ venda.tipo_entrega }</td>
                                                <td scope="row">{ venda.produto }</td>
                                                <td scope="row">{ venda.nome_entregador }<br/>{ venda.nome_veiculo }</td>
                                                <td scope="row">{ venda.data_entrega ? venda.data_entrega : 'N/A'}</td>
                                                <td scope="row">
                                                    <a onClick={() => verVenda( venda.sequencial_entrega )}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                                    </a> 
                                                </td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                    total_registros={ totalVendas }
                    setOffset={setOffset}
                />
                </div>

                
            <ModalConsulta
                isActive={ isActive }
                setIsActive={ setIsActive }
                sequencialEntrega={ sequencialEntrega }
                />
                </div>
        </>
    )
}
