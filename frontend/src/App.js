import logo from './logo.svg';
import './App.css';
import React, { useState,useEffect } from "react";
import axios from "axios";

function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
        alert("Please enter a job description");
        return;
    }

    setLoading(true);
    setGeneratedText("");

    try {
        const response = await axios.post("http://localhost:5000/generate", 
            { jobDescription },
            { headers: { "Content-Type": "application/json" } }
        );

        // Check if text exists before using it
        if (response.data && response.data.text) {
            setGeneratedText(response.data.text);
        } else {
            setGeneratedText("Error: No response from API.");
        }
    } catch (error) {
        console.error("Axios Error:", error);
        alert("Failed to generate resume & cover letter.");
    } finally {
        setLoading(false);
    }
};
  

  
  return (
    <div style={{ textAlign: "center", maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Resume & Cover Letter Generator</h1>
      <textarea
        placeholder="Enter job description..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={6}
        style={{ width: "100%", padding: "10px" }}
      />
      <br />
      <button onClick={handleGenerate} disabled={loading} style={{ marginTop: "10px", padding: "10px 20px" }}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {generatedText && (
        <div style={{ marginTop: "20px", textAlign: "left", background: "#f4f4f4", padding: "15px", borderRadius: "5px" }}>
          <h3>Generated Resume & Cover Letter:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{generatedText}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
