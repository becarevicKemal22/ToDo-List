export class Card {
    constructor(id, parentId, title = "", description = "", color="rgba(0, 0, 0, 0)") {
        this.id = id;
        this.parentId = parentId;
        this.HTMLElement = document.importNode(
            document.getElementById("cardTemplate").content.firstElementChild,
            true
        );

        this.setIDs();
        this.savedTitle = title;
        this.description = description;
        this.currentColor = color;
        this.HTMLElement.style.borderLeftColor = this.currentColor;
        this.inputEl = this.HTMLElement.querySelector(".nameInput");

        this.inputEl.addEventListener("keydown", (e) => {
            if (e.keyCode === 13) {
                this.inputEl.blur();
            }
        });

        this.inputEl.addEventListener("blur", () => {
            this.changeInputToTitle();
        });
    }

    setIDs() {
        this.HTMLElement.dataset.id = this.id;
        this.HTMLElement.querySelector(
            "input"
        ).id = `${this.parentId}completed${this.id}`;
        this.HTMLElement.querySelector(
            "label"
        ).htmlFor = `${this.parentId}completed${this.id}`;
    }

    focusInput() {
        this.inputEl.focus();
    }

    changeInputToTitle(loading = false) {
        const parent = this.HTMLElement.closest(".card");
        const newEl = document.createElement("h1");
        if(loading){
            newEl.textContent = this.savedTitle;
        }else{
            newEl.textContent = this.inputEl.value;
        }
        newEl.classList.add("cardTitle");
        this.title = newEl;
        parent.replaceChild(newEl, this.inputEl);
        const list = globalThis.lists.filter(
            (list) => list.id === this.parentId
        )[0];
        list.renderElementsForCurrentTab(); //* Has to be here so that if the user makes a card in the completed tab it doesn't keep it there.
    }

    changeTitleToInput() {
        const parent = this.HTMLElement.closest(".card");
        parent.replaceChild(this.inputEl, this.title);
        this.focusInput();
    }
}
