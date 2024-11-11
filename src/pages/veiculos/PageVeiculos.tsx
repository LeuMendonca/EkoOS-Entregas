import { useEffect, useState } from 'react'
import PageCadastroVeiculo from './cadastro/PageCadastroVeiculo'
import PageConsultaVeiculo from './consulta/PageConsultaVeiculo'
import styles from './PageVeiculos.module.css'
import { usuarioAutenticado } from '../../context/useAutenticacao';
import { getUserLocalStorage } from '../../context/AutenticacaoContext';

interface SESSAO{
    seq_tenant: string;
    login: string;
    type_user: string;
    nome_empresa: string;
}

export default function PageVeiculos() {

    const AutenticacaoContext = usuarioAutenticado();

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

    const [ aba , setAba ] = useState(0)
    const [ codigoVeiculo , setCodigoVeiculo ] = useState(0)

    return (
        <>
            { +sessao.seq_tenant &&
                <>
                    <header  className={ styles.header }>
                        <button onClick={() => {setAba( 1 );setCodigoVeiculo(0)}}>Novo Veículo</button>
                    </header>

                    { aba == 0 ? 
                        <PageConsultaVeiculo
                            setCodigoVeiculo={ setCodigoVeiculo }
                            setAba={ setAba }
                        />
                        : <PageCadastroVeiculo
                            setAba={ setAba }
                            codigoVeiculo={ codigoVeiculo }
                        />
                    }
                </>
            }
        </>
    )
}
