// ****** SELECT ITEMS **********

const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// edit option
let editElement;
let editFlag = false;
let editID = "";
// ****** EVENT LISTENERS **********
// submit form
form.addEventListener("submit", addItem);

// clear button
clearBtn.addEventListener("click", clearItems);

// load items
window.addEventListener("DOMContentLoaded", setupItems);
// ****** FUNCTIONS **********
function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    // console.log(id);

    if(value && !editFlag)
    {
        // console.log("add item to list");
        createListItem(id,value);
        // display alert
        displayAlert("Item added", "success");
        // show container
        container.classList.add("show-container");
        // add to local storage
        addToLocalStorage(id,value);
        // set back to default
        setBackToDefault();
    }
    else if(value && editFlag)
    {
        // console.log("Editing");
        editElement.innerHTML = value;
        displayAlert("value edited", "success");
        // edit local storage
        editLocalStorage(editID,value);
        setBackToDefault(); 
        
    }
    else
    {
        displayAlert("please enter value", "danger");
        // setTimeout(displayAlert,1000);
        // console.log("empty value");
    }
}

// display alert
function displayAlert(text,action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    },1000)
}

// clear items
function clearItems(){
    const items = document.querySelectorAll(".grocery-item")
    if (items.length > 0){
        items.forEach(function(item){
            list.removeChild(item);
        });

    }
    container.classList.remove("show-container");
    displayAlert("List empty", "warn");
    setBackToDefault();
    localStorage.removeItem("list");
}
// delete item
function deleteItem(e){
    // console.log("Deleted");
    const element = e.currentTarget.parentElement.parentElement;
    id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger")
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}
// edit item
function editItem(e){
    // console.log("Edited");
    const element = e.currentTarget.parentElement.parentElement;
    // id = element.dataset.id;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
    // alert
    displayAlert("edit mode", "warn");
}
// set back to default
function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";

}

// ****** LOCAL STORAGE **********
// // to save item in local storage
// localStorage.setItem("orange", JSON.stringify(["i1", "i2"]));
// // to get item from locan storage
// const org = JSON.parse(localStorage.getItem("orange"));
// console.log(org);

// // remove item from local Storage
// localStorage.removeItem("orange");



// add to local storage
function addToLocalStorage(id,value){
    const grocery = {id, value};
    // console.log(grocery);
    let items = getLocalStorage()
    items.push(grocery);
    // localStorage.setItem('list',JSON.stringify(items));
    setLocalStorage(items);
    
}
// edit in local storage
function editLocalStorage(id,value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if (item.id === id){
            item.value = value;
        }
        return item;
    });
    setLocalStorage(items);
}
// remove from local storage
function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(function(item){
        if (item.id !== id){
            return item;
        }
    })
    setLocalStorage(items);
}
function getLocalStorage(){
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem('list')):[];
}
function setLocalStorage(items){
    localStorage.setItem('list',JSON.stringify(items));
}
// ****** SETUP ITEMS **********
function setupItems(){
    let items = getLocalStorage();
    if (items.length > 0){
        items.forEach(function(item){
            createListItem(item.id,item.value);
        });
        container.classList.add('show-container');
    }
}

function createListItem(id,value){
    const element = document.createElement('article');
    element.classList.add("grocery-item");
    // giving id
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr)
    element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    </div>`;

    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");

    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    

    // append child
    list.appendChild(element);
}