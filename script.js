let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let addFlag = true;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let allPriorityColors = document.querySelectorAll(".priority-color");

let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let modalPriorityColor = colors[colors.length - 1];

let toolboxColors = document.querySelectorAll(".color");
let ticketArr = [];
for (let i = 0; i < toolboxColors.length; i++) {
  toolboxColors[i].addEventListener("click", (e) => {
    let currentToolboxColor = toolboxColors[i].classList[0];

    let filteredTickets = ticketArr.filter((ticketObj, idx) => {
      return currentToolboxColor === ticketObj.ticketColor;
    });

    // remove previous tickets
    let allTicketCont = document.querySelectorAll(".ticket-cont");
    for (let i = 0; i < allTicketCont.length; i++) {
      allTicketCont[i].remove();
    }

    // display new filtered ticket
    filteredTickets.forEach((ticketObj, idx) => {
      createTicket(
        ticketObj.ticketColor, ticketObj.ticketTask,
        ticketObj.ticketID
      );
    });
    toolboxColors[i].addEventListener("dblclick", (e) => {
      let allTicketCont = document.querySelectorAll(".ticket-cont");
      for (let i = 0; i < allTicketCont.length; i++) {
        allTicketCont[i].remove();
      }
      ticketArr.forEach((ticketObj, idx) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
      })
    });
  });
}

// listener for modal priority coloring
allPriorityColors.forEach((colorElem, idx) => {
  colorElem.addEventListener("click", (e) => {
    allPriorityColors.forEach((priorityColorElem, idx) => {
      priorityColorElem.classList.remove("border");
    });
    colorElem.classList.add("border");

    modalPriorityColor = colorElem.classList[1];
  });
});

addBtn.addEventListener("click", (e) => {
  //    addFlag = true -> display modal
  //    false -> hide modal
  addFlag = !addFlag;
  if (addFlag) {
    modalCont.style.display = "flex";
  } else {
    modalCont.style.display = "none";
  }
});
removeBtn.addEventListener("click", (e) => {
  removeFlag = !removeFlag;
});
modalCont.addEventListener("keydown", (e) => {
  let key = e.key;
  if (key === "Shift") {
    createTicket(modalPriorityColor, textareaCont.value);
    
    addFlag = false;
    setModalToDefault();
  }
});

function createTicket(ticketColor, ticketTask, ticketID) {
  let id = ticketID || shortid();
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock"><i class="fas fa-lock"></i></div>
    `;
  mainCont.appendChild(ticketCont);
  // create object of ticket and add to array
  if (!ticketID) ticketArr.push({ ticketColor, ticketTask, ticketID: id });

  handleRemoval(ticketCont);
  handleTicket(ticketCont);
  handleColor(ticketCont);
}

function handleRemoval(ticket) {
  ticket.addEventListener("click", (e) => {
    if (removeFlag) ticket.remove();
  });
}
function handleTicket(ticket) {
  let ticketLockElem = ticket.querySelector(".ticket-lock");
  let ticketLock = ticketLockElem.children[0];
  let ticketTaskArea = ticket.querySelector(".task-area");
  ticketLock.addEventListener("click", (e) => {
    if (ticketLock.classList.contains(lockClass)) {
      ticketLock.classList.remove(lockClass);
      ticketLock.classList.add(unlockClass);
      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      ticketLock.classList.remove(unlockClass);
      ticketLock.classList.add(lockClass);
      ticketTaskArea.setAttribute("contenteditable", "false");
    }
  });
}
function handleColor(ticket) {
  let ticketColor = ticket.querySelector(".ticket-color");
  ticketColor.addEventListener("click", (e) => {
    let currentTicketColor = ticketColor.classList[1];
    let currentTicketColorIdx = colors.findIndex((color) => {
      return currentTicketColor === color;
    });
    currentTicketColorIdx++;
    let newTicketColorIdx = currentTicketColorIdx % colors.length;
    let newTicketColor = colors[newTicketColorIdx];
    ticketColor.classList.remove(currentTicketColor);
    ticketColor.classList.add(newTicketColor);
  });
}

function setModalToDefault(){
  modalCont.style.display = "none";
  textareaCont.value = "";
  modalPriorityColor = colors[colors.length-1];
  allPriorityColors.forEach((priorityColorElem, idx) => {
    priorityColorElem.classList.remove("border");
  })
  allPriorityColors[allPriorityColors.length - 1].classList.add("border");
}
