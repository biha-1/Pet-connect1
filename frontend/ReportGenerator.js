import React from "react";
import { saveAs } from "file-saver"; // For saving files
import { jsPDF } from "jspdf"; // For generating PDFs
import html2canvas from "html2canvas"; // For converting HTML to images
import { Parser } from "json2csv"; // For generating CSV files

const ReportGenerator = ({ user, pets }) => {
  // Function to generate and download a CSV report
  const generateCSVReport = () => {
    const fields = ["name", "breed", "age"]; // CSV fields
    const parser = new Parser({ fields });
    const csv = parser.parse(pets); // Convert pets data to CSV
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "pet_report.csv"); // Download the CSV file
  };

  // Function to generate and download a PDF report
  const generatePDFReport = () => {
    const input = document.getElementById("report-content"); // Get the HTML content to convert to PDF

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png"); // Convert HTML to image
      const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight); // Add image to PDF
      pdf.save("pet_report.pdf"); // Download the PDF
    });
  };

  return (
    <div>
      {/* Buttons to generate reports */}
      <button onClick={generateCSVReport} className="report-button">
        Download CSV Report
      </button>
      <button onClick={generatePDFReport} className="report-button">
        Download PDF Report
      </button>

      {/* Hidden content for PDF generation */}
      <div id="report-content" style={{ display: "none" }}>
        <h3>User Details</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>

        <h3>Pet Details</h3>
        {pets.map((pet, index) => (
          <div key={index}>
            <p>Name: {pet.name}</p>
            <p>Breed: {pet.breed}</p>
            <p>Age: {pet.age}</p>
            {pet.photo && (
              <img
                src={pet.photo.startsWith("http") ? pet.photo : `http://localhost:5000/${pet.photo}`}
                alt={pet.name}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            )}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportGenerator;