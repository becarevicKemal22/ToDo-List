// * Templates
const listTemplate = document.getElementById('listTemplate');
const cardTemplate = document.getElementById('cardTemplate');

const addListButton = document.getElementById('addListButton');
addListButton.addEventListener('click', () => {
    app.addList();
})

let lists = [];

class App{
    lists = [];
    listContainer = document.querySelector('.listContainer');
    
    addList(){
        this.lists.push(new List());
        this.listContainer.insertAdjacentElement('afterBegin', this.lists[this.lists.length - 1].HTMLElement);
    }
}

class List{
    constructor(){
        this.cards = [];
        this.HTMLElement = document.importNode(listTemplate.content.firstElementChild, true);
    }
    addCard(card){
        this.cards.push(new Card());
    }
}

class Card{
    constructor(){
        this.name = '';
    }
}

const app = new App();