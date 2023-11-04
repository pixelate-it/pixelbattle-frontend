import styles from "./NotFound.module.css";

export function NotFound() {
	return (
        <div className={styles.container}>
            <section className={styles.wrapper}>
                <h1 className={styles.title}>Страница не найдена</h1>
                <p className={styles.message}>Возможно вы перешли по неправильному адресу</p>
                <a href="/" className={styles.link}>Вернуться на главную</a>
            </section>
        </div>
	);
}
