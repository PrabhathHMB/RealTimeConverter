import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";

export default function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/history");
        setHistoryItems(response.data.history || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="home-container">
      <div className="header">
        <h1>📜 Conversion History</h1>
        <p>Review your recent conversions and download results again.</p>
        <Link to="/" className="history-link">
          ← Back to Converter
        </Link>
      </div>

      <div className="main-content history-content">
        {loading ? (
          <p className="message">Loading history...</p>
        ) : error ? (
          <p className="message">Error: {error}</p>
        ) : historyItems.length === 0 ? (
          <p className="message">No conversions recorded yet.</p>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Source</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Type</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {historyItems.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>{item.originalName || item.fileId}</td>
                    <td>{item.fromFormat || "n/a"}</td>
                    <td>{item.toFormat}</td>
                    <td>{item.type}</td>
                    <td>
                      <a
                        className="download-link"
                        href={`http://localhost:5000${item.outputPath}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
