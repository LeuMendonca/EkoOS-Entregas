// import Image from "next/image"
import styles from "./Login.module.css"
import logoImg  from "../../img/logo.png"

export default function Login() {
    return (
        <div className={styles.containerCenter}>
            <section className={styles.login}>
                <img src={ logoImg } className={ styles['img-logo'] }/>
                <form action="/dashboard">
                    <input 
                      type="email"
                      required
                      name="email"
                      placeholder="Digite seu email..."
                      className={styles.input}
                    />

                    <input 
                      type="password"
                      required
                      name="password"
                      placeholder="***********"
                      className={styles.input}
                    />

                    <button type="submit">
                      Acessar
                    </button>
                  </form>


              </section>
        </div>
  );
}
