import { useEffect, useState } from 'react';
import styles from './Layout.module.css'
import { Outlet } from 'react-router-dom'
import { getUserLocalStorage } from '../../context/AutenticacaoContext';
import { usuarioAutenticado } from '../../context/useAutenticacao';

interface SESSAO{
    seq_tenant: string;
    login: string;
    type_user: string;
    nome_empresa: string;
}

export default function Layout() {

    const AutenticacaoContext = usuarioAutenticado();

    const [ accordionSidebar , setAccordionSideBar ] = useState( true )

    const inicializaSessao = {
        seq_tenant: '',
        login: '',
        type_user: '',
        nome_empresa: '',
    }

    const[sessao, setSessao] = useState<SESSAO>(inicializaSessao)


    useEffect(() => {
        
        const sessao = getUserLocalStorage();

        if ( sessao ) {

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
            {  +sessao.seq_tenant > 0 ?
                <div>
                    

                    <aside className={`${styles.sidebar} ${ accordionSidebar ? styles['sidebar-open'] : styles['sidebar-close']}`}>
                        
                        <div className={styles.sidebarheader}>
                            <button className={ styles['btn-close-open-sidebar'] } onClick={() => setAccordionSideBar(!accordionSidebar)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-align-justify"><path d="M3 12h18"/><path d="M3 18h18"/><path d="M3 6h18"/></svg>
                            </button>
                            <span className={styles.materialsymbolsoutlined}></span><h2>EkoOS Entregas</h2>
                            
                        </div>
                        <ul className={styles.sidebarlinks}>
                            <h4>
                                <span className={ styles["menu-span"]}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-package"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/></svg>
                                    Entregas
                                </span>
                            </h4>
                            <li>
                                <a href="/entregas">
                                    <span className={ styles["menu-span"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar-fold"><path d="M8 2v4"/><path d="M16 2v4"/><path d="M21 17V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11Z"/><path d="M3 10h18"/><path d="M15 22v-4a2 2 0 0 1 2-2h4"/></svg>
                                        Agendar
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="/consultar-entregas">
                                    <span className={styles["menu-span"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                        Consultar
                                    </span>
                                </a>
                            </li>
                            <li>
                            </li>
                            <h4>
                                <span className={ styles["menu-span"]}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={"lucide lucide-truck"}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                                    Veiculos
                                </span>
                            </h4>
                            <li>
                                <a href="/veiculos">
                                    <span className={ styles["menu-span"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                        Consultar
                                    </span>
                                </a>
                            </li>
                            
                            <h4>
                                <span className={ styles["menu-span"]}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    Entregadores
                                </span>
                            </h4>

                            <li>
                                <a href="/entregadores">
                                    <span className={ styles["menu-span"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                        Consultar
                                    </span>
                                </a>
                            </li>
                        </ul>

                        { accordionSidebar && 
                            <div className={ styles.userZone}>
                                <div className={ styles.infoZone }>
                                    <div>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        </span>
                                        <div className={ styles.infoUser }>
                                            <span>{ sessao.login }</span>
                                            <span className={ styles.typeUser }>{ +sessao.type_user == 1 ? 'Administrador' : +sessao.type_user == 2 ? 'Gerente' : 'Entregador' }</span>
                                        </div>
                                    </div>

                                </div>

                                <a onClick={ () => AutenticacaoContext.logout() }>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                                    Logoff
                                </a>
                            </div>
                        }
                    </aside>

                    <div className={accordionSidebar ? styles['div-outlet-sidebar-open'] : styles['div-outlet-sidebar-close'] }>
                        <Outlet context={{
                            statusSidebar: accordionSidebar
                        }} />
                    </div>
                </div> 
                : <></>
            }
        </>
    )
}
