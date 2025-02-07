import { toast } from 'react-toastify';
import { api } from '../../../services/axios';
import styles from './PageCadastroVeiculo.module.css'
import animation from '../../../components/animation.module.css'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { SESSAO } from '../PageVeiculos';

interface PROPRIEDADES {
    codigoVeiculo: number;
    setAba: ( aba: number ) => void;
    sessao: SESSAO;
}

export default function PageCadastroVeiculo({ codigoVeiculo , setAba , sessao }: PROPRIEDADES) {

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
                params: {
                    seq_tenant: sessao.seq_tenant,
                    seq_tenant_user: sessao.seq_tenant_user
                },body: data
            })
    
            if( response.data.Status == 200 ){
                toast.success( response.data.Mensagem );
                reset()
            }else{
                toast.error( response.data.Erro.causa )
            }

        }else{
            
            const response = await api.put('veiculos/',{
                params: {
                    codigo_veiculo: codigoVeiculo,
                    seq_tenant: sessao.seq_tenant,
                    seq_tenant_user: sessao.seq_tenant_user
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
        <div className={ `${ styles.tabela } ${ animation.introY }` }>
            <form onSubmit={handleSubmit(handleSubmitForm)} id={styles.formulario} >
                <button onClick={() => setAba(0)} className={ styles['btn-return'] }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                </button>
                
                <legend>Cadastrar Veículo</legend>
                <div>
                    <label>Nome</label>
                    <input 
                        {...register("dbedNome")} 
                        className={styles.camponome} 
                        type="text"
                        autoComplete="off"
                    />
                </div>

                <div>
                    <label>Placa</label>
                    <input 
                        {...register("dbedPlaca")} 
                        className={styles.campoplaca} 
                        type="text"
                        autoComplete="off"
                    />
                </div>
                
                <div className={styles.botoes}>
                    <button 
                        className={styles.botaocadastrar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                        Salvar
                    </button>
                </div>
            </form>
        </div>
        
    </div>
  )
}
