import { Modal } from "./Modal.js";

export class ListSelectModal extends Modal {
    constructor(HTMLEl) {
        super(HTMLEl);
        this.listCardContainer =
            this.HTMLElement.querySelector("#availableLists");
    }

    onOpen() {
        let avalLists = this.getAvailableLists();
        this.addListCards(avalLists);
    }

    onClose() {
        this.removeCards();
    }

    getAvailableLists() {
        let lists = [];
        for (const list of globalThis.lists) {
            if (list.id !== this.callerCard.parentId) {
                lists.push(list);
            }
        }
        return lists;
    }

    addListCards(avalLists) {
        avalLists.forEach((lst, idx, avalLists) => {
            this.createCard(lst);
        });
    }

    createCard(list) {
        let card = document.createElement("li");
        card.classList.add("card");
        card.classList.add("padding05");
        card.innerHTML = `
            <p>${this.getListName(list)}</p>
        `;
        card.addEventListener("click", () => {
            const currentList = globalThis.lists.filter(
                (list) => list.id === this.callerCard.parentId
            )[0];
            const selectedList = globalThis.lists.filter(
                (listT) => listT.id === list.id
            )[0];
            currentList.removeCard(this.callerCard);
            selectedList.addExistingCard(this.callerCard);
        });
        this.listCardContainer.appendChild(card);
    }

    getListName(list) {
        return list.HTMLElement.querySelector("#listName").value;
    }

    removeCards() {
        let child = this.listCardContainer.lastElementChild;
        while (child) {
            this.listCardContainer.removeChild(child);
            child = this.listCardContainer.lastElementChild;
        }
    }
}
