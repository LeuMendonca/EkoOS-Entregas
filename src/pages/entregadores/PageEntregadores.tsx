import { useEffect, useState } from 'react'
import PageCadastroEntregador from './cadastro/PageCadastroEntregador'
import PageConsultaEntregadores from './consulta/PageConsultaEntregadores'
import styles from './PageEntregadores.module.css'
import { usuarioAutenticado } from '../../context/useAutenticacao'
import { getUserLocalStorage } from '../../context/AutenticacaoContext'

interface SESSAO{
    seq_tenant: string;
    login: string;
    type_user: string;
    nome_empresa: string;
}

export default function PageEntregadores() {

    const [ aba , setAba ] = useState(0)
    const [ codigoEntregador , setCodigoEntregador ] = useState(0)

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

    return (
        <>
            { +sessao.seq_tenant > 0 && 
                <>
                    <header  className={ styles.header }>
                        <button onClick={() => {setAba( 1 );setCodigoEntregador(0)}}>Novo Entregador</button>
                    </header>

                    { aba == 0 ? 
                        <PageConsultaEntregadores
                            setCodigoEntregador={ setCodigoEntregador }
                            setAba={ setAba }
                        />
                        : <PageCadastroEntregador
                            setAba={ setAba }
                            codigoEntregador={ codigoEntregador }
                        />
                    }
                </>
            }
        </>
    )
}