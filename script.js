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
            input.addEventListener('change', function() {
                cellObject.Value = this.value;
            });
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

document.addEventListener('DOMContentLoaded', generateTableRows);