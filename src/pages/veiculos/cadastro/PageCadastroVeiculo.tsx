import { toast } from 'react-toastify';
import { api } from '../../../services/axios';
import styles from './PageCadastroVeiculo.module.css'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

interface PROPRIEDADES {
    codigoVeiculo: number;
    setAba: ( aba: number ) => void;
}

export default function PageCadastroVeiculo({ codigoVeiculo , setAba }: PROPRIEDADES) {

    const schema = z.object({
        dbedNome: z.string().trim().min(1,'Nome do entregador é obrigatório!'),
        dbedPlaca: z.string().trim().min(1,'Senha é obrigatório!')
    })

    type CADASTRO_VEICULO = z.infer<typeof schema>

    const { register, handleSubmit , reset , setValue } = useForm<CADASTRO_VEICULO>({
        resolver: zodResolver(schema),
    })
    
    async function handleSubmitForm( data: CADASTRO_VEICULO ){

        if( codigoVeiculo <= 0 ){
            
            const response = await api.post('veiculos/',{
                body: data
            })
    
            if( response.data.Status == 200 ){
                toast.success(response.data.Mensagem,{position: 'bottom-right'});
                reset()
            }else{
                toast.error( response.data.Erro.causa,{position: 'bottom-right'} )
            }

        }else{
            
            const response = await api.put('veiculos/',{
                params: {
                    codigo_veiculo: codigoVeiculo
                },
                body: data
            })
    
            if( response.data.Status == 200 ){
                toast.success(response.data.Mensagem,{position: 'bottom-right'});
                reset()
            }else{
                toast.error( response.data.Erro.causa,{position: 'bottom-right'} )
            }
        }
        
    }

    async function getVeiculo(){
        const response = await api.get("veiculos/edit",{
            params: {
                codigo_veiculo: codigoVeiculo
            }
        })

        console.log( response.data )

        if( response.data.Status == 200 ){
            setValue("dbedNome", response.data.Veiculo[0].nome )
            setValue("dbedPlaca", response.data.Veiculo[0].placa )
        }
    }

    useEffect(() => {
        if( codigoVeiculo > 0 ){
            getVeiculo();
        }
    },[ codigoVeiculo ])
    
    return (
    <div className={styles.banner}>
        <div className={styles.tabela}>
            <form onSubmit={handleSubmit(handleSubmitForm)} id={styles.formulario} >
                <button onClick={() => setAba(0)} className={ styles['btn-return'] }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
                </button>
                
                <legend>Cadastrar Veículo</legend>
                <div>
                    <label>Nome:</label>
                    <input {...register("dbedNome")} className={styles.camponome} type="text"></input>
                </div>

                <div>
                    <label>Placa:</label>
                    <input {...register("dbedPlaca")} className={styles.campoplaca} type="text"></input>
                </div>
                
                <div className={styles.botoes}>
                    <input className={styles.botaocadastrar} type="submit" value="Cadastrar"></input>
                </div>
            </form>
        </div>
        
    </div>
  )
}
