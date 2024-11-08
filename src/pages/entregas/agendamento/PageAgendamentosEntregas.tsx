import { useEffect, useState } from 'react'
import styles from './PageAgendamentosEntregas.module.css'
import { api } from '../../../services/axios';
import Select from 'react-select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Pagination from '../../components/Pagination';
import Modal from './components/Modal';
import DropdownButton from '../../components/DropdownButton';

const status = [
    { value: '' , label: 'TODOS'},
    { value: 'EM ABERTO' , label: 'EM ABERTO'},
    { value: 'FINALIZADO' , label: 'FINALIZADO'}
]

const tipo_entrega = [
    { value: '' , label: 'Selecione...'},
    { value: 'E' , label: 'ENTREGA'},
    { value: 'R' , label: 'RECOLHIMENTO'},
    { value: 'T' , label: 'TROCA'},
]

const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#2c2f3a', // Fundo do controle do Select (diferente do fundo da tela)
      borderColor: '#5a5d6a',     // Borda clara para contraste
      color: 'white',
      width: '100%' ,
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

    const [ vendas , setVendas ] = useState<VENDAS[]>([])
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
            dbedStatus: '',
            dbedTipoEntrega: '',
            dbedCliente: ''
        }
    })

    async function submitForm( data: BUSCA_FORMULARIO){
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
    }

    async function getEntregas(){
        const response = await api.get("entregas/",{
            params: {
                query_tipoEntrega: '',
                query_pedido: '',
                query_status: '',
                query_cliente: '',
                offset
            }
        })

        if( response.data.Status == 200 ){
            setVendas( response.data.Vendas )
            setTotalVendas( response.data.TotalVendas )
        }
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
            <div className={styles.banner}>
                <div className={ styles.section}>
                    <form id={styles.pesquisa} onSubmit={handleSubmit(submitForm)}>
                        <div className={ styles["row-input"]}>
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

                            <div className={ styles["form-control"]}>
                                <label>Cliente</label>
                                
                                <input {...register("dbedCliente")} type="text" className={` ${styles['input-form-control']} ${ styles['input-cliente']}`}/>
                            </div>
                        </div>

                        <div className={ styles["row-btn"]}>
                            <input className={styles.botaopesquisar} type="submit" value="Pesquisar"/>
                            
                            <input onClick={() => limparFiltros()} className={styles.botaopesquisar} type="button" value="Limpar"/>
                        </div>
                    </form >

                    <div className={styles.tabela}>
                        <table className={ styles.table }>

                            <thead>
                                <tr>
                                    <th scope="col">N° VENDA</th>
                                    <th scope="col">CLIENTE</th>
                                    <th scope="col">ENDERECO</th>
                                    <th scope="col">TIPO</th>
                                    <th>DATA</th>
                                    <th>STATUS</th>
                                    <th scope="col">AÇÕES</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    vendas && 
                                        vendas.map( venda =>  (
                                            <tr>
                                                <td scope="row">{ venda.pedido }</td>
                                                <td>{ venda.cliente }</td>
                                                <td>{ venda.endereco }</td>
                                                <td>{ venda.tipo_entrega }</td>
                                                <td>{ venda.data_venda}</td>
                                                <td>{ venda.status }</td>
                                                <td>
                                                    <DropdownButton
                                                        setIsActive={ setIsActive }
                                                        setSequencialEntrega={ setSequencialEntrega }
                                                        sequencialEntrega={ venda.sequencial}
                                                        tipoEntrega={ venda.tipo_entrega }
                                                        status={ venda.status }
                                                        setAtualiza={ setAtualiza }
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                }
                                
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                    total_registros = { totalVendas }
                    setOffset={setOffset}
                />
                </div>

                <Modal
                    setIsActive={ setIsActive }
                    isActive={ isActive }
                    sequencialEntrega={ sequencialEntrega }
                    optionsEntregadores={optionsEntregadores}
                    optionsVeiculos={optionsVeiculos}
                />

                

            </div>
        </>
    )
}
