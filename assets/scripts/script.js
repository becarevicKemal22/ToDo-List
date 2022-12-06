// * Templates
const listTemplate = document.getElementById("listTemplate");
const cardTemplate = document.getElementById("cardTemplate");

let listModal = document.querySelector(".listModal");

const addListButton = document.getElementById("addListButton");
addListButton.addEventListener("click", () => {
    app.addList();
});

function removeSpecificNode(el, index) {
    var children = el.children;
    if(children.length > 0) {
        el.removeChild(children[index]);
    }
}

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

    removeList(list){
        const idx = this.lists.indexOf(list);
        removeSpecificNode(this.listContainer, idx);
        this.lists.splice(idx, 1);
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
        this.tabElements = this.HTMLElement.querySelectorAll(".tab");
        this.tabElements = Array.from(this.tabElements);
        this.selectedTab = 0;
        this.optionsButton = this.HTMLElement.querySelector(".iconButton");

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
                cardModal.show(this.cards[event.target.closest('.card').dataset.id]);
            }
        });
        this.inputEl.addEventListener("keydown", (e) => {
            if (e.keyCode == 13) {
                this.inputEl.blur();
            }
        });
    }

    showOptionsModal(){
        const parent = listModal.parentNode;
        const newEl = listModal.cloneNode(true);
        parent.replaceChild(newEl, listModal);
        listModal = newEl;

        listModal.addEventListener('click', event => {
            if (!event.target.closest('.modalContainer')){
                listModal.close();
            }
        });

        listModal.querySelector('button').addEventListener('click', () => {
            listModal.close();
        })

        let buttons = listModal.querySelectorAll('button.card');
        
        buttons[0].addEventListener('click', () => {
            listModal.close();   
            this.focusInput();
        });

        buttons[1].addEventListener('click', () => {
            listModal.close();
            app.removeList(this);
        });

        listModal.showModal();
        
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
        const idx = this.cards.indexOf(card);
        this.cards.splice(idx, 1);
        this.cardContainer.removeChild(card.HTMLElement);
        this.adjustCardIDs();
    }

    adjustCardIDs(){
        let counter = 0;
        for(const card of this.cards){
            card.HTMLElement.dataset.id = counter++;
        }
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

        this.description = "";
        this.inputEl = this.HTMLElement.querySelector(".nameInput");

        this.inputEl.addEventListener("keydown", (e) => {
            if (e.keyCode == 13) {
                this.inputEl.blur();
            }
        });

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
        this.title = newEl;
        parent.replaceChild(newEl, this.inputEl);
    }

    changeTitleToInput() {
        const parent = this.HTMLElement.closest(".card");
        parent.replaceChild(this.inputEl, this.title);
        this.focusInput();
    }
}


class CardModal{
    constructor(){
        this.HTMLElement = document.querySelector('.cardModal');
        this.callerCard = null;

        this.HTMLElement.querySelector('textarea').addEventListener("keydown", (e) => {
            if (e.keyCode == 13) {
                this.HTMLElement.querySelector('textarea').blur();
            }
        });
        
        this.HTMLElement.querySelector('#exit').addEventListener('click', () => {
            this.HTMLElement.close();
        })

        this.HTMLElement.addEventListener('click', event => {
            if (!event.target.closest('.modalContainer')){
                this.HTMLElement.close();
            }
        });

        this.HTMLElement.querySelector('.buttonCancel').addEventListener('click', () => {
            this.HTMLElement.close();
        });
        
        this.HTMLElement.querySelector('.buttonConfirm').addEventListener('click', () => {
            this.save();
            this.HTMLElement.close();
        });

        this.HTMLElement.querySelector('.dangerButton').addEventListener('click', () => {
            this.HTMLElement.close();
            this.deleteCard();
        });

    }

    show(callerCard){
        this.callerCard = callerCard;
        console.log(callerCard);
        let element = callerCard.HTMLElement;
        this.setTitle(element.querySelector('.cardTitle').textContent);
        this.setDesc(callerCard.description);
        this.HTMLElement.showModal();
    }

    setTitle(title){
        this.HTMLElement.querySelector(".titleWithIcon h1").textContent = title;
    }

    setDesc(desc){
        this.HTMLElement.querySelector('textarea').value = desc;
    }

    save(){
        this.callerCard.description = this.HTMLElement.querySelector('textarea').value;
    }

    deleteCard(){
        app.lists[this.callerCard.parentId].removeCard(this.callerCard);
    }
}

const cardModal = new CardModal();

const app = new App();
