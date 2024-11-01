import styles from './PageHome.module.css'
import bannerEntregas from '../../img/banner-entregas.jpg'

export default function PageHome() {
    return (
        <div className={ styles.divTest}>
            

            <section className={ styles.section }>
                <div className={ styles.divBanner }>
                    <span>Seu gerenciamento de entregas, mais simples do que nunca.</span>
                    <img src={bannerEntregas} className={ styles.bannerEntregas }/>
                </div>
            </section>
        </div>
    )
}