import { useState } from 'react'
import PageCadastroVeiculo from './cadastro/PageCadastroVeiculo'
import PageConsultaVeiculo from './consulta/PageConsultaVeiculo'
import styles from './PageVeiculos.module.css'

export default function PageVeiculos() {

    const [ aba , setAba ] = useState(0)
    const [ codigoVeiculo , setCodigoVeiculo ] = useState(0)

    return (
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
    )
}
