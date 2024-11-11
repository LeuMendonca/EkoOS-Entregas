import { useEffect, useState } from 'react';
import styles from './PageConsultaVeiculo.module.css'
import animation from '../../../components/animation.module.css'
import { api } from '../../../services/axios';

interface PROPRIEDADES {
    setCodigoVeiculo: ( codigoVeiculo: number ) => void;
    setAba: ( aba: number ) => void;
}

interface VEICULOS {
    sequencial: number;
    nome_veiculo: string;
    placa_veiculo: string;
}

export default function PageConsultaVeiculo({ setAba , setCodigoVeiculo }: PROPRIEDADES) {
    
    const [ veiculos , setVeiculos ] = useState<VEICULOS[]>([])

    async function getVeiculos(){
        const response = await api.get("veiculos/")

        setVeiculos( response.data )
    }

    useEffect(() => {
        getVeiculos();
    },[])
    
    return (
    <div className={styles.banner}>
        <div className={styles.tabela}>
            <table className={`${ styles.table } ${ animation.introY }`}>
                <thead>
                    <tr>
                        <th scope="col">CODIGO</th>
                        <th scope="col">NOME</th>
                        <th scope="col">PLACA</th>
                        <th scope="col">AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        veiculos && 
                            veiculos.map( veiculo => (
                                <tr>
                                    <td scope="row">{ veiculo.sequencial }</td>
                                    <td>{ veiculo.nome_veiculo }</td>
                                    <td>{ veiculo.placa_veiculo }</td>
                                    <td>
                                        <a className={ styles["btn-edit"]} onClick={() => { setCodigoVeiculo( veiculo.sequencial); setAba(1); }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg></a> 
                                    </td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}
