// * Templates
const listTemplate = document.getElementById("listTemplate");
const cardTemplate = document.getElementById("cardTemplate");

let cardModal = document.querySelector(".cardModal");
let optionsModal = document.querySelector(".optionsModal");

function setModalCloseHandler(modal){
    modal.addEventListener("click", () => {
        modal.close();
    });
}

function setUpOptionsModal(callList){
    let clone = optionsModal.cloneNode(true);
    document.querySelector('main').replaceChild(clone, optionsModal);
    optionsModal = clone; 

    setModalCloseHandler(optionsModal);

    optionsModal.querySelector('.editName').addEventListener("click", () => {
        optionsModal.close();
        callList.focusInput();
    });
    optionsModal.querySelector('.deleteButton').addEventListener("click", () => {
        optionsModal.close();
        app.deleteList(callList);
    });
}

function removeSpecificNode(el, index) {
    var children = el.children;
    if(children.length > 0) {
        el.removeChild(children[index]);
    }
}

setModalCloseHandler(cardModal);
setModalCloseHandler(optionsModal);

const addListButton = document.getElementById("addListButton");
addListButton.addEventListener("click", () => {
    app.addList();
});

class App {
    lists = [];
    listContainer = document.querySelector(".listContainer");

    addList() {
        let newList = new List(this.lists.length);
        this.lists.push(newList);
        this.listContainer
            .querySelector("#addListButton")
            .insertAdjacentElement(
                "beforeBegin",
                this.lists[this.lists.length - 1].HTMLElement
            );
        newList.focusInput();
    }

    deleteList(listToDelete){
        const indeks = this.lists.findIndex(list => {
            if(list == listToDelete){
                return true;
            }
        })
        removeSpecificNode(this.listContainer, indeks);
        this.lists.splice(indeks, 1);        
    }
}

class List {
    constructor(id) {
        this.cards = [];
        this.id = id;
        this.HTMLElement = document.importNode(
            listTemplate.content.firstElementChild,
            true
        );
        this.cardContainer = this.HTMLElement.querySelector(".cardList");
        this.addCardButton = this.cardContainer.querySelector("#addCard");
        this.inputEl = this.HTMLElement.querySelector(".nameInput");
        this.addCardButton.addEventListener("click", (event) => {
            event.stopPropagation();
            this.addCard();
        });
        this.tabElements = this.HTMLElement.querySelectorAll(".tab");
        this.tabElements = Array.from(this.tabElements);
        this.selectedTab = 0;

        this.tabElements[0].parentNode.addEventListener("click", (event) => {
            if (!event.target.classList.contains("tab")) {
                return;
            }
            this.selectTab(event.target);
        });
        this.optionsButton = this.HTMLElement.querySelector(".iconButton");
        this.optionsModal = this.HTMLElement.querySelector(".listOptions");

        //* Adds an event listener to the entire card container.
        //* Skips if the event target was blank space.
        //* If the rename button was clicked it changes the title to an input
        //* And finally, it opens the modal of a card if it was clicked.
        this.cardContainer.addEventListener("click", (event) => {
            if (event.target.tagName.toLowerCase() === "ul") {
                return;
            } else if (
                event.target.tagName.toLowerCase() === "button" ||
                event.target.tagName.toLowerCase() === "i"
            ) {
                const crd = event.target.closest(".card");
                const el = this.cards.find((card) => card.id == crd.dataset.id);
                el.changeTitleToInput();
            } else if (event.target.type === "checkbox") {
                this.renderElementsForCurrentTab();
            } else {
                //cardModal.classList.add("visible");
            }
        });
        //* Unfocuses the input field if enter is pressed.
        this.inputEl.addEventListener("keydown", (e) => {
            if (e.keyCode == 13) {
                this.inputEl.blur();
            }
        });

        this.optionsButton.addEventListener("click", () => {
            setUpOptionsModal(this);
            optionsModal.showModal();
        });
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
        if (this.selectedTab == 0) {
            for(const card of this.cards){
                this.addCardButton.insertAdjacentElement(
                    "beforeBegin",
                    card.HTMLElement
                );
            }
        } else if (this.selectedTab == 1) {
            for(const card of this.cards){
                if(!card.HTMLElement.querySelector('input').checked){
                    this.addCardButton.insertAdjacentElement(
                        "beforeBegin",
                        card.HTMLElement
                    );
                }
            }
        } else {
            for(const card of this.cards){
                if(card.HTMLElement.querySelector('input').checked){
                    this.addCardButton.insertAdjacentElement(
                        "beforeBegin",
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
            "beforeBegin",
            newCard.HTMLElement
        );
        newCard.focusInput();
    }

    removeCard(card) {
        for (cd of this.cards) {
            if (card === cd) {
                console.log("found card: " + card);
            }
        }
        this.cards.splice(index, 1);
    }
}

class Card {
    constructor(id, parentId) {
        this.id = id;
        this.parentId = parentId;
        this.HTMLElement = document.importNode(
            cardTemplate.content.firstElementChild,
            true
        );
        
        this.setIDs();

        this.name = "";
        this.inputEl = this.HTMLElement.querySelector(".nameInput");
        this.titleEl = null;

        //* Unfocuses the element if the enter key is pressed
        this.inputEl.addEventListener("keydown", (e) => {
            if (e.keyCode == 13) {
                this.inputEl.blur();
            }
        });
        //* Converts the input element to a title element after it is unfocused.
        this.inputEl.addEventListener("blur", (e) => {
            this.changeInputToTitle();
        });
    }
    
    setIDs(){
        this.HTMLElement.dataset.id = this.id;
        this.HTMLElement.querySelector("input").id = `${this.parentId}completed${this.id}`
        this.HTMLElement.querySelector("label").htmlFor = `${this.parentId}completed${this.id}` 
    }

    focusInput() {
        this.inputEl.focus();
    }

    changeInputToTitle() {
        const parent = this.HTMLElement.closest(".card");
        const newEl = document.createElement("h1");
        newEl.textContent = this.inputEl.value;
        newEl.classList.add("cardTitle");
        this.titleEl = newEl;
        parent.replaceChild(this.titleEl, this.inputEl);
    }

    changeTitleToInput() {
        const parent = this.HTMLElement.closest(".card");
        parent.replaceChild(this.inputEl, this.titleEl);
        this.focusInput();
    }
}

const app = new App();
