import { Modal } from "./Modal.js";

export class ColorLabelModal extends Modal {
    constructor(HTMLEl) {
        super(HTMLEl);

        this.HTMLElement.querySelector("ul").addEventListener(
            "click",
            (event) => {
                if (event.target.closest(".labelChoice")) {
                    this.selectedColor = getComputedStyle(
                        event.target.closest(".labelChoice")
                    ).backgroundColor;
                    this.sendColorToModal();
                    this.close();
                    globalThis.cardModal.showAgain();
                }
            }
        );
    }

    sendColorToModal() {
        globalThis.cardModal.colorToApply = this.selectedColor;
    }
}
