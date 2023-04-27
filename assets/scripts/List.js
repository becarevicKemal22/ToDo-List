import { Card } from "./Card.js";

export class List {
    constructor(app, id = null, cards = null) {
        this.app = app;
        this.savedCards = cards;
        this.cards = [];

        this.id = id ? id : Date.now();
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

    loadCards(){
        for(const crd of this.savedCards){
            this.loadCard(crd.id, crd.parentId, crd.title, crd.description, crd.currentColor);
        }
    }

    loadCard(id, parentId, title, description, color){
        const newCard = new Card(id, this.id, title, description, color);
        this.cards.push(newCard);
        this.addCardButton.insertAdjacentElement(
            "beforebegin",
            newCard.HTMLElement
        );
        newCard.changeInputToTitle(true);
        newCard.inputEl.addEventListener("blur", () => {
            localStorage.setItem(this.id, JSON.stringify(this.serializeCards()));
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

    serializeCards(){
        let list = [];
        for(const card of this.cards){
            let obj = {
                id: card.id,
                parentId: card.parentId,
                title: card.title.textContent,
                description: card.description,
                currentColor: card.currentColor,
            }
            list.push(obj);
        }
        return list;
    }

    addCard() {
        const newCard = new Card(this.cards.length, this.id);
        this.cards.push(newCard);
        this.addCardButton.insertAdjacentElement(
            "beforebegin",
            newCard.HTMLElement
        );
        newCard.inputEl.addEventListener("blur", () => {
            localStorage.setItem(this.id, JSON.stringify(this.serializeCards()));
        });
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
        localStorage.setItem(this.id, JSON.stringify(this.serializeCards()));
    }

    saveCards(){
        localStorage.setItem(this.id, JSON.stringify(this.serializeCards()));
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
