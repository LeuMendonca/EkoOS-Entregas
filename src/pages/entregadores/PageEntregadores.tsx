import { useState } from 'react'
import PageCadastroEntregador from './cadastro/PageCadastroEntregador'
import PageConsultaEntregadores from './consulta/PageConsultaEntregadores'
import styles from './PageEntregadores.module.css'

export default function PageEntregadores() {

    const [ aba , setAba ] = useState(0)
    const [ codigoEntregador , setCodigoEntregador ] = useState(0)

    return (
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
    )
}