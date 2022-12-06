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
                if(event.target.tagName === 'INPUT'){
                    return;
                }
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

    addExistingCard(card){
        this.cards.push(card);
            this.addCardButton.insertAdjacentElement(
                "beforeBegin",
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

    adjustCardIDs(){
        let counter = 0;
        for(const card of this.cards){
            card.id = counter;
            card.HTMLElement.dataset.id = counter;
            card.parentId = this.id;
            counter++;
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
        app.lists[this.parentId].renderElementsForCurrentTab(); //* Has to be here so that if the user makes a card in the completed tab it doesnt keep it there.
    }

    changeTitleToInput() {
        const parent = this.HTMLElement.closest(".card");
        parent.replaceChild(this.inputEl, this.title);
        this.focusInput();
    }
}

class Modal{
    constructor(HTMLEl){
        this.HTMLElement = HTMLEl;
        this.callerCard = null;
        
        //* Closes the element if the backdrop is clicked
        this.HTMLElement.addEventListener('click', event => {
            if (!event.target.closest('.modalContainer')){
                this.close();
            }
        });

        if(this.HTMLElement.querySelector("#exit")){
            this.HTMLElement.querySelector('#exit').addEventListener('click', () => {
                this.close();
            })
        }
        
        if(this.HTMLElement.querySelector('.buttonCancel')){
            this.HTMLElement.querySelector('.buttonCancel').addEventListener('click', () => {
                this.close();
            });
        }
    }

    show(callerCard){
        this.callerCard = callerCard;
        if(this.onOpen){
            this.onOpen();
        }
        this.HTMLElement.showModal();
    }

    close(){
        if(this.onClose){
            this.onClose();
        }
        this.HTMLElement.close();
    }
}

class CardModal extends Modal{
    constructor(HTMLEl){
        super(HTMLEl);

        this.colorToApply = null;

        this.HTMLElement.querySelector('textarea').addEventListener("keydown", (e) => {
            if (e.keyCode == 13) {
                this.HTMLElement.querySelector('textarea').blur();
            }
        });

        this.HTMLElement.querySelector('.dangerButton').addEventListener('click', () => {
            this.close();
            this.deleteCard();
        });
        
        this.HTMLElement.querySelector('#moveCard').addEventListener('click', () =>{
            this.close();

            listSelectModal.show(this.callerCard);
        });

        this.HTMLElement.querySelector('#colorLabel').addEventListener('click', () => {
            colorLabelModal.show(this.callerCard);
        });
        this.HTMLElement.querySelector('.buttonConfirm').addEventListener('click', () => {
            this.save();
            this.close();
        });
    }

    updateElement(){
        let callerCardElement = this.callerCard.HTMLElement;
        this.setTitle(callerCardElement.querySelector('.cardTitle').textContent);
        this.setDesc(this.callerCard.description);
    }

    onOpen(){
        this.updateElement();
    }

    onClose(){
        this.colorToApply = null;
    }

    setTitle(title){
        this.HTMLElement.querySelector(".titleWithIcon h1").textContent = title;
    }

    setDesc(desc){
        this.HTMLElement.querySelector('textarea').value = desc;
    }

    applyColorLabel(){
        this.callerCard.HTMLElement.style.borderLeftColor = this.colorToApply;
    }

    save(){
        this.callerCard.description = this.HTMLElement.querySelector('textarea').value;
        if(this.colorToApply){
            this.applyColorLabel();
        }
    }

    deleteCard(){
        app.lists[this.callerCard.parentId].removeCard(this.callerCard);
    }
}

class ListSelectModal extends Modal{
    constructor(HTMLEl){
        super(HTMLEl);
        this.listCardContainer = this.HTMLElement.querySelector("#availableLists");
    }

    onOpen(){
        let avalLists = this.getAvailableLists();
        this.addListCards(avalLists);
    }

    onClose(){
        this.removeCards();
    }

    getAvailableLists(){
        let lists = [];
        for(const list of app.lists){
            if(list.id != this.callerCard.parentId){
                lists.push(list);
            }
        }
        return lists;
    }

    addListCards(avalLists){
        avalLists.forEach((lst, idx, avalLists) => {
            this.createCard(lst);
        })
    }

    createCard(list){
        let card = document.createElement('li');
        card.classList.add("card");
        card.classList.add("padding05");
        card.innerHTML = `
            <p>${this.getListName(list)}</p>
        `
        card.addEventListener('click', () => {
            const currentList = app.lists[this.callerCard.parentId];
            const selectedList = app.lists[list.id];
            currentList.removeCard(this.callerCard);
            selectedList.addExistingCard(this.callerCard);
        })
        this.listCardContainer.appendChild(card);
    }
    
    getListName(list){
        return list.HTMLElement.querySelector('#listName').value;
    }

    removeCards(){
        let child = this.listCardContainer.lastElementChild; 
        while (child) {
            this.listCardContainer.removeChild(child);
            child = this.listCardContainer.lastElementChild;
        }
    }
}

class ColorLabelModal extends Modal{
    constructor(HTMLEl){
        super(HTMLEl);

        this.HTMLElement.querySelector("ul").addEventListener("click", event => {
            this.selectedColor = getComputedStyle(event.target.closest('.labelChoice')).backgroundColor;
            this.sendColorToModal();
            this.close();
        });
    }

    sendColorToModal(){
        cardModal.colorToApply = this.selectedColor;
    }
}

const cardModal = new CardModal(document.querySelector('.cardModal'));
const listSelectModal = new ListSelectModal(document.querySelector('#listSelectModal'));
const colorLabelModal = new ColorLabelModal(document.querySelector('#colorLabelModal'));

const app = new App();
