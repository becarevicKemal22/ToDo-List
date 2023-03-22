import { Modal } from "./Modal.js";

export class ColorLabelModal extends Modal {
    constructor(HTMLEl, cardModal) {
        super(HTMLEl);

        this.HTMLElement.querySelector("ul").addEventListener(
            "click",
            (event) => {
                this.selectedColor = getComputedStyle(
                    event.target.closest(".labelChoice")
                ).backgroundColor;
                this.sendColorToModal();
                this.close();
                globalThis.cardModal.showAgain();
            }
        );
    }

    sendColorToModal() {
        this.cardModal.colorToApply = this.selectedColor;
    }
}