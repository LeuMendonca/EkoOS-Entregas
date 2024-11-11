import { useState } from 'react';
import styles from './Pagination.module.css';
import animation from '../../components/animation.module.css'

interface PROPRIEDADES {
    total_registros: number;
    setOffset: (offset: number) => void;
}

export default function Pagination({ total_registros, setOffset }: PROPRIEDADES) {
    const [currencyPage, setCurrencyPage] = useState(0);

    const totalPaginas = Math.ceil(total_registros / 10);

    const maxPagesAround = 2;
    const startPage = Math.max(0, currencyPage - maxPagesAround);
    const endPage = Math.min(totalPaginas, currencyPage + maxPagesAround + 1);

    return (
        <div className={`${styles.pagination} ${animation.introX}`}>
            <span onClick={() => {setCurrencyPage(0);setOffset(0)}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevrons-left"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
            </span>

            {total_registros > 0 &&
                Array.from({ length: endPage - startPage }, (_, index) => {
                    
                    const pageNumber = startPage + index;

                    return (
                        <span
                            key={pageNumber}
                            onClick={() => {
                                setOffset(pageNumber * 10);
                                setCurrencyPage(pageNumber);
                            }}
                            className={pageNumber === currencyPage ? styles.active : ''}
                        >
                            {pageNumber + 1}
                        </span>
                    );
                })
            }

            <span onClick={() => {setCurrencyPage( totalPaginas - 1 ) ; setOffset( (totalPaginas - 1) * 10 )}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevrons-right"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>
            </span>
        </div>
    );
}
