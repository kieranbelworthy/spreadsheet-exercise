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

            // If cell selected and it has Equation, make it editable
            input.addEventListener('mousedown', function() {
                if (cellObject.Equation) {
                    this.value = cellObject.Equation;
                }
            });

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
        let parts = range.split(':');
        let coordinates = parts.toString().split(',');
        let startCellId = coordinates[0];
        let endCellId = coordinates[1];
        let startRow = parseInt(startCellId.substring(1));
        let startCol = columnLabelToNumber(startCellId.substring(0, 1));
        let endRow = parseInt(endCellId.substring(1));
        let endCol = columnLabelToNumber(endCellId.substring(0, 1));
        let sum = 0;
        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                let cellValue = grid[i][j].Value;
                if (cellValue) {
                    sum += parseFloat(cellValue);
                }
            }
        }
        return sum;
    } else {
        var result = 0;

        if (equation.includes("+")) {
            result += handleAddition(equation);
        } else if (equation.includes("-")) {
            result += handleSubtraction(equation);
        } else if (equation.includes("*")) {
            result += handleMultiplication(equation);
        } else if (equation.includes("/")) {
            result += handleDivision(equation);
        }

        return result;
    }
}

function handleAddition(equation) {
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

function handleSubtraction(equation) {
    var parts = equation.substring(1).split('-');
    var result = 0;

    if (parts.length > 1) {
        // Get the first value and add to result
        var cellId = parts[0].trim();
        var row = parseInt(cellId.substring(1));
        var col = columnLabelToNumber(cellId.substring(0, 1));
        result = parseFloat(grid[row][col].Value) || 0;

        // Subtract the remaining values
        for (var i = 1; i < parts.length; i++) {
            cellId = parts[i].trim();
            row = parseInt(cellId.substring(1));
            col = columnLabelToNumber(cellId.substring(0, 1));
            var cellValue = parseFloat(grid[row][col].Value) || 0;
            result -= cellValue;
        }
    }

    return result;
}

function handleMultiplication(equation) {
    var parts = equation.substring(1).split('*');
    
    var result = 1;

    for (var part of parts) {
        var cellId = part.trim();
        var row = parseInt(cellId.substring(1));
        var col = columnLabelToNumber(cellId.substring(0, 1));
        var cellValue = parseFloat(grid[row][col].Value) || 0;
        result *= cellValue;
    }

    return result;
}

function handleDivision(equation) {
    var parts = equation.substring(1).split("/");
    var result = 0;

    if (parts.length > 1) {
        // Get the first value and set result
        var cellId = parts[0].trim();
        var row = parseInt(cellId.substring(1));
        var col = columnLabelToNumber(cellId.substring(0, 1));
        result = parseFloat(grid[row][col].Value) || 0;

        // Divide by the remaining values
        for (var i = 1; i < parts.length; i++) {
            cellId = parts[i].trim();
            row = parseInt(cellId.substring(1));
            col = columnLabelToNumber(cellId.substring(0, 1));
            var cellValue = parseFloat(grid[row][col].Value) || 0;
            // Set result to 0 if any value is 0
            if (cellValue === 0) {
                result = 0;
            } else {
                result /= cellValue;
            }
        }
    }

    return result;
}

function columnLabelToNumber(label) {
    // Convert column label to number
    // ASCII codes for letters start at 65
    return label.charCodeAt(0) - 64;
}

function createButtonListeners() {
    const boldButton = document.getElementById('bold-button');
    const italicsButton = document.getElementById('italics-button');
    const underlineButton = document.getElementById('underline-button');
    const refreshButton = document.getElementById('refresh-button');

    // Use mousedown for formatting buttons
    // Because using click deactivates the cell
    boldButton.addEventListener('mousedown', function(event) {
        event.preventDefault();
        toggleBold();
    });

    italicsButton.addEventListener('mousedown', function(event) {
        event.preventDefault();
        toggleItalics();
    });

    underlineButton.addEventListener('mousedown', function(event) {
        event.preventDefault();
        toggleUnderline();
    });

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

function toggleBold() {
    for (let i = 1; i <= 100; i++) {
        for (let j = 0; j < 100; j++) {
            let cellObject = grid[i][j + 1];
            if (cellObject.input === document.activeElement) {
                cellObject.isBold = !cellObject.isBold;
                if (cellObject.isBold) {
                    cellObject.input.style.fontWeight = 'bold';
                } else {
                    cellObject.input.style.fontWeight = 'normal';
                }
            }
        }
    }
}

function toggleItalics() {
    for (let i = 1; i <= 100; i++) {
        for (let j = 0; j < 100; j++) {
            let cellObject = grid[i][j + 1];
            if (cellObject.input === document.activeElement) {
                cellObject.isItalics = !cellObject.isItalics;
                if (cellObject.isItalics) {
                    cellObject.input.style.fontStyle = 'italic';
                } else {
                    cellObject.input.style.fontStyle = 'normal';
                }
            }
        }
    }
}

function toggleUnderline() {
    for (let i = 1; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            let cellObject = grid[i][j + 1];
            if (cellObject.input === document.activeElement) {
                cellObject.isUnderlined = !cellObject.isUnderlined;
                if (cellObject.isUnderlined) {
                    cellObject.input.style.textDecoration = 'underline';
                } else {
                    cellObject.input.style.textDecoration = 'none';
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', setupData);