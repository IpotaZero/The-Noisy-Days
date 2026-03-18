export class Dom {
    static container: HTMLElement

    static init() {
        this.container = document.querySelector("#container") as HTMLElement

        if (!this.container) {
            throw new Error("Container element not found")
        }
    }
}
