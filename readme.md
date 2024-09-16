# 📊 Vecno Emission Chart Generator

This project generates a PDF containing a **block reward emissions chart** and **tabulated data** from an Excel file. The chart visualizes the total mined supply over time, with a clean and professional layout.

## Features

- **Block Reward Chart**: Displays the total mined supply progression.
- **Excel Data Conversion**: Reads and formats selected columns from an Excel sheet.
- **Full-Width Chart**: Chart spans the full width of the PDF.
- **Custom PDF Design**: Professional styling for a visually appealing PDF.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v18.20.4 or later)
- **npm** (v7.0.0 or later)

## Getting Started

1. **Clone the repository**:

    ```bash
    git clone https://github.com/Vecno-Foundation/block_reward_emission.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd block_reward_emission
    ```

3. **Install dependencies**:

    ```bash
    npm install
    ```

4. **Place your Excel file** (`VecnoEmission.xls`) in the root directory.

## Usage

1. **Run the project**:

    ```bash
    node index.js
    ```

2. A PDF (`vecno_block_reward_emission.pdf`) will be generated in the root directory with a block reward chart and data from the Excel file.

## Dependencies

- **[xlsx](https://www.npmjs.com/package/xlsx)**: For reading and parsing Excel files.
- **[chartjs-node-canvas](https://www.npmjs.com/package/chartjs-node-canvas)**: For generating a Chart.js chart as an image.
- **[pdf-lib](https://www.npmjs.com/package/pdf-lib)**: For generating and manipulating the PDF document.

## 📂 Project Structure

