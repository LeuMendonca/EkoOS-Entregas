import { useEffect, useState } from 'react'
import PageCadastroVeiculo from './cadastro/PageCadastroVeiculo'
import PageConsultaVeiculo from './consulta/PageConsultaVeiculo'
import { getUserLocalStorage } from '../../context/AutenticacaoContext';

export interface SESSAO{
    seq_tenant: string;
    seq_tenant_user: string;
    login: string;
    type_user: string;
    nome_empresa: string;
}

export default function PageVeiculos() {

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

    const [ aba , setAba ] = useState(0)
    const [ codigoVeiculo , setCodigoVeiculo ] = useState(0)

    return (
        <>
            { +sessao.seq_tenant &&
                <>

                    { aba == 0 ? 
                        <PageConsultaVeiculo
                            setCodigoVeiculo={ setCodigoVeiculo }
                            setAba={ setAba }
                            sessao={ sessao }
                        />
                        : <PageCadastroVeiculo
                            setAba={ setAba }
                            codigoVeiculo={ codigoVeiculo }
                            sessao={ sessao }
                        />
                    }
                </>
            }
        </>
    )
}
