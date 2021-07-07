// the size of each cell on the board
const CELL_SIZE = 15;
// classnames for cells
const CELL_SELECTED = "selected";
const CELL_UNSELECTED = "unselected";
const CELL_TO_SELECT = "to_select";
const CELL_TO_UNSELECT = "to_unselect";

const MOUSE_LEFT = 0;
const MOUSE_RIGHT = 2;
let mouse_down = [false, false, false];
// to keep track of running state of game
let timer: NodeJS.Timer;
let running = false;

// the speed of the game
let SPEED = 1000;
let slider = document.getElementById("speed");
if (slider) {
    slider.oninput = function () {
        SPEED = parseInt((<HTMLInputElement>slider)?.value, 10);
        (<HTMLElement>document.getElementById("tickrate")).innerHTML =
            "Tickrate: " + (<HTMLInputElement>slider)?.value + "ms";
    };
}

document.body.onmousedown = function (e: MouseEvent) {
    mouse_down[e.button] = true;
};
document.body.onmouseup = function (e: MouseEvent) {
    mouse_down[e.button] = false;
};
document.getElementById("start")?.addEventListener("click", () => {
    running = true;
    timer = setInterval(run, SPEED);
});
document.getElementById("stop")?.addEventListener("click", () => {
    running = false;
    clearInterval(timer);
});

// prevent right-click menu
window.addEventListener("contextmenu", (e) => e.preventDefault());

window.onload = function (e: any) {
    const board = <HTMLElement>document.getElementById("board");

    let board_width = board.clientWidth;
    let board_height = board.clientHeight;

    let num_rows = board_height / CELL_SIZE;
    let num_cols = board_width / CELL_SIZE;

    // create the board with specified number of rows and columns
    create_board(board, num_rows, num_cols);
};

function create_board(board: HTMLElement, num_rows: number, num_cols: number) {
    // make the table and add it to page
    let table = document.createElement("table");
    table.id = "table";
    board.appendChild(table);

    // add all the cells to the board
    for (let i = 0; i < num_rows; i++) {
        // insert new row
        let row = table.insertRow();
        row.id = "row " + i;

        for (let j = 0; j < num_cols; j++) {
            // insert the cell
            let cell = row.insertCell();
            cell.id = i + " " + j;
            // specify the class as unselected first
            cell.className = CELL_UNSELECTED;
            // if the cell is clicked, change state to selected
            cell.onmouseover = function (e: MouseEvent) {
                if (mouse_down[MOUSE_LEFT]) {
                    cell.className = CELL_SELECTED;
                } else if (mouse_down[MOUSE_RIGHT]) {
                    cell.className = CELL_UNSELECTED;
                }
            };
            cell.onmousedown = function (e: MouseEvent) {
                if (e.button == MOUSE_LEFT) {
                    cell.className = CELL_SELECTED;
                } else if (e.button == MOUSE_RIGHT) {
                    cell.className = CELL_UNSELECTED;
                }
            };
        }
    }
}

// run the game of life
function run() {
    const table = <HTMLTableElement>document.getElementById("table");
    const num_rows = table.rows.length;
    const num_cols = table.rows[0].cells.length;
    for (let i = 0; i < num_rows; i++) {
        for (let j = 0; j < num_cols; j++) {
            let num_neighbours = 0;
            if (i == 0) {
                if (j == 0) {
                    if (table.rows[i].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j].className == CELL_SELECTED) num_neighbours++;
                } else if (j == num_cols - 1) {
                    if (table.rows[i].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j].className == CELL_SELECTED) num_neighbours++;
                } else {
                    if (table.rows[i].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                }
            } else if (i == num_rows - 1) {
                if (j == 0) {
                    if (table.rows[i - 1].cells[j].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i - 1].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                } else if (j == num_cols - 1) {
                    if (table.rows[i - 1].cells[j].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i - 1].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                } else {
                    if (table.rows[i].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i - 1].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i - 1].cells[j].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i - 1].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                }
            } else {
                if (j == 0) {
                    if (table.rows[i - 1].cells[j].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i - 1].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                } else if (j == num_cols - 1) {
                    if (table.rows[i - 1].cells[j].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i - 1].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                } else {
                    if (table.rows[i - 1].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i - 1].cells[j].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i - 1].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j - 1].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j].className == CELL_SELECTED) num_neighbours++;
                    if (table.rows[i + 1].cells[j + 1].className == CELL_SELECTED) num_neighbours++;
                }
            }
            if (num_neighbours == 1 || num_neighbours == 0 || num_neighbours >= 4) {
                table.rows[i].cells[j].setAttribute(CELL_TO_UNSELECT, "true");
            } else if (num_neighbours == 3) {
                table.rows[i].cells[j].setAttribute(CELL_TO_SELECT, "true");
            }
        }
    }
    update_cells(table, num_rows, num_cols);
}

function update_cells(table: HTMLTableElement, num_rows: number, num_cols: number) {
    for (let i = 0; i < num_rows; i++) {
        for (let j = 0; j < num_cols; j++) {
            const cell = table.rows[i].cells[j];
            if (cell.hasAttribute(CELL_TO_SELECT)) {
                cell.removeAttribute(CELL_TO_SELECT);
                cell.className = CELL_SELECTED;
            } else if (cell.hasAttribute(CELL_TO_UNSELECT)) {
                cell.removeAttribute(CELL_TO_UNSELECT);
                cell.className = CELL_UNSELECTED;
            }
        }
    }
}
