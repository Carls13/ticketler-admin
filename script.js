const gridElement = document.querySelector(".tickets-grid");
const saveButton = document.getElementById("save-seats");

let rows = 2;
let columns = 2;

// Square size in px
const SQUARE_SIZE = 70;

const root = document.documentElement;

// Create rows and columns array
function createSeatsMap() {
    // Calculate seats
    const seats = new Array(rows * columns);

    const chunkedSeats = chunkArray(seats, columns);

    return chunkedSeats;
}

let seats = createSeatsMap();

// Create array with detail of each seat
function createSeatsData(first = false) {
    let data = [];
    seats.forEach((seatRow, i) => {
        seatRow.forEach((seat, j) => {
            // return empty seat
            data.push({
                row: i + 1,
                column: j + 1,
                seat_type: "empty"
            })
        });
    });

    return data;
}

let floorData = {
    seats: createSeatsData()
};

// Gets type of the seat
function getSeatInfo(i, j) {
    const targetSeat = floorData.seats.find((seat) => seat.row === i && seat.column === j);

    return targetSeat?.seat_type;
}

// Modify seat status
function modifySeatStatus(i, j, status) {
    // Map through all the data
    const newData = floorData.seats.map((seat) => {
        if (seat.row === i + 1 && seat.column === j + 1) {
            return {
                ...seat,
                seat_type: status
            };
        }
        return seat;
    });

    // Assign new data
    floorData.seats = newData;
}

// Create array with detail of each seat
function createSeatsData() {
    let data = [];
    seats.forEach((seatRow, i) => {
        seatRow.forEach((seat, j) => {
            // return empty seat
            data.push({
                row: i + 1,
                column: j + 1,
                seat_type: "empty"
            })
        });
    });

    return data;
}

// update array with detail of each seat
function updateSeatsDataOnDimensionsChange() {
    let data = [];
    seats.forEach((seatRow, i) => {
        seatRow.forEach((seat, j) => {
            // return empty seat
            data.push({
                row: i + 1,
                column: j + 1,
                seat_type: getSeatInfo(i + 1, j + 1) || "empty"
            })
        });
    });

    floorData.seats = data;
}

