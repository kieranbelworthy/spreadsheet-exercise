# spreadsheet-exercise
A simple spreadsheet web application.

Supports:
- Simple operations between 2 cells (+, -, *, /)
- Sum and average formulas between range of cells
- Simple text formatting (bold, italics, underline)

# Future Enhancements
- Support Equations with more than 2 values and operations (ie. =A1+B1/C1)
- Support further formulas:
    - MIN, MAX
    - ROUND
    - SQRT
    - POWER

# Planning Notes

Step 1:
Hmm I’m a little rusty with web development, and setting up a project. Need to do a little bit of research on setting up a project + boilerplate

Step 2:
What will I use to render the grid (collection of cells)??
HTML Table
Event Listener to render the grid on page load
JS Functions to generate Column Headers and Rows
CSS for cell outlines + further style

Step 3:
I’ll create a data object that represents a Cell, and will hold coordinates, values and stored equations
The displayed cell grid will be based on a list of these Cell objects. Will generate this in javascript on page load.
Add functionality to change the Cell list when a cell is clicked and text is entered. This will be the ‘Value’ property

Step 4:
My first instinct is that all changes to the grid would be made at the point where a value is added to a grid, if I was developing it myself I don’t think i’d include a refresh button.
To meet this requirement, rather than live updating the entire grid when a change is made to one cell, we’ll recalculate all cell values when this refresh button is clicked.

Step 5:
We’ll have a nullable equation property attached to each cell. This will be separate from the value property, but will be used to indicate whether the value should be calculated.

Step 6:
There will be rules to detect and support function entry.
These will be identified by use of ‘=’
If the sum is invalid, it will be simply treated as a value entry.

Step 7:
Add UI for Bold, Italics and Underline buttons
Add conditional rules to update the CSS for cell text when a cell is selected and one of the above buttons is pressed