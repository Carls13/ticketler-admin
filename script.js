const gridElement = document.querySelector(".tickets-grid");
const saveButton = document.getElementById("save-seats");

let rows = 6;
let leftColumns = 2;
let rightColumns = 2;
let hallColumns = 1;

// Square size in px
const SQUARE_SIZE = 70;

const root = document.documentElement;

// Convert array into array of arrays
function chunkArray (list, howMany) {
    var idx = 0
    var result = []
  
    while (idx < list.length) {
      if (idx % howMany === 0) result.push([])
      result[result.length - 1].push(list[idx++])
    }
  
    return result
};

// Convert number into capital letter (A-Z)
function mapIntToLetter(int) {
    return (int + 9).toString(36).toUpperCase();
}

// Check if spot is blocked (hall or other elements)
function isBlockedSpot(i, j) {
    // Check is spot is part of the Hall
    const isHall = (i > 0 && i < rows - 1) && (j > leftColumns - 1 && j <= leftColumns + hallColumns - 1);

    // Check if spot is next to the doors
    const isNextDoor = (i === 1 || i === rows - 2) && (j > leftColumns - 1);

    // Check is spot is next to the driver
    const isNextDriver = (i === 0) && (j > 0) && (j < leftColumns + hallColumns)

    return isHall || isNextDoor || isNextDriver;
}

// Draw driver spot
function drawDriver() {
    const driverContainer = document.createElement("div");
    driverContainer.className = "driver";
    driverContainer.title = "Driver";

    const driverIcon = document.createElement("i");
    driverIcon.className = "fas fa-user";

    driverContainer.appendChild(driverIcon);
    gridElement.appendChild(driverContainer);

}

// Draw door spot
function drawDoor() {
    const doorContainer = document.createElement("div");
    doorContainer.className = "door";
    doorContainer.title = "Door";

    const doorIcon = document.createElement("i");
    doorIcon.className = "fas fa-door-open";

    doorContainer.appendChild(doorIcon);
    gridElement.appendChild(doorContainer);
}

// Draw blocked spot
function drawBlocked() {
    const blockedContainer = document.createElement("div");
    blockedContainer.className = "door";
    blockedContainer.title = "Hall";

    gridElement.appendChild(blockedContainer);
}

// Gives attributes to a div to convert it into a seat
function getSeatItem(i, j, seatContainer) {
    seatContainer.className = "seat";
    seatContainer.textContent = `${mapIntToLetter(i+1)}-${j+1}`;
    seatContainer.id = `${i}-${j}`;

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-minus-circle";
    deleteIcon.setAttribute("onclick", `removeSeat(${i}, ${j})`);
    
    seatContainer.appendChild(deleteIcon);
    return seatContainer;
}

// Add seat back
function addSeatBack(i, j) {
    const seatToAdd = document.getElementById(`${i}-${j}`);
    if (seatToAdd) {
        getSeatItem(i, j, seatToAdd);
    }
}

// Removes seat and turns into empty spot
function removeSeat(i, j) {
    const seatToRemove = document.getElementById(`${i}-${j}`);
    if (seatToRemove) {
        seatToRemove.textContent = "";
        seatToRemove.className = "empty";

        // Append icon to add back
        const addIcon = document.createElement("i");
        addIcon.className = "fas fa-plus";
        addIcon.setAttribute("onclick", `addSeatBack(${i}, ${j})`);

        seatToRemove.appendChild(addIcon);
    }
}

// Draw seat
function drawSeat(i, j) {
    const seatContainer = document.createElement("div");
    
    gridElement.appendChild(getSeatItem(i, j, seatContainer));
}

// Draw left button
function drawLeftButton() {
    const leftButton = document.createElement("div");
    leftButton.className = "button-left";
    leftButton.style.gridColumn = "1";
    leftButton.style.gridRow = `1 / span ${rows}`;

    const rightArrow = document.createElement("i");
    rightArrow.className = "fas fa-arrow-right";
    rightArrow.hidden = leftColumns === 1;
    rightArrow.setAttribute("onclick", `modifyLeftColumn(-1)`);
    rightArrow.title = "Remove column from the left";
    
    const leftArrow = document.createElement("i");
    leftArrow.className = "fas fa-arrow-left";
    leftArrow.hidden = leftColumns === 3;
    leftArrow.setAttribute("onclick", `modifyLeftColumn(1)`);
    leftArrow.title = "Add column to the left";

    leftButton.append(leftArrow, rightArrow);
    gridElement.append(leftButton);
}

