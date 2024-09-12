const XLSX = require('xlsx');
const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const createChart = require('./createChart'); // Import the chart creation function

// Step 1: Read the Excel File and Convert to JSON
const workbook = XLSX.readFile('./VecnoEmission.xls'); // Change to your file's path
const sheetName = workbook.SheetNames[0]; // Assumes first sheet
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 'A1:J1200' });

// Step 2: Generate the Chart
createChart(data).then(() => {
    // Step 3: Generate the PDF with Chart
    async function generatePDFWithChart() {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const chartImage = await pdfDoc.embedPng(fs.readFileSync('chart.png')); // Load the chart image

        // Create the first page and add chart image
        let page = pdfDoc.addPage([600, 900]);
        page.drawImage(chartImage, {
            x: 0,
            y: 600, // Place chart at the top of the page
            width: 600, // Utilize full width of the PDF
            height: 300 // Adjust height as needed
        });

        // Define column positions (x coordinates for columns A, C, D, J)
        const columnPositions = [50, 150, 250, 350];
        const fontSize = 10;

        // Add a header line
        page.drawRectangle({
            x: 0,
            y: 550,
            width: 600,
            height: 40,
            color: rgb(0.8, 0.8, 0.8), // Light gray background for header
        });

        // Draw headers (if needed, or just remove this part)
        page.drawText('Months', { x: columnPositions[0], y: 565, size: fontSize, font: font, color: rgb(0, 0, 0) });
        page.drawText('Block rewards', { x: columnPositions[1], y: 565, size: fontSize, font: font, color: rgb(0, 0, 0) });
        page.drawText('Rewards this month', { x: columnPositions[2], y: 565, size: fontSize, font: font, color: rgb(0, 0, 0) });
        page.drawText('Total supply', { x: columnPositions[3], y: 565, size: fontSize, font: font, color: rgb(0, 0, 0) });

        // Adjust starting y position for text below the chart
        let yPosition = 530; // Start below the header

        // Add Excel Data to PDF, aligning columns A, C, D, J
        data.forEach((row, rowIndex) => {
            if (yPosition < 50) {
                // Create a new page if needed
                page = pdfDoc.addPage([600, 900]); // Add new page
                yPosition = 850; // Reset y position for new page
                // No chart image on new pages
            }

            // Skip the B column (index 1) and draw the remaining columns A, C, D, J
            [0, 2, 3, 9].forEach((colIndex, posIndex) => {
                let value = row[colIndex];
                let text = '';

                if (typeof value === 'number') {
                    text = Number.isInteger(value) ? value.toString() : value.toFixed(4); // Adjust decimal places as needed
                } else {
                    text = value ? value.toString() : '';
                }

                page.drawText(text, {
                    x: columnPositions[posIndex],
                    y: yPosition,
                    size: fontSize,
                    font: font,
                    color: rgb(0, 0, 0)
                });
            });

            yPosition -= 15; // Move cursor down for the next row
        });

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync('./vecno_block_reward_emission.pdf', pdfBytes);

        console.log('PDF with block reward decline chart and aligned data created successfully!');
    }

    generatePDFWithChart();
}).catch(error => {
    console.error('Failed to create chart:', error);
});
