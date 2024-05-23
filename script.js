let grid = [];

function setupData() {
    generateTableRows();
    createButtonListeners();
}

function generateColumnLabels() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let columnLabels = [];
    for (let i = 1; i <= 100; i++) {
        let label = '';
        let n = i;
        while (n > 0) {
            let remainder = n % 26;
            if (remainder === 0) {
                remainder = 26;
                n--;
            }
            label = alphabet[remainder - 1] + label;
            n = Math.floor(n / 26);
        }
        columnLabels.push(label);
    }
    return columnLabels;
}

function generateTableRows() {
    const table = document.getElementById('grid');
    const columnLabels = generateColumnLabels();
    for (let i = 1; i <= 100; i++) {
        grid[i] = [];

        // Create the column label row
        if (i === 1) {
            let columnLabelRow = document.createElement('tr');
            let blankCell = document.createElement('th');
            columnLabelRow.appendChild(blankCell);
            for (let j = 0; j < 100; j++) {
                let columnLabelCell = document.createElement('th');
                columnLabelCell.textContent = columnLabels[j];
                columnLabelRow.appendChild(columnLabelCell);
            }
            table.appendChild(columnLabelRow);
        }

        let row = document.createElement('tr');
        // Create the row number cell
        let rowNumberCell = document.createElement('th');
        rowNumberCell.textContent = i;
        row.appendChild(rowNumberCell);

        // Create cells for each column
        // TODO: Nested loop could this be improved?
        for (let j = 0; j < 100; j++) {
            let cell = document.createElement('td');
            let input = document.createElement('input');
            input.type = 'text';
            let cellObject = new Cell(i, j + 1);
            grid[i][j + 1] = cellObject;

            // Store the input element in the Cell object
            cellObject.input = input;

            // Add event listeners for each cell
            // Only calculate equations when cell left, or cell left focus
            input.addEventListener('input', function() {
                var value = this.value;
                if (value.startsWith('=')) {
                    grid[i][j + 1].Equation = value;
                } else {
                    grid[i][j + 1].Equation = null;
                    grid[i][j + 1].Value = value;
                }
            });
            
            input.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var cellObject = grid[i][j + 1];
                    if (cellObject.Equation) {
                        cellObject.Value = evaluateEquation(cellObject.Equation, grid);
                        this.value = cellObject.Value;
                    }
                }
            });
            
            input.addEventListener('blur', function() {
                var cellObject = grid[i][j + 1];
                if (cellObject.Equation) {
                    cellObject.Value = evaluateEquation(cellObject.Equation, grid);
                    this.value = cellObject.Value;
                }
            });

            cell.appendChild(input);
            row.appendChild(cell);
        }

        table.appendChild(row);
    }
}

function evaluateEquation(equation, grid) {
    if (equation.startsWith('=sum(')) {
        let range = equation.substring(5, equation.length - 1);
        console.log("range is " + range);
        let parts = range.split(':');
        console.log("parts is " + parts);
        let coordinates = parts.toString().split(',');
        let startCellId = coordinates[0];
        let endCellId = coordinates[1];
        console.log("cell id worked whippe?? end cell id is  " + endCellId);
        let startRow = parseInt(startCellId.substring(1));
        let startCol = columnLabelToNumber(startCellId.substring(0, 1));
        let endRow = parseInt(endCellId.substring(1));
        let endCol = columnLabelToNumber(endCellId.substring(0, 1));
        let sum = 0;
        console.log("start row is " + startRow + " and end row is " + endRow);
        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                let cellValue = grid[i][j].Value;
                if (cellValue) {
                    sum += parseFloat(cellValue);
                    console.log("changing sum and its value adding is " + cellValue);
                }
            }
        }
        console.log('sum is ' + sum);
        return sum;
    } else {
        var parts = equation.substring(1).split('+');
        var result = 0;
        for (var part of parts) {
            var cellId = part.trim();
            var row = parseInt(cellId.substring(1));
            var col = columnLabelToNumber(cellId.substring(0, 1));
            var cellValue = grid[row][col].Value;
            if (cellValue) {
                result += parseFloat(cellValue);
            }
        }
        return result;
    }
}

function columnLabelToNumber(label) {
    // Convert column label to number
    // ASCII codes for letters start at 65
    return label.charCodeAt(0) - 64;
}

function createButtonListeners() {
    const refreshButton = document.getElementById('refresh-button');

    refreshButton.addEventListener('click', function() {
        refreshCells();
    });
}

function refreshCells() {
    for (let i = 1; i <= 100; i++) {
        for (let j = 0; j < 100; j++) {
            let cellObject = grid[i][j + 1];
            
            if (cellObject.Equation) {
                cellObject.Value = evaluateEquation(cellObject.Equation, grid);
                cellObject.input.value = cellObject.Value;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', setupData);