import { Card } from "./Card.js";

export class List {
    constructor(app) {
        this.app = app;
        this.cards = [];
        this.id = Date.now();
        this.HTMLElement = document.importNode(
            document.getElementById("listTemplate").content.firstElementChild,
            true
        );
        this.cardContainer = this.HTMLElement.querySelector(".cardList");
        this.addCardButton = this.cardContainer.querySelector("#addCard");
        this.inputEl = this.HTMLElement.querySelector(".nameInput");
        this.tabElements = this.HTMLElement.querySelectorAll(".tab");
        this.tabElements = Array.from(this.tabElements);
        this.selectedTab = 0;
        this.optionsButton = this.HTMLElement.querySelector(".iconButton");
        this.listModal = document.querySelector(".listModal");
        console.log(this.listModal);

        this.optionsButton.addEventListener("click", () => {
            this.showOptionsModal();
        });

        this.addCardButton.addEventListener("click", (event) => {
            event.stopPropagation();
            this.addCard();
        });

        this.tabElements[0].parentNode.addEventListener("click", (event) => {
            if (!event.target.classList.contains("tab")) {
                return;
            }
            this.selectTab(event.target);
        });

        this.cardContainer.addEventListener("click", (event) => {
            if (event.target.tagName.toLowerCase() === "ul") {

            } else if (
                event.target.tagName.toLowerCase() === "button" ||
                event.target.tagName.toLowerCase() === "i"
            ) {
                const crd = event.target.closest(".card");
                console.log(this.cards);
                console.log(crd.dataset.id);
                const el = this.cards.find((card) => card.id == crd.dataset.id);
                el.changeTitleToInput();
            } else if (event.target.type === "checkbox") {
                this.renderElementsForCurrentTab();
            } else {
                if (event.target.tagName === "INPUT") {
                    return;
                }
                cardModal.show(
                    this.cards[event.target.closest(".card").dataset.id]
                );
            }
        });
        this.inputEl.addEventListener("keydown", (e) => {
            if (e.keyCode === 13) {
                this.inputEl.blur();
            }
        });
    }

    showOptionsModal() {
        this.listModal = document.querySelector(".listModal");
        const parent = this.listModal.parentNode;
        const newEl = this.listModal.cloneNode(true);
        parent.replaceChild(newEl, this.listModal);
        this.listModal = newEl;

        this.listModal.addEventListener("click", (event) => {
            if (!event.target.closest(".modalContainer")) {
                this.listModal.close();
            }
        });

        this.listModal.querySelector("button").addEventListener("click", () => {
            this.listModal.close();
        });

        let buttons = this.listModal.querySelectorAll("button.card");

        buttons[0].addEventListener("click", () => {
            this.listModal.close();
            this.focusInput();
        });

        buttons[1].addEventListener("click", () => {
            this.listModal.close();
            this.app.removeList(this);
        });

        this.listModal.showModal();
    }

    selectTab(tab) {
        this.tabElements[this.selectedTab].classList.remove("selected");
        const idx = this.tabElements.indexOf(tab);
        this.selectedTab = idx;
        this.tabElements[idx].classList.add("selected");

        this.renderElementsForCurrentTab();
    }

    renderElementsForCurrentTab() {
        let child = this.cardContainer.lastElementChild.previousElementSibling;
        while (child) {
            this.cardContainer.removeChild(child);
            child = this.cardContainer.lastElementChild.previousElementSibling;
        }
        if (this.selectedTab === 0) {
            for (const card of this.cards) {
                this.addCardButton.insertAdjacentElement(
                    "beforebegin",
                    card.HTMLElement
                );
            }
        } else if (this.selectedTab === 1) {
            for (const card of this.cards) {
                if (!card.HTMLElement.querySelector("input").checked) {
                    this.addCardButton.insertAdjacentElement(
                        "beforebegin",
                        card.HTMLElement
                    );
                }
            }
        } else {
            for (const card of this.cards) {
                if (card.HTMLElement.querySelector("input").checked) {
                    this.addCardButton.insertAdjacentElement(
                        "beforebegin",
                        card.HTMLElement
                    );
                }
            }
        }
    }

    focusInput() {
        this.inputEl.focus();
    }

    addCard() {
        const newCard = new Card(this.cards.length, this.id);
        this.cards.push(newCard);
        this.addCardButton.insertAdjacentElement(
            "beforebegin",
            newCard.HTMLElement
        );
        newCard.focusInput();
    }

    addExistingCard(card) {
        this.cards.push(card);
        this.addCardButton.insertAdjacentElement(
            "beforebegin",
            card.HTMLElement
        );
        this.adjustCardIDs();
        this.renderElementsForCurrentTab();
    }

    removeCard(card) {
        const idx = this.cards.indexOf(card);
        this.cards.splice(idx, 1);
        this.cardContainer.removeChild(card.HTMLElement);
        this.adjustCardIDs();
    }

    adjustCardIDs() {
        let counter = 0;
        for (const card of this.cards) {
            card.id = counter;
            card.HTMLElement.dataset.id = counter;
            card.parentId = this.id;
            counter++;
        }
    }
}
