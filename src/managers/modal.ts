import { ComponentChildren, createContext } from "preact";
import { Signal, computed, signal } from "@preact/signals";

export const ModalManager = {
    modal: signal(null) as Signal<null | { title: string; children: ComponentChildren }>,
    isOpen: computed(() => false),
    open(title: string, children: ComponentChildren) {
        console.log("Test modal")
        ModalManager.modal.value = { title: title, children: children }
    },
    close() {
        ModalManager.modal.value = null;
    },
}

ModalManager.isOpen = computed(() => ModalManager.modal.value !== null)

export const ModalContext = createContext({} as typeof ModalManager)



