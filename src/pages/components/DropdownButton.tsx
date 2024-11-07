import React, { useState, useRef, useEffect } from 'react';
import styles from './DropdownButton.module.css'; // Importa o CSS para o componente
import { api } from '../../services/axios';
import { toast } from 'react-toastify';

interface PROPRIEDADES {
    setIsActive: (isActive: boolean) => void;
    setSequencialEntrega: (sequencialEntrega: number) => void;
    sequencialEntrega: number;
    tipoEntrega: string;
    status: string;
}

const DropdownButton: React.FC<PROPRIEDADES> = ({ sequencialEntrega, setSequencialEntrega, setIsActive , tipoEntrega , status }) => {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const openModal = () => {
        setSequencialEntrega(sequencialEntrega);
        setIsActive(true);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    async function geraTroca(){
        const response = await api.post("entregas/gera-troca",{
            body: { 
                sequencial_entrega: sequencialEntrega 
            }
        })

        if( response.data.Status == 200 ){
            setIsActive( true );
            setSequencialEntrega( response.data.SequencialTroca )
            toast.success( response.data.Mensagem )
        }else {
            toast.error( response.data.Erro.causa )
        }
    }

    async function geraRecolhimento(){
        const response = await api.post("entregas/gera-recolhimento",{
            body: { 
                sequencial_entrega: sequencialEntrega 
            }
        })

        if( response.data.Status == 200 ){
            setIsActive( true );
            setSequencialEntrega( response.data.SequencialRecolhimento )
            toast.success( response.data.Mensagem )
        }else {
            toast.error( response.data.Erro.causa )
        }
    }

    return (
        <div ref={dropdownRef} className={ styles.dropdown}>
            <button onClick={toggleDropdown} className={ styles['dropdown-button']}>
                Ações
            </button>
            <div className={`${ styles["dropdown-content"]} ${isOpen ? styles.show : ''}`}>
                <a onClick={openModal}>Editar</a>
                { tipoEntrega == 'ENTREGA' && status == 'FINALIZADO' && (
                 <>
                    <a onClick={ () => { geraTroca() } }>Gerar Troca</a>
                    <a onClick={ () => geraRecolhimento() }>Gerar Recolhimento</a></>
                )
                }
            </div>
        </div>
    );
};

export default DropdownButton;
