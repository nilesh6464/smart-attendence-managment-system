import { useState } from 'react';
import { useGetDailyReportQuery } from '../app/api';
import Navbar from '../components/Navbar';

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: report, isLoading } = useGetDailyReportQuery(selectedDate);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1>📄 Daily Attendance Report</h1>
        
        <div style={styles.card}>
          <label>Select Date: </label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.input}
          />
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div style={styles.card}>
            <h2>Report for {new Date(selectedDate).toLocaleDateString()}</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Punch In</th>
                  <th>Punch Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                  <th>Validation</th>
                  <th>Selfie</th>
                </tr>
              </thead>
              <tbody>
                {report?.map((record) => (
                  <tr key={record._id}>
                    <td>{record.userId?.name}</td>
                    <td>{record.userId?.email}</td>
                    <td>{new Date(record.punchIn.time).toLocaleTimeString()}</td>
                    <td>{record.punchOut?.time ? new Date(record.punchOut.time).toLocaleTimeString() : '-'}</td>
                    <td>{record.workingHours.toFixed(2)}h</td>
                    <td>{record.status}</td>
                    <td>{record.isValid}</td>
                    <td>
                      {record.punchIn.selfie && (
                        <img src={record.punchIn.selfie} alt="Selfie" style={styles.thumbnail} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {report?.length === 0 && <p>No attendance records for this date.</p>}
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '2rem' },
  input: { padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginLeft: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  thumbnail: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }
};

export default Reports;
