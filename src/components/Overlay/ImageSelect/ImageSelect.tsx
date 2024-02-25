import { useContext, useRef, useState } from "preact/hooks";
import { Button } from "../../General/Button/Button";
import styles from "./ImageSelect.module.css";
import React from "preact/compat";
import { OverlayContext } from "../../../managers/overlay";
import { AppImage } from "../../../classes/AppImage";
import { Point } from "@pixi/math";
import { PlaceContext } from "../../../managers/place";
import { NotificationsContext } from "../../../managers/notifications";



export function ImageSelect() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false)

    const overlay = useContext(OverlayContext)
    const place = useContext(PlaceContext)
    const notifications = useContext(NotificationsContext)


    async function uploadImage(image: File) {
        const decodedImage = new AppImage(await image.arrayBuffer(), 4);
        const isBiggerThatCanvas = place.image.value!.size.x < decodedImage.size.x || place.image.value!.size.y < decodedImage.size.y

        if (isBiggerThatCanvas) {
            notifications.addNotification({
                title: "Слишком большое изображение",
                message: "Размер изображения больше игрового поля",
                type: "error"
            })

            return
        }

        overlay.setImage(decodedImage, image.name, new Point(0, 0))
    }

    function onDrop(event: DragEvent) {
        event.preventDefault()

        unhover(event)
        const files = event.dataTransfer?.files

        if (files && files.length) {
            uploadImage(files[0])
        }
    }

    function onInput(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()

        const files = event.currentTarget.files

        if (files && files.length) {
            uploadImage(files[0])
        }
    }

    function hover(event: DragEvent) {
        event.preventDefault()

        setIsHovered(true)
    }


    function unhover(event: DragEvent) {
        event.preventDefault()

        setIsHovered(false)
    }


    return <div
        class={[styles.wrapper, isHovered ? styles.wrapperActive : ""].join(" ")}
        onDrop={onDrop}
        onDragEnter={hover}
        onDragOver={hover}
        onDragLeave={unhover}
    >
        <p class={styles.label}>Перетащите изображение</p>

        <p class={styles.or}>или</p>

        <input
            type="file"
            accept="image/png"
            onInput={onInput}
            ref={fileInputRef}
            class={styles.input}
        />

        <Button onClick={() => fileInputRef.current?.click()}>Выберите файл</Button>
    </div>
}