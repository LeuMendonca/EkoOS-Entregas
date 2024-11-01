import { useEffect, useState } from 'react'
import styles from './PageConsultaEntregas.module.css'
import { api } from '../../../services/axios';
import Select from 'react-select';
import Modal from '../components/Modal';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const status = [
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
  

interface VENDAS {
    sequencial: number;
    venda: number;
    cliente: string;
    endereco: string;
    status: string;
    data_venda: string;
}

interface OBJETO_SELECT {
    value: string;
    label: string;
}

export default function PageConsultaEntregas() {

    const [ vendas , setVendas ] = useState<VENDAS[]>([])
    const [isActive, setIsActive] = useState(false);
    const [ codigoVenda , setCodigoVenda ] = useState(0)

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

    const { register, handleSubmit , reset , setValue , control } = useForm<BUSCA_FORMULARIO>({
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

    async function submitForm( data: BUSCA_FORMULARIO){
        const response = await api.get("entregas/",{
            params: {
                query_veiculo: data.dbedVeiculo,
                query_entregador: data.dbedEntregador,
                query_data_entrega: data.dbedDataEntrega,
                query_venda: data.dbedVenda,
                query_status: data.dbedStatus
            }
        })
    }

    async function getEntregas(){
        const response = await api.get("entregas/",{
            params: {
                query_veiculo: '',
                query_entregador: '',
                query_data_entrega: '',
                query_venda: '',
                query_status: '',
            }
        })

        if( response.data.Status == 200 ){
            setVendas( response.data.Vendas )
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

    useEffect(() => {
        getEntregas();
        getEntregadoresOptions();
        getVeiculoOptions();
    },[ isActive ])

    return (
    <>
        <div className={styles.banner}>
            <div className={ styles.section}>
                <form id={styles.pesquisa} onSubmit={handleSubmit(submitForm)}>
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
                                            <td scope="row">{ venda.venda }</td>
                                            <td>{ venda.cliente }</td>
                                            <td>{ venda.endereco }</td>
                                            <td>RECOLHIMENTO</td>
                                            <td>{ venda.data_venda}</td>
                                            <td>{ venda.status == 'A' ? 'ABERTO' 
                                                : venda.status == 'F' ? 'FINALIZADO'
                                                : venda.status == 'R' ? 'EM ROTA'
                                                : venda.status == 'C' ? 'CANCELADO'
                                                : venda.status == 'AD' ? 'ADIADO'
                                                : venda.status == 'AG' ? 'AGENDADO'
                                                : ''
                                            }</td>
                                            <td>
                                                <a onClick={() => { setIsActive( state => !state ); setCodigoVenda( venda.sequencial) }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                                                </a> 
                                            </td>
                                        </tr>
                                    ))
                            }
                            
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                setIsActive={ setIsActive }
                isActive={ isActive }
                codigoVenda={ codigoVenda }
                optionsEntregadores={optionsEntregadores}
                optionsVeiculos={optionsVeiculos}
            />

        </div>

    </>
  )
}
