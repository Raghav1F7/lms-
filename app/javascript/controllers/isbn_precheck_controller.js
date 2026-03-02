import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["isbn", "title", "author", "message"]

    async check() {
        const isbn = this.isbnTarget.value.trim()
        if (isbn.length < 3) return

        try {
            const response = await fetch(`/books/by_isbn?isbn=${encodeURIComponent(isbn)}`)
            const result = await response.json()

            if (result.status === "exists") {
                this.fillForm(result.data.book)
                this.showMessage("Bibliographic record already exists. A new copy will be appended.")
            } else {
                this.unlockForm()
                this.clearMessage()
            }
        } catch (error) {
            console.error("ISBN check failed", error)
        }
    }

    fillForm(book) {
        this.titleTarget.value = book.title
        this.authorTarget.value = book.author

        this.titleTarget.readOnly = true
        this.authorTarget.readOnly = true

        this.titleTarget.classList.add("bg-gray-100", "cursor-not-allowed")
        this.authorTarget.classList.add("bg-gray-100", "cursor-not-allowed")
    }

    unlockForm() {
        this.titleTarget.readOnly = false
        this.authorTarget.readOnly = false

        this.titleTarget.classList.remove("bg-gray-100", "cursor-not-allowed")
        this.authorTarget.classList.remove("bg-gray-100", "cursor-not-allowed")
    }

    showMessage(text) {
        if (this.hasMessageTarget) {
            this.messageTarget.textContent = text
            this.messageTarget.classList.remove("hidden")
        }
    }

    clearMessage() {
        if (this.hasMessageTarget) {
            this.messageTarget.textContent = ""
            this.messageTarget.classList.add("hidden")
        }
    }
}
