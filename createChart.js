const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');

const width = 1920; // Width of the chart
const height = 1080; // Height of the chart

// Create a new ChartJSNodeCanvas instance
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

async function createChart(data) {
    try {
        // Extract and format months and total mined values
        const months = data.map(row => row[0]); // Extract the first column (Month)
        const totalMined = data.map(row => Math.floor(row[9])); // Extract and remove decimals from the tenth column (Total Mined)

        // Ensure data is valid
        if (months.length === 0 || totalMined.length === 0) {
            throw new Error('Data is empty or invalid.');
        }

        // Calculate the number of months to display (20 years * 12 months per year)
        const maxMonths = 20 * 12 + 1; // Including day 0

        // Limit months and total mined to the first 20 years
        const limitedMonths = months.slice(0, maxMonths);
        const limitedTotalMined = totalMined.slice(0, maxMonths);

        // Create chart labels and tick labels
        const labels = limitedMonths.map((_, index) => {
            if (index === 0) return 'Day 0'; // First data point
            const year = Math.floor((index - 1) / 12) + 1;
            return index % 12 === 0 ? `Year ${year}` : '';
        });

        // Create a chart configuration
        const configuration = {
            type: 'line',
            data: {
                labels: labels, // Display year labels
                datasets: [{
                    label: 'Total Supply',
                    data: limitedTotalMined,
                    fill: false,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)', // Light blue fill
                    tension: 0.2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const value = context.raw;
                                return `${context.dataset.label}: ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: ''
                        },
                        ticks: {
                            callback: function (value, index, values) {
                                // Display label for year only
                                return labels[index];
                            }
                        }
                    },
                    y: {
                        title: {
                            display: false,
                            text: 'Total Supply'
                        },
                        beginAtZero: false,
                    }
                }
            }
        };

        // Render the chart and save it as an image
        const image = await chartJSNodeCanvas.renderToBuffer(configuration);
        fs.writeFileSync('chart.png', image);
        console.log('Chart created and saved as chart.png.');
    } catch (error) {
        console.error('Failed to create chart:', error);
    }
}

module.exports = createChart;
