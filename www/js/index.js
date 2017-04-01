/*****************************************************************
File: index.js
Author: Alison Kapcala
Description: GiftR Midterm 

Here is the sequence of logic for the app:
- A Cordova App that lets people store gift ideas.
- There is two main screens and two modal popus.
- All data is saved in localStorage using the key: giftr-kapc0003

- The first screen (list):
    - A List of people that has been added to the app along with their birthday.
    - Each person has an arrow to navigate to the secon page, a list of gift ideas for that person.
    - A button to open a modal popup to add a new person. 
    - Clicking on a person's name from the list, will also open the same modal popup, but it allows the user to edit instead of adding a new one.

- The second screen (gifts):
    - A button to add a new gift idea to the list.
    - The modal popup for adding gifts will ask for: the idea, location where it can be bought, a URL where it can be found online, and a cost. 
    - A delete button for each idea, so it can be removed.

Version: 0.0.1
Updated: March, 31 2017
*****************************************************************/
'use strict';

let people = new Array();
let ideaList = new Array();
let giftListPerson;
let currentPerson;
//localStorage.removeItem("giftr-kapc0003");

document.addEventListener('deviceready', onDeviceReady);


window.addEventListener('push', function (ev){
   
    let contentDiv = ev.currentTarget.document.querySelector(".content")
    let id = contentDiv.id;
    switch (id) {
        case "index": 
            let saveButton = document.getElementById("savebtn");
            saveButton.addEventListener("click", savePerson);
            let cancelButton = document.getElementById("cancelbtn");
            cancelButton.addEventListener("click", cancelModal);
            displayPeopleList();
            break;
            
        case "gifts":  
            let saveGiftButton = document.getElementById("saveGiftButton");
            saveGiftButton.addEventListener("click", saveGift);
            let cancelGiftButton = document.getElementById("cancelGiftButton");
            cancelGiftButton.addEventListener("click", cancelGiftModal);
            determinePerson();
            break;
            
        default:
            displayPeopleList();
    }
});

function onDeviceReady(){
    console.log("Ready");
    let saveButton = document.getElementById("savebtn");
    saveButton.addEventListener("click", savePerson);
    
    let cancelButton = document.getElementById("cancelbtn");
    cancelButton.addEventListener("click", cancelModal);
    displayPeopleList();   
}

function savePerson(){    
    let nameToBeSaved = document.getElementById("nameField").value;
    let dateToBeSaved = document.getElementById("dateField").value;
    
    if(currentPerson == 0){
        
        let timeStamp = new Date().getTime() / 1000;
    
        let person = {id: timeStamp,
                     name:nameToBeSaved,
                     dob:dateToBeSaved,
                     ideas:new Array()
                     };
        people.push(person);
    } else {
        let length = people.length;
        for(let i = 0; i < length; i++){
            if(people[i].id == currentPerson){
                people[i].dob = dateToBeSaved;
                people[i].name = nameToBeSaved;
                break;
            }
        }
    }
    
    currentPerson = 0;
    console.log("People array:");
    console.log(people);

    SaveToLS();
    
    document.getElementById("nameField").value = "";
    document.getElementById("dateField").value = "";

    var endEvent = new CustomEvent('touchend', {bubbles:true, cancelable:true});
    var a = document.querySelector("a#xButton");
    console.dir(a);
    console.dir(endEvent);
    a.dispatchEvent(endEvent);

    displayPeopleList();
    
}

function displayPeopleList(){
    GetFromLS();
    
    let list = document.getElementById("contact-list");
    list.innerHTML = "";
    
    function compare(a, b) {
        if (a.dob.substring(5) < b.dob.substring(5)) return -1;
        if (a.dob.substring(5) > b.dob.substring(5)) return 1;
        return 0;
    }
    people.sort(compare);
    
    let length = people.length;
    
    for(let i = 0; i < length; i++){
        let li = document.createElement("li");
        li.className = "table-view-cell";
        li.setAttribute("dataId", people[i].id);
        
        let spanName = document.createElement("span");
        spanName.className = "name";
        
        let aName = document.createElement("a");
        aName.textContent = people[i].name;
        aName.href = "#personModal"
        aName.setAttribute("data-name", people[i].name);
        aName.setAttribute("data-dob", people[i].dob);
        
        let spanDob = document.createElement("span");
        spanDob.className = "dob";
        spanDob.textContent = moment(people[i].dob).format("MMMM DD");
        
        let aDob = document.createElement("a");
        aDob.className = "navigate-right pull-right";
        aDob.href = "gifts.html"
        
        spanName.appendChild(aName);
        aDob.appendChild(spanDob);
        li.appendChild(spanName);
        li.appendChild(aDob);
        list.appendChild(li);
        
        aName.addEventListener("touchstart",editButton);
        aDob.addEventListener("touchstart", pageSwitch);
    }
    
}

