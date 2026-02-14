import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    connect() {
        setTimeout(() => {
            this.element.classList.add("fade-out")
            setTimeout(() => this.element.remove(), 500)
        }, 3000)
    }

    remove() {
        this.element.remove()
    }
}
