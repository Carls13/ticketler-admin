const gridElement = document.querySelector(".tickets-grid");
const saveButton = document.getElementById("save-seats");

// Square size in px
const SQUARE_SIZE = 70;

const root = document.documentElement;

const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const requestedFloors = parseInt(params.get("floors"));

if (requestedFloors !== 2) {
  const button2 = document.getElementById("floor-2");
  const tab = document.querySelector(".tab");

  tab.style.width = "125px";

  button2.style.display = "none";
}

// Current active floor
let activeFloor = 1;

let busData = {
  floor1: {
    rows: 2,
    columns: 2,
    seats: [],
    seatsData: []
  }
};

if (requestedFloors === 2) busData.floor2 = {
  rows: 2,
  columns: 2,
  seats: [],
  seatsData: []
};

// Create rows and columns array
function createSeatsMap(floor) {
  // Calculate seats
  const seats = new Array(busData["floor" + floor].rows * busData["floor" + floor].columns);

  return chunkArray(seats, busData["floor" + floor].columns);
}

busData.floor1.seats = createSeatsMap(1);
if (requestedFloors === 2) busData.floor2.seats = createSeatsMap(2);

// Create array with detail of each seat
function createSeatsData(floor) {
  let data = [];
  busData["floor" + floor].seats.forEach((seatRow, i) => {
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

busData.floor1.seatsData = createSeatsData(1);
if (requestedFloors === 2) busData.floor2.seatsData = createSeatsData(2);

// Gets type of the seat
function getSeatInfo(i, j) {
  const targetSeat = busData["floor" + activeFloor].seatsData.find((seat) => seat.row === i && seat.column === j);

  return targetSeat?.seat_type;
}

// Modify seat status
function modifySeatStatus(i, j, status) {
  // Map through all the data
  // Assign new data
  busData["floor" + activeFloor].seatsData = busData["floor" + activeFloor].seatsData.map((seat) => {
    if (seat.row === i + 1 && seat.column === j + 1) {
      return {
        ...seat,
        seat_type: status
      };
    }
    return seat;
  });
}

// update array with detail of each seat
function updateSeatsDataOnDimensionsChange() {
  const { seats } = busData["floor" + activeFloor];
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

  busData["floor" + activeFloor].seatsData = data;
}

// Change floor
function changeCurrentFloor(newFloor) {
  // Remove active class from old button
  const oldButton = document.getElementById("floor-" + activeFloor);
  oldButton.classList.remove("active");

  // Add active class to new button
  const newButton = document.getElementById("floor-" + newFloor);
  newButton.classList.add("active");

  activeFloor = newFloor;

  paintGrid();
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
  const deleteIcon = document.createElement("img");
  deleteIcon.className = 'remove-field'
  deleteIcon.src = "<%= asset_path 'close.png' %>";
  deleteIcon.style.width = '20px'
  deleteIcon.style.height = '20px'
  deleteIcon.style.cursor = 'pointer'

  deleteIcon.setAttribute("onclick", `removeSeat(${i}, ${j})`);

  return deleteIcon;
}

// Gives attributes to a div to convert it into a seat
function addSeatItem(i, j, seatContainer) {
  if (!seatContainer) {
    seatContainer = document.getElementById(`${i}-${j}`);
    seatContainer.innerHTML = "";
  }

  // Change class name
  seatContainer.className = "seat";
  seatContainer.id = `${i}-${j}`;

  // Create seat icon to identify
  const seatIcon = document.createElement("img");
  seatIcon.src = "<%= asset_path 'exit.png' %>";
  seatIcon.style.width = "25px"
  seatIcon.style.height = "25px"

  const deleteIcon = createDeleteIcon(i, j);

  modifySeatStatus(i, j, "seat");

  seatContainer.append(seatIcon, deleteIcon);
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
  const doorIcon = document.createElement("img");
  doorIcon.src = "<%= asset_path 'exit.png' %>";
  doorIcon.style.width = "25px"
  doorIcon.style.height = "25px"

  const deleteIcon = createDeleteIcon(i, j);

  modifySeatStatus(i, j, "regular_exit");

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
  const stairsIcon = document.createElement("img");
  stairsIcon.src = "<%= asset_path 'upstairs.png' %>";
  stairsIcon.style.width = "25px"
  stairsIcon.style.height = "25px"

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
  const driverIcon = document.createElement("img");
  driverIcon.src = "<%= asset_path 'driver.png' %>";
  driverIcon.style.width = "25px"
  driverIcon.style.height = "25px"

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
  const premiumIcon = document.createElement("img");
  premiumIcon.src = "<%= asset_path 'first-class.png' %>";
  premiumIcon.style.width = "25px"
  premiumIcon.style.height = "25px"

  const deleteIcon = createDeleteIcon(i, j);

  modifySeatStatus(i, j, "first_class_seat");

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
  const bathIcon = document.createElement("img");
  bathIcon.src = "<%= asset_path 'bathroom.png' %>";
  bathIcon.style.width = "25px"
  bathIcon.style.height = "25px"

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
  const hallIcon = document.createElement("img");
  hallIcon.src = "<%= asset_path 'walking-hall.png' %>";
  hallIcon.style.width = "25px"
  hallIcon.style.height = "25px"

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
  const addIcon = document.createElement("img");
  addIcon.src = "<%= asset_path 'seat-icon.png' %>";
  addIcon.style.width = '25px'
  addIcon.style.height = '25px'
  addIcon.setAttribute("onclick", `addSeatItem(${i}, ${j})`);
  addIcon.setAttribute("title", "Agregar asiento normal");

  // Append icon to add as a first class icon
  const premiumIcon = document.createElement("img");
  premiumIcon.src = "<%= asset_path 'first-class.png', class: 'toolbar-icon' %>";
  premiumIcon.style.width = '25px'
  premiumIcon.style.height = '25px'
  premiumIcon.setAttribute("onclick", `addPremiumSeat(${i}, ${j})`);
  premiumIcon.setAttribute("title", "Agregar asiento de primera clase");

  // Append icon to add as door
  const doorIcon = document.createElement("img");
  doorIcon.src = "<%= asset_path 'exit.png', class: 'toolbar-icon' %>";
  doorIcon.style.width = '25px'
  doorIcon.style.height = '25px'
  doorIcon.setAttribute("onclick", `addDoorSeat(${i}, ${j})`);
  doorIcon.setAttribute("title", "Agregar puerta");

  // Append icon to add as hall
  const hallIcon = document.createElement("img");
  hallIcon.src = "<%= asset_path 'walking-hall.png', class: 'toolbar-icon' %>";
  hallIcon.style.width = '25px'
  hallIcon.style.height = '25px'
  hallIcon.setAttribute("onclick", `addHallSeat(${i}, ${j})`);
  hallIcon.setAttribute("title", "Agregar pasillo");

  // Append icon to add as stairs
  const stairsIcon = document.createElement("img");
  stairsIcon.src = "<%= asset_path 'upstairs.png', class: 'toolbar-icon' %>";
  stairsIcon.style.width = '25px'
  stairsIcon.style.height = '25px'
  stairsIcon.setAttribute("onclick", `addStairsSeat(${i}, ${j})`);
  stairsIcon.setAttribute("title", "Agregar escalera");

  // Append icon to add as bathroom
  const bathroomIcon = document.createElement("img");
  bathroomIcon.src = "<%= asset_path 'bathroom.png', class: 'toolbar-icon' %>";
  bathroomIcon.style.width = '25px'
  bathroomIcon.style.height = '25px'
  bathroomIcon.setAttribute("onclick", `addBathroomSeat(${i}, ${j})`);
  bathroomIcon.setAttribute("title", "Agregar baño");

  // Append icon to add as driver
  const driverIcon = document.createElement("img");
  driverIcon.src = "<%= asset_path 'driver.png', class: 'toolbar-icon' %>";
  driverIcon.style.width = '25px'
  driverIcon.style.height = '25px'
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

  document.addEventListener('click', function (event) {
    const isClickInside = seatContainer.contains(event.target);

    if (!isClickInside) {
      seatContainer.classList.remove("show-toolbar");
    }
  });

  seatContainer.addEventListener('click', () => {
    // Hide any other open toolbars
    const emptySeats = document.getElementsByClassName("empty");

    Array.from(emptySeats).forEach((seat) => {
      if (seat.id !== `${i}-${j}`) seat.classList.remove("show-toolbar");
    });

    // Show toolbar
    seatContainer.classList.toggle("show-toolbar");
  });
}

// Draw right buttons
function drawRightButtons() {
  const { columns } = busData["floor" + activeFloor];
  const rightButton = document.createElement("div");
  rightButton.className = "button-right";
  rightButton.style.gridColumn = `${columns + 1}`;
  rightButton.style.gridRow = `1`;

  const rightArrow = document.createElement("i");
  rightArrow.className = "fas fa-plus";
  rightArrow.setAttribute("onclick", `modifyColumns(1)`);
  rightArrow.title = "Agregar 1 columna";

  rightButton.append(rightArrow);

  const leftButton = document.createElement("div");
  leftButton.className = "button-right";
  leftButton.style.gridColumn = `${columns + 1}`;
  leftButton.style.gridRow = `2`;

  const leftArrow = document.createElement("i");
  leftArrow.className = "fas fa-minus";
  leftArrow.hidden = columns === 1;
  leftArrow.setAttribute("onclick", `modifyColumns(-1)`);
  leftArrow.title = "Remover 1 columna";

  leftButton.append(leftArrow);
  gridElement.append(leftButton, rightButton);
}

// Draw down button
function drawDownButtons() {
  const { rows } = busData["floor" + activeFloor];
  const downButton = document.createElement("div");
  downButton.className = "button-down";
  downButton.style.gridColumn = `1`;
  downButton.style.gridRow = `${rows + 1}`;

  const downArrow = document.createElement("i");
  downArrow.className = "fas fa-plus";
  downArrow.setAttribute("onclick", `modifyRows(1)`);
  downArrow.title = "Agregar 1 fila";

  downButton.append(downArrow);

  const upButton = document.createElement("div");
  upButton.className = "button-down";
  upButton.style.gridColumn = `2`;
  upButton.style.gridRow = `${rows + 1}`;

  const upArrow = document.createElement("i");
  upArrow.className = "fas fa-minus";
  upArrow.hidden = rows === 6;
  upArrow.setAttribute("onclick", `modifyRows(-1)`);
  upArrow.title = "Remover 1 fila";

  upButton.append(upArrow);

  gridElement.append(downButton, upButton);
}

// Increase/Dicrease columns
function modifyColumns(amount) {
  if (amount < 0 && busData['floor' + activeFloor].columns === 2) return;
  busData['floor' + activeFloor].columns += amount;

  busData['floor' + activeFloor].seats = createSeatsMap(activeFloor);
  updateSeatsDataOnDimensionsChange();
  paintGrid();
}

// Increase/Dicrease rows
function modifyRows(amount) {
  if (amount < 0 && busData['floor' + activeFloor].rows === 2) return;
  busData['floor' + activeFloor].rows += amount;

  busData['floor' + activeFloor].seats = createSeatsMap(activeFloor);
  updateSeatsDataOnDimensionsChange();
  paintGrid();
}

// Draw left, right and down buttons
function drawButtons() {
  drawRightButtons();
  drawDownButtons();
}

// Paint seats grid
function paintGrid() {
  // Reset grid
  gridElement.textContent = "";

  const { seats, columns } = busData["floor" + activeFloor];

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
        case "regular_seat":
          // draw seat
          getSeatItem(i, j, seatContainer);
          break;
        case "regular_exit":
          // draw door seat
          addDoorSeat(i, j, seatContainer);
          break;
        case "first_class_seat":
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

function handleValidation(emptyItem, floor) {
  const icon = document.querySelector(`#floor-${floor} i`);

  // Show alert icon if there are any empty seats in the floor

  if (emptyItem) {
    icon.style.display = "unset";
    return;
  } else {
    icon.style.display = "none";
  }
}

// Save seats info
function saveSeats() {
  const finalData = Object.keys(busData).reduce((currentData, newFloor, i) => {
    return [
      ...currentData,
      ...busData[newFloor].seatsData.map((seat) => {
        return {
          ...seat,
          floor: i + 1
        };
      })
    ]
  }, []);

  // Check if there are any empty seats
  const emptySpotInFloor1 = finalData.find((element) => element.floor === 1 && element.seat_type === "empty");
  const emptySpotInFloor2 = finalData.find((element) => element.floor === 2 && element.seat_type === "empty");

  handleValidation(emptySpotInFloor1, 1);
  if (requestedFloors === 2) handleValidation(emptySpotInFloor2, 2);
  if (emptySpotInFloor1 || emptySpotInFloor2) return;

  // Save somewhere... (must be enabled later)
  saveButton.disabled = true;

  // MODIFY BACKEND URL HERE
  const BACKEND_URI = "/admin/customers/<%= @customer.id %>/vehicle_models/<%= @vehicle_model.id %>/vehicle_seats";

  $.ajax({
    url: BACKEND_URI,
    type: 'POST',
    dataType: 'json',
    data: { seats: finalData }
  }).done(function () {
    saveButton.disabled = false;
    window.location.replace("<%= admin_customer_vehicle_models_path(customer_id: @customer.id, display_message: true) %>")
  })
}

paintGrid();

// Add event listener to button
saveButton.addEventListener("click", saveSeats);
