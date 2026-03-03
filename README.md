# dataToDiagram

**Transform your data into beautiful visuals instantly.**
dataToDiagram is a minimalist, high-performance tool built to turn your CSV and Excel files into professional, interactive diagrams. Whether you need a simple bar chart or a complex sunburst, we've got you covered.

## Getting Started

Follow these simple steps to run dataToDiagram on your local machine:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/dataToDiagram.git
    cd dataToDiagram
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Launch the application**:
    ```bash
    npm run dev
    ```
4.  **Open in your browser**: Navigate to `http://localhost:5173/` (or the port shown in your terminal).

---

## Chart Gallery

Explore the wide range of visual styles supported by dataToDiagram. Each chart is designed to be clean, responsive, and highly customizable.

| Chart Type | Best For... | Preview |
| :--- | :--- | :--- |
| **Bar Chart** | Comparing categories and tracking totals. | ![Bar Chart](docs/images/gallery_bar_1772510865609.png) |
| **Line & Combo** | Visualizing trends and correlations over time. | ![Line Chart](docs/images/gallery_line_1772511372534.png) |
| **Pie & Donut** | Showing proportional relationships and grand totals. | ![Pie Chart](docs/images/gallery_pie_1772511425440.png) |
| **Waterfall** | Understanding cumulative flow and bridge analysis. | ![Waterfall Chart](docs/images/gallery_waterfall_1772511014884.png) |
| **Treemap** | Visualizing large hierarchical datasets compactly. | ![Treemap](docs/images/gallery_treemap_1772511054621.png) |
| **Sunburst** | Exploring multi-layer branch structures. | ![Sunburst](docs/images/gallery_sunburst_1772511089140.png) |
| **Heatmap** | Identifying patterns and peaks in dense data. | ![Heatmap](docs/images/gallery_heatmap_1772511111356.png) |
| **Funnel** | Tracking conversion stages and process drop-offs. | ![Funnel](docs/images/gallery_funnel_1772511300029.png) |

---

## Sample Data

Not sure what data to use? Check out the `samples/` directory for perfectly formatted CSV files to get you started:

-   `sales_by_region.csv` (Bar, Pie, Rose)
-   `monthly_metrics.csv` (Line, Combo, Scatter)
-   `project_cost_waterfall.csv` (Waterfall)
-   `hierarchical_org.csv` (Treemap, Sunburst)
-   `traffic_heatmap.csv` (Heatmap)
-   `conversion_funnel.csv` (Funnel)

---

## License

MIT License. Free to use, modify, and distribute.
