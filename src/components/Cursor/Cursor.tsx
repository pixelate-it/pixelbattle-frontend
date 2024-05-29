import { useEffect, useState, useContext } from 'preact/hooks';
import styles from './Cursor.module.css';
import { CursorContext } from "../../managers/cursor";

export function Cursor() {
    const cursor = useContext(CursorContext);
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const updateCursor = function(e: MouseEvent) {
        setPosition({ x: e.clientX, y: e.clientY });
    }

    useEffect(() => {
        document.addEventListener('mouseover', (e) => {
            updateCursor(e);
            setVisible(true);
        });
        document.addEventListener('mouseout', () => setVisible(false));
        document.addEventListener('mousemove', updateCursor);
    }, []);

    return <div
        className={styles.cursor}
        style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            backgroundColor: cursor.color.value.toHex(),
            opacity: visible ? 1 : 0
        }}
    />;
}