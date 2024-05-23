let grid = [];

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
        for (let j = 0; j < 100; j++) {
            let cell = document.createElement('td');
            let input = document.createElement('input');
            input.type = 'text';
            let cellObject = new Cell(i, j + 1);
            grid[i][j + 1] = cellObject;

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
    // Implement your equation evaluation logic here
    // For example, to support addition:
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

function columnLabelToNumber(label) {
    // Convert column label to number
    // ASCII codes for letters start at 65
    return label.charCodeAt(0) - 64;
}

document.addEventListener('DOMContentLoaded', generateTableRows);