// Convert array into array of arrays
function chunkArray(list, howMany) {
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

// Create delete icon
function createDeleteIcon(i, j) {
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-minus-circle";
    deleteIcon.setAttribute("onclick", `removeSeat(${i}, ${j})`);

    return deleteIcon;
}

// Gives attributes to a div to convert it into a seat
function getSeatItem(i, j, seatContainer) {
    seatContainer.className = "seat";
    seatContainer.textContent = `${mapIntToLetter(i + 1)}-${j + 1}`;
    seatContainer.id = `${i}-${j}`;

    const deleteIcon = createDeleteIcon(i, j);

    modifySeatStatus(i, j, "normal");

    seatContainer.appendChild(deleteIcon);
    return seatContainer;
}

// Convert seat into door
function addDoorSeat(i, j, seatContainer) {
    if (!seatContainer) {
        seatContainer = document.getElementById(`${i}-${j}`);
        seatContainer.innerHTML = "";
    }

    // Change class name
    seatContainer.className = "door";
    seatContainer.id = `${i}-${j}`;

    // Create door icon to identify
    const doorIcon = document.createElement("i");
    doorIcon.className = "fas fa-door-open";

    const deleteIcon = createDeleteIcon(i, j);

    modifySeatStatus(i, j, "door");

    seatContainer.append(doorIcon, deleteIcon);
    return seatContainer;
}

// Convert seat into stairs
function addStairsSeat(i, j, seatContainer) {
    if (!seatContainer) {
        seatContainer = document.getElementById(`${i}-${j}`);
        seatContainer.innerHTML = "";
    }

    // Change class name
    seatContainer.className = "stairs";
    seatContainer.id = `${i}-${j}`;

    // Create door icon to identify
    const stairsIcon = document.createElement("i");
    stairsIcon.className = "fas fa-layer-group";

    const deleteIcon = createDeleteIcon(i, j);

    modifySeatStatus(i, j, "stairs");

    seatContainer.append(stairsIcon, deleteIcon);
    return seatContainer;
}

// Convert seat into driver
function addDriverSeat(i, j, seatContainer) {
    if (!seatContainer) {
        seatContainer = document.getElementById(`${i}-${j}`);
        seatContainer.innerHTML = "";
    }

    // Change class name
    seatContainer.className = "driver";
    seatContainer.id = `${i}-${j}`;

    // Create driver icon to identify
    const driverIcon = document.createElement("i");
    driverIcon.className = "fas fa-user";

    const deleteIcon = createDeleteIcon(i, j);

    modifySeatStatus(i, j, "driver");

    seatContainer.append(driverIcon, deleteIcon);
    return seatContainer;
}

// Convert seat into premium
function addPremiumSeat(i, j, seatContainer) {
    if (!seatContainer) {
        seatContainer = document.getElementById(`${i}-${j}`);
        seatContainer.innerHTML = "";
    }

    // Change class name
    seatContainer.className = "premium";
    seatContainer.id = `${i}-${j}`;

    // Create premium icon to identify
    const premiumIcon = document.createElement("i");
    premiumIcon.className = "fas fa-star";

    const deleteIcon = createDeleteIcon(i, j);

    modifySeatStatus(i, j, "premium");

    seatContainer.append(premiumIcon, deleteIcon);
    return seatContainer;
}

// Convert seat into bathroom
function addBathroomSeat(i, j, seatContainer) {
    if (!seatContainer) {
        seatContainer = document.getElementById(`${i}-${j}`);
        seatContainer.innerHTML = "";
    }

    // Change class name
    seatContainer.className = "bath";
    seatContainer.id = `${i}-${j}`;

    // Create bath icon to identify
    const bathIcon = document.createElement("i");
    bathIcon.className = "fas fa-toilet";

    const deleteIcon = createDeleteIcon(i, j);

    modifySeatStatus(i, j, "bath");

    seatContainer.append(bathIcon, deleteIcon);
    return seatContainer;
}

// Convert seat into hall
function addHallSeat(i, j, seatContainer) {
    if (!seatContainer) {
        seatContainer = document.getElementById(`${i}-${j}`);
        seatContainer.innerHTML = "";
    }

    // Change class name
    seatContainer.className = "hall";
    seatContainer.id = `${i}-${j}`;

    // Create hall icon to identify
    const hallIcon = document.createElement("i");
    hallIcon.className = "fas fa-just-empty";

    const deleteIcon = createDeleteIcon(i, j);

    modifySeatStatus(i, j, "hall");

    seatContainer.append(hallIcon, deleteIcon);
    return seatContainer;
}

// Add seat back
function addSeatBack(i, j) {
    const seatToAdd = document.getElementById(`${i}-${j}`);

    if (seatToAdd) getSeatItem(i, j, seatToAdd);

}

// Removes seat and turns into empty spot
function removeSeat(i, j) {
    const seatToRemove = document.getElementById(`${i}-${j}`);
    if (seatToRemove) {
        seatToRemove.textContent = "";
        seatToRemove.className = "empty";

        seatToRemove.setAttribute("title", `${mapIntToLetter(i + 1)}-${j + 1}`);

        modifySeatStatus(i, j, "empty");

        // Append toolbox 
        seatToRemove.appendChild(getToolBar(i, j));
    }
}

// Draw seat tool bar
function getToolBar(i, j) {
    const toolsContainer = document.createElement("div");
    toolsContainer.className = "toolbar";

    // Append icon to add back
    const addIcon = document.createElement("i");
    addIcon.className = "fas fa-plus";
    addIcon.setAttribute("onclick", `addSeatBack(${i}, ${j})`);
    addIcon.setAttribute("title", "Agregar asiento normal");

    // Append icon to add as a first class icon
    const premiumIcon = document.createElement("i");
    premiumIcon.className = "fa fa-star";
    premiumIcon.setAttribute("onclick", `addPremiumSeat(${i}, ${j})`);
    premiumIcon.setAttribute("title", "Agregar asiento de primera clase");

    // Append icon to add as door
    const doorIcon = document.createElement("i");
    doorIcon.className = "fas fa-door-open";
    doorIcon.setAttribute("onclick", `addDoorSeat(${i}, ${j})`);
    doorIcon.setAttribute("title", "Agregar puerta");

    // Append icon to add as hall
    const hallIcon = document.createElement("i");
    hallIcon.className = "fa fa-walking";
    hallIcon.setAttribute("onclick", `addHallSeat(${i}, ${j})`);
    hallIcon.setAttribute("title", "Agregar pasillo");

    // Append icon to add as stairs
    const stairsIcon = document.createElement("i");
    stairsIcon.className = "fas fa-layer-group";
    stairsIcon.setAttribute("onclick", `addStairsSeat(${i}, ${j})`);
    stairsIcon.setAttribute("title", "Agregar escalera");

    // Append icon to add as bathroom
    const bathroomIcon = document.createElement("i");
    bathroomIcon.className = "fas fa-toilet";
    bathroomIcon.setAttribute("onclick", `addBathroomSeat(${i}, ${j})`);
    bathroomIcon.setAttribute("title", "Agregar baño");

    // Append icon to add as driver
    const driverIcon = document.createElement("i");
    driverIcon.className = "fas fa-user";
    driverIcon.setAttribute("onclick", `addDriverSeat(${i}, ${j})`);
    driverIcon.setAttribute("title", "Agregar conductor");

    //Append icons to toolbar
    toolsContainer.append(addIcon, premiumIcon, doorIcon, hallIcon, stairsIcon, bathroomIcon, driverIcon);

    return toolsContainer;
}

// Draw empty seat
function drawEmptySeat(i, j, seatContainer) {
    // Add empty class
    seatContainer.className = "empty";
    seatContainer.id = `${i}-${j}`;
    seatContainer.setAttribute("title", `${mapIntToLetter(i + 1)}-${j + 1}`);

    // Append toolbox 
    seatContainer.appendChild(getToolBar(i, j));

    seatContainer.addEventListener('click', () => {
        seatContainer.classList.toggle("show-toolbar");
    });
}


// Draw right button
function drawRightButton() {
    const rightButton = document.createElement("div");
    rightButton.className = "button-right";
    rightButton.style.gridColumn = `${columns + 1}`;
    rightButton.style.gridRow = `1 / span ${rows}`;

    const rightArrow = document.createElement("i");
    rightArrow.className = "fas fa-arrow-right";
    rightArrow.setAttribute("onclick", `modifyColumns(1)`);
    rightArrow.title = "Add column to the right";

    const leftArrow = document.createElement("i");
    leftArrow.className = "fas fa-arrow-left";
    leftArrow.hidden = columns === 1;
    leftArrow.setAttribute("onclick", `modifyColumns(-1)`);
    leftArrow.title = "Remove column";

    rightButton.append(rightArrow, leftArrow);
    gridElement.append(rightButton);
}

// Draw down button
function drawDownButton() {
    const downButton = document.createElement("div");
    downButton.className = "button-down";
    downButton.style.gridColumn = `1 / span ${columns}`;
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

// Increase/Dicrease columns
function modifyColumns(amount) {
    columns += amount;

    seats = createSeatsMap();
    updateSeatsDataOnDimensionsChange();
    paintGrid();
}

// Increase/Dicrease rows
function modifyRows(amount) {
    rows += amount;

    seats = createSeatsMap();
    updateSeatsDataOnDimensionsChange();
    paintGrid();
}

// Draw left, right and down buttons
function drawButtons() {
    drawRightButton();
    drawDownButton();
}

// Paint seats grid
function paintGrid() {
    // Reset grid
    gridElement.textContent = "";

    // Style grid depending on columns
    gridElement.style.gridTemplateColumns = `repeat(${columns + 1}, ${SQUARE_SIZE}px)`;
    gridElement.style.width = `${(columns + 1) * SQUARE_SIZE}px`;

    // Draw buttons
    drawButtons();

    seats.forEach((seatRow, i) => {
        seatRow.forEach((seat, j) => {
            const type = getSeatInfo(i + 1, j + 1);
            const seatContainer = document.createElement("div");

            switch (type) {
                case "empty":
                    // draw empty seat
                    drawEmptySeat(i, j, seatContainer);
                    break;
                case "normal":
                    // draw seat
                    getSeatItem(i, j, seatContainer);
                    break;
                case "door":
                    // draw door seat
                    addDoorSeat(i, j, seatContainer);
                    break;
                case "premium":
                    // draw premium seat
                    addPremiumSeat(i, j, seatContainer);
                    break;
                case "hall":
                    // draw hall seat
                    addHallSeat(i, j, seatContainer);
                    break;
                case "bath":
                    // draw bath seat
                    addBathroomSeat(i, j, seatContainer);
                    break;
                case "driver":
                    // draw driver seat
                    addDriverSeat(i, j, seatContainer);
                    break;
                case "stairs":
                    // draw stairs seat
                    addStairsSeat(i, j, seatContainer);
                    break;
                case "bath":
                    // draw bath seat
                    addBathroomSeat(i, j, seatContainer);
                    break;
                default:
                    // draw empty seat
                    drawEmptySeat(i, j, seatContainer);
                    // Append empty child to grid
                    break;
            }
            gridElement.appendChild(seatContainer);

        })
    })
};

// Save seats info
function saveSeats() {
    console.log({
        seats: floorData.seats,
    });

    // Save somewhere...
}

paintGrid();

// Add event listener to button
saveButton.addEventListener("click", saveSeats);