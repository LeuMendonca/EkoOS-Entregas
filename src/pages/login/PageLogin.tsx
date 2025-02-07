// import Image from "next/image"
import imageLogin  from "../../img/image-login.jpg"
import styles from './PageLogin.module.css'
import animation from '../../components/animation.module.css'

import Login from "./components/Login"

export default function PageLogin() {

    return (
        <div className={styles.containerCenter}>
            <img src={ imageLogin } className={ `${styles['img-login']} ${ animation['show-opacity'] }` }/>
            
            <Login/>
        </div>
    );
}
