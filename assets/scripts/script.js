// * Templates
const listTemplate = document.getElementById('listTemplate');
const cardTemplate = document.getElementById('cardTemplate');

const cardModal = document.querySelector('.cardModal');

const addListButton = document.getElementById('addListButton');
addListButton.addEventListener('click', () => {
    app.addList();
})

let lists = [];

class App{
    lists = [];
    listContainer = document.querySelector('.listContainer');
    
    addList(){
        let newList = new List();
        this.lists.push(newList);
        this.listContainer.querySelector('#addListButton').insertAdjacentElement('beforeBegin', this.lists[this.lists.length - 1].HTMLElement);
        newList.focusInput();
    }
}

class List{
    constructor(){
        this.cards = [];
        this.HTMLElement = document.importNode(listTemplate.content.firstElementChild, true);
        this.cardContainer = this.HTMLElement.querySelector('.cardList');
        this.addCardButton = this.cardContainer.querySelector('#addCard');
        this.addCardButton.addEventListener('click', event => {
            event.stopPropagation();
            this.addCard();
        })
        this.cardContainer.addEventListener('click', event => {
            cardModal.classList.add('visible');
        })
    }
    focusInput(){
        this.HTMLElement.querySelector('input').focus();
    }

    addCard(){
        this.cards.push(new Card());
        console.log(this.cards.length);
        this.cardContainer.insertAdjacentElement('afterBegin', this.cards[this.cards.length - 1].HTMLElement);
    }
    
    removeCard(card){
        for(cd of this.cards){
            if(card === cd){
                console.log("found card: " + card);
            }
        }
        this.cards.splice(index, 1);
    }

}

class Card{
    constructor(){
        this.HTMLElement = document.importNode(cardTemplate.content.firstElementChild, true);
        this.name = '';
    }
}

const app = new App();