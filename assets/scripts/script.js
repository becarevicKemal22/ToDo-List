import { CardModal } from "./CardModal.js";
import { ListSelectModal } from "./ListSelectModal.js";
import { ColorLabelModal } from "./ColorLabelModal.js";
import { List } from "./List.js";

function removeSpecificNode(el, index) {
    let children = el.children;
    if (children.length > 0) {
        el.removeChild(children[index]);
    }
}

const addListButton = document.getElementById("addListButton");
addListButton.addEventListener("click", () => {
    app.addList();
});

class App {
    lists = [];
    listContainer = document.querySelector(".listContainer");

    addList() {
        let newList = new List(this);
        this.lists.push(newList);
        this.listContainer
            .querySelector("#addListButton")
            .insertAdjacentElement(
                "beforebegin",
                this.lists[this.lists.length - 1].HTMLElement
            );
        newList.focusInput();

        globalThis.lists = this.lists;
    }

    removeList(list) {
        const idx = this.lists.indexOf(list);
        removeSpecificNode(this.listContainer, idx);
        this.lists.splice(idx, 1);
        console.log(this.lists);
        globalThis.lists = this.lists;
    }
}

const app = new App();

const cardModal = new CardModal(document.querySelector(".cardModal"));
globalThis.cardModal = cardModal;

const listSelectModal = new ListSelectModal(
    document.querySelector("#listSelectModal")
);
globalThis.listSelectModal = listSelectModal;

const colorLabelModal = new ColorLabelModal(
    document.querySelector("#colorLabelModal")
);
globalThis.colorLabelModal = colorLabelModal;
