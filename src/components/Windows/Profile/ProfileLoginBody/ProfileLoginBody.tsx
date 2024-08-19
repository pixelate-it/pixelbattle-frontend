import { useComputed, useSignal } from "@preact/signals";
import { Button } from "../../../General/Button/Button";
import { Checkbox } from "../../../General/Checkbox/Checkbox";
import styles from "./ProfileLoginBody.module.css"
import { config } from "../../../../config";

export function ProfileLoginBody() {
    const agreement = useSignal({
        terms: false,
        rules: false
    })

    const isAllowed = useComputed(() => !Object.values(agreement.value).includes(false))


    return <div class={styles.wrapper}>
        <div class={styles.checkboxes}>
            <Checkbox
                name="terms"
                onChange={(val) => {
                    agreement.value = {...agreement.value, terms: val }
                }}>
                Я согласен с <a href={config.media.help[0] + "/legal/privacy"} target="_blank">Политикой конфиденциальности</a> и <a href={config.media.help[0] + "/legal/terms"} target="_blank">Условиями использования</a>
            </Checkbox>
            <Checkbox
                name="rules"
                onChange={(val) => { agreement.value = { ...agreement.value, rules: val } }}>
                Я согласен с <a href={config.media.help[0] + "/rules"} target="_blank">Правилами PixelBattle</a>
            </Checkbox>
        </div>

        <Button href="/login" disabled={!isAllowed.value}>Войти</Button>
    </div>
}
