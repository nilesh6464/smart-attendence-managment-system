import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usePunchInMutation, usePunchOutMutation, useGetMyAttendanceQuery, useGetAllAttendanceQuery, useValidateAttendanceMutation, useApproveOvertimeMutation, useRequestOvertimeMutation, useGetTodayAttendanceQuery } from '../app/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [punchIn] = usePunchInMutation();
  const [punchOut] = usePunchOutMutation();
  const [requestOvertime] = useRequestOvertimeMutation();
  const [validateAttendance] = useValidateAttendanceMutation();
  const [approveOvertime] = useApproveOvertimeMutation();
  
  const { data: todayAttendance, refetch: refetchToday } = useGetTodayAttendanceQuery(undefined, {
    skip: !user || user.role !== 'employee'
  });
  const { data: myAttendance, refetch: refetchMy } = useGetMyAttendanceQuery(undefined, {
    skip: !user || user.role !== 'employee'
  });
  const { data: allAttendance, refetch: refetchAll } = useGetAllAttendanceQuery(undefined, {
    skip: !user || user.role === 'employee'
  });

  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [cameraStatus, setCameraStatus] = useState('idle'); // idle, starting, ready, error

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setCameraError('');
      setCameraStatus('starting');
      
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      console.log('🎥 Requesting camera...');
      
      // Simple camera request - no constraints
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      });
      
      console.log('✅ Camera granted');
      setStream(mediaStream);
      
      if (videoRef.current) {
        // Set source
        videoRef.current.srcObject = mediaStream;
        
        // Simple approach - just wait and set ready
        setTimeout(() => {
          console.log('✅ Setting ready');
          setCameraStatus('ready');
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Camera error:', error);
      setCameraStatus('error');
      setCameraError('Camera failed: ' + error.message);
      alert('Camera failed: ' + error.message);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    
    if (!video || !stream) {
      alert('❌ Start camera first');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      
      // Use actual dimensions or fallback
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      
      canvas.width = width;
      canvas.height = height;
      
      console.log('📸 Capturing:', width, 'x', height);
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, width, height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      console.log('✅ Captured, size:', imageData.length);
      
      setCapturedImage(imageData);
      
      // Stop camera
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraStatus('idle');
    } catch (error) {
      console.error('❌ Capture error:', error);
      alert('Capture failed: ' + error.message);
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        (error) => reject(error)
      );
    });
  };

  const handlePunchIn = async () => {
    if (!capturedImage) return alert('Please capture selfie first');
    
    // Check if already punched in today
    if (todayAttendance && !todayAttendance.punchOut?.time) {
      return alert('⚠️ You have already punched in today. Please punch out first.');
    }
    if (todayAttendance && todayAttendance.punchOut?.time) {
      return alert('⚠️ You have already completed attendance for today.');
    }
    
    try {
      const location = await getLocation();
      await punchIn({ selfie: capturedImage, ...location }).unwrap();
      alert('✅ Punched In Successfully');
      setCapturedImage(null);
      refetchToday();
      refetchMy();
    } catch (error) {
      alert(error?.data?.message || 'Punch in failed');
    }
  };

  const handlePunchOut = async () => {
    if (!capturedImage) return alert('Please capture selfie first');
    
    // Check if punched in today
    if (!todayAttendance) {
      return alert('⚠️ Please punch in first before punching out.');
    }
    if (todayAttendance.punchOut?.time) {
      return alert('⚠️ You have already punched out today.');
    }
    
    try {
      const location = await getLocation();
      await punchOut({ selfie: capturedImage, ...location }).unwrap();
      alert('✅ Punched Out Successfully');
      setCapturedImage(null);
      refetchToday();
      refetchMy();
    } catch (error) {
      alert(error?.data?.message || 'Punch out failed');
    }
  };

  const handleRequestOvertime = async (attendanceId) => {
    const hours = prompt('Enter overtime hours:');
    if (hours) {
      try {
        await requestOvertime({ attendanceId, overtimeHours: parseFloat(hours) }).unwrap();
        alert('✅ Overtime requested');
        refetchMy();
      } catch (error) {
        alert(error?.data?.message || 'Request failed');
      }
    }
  };

  const handleValidate = async (id, isValid) => {
    const remarks = prompt('Add remarks (optional):');
    try {
      await validateAttendance({ id, isValid, remarks }).unwrap();
      alert('✅ Attendance validated');
      refetchAll();
    } catch (error) {
      alert('Validation failed');
    }
  };

  const handleApproveOT = async (id, status) => {
    try {
      await approveOvertime({ id, status }).unwrap();
      alert(`✅ Overtime ${status}`);
      refetchAll();
    } catch (error) {
      alert('Action failed');
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        {!user ? (
          <div style={styles.card}>
            <h2>Loading...</h2>
          </div>
        ) : (
          <>
            <h1>👋 Welcome, {user.name}</h1>

        {user?.role === 'employee' && (
          <div style={styles.card}>
            <h2>📸 Mark Attendance</h2>
            
            {/* Today's Status */}
            {todayAttendance && (
              <div style={styles.statusBox}>
                <p><strong>📅 Today's Status:</strong></p>
                <p>✅ Punch In: {new Date(todayAttendance.punchIn.time).toLocaleTimeString()}</p>
                {todayAttendance.punchOut?.time ? (
                  <>
                    <p>✅ Punch Out: {new Date(todayAttendance.punchOut.time).toLocaleTimeString()}</p>
                    <p>🕒 Working Hours: {todayAttendance.workingHours.toFixed(2)}h</p>
                    <p style={{ color: todayAttendance.status === 'completed' ? 'green' : 'orange' }}>
                      Status: {todayAttendance.status === 'completed' ? '✅ Completed' : '⚠️ Incomplete'}
                    </p>
                  </>
                ) : (
                  <p style={{ color: 'blue' }}>⏳ Waiting for punch out...</p>
                )}
              </div>
            )}
            
                        {cameraError && <p style={styles.error}>{cameraError}</p>}
            
            {!stream && !capturedImage && (
              <button onClick={startCamera} style={styles.button}>
                📷 Start Camera
              </button>
            )}
            
                        {stream && (
              <div style={styles.cameraContainer}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  style={styles.video} 
                />
                
                {cameraStatus === 'starting' && (
                  <p style={styles.loading}>⏳ Starting camera... (wait 3 seconds)</p>
                )}
                
                {cameraStatus === 'ready' && (
                  <p style={styles.ready}>✅ Camera ready!</p>
                )}
                
                <button 
                  onClick={capturePhoto} 
                  style={styles.button}
                >
                  📸 Capture Photo
                </button>
                
                {cameraStatus === 'starting' && (
                  <p style={styles.hint}>💡 If you see yourself clearly, you can try capturing now</p>
                )}
              </div>
            )}
            {capturedImage && (
              <>
                <img src={capturedImage} alt="Captured" style={styles.image} />
                <div style={styles.buttonGroup}>
                  <button onClick={handlePunchIn} style={styles.buttonSuccess}>Punch In</button>
                  <button onClick={handlePunchOut} style={styles.buttonWarning}>Punch Out</button>
                  <button onClick={() => setCapturedImage(null)} style={styles.buttonDanger}>Retake</button>
                </div>
              </>
            )}
          </div>
        )}

        <div style={styles.card}>
          <h2>📊 {user?.role === 'employee' ? 'My Attendance' : 'All Attendance'}</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                {user?.role !== 'employee' && <th>Name</th>}
                <th>Date</th>
                <th>Punch In</th>
                <th>Punch Out</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(user?.role === 'employee' ? myAttendance : allAttendance)?.map((record) => (
                <tr key={record._id}>
                  {user?.role !== 'employee' && <td>{record.userId?.name}</td>}
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{new Date(record.punchIn.time).toLocaleTimeString()}</td>
                  <td>{record.punchOut?.time ? new Date(record.punchOut.time).toLocaleTimeString() : '-'}</td>
                  <td>{record.workingHours.toFixed(2)}h</td>
                  <td>{record.status}</td>
                  <td>
                    {user?.role === 'employee' && record.workingHours < 8 && record.punchOut?.time && (
                      <button onClick={() => handleRequestOvertime(record._id)} style={styles.buttonSmall}>Request OT</button>
                    )}
                    {(user?.role === 'manager' || user?.role === 'admin') && (
                      <>
                        <button onClick={() => handleValidate(record._id, 'valid')} style={styles.buttonSmall}>✅</button>
                        <button onClick={() => handleValidate(record._id, 'invalid')} style={styles.buttonSmall}>❌</button>
                        {record.overtimeRequested && record.overtimeStatus === 'pending' && (
                          <>
                            <button onClick={() => handleApproveOT(record._id, 'approved')} style={styles.buttonSmall}>Approve OT</button>
                            <button onClick={() => handleApproveOT(record._id, 'rejected')} style={styles.buttonSmall}>Reject OT</button>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </>
        )}
      </div>
    </>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '2rem' },
  statusBox: { background: '#e8f5e9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '2px solid #4caf50' },
  button: { padding: '0.75rem 1.5rem', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', margin: '0.5rem' },
  buttonSuccess: { padding: '0.75rem 1.5rem', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', margin: '0.5rem' },
  buttonWarning: { padding: '0.75rem 1.5rem', background: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', margin: '0.5rem' },
  buttonDanger: { padding: '0.75rem 1.5rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', margin: '0.5rem' },
  buttonSmall: { padding: '0.25rem 0.5rem', margin: '0.25rem', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  buttonGroup: { display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' },
  cameraContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', position: 'relative' },
  video: { 
    width: '100%', 
    maxWidth: '640px', 
    minHeight: '480px',
    height: 'auto', 
    borderRadius: '8px', 
    border: '2px solid #3498db', 
    objectFit: 'cover',
    display: 'block',
    margin: '0 auto'
  },
  image: { width: '100%', maxWidth: '640px', borderRadius: '8px', display: 'block', margin: '0 auto', border: '2px solid #2ecc71' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  error: { color: '#e74c3c', padding: '1rem', background: '#fadbd8', borderRadius: '4px', marginBottom: '1rem' },
  loading: { color: '#f39c12', fontWeight: 'bold', fontSize: '1.1rem', margin: '0.5rem 0' },
  ready: { color: '#2ecc71', fontWeight: 'bold', fontSize: '1.1rem', margin: '0.5rem 0' },
  hint: { color: '#7f8c8d', fontSize: '0.9rem', fontStyle: 'italic', margin: '0.5rem 0' },
  buttonDisabled: { padding: '0.75rem 1.5rem', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'not-allowed', margin: '0.5rem' }
};

export default Dashboard;
