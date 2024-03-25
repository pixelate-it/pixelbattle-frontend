import { useContext, useEffect } from "preact/hooks";
import { ImageSelect } from "../../Overlay/ImageSelect/ImageSelect";
import { WindowBox } from "../../WindowBox/WindowBox";
import { OverlayContext } from "../../../managers/overlay";
import { OverlayTransform } from "../../Overlay/OverlayTransform/OverlayTransform";

export function Overlay() {
    const overlay = useContext(OverlayContext)

    useEffect(() => {
        overlay.load()
    }, [])

    return <WindowBox title="Срисовать">
        {
            overlay.isSet.value
                ? <OverlayTransform />
                : <ImageSelect />
        }
    </WindowBox>
}