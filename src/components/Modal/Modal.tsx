import styles from "./Modal.module.css"
import { Icon } from "../General/Icon/Icon";
import { useContext } from "preact/hooks";
import { ModalContext } from "../../managers/modal";



export function Modal() {
    const modal = useContext(ModalContext)

    if (!modal.isOpen.value)
        return null;

    return <div className={styles.background}>
        <div className={styles.modal}>
            <div className={styles.top}>
                <h3 className={styles.title}>{modal.modal.value?.title}</h3>
                <button className={styles.close} onClick={() => modal.close()}><Icon icon="plus" /></button>
            </div>
            <div className={styles.body}>
                {modal.modal.value?.children}
            </div>
        </div>
    </div>
}