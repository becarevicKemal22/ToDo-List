export class Modal {
    constructor(HTMLEl) {
        this.HTMLElement = HTMLEl;
        this.callerCard = null;

        //* Closes the element if the backdrop is clicked
        this.HTMLElement.addEventListener("click", (event) => {
            if (!event.target.closest(".modalContainer")) {
                this.close();
            }
        });

        if (this.HTMLElement.querySelector("#exit")) {
            this.HTMLElement.querySelector("#exit").addEventListener(
                "click",
                () => {
                    this.close();
                }
            );
        }

        if (this.HTMLElement.querySelector(".buttonCancel")) {
            this.HTMLElement.querySelector(".buttonCancel").addEventListener(
                "click",
                () => {
                    this.close();
                }
            );
        }
    }

    show(callerCard) {
        this.callerCard = callerCard;
        if (this.onOpen) {
            this.onOpen();
        }
        this.HTMLElement.showModal();
    }

    showAgain(){
        if (this.onOpen) {
            this.onOpen();
        }
        this.HTMLElement.showModal();
    }

    close() {
        if (this.onClose) {
            this.onClose();
        }
        this.HTMLElement.close();
    }
}