// Draw right button
function drawRightButton() {
    const columns = leftColumns + hallColumns + rightColumns;

    const rightButton = document.createElement("div");
    rightButton.className = "button-right";
    rightButton.style.gridColumn = `${columns + 2}`;
    rightButton.style.gridRow = `1 / span ${rows}`;

    const rightArrow = document.createElement("i");
    rightArrow.className = "fas fa-arrow-right";
    rightArrow.hidden = rightColumns === 3;
    rightArrow.setAttribute("onclick", `modifyRightColumn(1)`);
    rightArrow.title = "Add column to the right";
    
    const leftArrow = document.createElement("i");
    leftArrow.className = "fas fa-arrow-left";
    leftArrow.hidden = rightColumns === 1;
    leftArrow.setAttribute("onclick", `modifyRightColumn(-1)`);
    leftArrow.title = "Remove column from the right";

    rightButton.append(rightArrow, leftArrow);
    gridElement.append(rightButton);
}

// Draw down button
function drawDownButton() {
    const columns = leftColumns + hallColumns + rightColumns;

    const downButton = document.createElement("div");
    downButton.className = "button-down";
    downButton.style.gridColumn = `2 / span ${columns}`;
    downButton.style.gridRow = `${rows + 1}`;

    const downArrow = document.createElement("i");
    downArrow.className = "fas fa-arrow-down";
    downArrow.setAttribute("onclick", `modifyRows(1)`);
    downArrow.title = "Add 1 row";
    
    const upArrow = document.createElement("i");
    upArrow.className = "fas fa-arrow-up";
    upArrow.hidden = rows === 6;
    upArrow.setAttribute("onclick", `modifyRows(-1)`);
    upArrow.title = "Remove 1 row";

    downButton.append(downArrow, upArrow);
    gridElement.append(downButton);
}

// Increase/Dicrease right columns
function modifyRightColumn(amount) {
    rightColumns += amount;

    paintGrid();
}

// Increase/Dicrease left columns
function modifyLeftColumn(amount) {
    leftColumns += amount;

    paintGrid();
}
// Increase/Dicrease rows
function modifyRows(amount) {
    rows += amount;

    paintGrid();
}

// Draw left, right and down buttons
function drawButtons() {
    drawLeftButton();
    drawRightButton();
    drawDownButton();
}

// Paint seats grid
function paintGrid() {
    // Reset grid
    gridElement.textContent = "";

    const columns = leftColumns + hallColumns + rightColumns;

    // Style grid depending on columns
    gridElement.style.gridTemplateColumns = `repeat(${columns + 2}, ${SQUARE_SIZE}px)`;
    gridElement.style.width = `${(columns + 2) * SQUARE_SIZE}px`;

    // Draw buttons
    drawButtons();

    // Calculate seats
    const seats = new Array(rows * columns);

    const chunkedSeats = chunkArray(seats, columns);

    chunkedSeats.forEach((seatRow, i) => {
        seatRow.forEach((seat, j) => {
            // Check if spot is driver
           if (i === 0 && j === 0) {
               drawDriver()
           } else if (j === seatRow.length - 1 && (i === 1 || i === chunkedSeats.length - 2)) {
               drawDoor(); // Draw door
           } else if (isBlockedSpot(i, j)) {
               drawBlocked(); // Draw blocked spot
           } else {
               drawSeat(i, j);
           }
        })
    })
};

// Save seats info
function saveSeats() {
    const seatsEls = document.querySelectorAll(".tickets-grid .seat");
    const seatsNames = Array.from(seatsEls).map((seat) => {
        return seat.textContent
    });

    console.log({
        seatsNames,
        leftColumns,
        hallColumns,
        rightColumns,
        rows
    });

    // Save somewhere...
}

paintGrid();

// Add event listener to button
saveButton.addEventListener("click", saveSeats);