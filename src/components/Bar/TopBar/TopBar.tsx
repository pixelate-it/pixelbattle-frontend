import { BottomBar } from "../BottomBar/BottomBar";
import { Sidebar } from "../Sidebar/Sidebar";
import { TitleBar } from "../TitleBar/TitleBar";
import styles from "./TopBar.module.css";

export function TopBar() {
    return (<div className={styles.wrapper}>
        <TitleBar />
        <Sidebar />
        <BottomBar />
    </div>

    )
}