import { Modal } from "./Modal.js";

export class CardModal extends Modal {
    constructor(HTMLEl, listSelectModal, colorLabelModal) {
        super(HTMLEl);

        this.listSelectModal = listSelectModal;
        this.colorLabelModal = colorLabelModal;

        this.colorToApply = null;

        this.HTMLElement.querySelector("textarea").addEventListener(
            "keydown",
            (e) => {
                if (e.keyCode === 13) {
                    this.HTMLElement.querySelector("textarea").blur();
                }
            }
        );

        this.HTMLElement.querySelector(".dangerButton").addEventListener(
            "click",
            () => {
                this.close();
                this.deleteCard();
            }
        );

        this.HTMLElement.querySelector("#moveCard").addEventListener(
            "click",
            () => {
                this.close();
                globalThis.listSelectModal.show(this.callerCard);
            }
        );

        this.HTMLElement.querySelector("#colorLabel").addEventListener(
            "click",
            () => {
                this.close();
                globalThis.colorLabelModal.show(this.callerCard);
            }
        );
        this.HTMLElement.querySelector(".buttonConfirm").addEventListener(
            "click",
            () => {
                this.save();
                this.close();
            }
        );
    }

    updateElement() {
        console.log(this.callerCard.description);
        let callerCardElement = this.callerCard.HTMLElement;
        this.setTitle(
            callerCardElement.querySelector(".cardTitle").textContent
        );
        this.setDesc(this.callerCard.description);
    }

    onOpen() {
        this.updateElement();
    }

    onClose() {
        this.colorToApply = null;
    }

    setTitle(title) {
        this.HTMLElement.querySelector(".titleWithIcon h1").textContent = title;
    }

    setDesc(desc) {
        this.HTMLElement.querySelector("textarea").value = desc;
    }

    applyColorLabel() {
        this.callerCard.HTMLElement.style.borderLeftColor = this.colorToApply;
        this.callerCard.currentColor = this.colorToApply;
    }

    save() {
        this.callerCard.description =
            this.HTMLElement.querySelector("textarea").value;
        if (this.colorToApply) {
            this.applyColorLabel();
        }
        const list = globalThis.lists.filter((l) => {
            return l.id === this.callerCard.parentId;
        })[0];
        list.saveCards();
    }

    deleteCard() {
        const list = globalThis.lists.filter((l) => {
            return l.id === this.callerCard.parentId;
        })[0];
        list.removeCard(this.callerCard);
    }
}