function SaveToLS(){
    localStorage.setItem("giftr-kapc0003", JSON.stringify(people));
}

function GetFromLS(){
    if(!localStorage.getItem("giftr-kapc0003")){
        console.log("No data found");
    }
    else{
        people = JSON.parse(localStorage.getItem("giftr-kapc0003"));
        console.log("Data retrived from LS");
        console.log(people);
    }
}

function cancelModal(){
    var endEvent = new CustomEvent('touchend', {bubbles:true, cancelable:true});
    var a = document.querySelector("a#xButton");
    a.dispatchEvent(endEvent);
}

function editButton(ev){
    console.dir(ev);
    console.log(ev.target.dataset.name);
    currentPerson = ev.target.parentElement.parentElement.attributes.dataId.nodeValue;
    
    document.getElementById("nameField").value = ev.target.dataset.name;
    document.getElementById("dateField").value = ev.target.dataset.dob;
}

function pageSwitch(ev){
    console.log("Switch");
    console.dir(ev);
 
    giftListPerson = ev.target.parentElement.attributes.dataId.nodeValue;
    console.log(giftListPerson);
}

function determinePerson(){
    let length = people.length;
    
    for(let i = 0; i < length; i++){
        if(giftListPerson == people[i].id){
            console.log(i);
            ideaList = people[i].ideas;
            document.getElementById("addName").textContent ="Gifts For " + people[i].name;
            document.getElementById("giftTitle").textContent = people[i].name;
            break;
        }
    }
    displayGiftList();
}

function saveGift(){
    let giftToBeSaved = document.getElementById("giftField").value;
    let storeToBeSaved = document.getElementById("storeField").value;
    let urlToBeSaved = document.getElementById("urlField").value;
    let costToBeSaved = document.getElementById("costField").value;
    
    let timeStamp = new Date().getTime() / 1000;
    
    let giftIdea = {idea:giftToBeSaved,
                at:storeToBeSaved,
                url:urlToBeSaved,
                cost:costToBeSaved,
                id:timeStamp
               };

    ideaList.push(giftIdea);
    
    saveToContact();
    
    document.getElementById("giftField").value = "";
    document.getElementById("storeField").value = "";
    document.getElementById("urlField").value = "";
    document.getElementById("costField").value = "";
    
    var endEvent = new CustomEvent('touchend', {bubbles:true, cancelable:true});
    var a = document.querySelector("a#xGiftButton");
    a.dispatchEvent(endEvent);
    
    displayGiftList();
}

function displayGiftList(){
    
    let giftList = document.getElementById("gift-list");
    giftList.innerHTML = "";

    let length = ideaList.length;
    
    for(let i = 0; i < length; i++){
        let liGift = document.createElement("li");
        liGift.className = "table-view-cell media";
        liGift.setAttribute("dataId", ideaList[i].id);
        
        let spanDelete = document.createElement("span");
        spanDelete.className = "pull-right icon icon-trash midline";
        
        let divIdeaDisplay = document.createElement("div");
        divIdeaDisplay.textContent = ideaList[i].idea;
        divIdeaDisplay.className = "media-body";
        
        spanDelete.addEventListener("touchstart", deleteIdea);
        
        if(ideaList[i].at != ""){
            let pStore = document.createElement("p");
            pStore.textContent = ideaList[i].at;
            divIdeaDisplay.appendChild(pStore);
        }
        
        if(ideaList[i].url != ""){
            let pUrl = document.createElement("p");
            let aUrl = document.createElement("a");
            aUrl.textContent = ideaList[i].url;
            aUrl.href = ideaList[i].url;
            pUrl.appendChild(aUrl);
            divIdeaDisplay.appendChild(pUrl);
        }
        
        if(ideaList[i].cost != ""){
            let pCost = document.createElement("p");
            pCost.textContent = ideaList[i].cost;
            divIdeaDisplay.appendChild(pCost);
        }
        liGift.appendChild(spanDelete);
        liGift.appendChild(divIdeaDisplay);
        giftList.appendChild(liGift);
    }
    
}

function cancelGiftModal(){
    var endEvent = new CustomEvent('touchend', {bubbles:true, cancelable:true});
    var a = document.querySelector("a#xGiftButton");
    a.dispatchEvent(endEvent);
}

function saveToContact(){
    let length = people.length;
    for(let i = 0; i < length; i++){
        if(giftListPerson == people[i].id){
            people[i].ideas = ideaList;
            console.log(people);
            break;
        }
    }
    SaveToLS();
}

function deleteIdea(ev){
    console.dir(ev);
    let ideaToBeDeleted = ev.target.parentElement.attributes.dataId.nodeValue;
    let length = ideaList.length;
    for(let i = 0; i < length; i++){
        if(ideaList[i].id == ideaToBeDeleted){
            ideaList.splice(i,1);
            break;
        }
    }
    saveToContact();
    displayGiftList();
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}