import { useEffect, useState } from 'react'
import PageCadastroEntregador from './cadastro/PageCadastroEntregador'
import PageConsultaEntregadores from './consulta/PageConsultaEntregadores'
import { getUserLocalStorage } from '../../context/AutenticacaoContext'

export interface SESSAO{
    seq_tenant: string;
    seq_tenant_user: string;
    login: string;
    type_user: string;
    nome_empresa: string;
}

export default function PageEntregadores() {

    const [ aba , setAba ] = useState(0)
    const [ codigoEntregador , setCodigoEntregador ] = useState(0)

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

    return (
        <>
            { +sessao.seq_tenant > 0 && 
                <>
                    { aba == 0 ? 
                        <PageConsultaEntregadores
                            setCodigoEntregador={ setCodigoEntregador }
                            setAba={ setAba }
                            sessao={ sessao }
                        />
                        : <PageCadastroEntregador
                            setAba={ setAba }
                            codigoEntregador={ codigoEntregador }
                            sessao={ sessao }
                        />
                    }
                </>
            }
        </>
    )
}