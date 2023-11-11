export class AppDebug {
    static info(message: string) {
        AppDebug.print(`[INFO] ${message}`)
    }

    static error(message: string) {
        AppDebug.print(`[ERROR] ${message}`)
    }
    
    static print(message: string) {
        if (import.meta.env.DEV)
        console.log(message)
    }
}
