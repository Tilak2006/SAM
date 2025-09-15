// src/dashboard/s_dashboard.jsx

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, arrayUnion, arrayRemove, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import './s_dashboard.css';

const StudentDashboard = () => {
  const { currentUser, studentInfo } = useAuth(); // New: Use studentInfo from AuthContext
  const [theme, setTheme] = useState('light');
  const [selectedDay, setSelectedDay] = useState('MONDAY');
  // Removed `studentInfo` state as it's now in AuthContext
  const [attendanceData, setAttendanceData] = useState({});
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState(true);
  const [manualDate, setManualDate] = useState('');
  const [manualSubject, setManualSubject] = useState('');

  // Subject mapping
  const subjects = {
    'FSJ': { name: 'Full Stack Java Programming', code: 'FSJ', faculty: 'PROF. ARCHANA KALWANI' },
    'ADSA': { name: 'Advanced Data Structure and Analysis', code: 'ADSA', faculty: 'DR. SHANTHI THERESE' },
    'AT': { name: 'Automata Theory', code: 'AT', faculty: 'PROF. ANJALI MALVIYA' },
    'OST': { name: 'Open Source Technologies', code: 'OST', faculty: 'MI' },
    'DMSA': { name: 'Database Management System', code: 'DMSA', faculty: 'DR. ARTI DESHPANDE' },
    'ED': { name: 'Entrepreneurship Development', code: 'ED', faculty: 'DR. MUKESH JOSHI' },
    'ES': { name: 'Environment Science', code: 'ES', faculty: 'DR. MUKESH ISKANI' },
    'SQL': { name: 'SQL Programming', code: 'SQL', faculty: 'DR. ARTI DESHPANDE' },
    'AMT': { name: 'Applied Mathematics Tutorial', code: 'AMT', faculty: 'DR. MANSHA KOTWANI' }
  };

  // Timetable
  const timetable = {
    'MONDAY': [
      { time: '8:30-9:30', subject: 'FSJ', code: 'FSJ', type: 'lecture' },
      { time: '9:30-10:30', subject: 'ADSA', code: 'ADSA', type: 'lab' },
      { time: '10:30-11:30', subject: 'ES', code: 'ES', type: 'lecture' },
      { time: '11:30-12:30', subject: 'AT', code: 'AT', type: 'lecture' },
      { time: '1:30-2:30', subject: 'AMT', code: 'AMT', type: 'tutorial' },
      { time: '2:30-3:30', subject: 'AMT', code: 'AMT', type: 'tutorial' },
      { time: '3:30-4:30', subject: 'AMT', code: 'AMT', type: 'tutorial' }
    ],
    'TUESDAY': [
      { time: '8:30-9:30', subject: 'Remedial Lecture', code: 'Remedial Lecture', type: 'remedial' },
      { time: '9:30-10:30', subject: 'OST', code: 'OST', type: 'lecture' },
      { time: '10:30-11:30', subject: 'FSJ', code: 'FSJ', type: 'lecture' },
      { time: '11:30-12:30', subject: 'DMSA', code: 'DMSA', type: 'lecture' },
      { time: '1:30-2:30', subject: 'ADSA', code: 'ADSA', type: 'lab' },
      { time: '2:30-3:30', subject: 'FSJ', code: 'FSJ', type: 'remedial' },
      { time: '3:30-4:30', subject: 'ADSA', code: 'ADSA', type: 'remedial' }
    ],
    'WEDNESDAY': [
      { time: '8:30-9:30', subject: 'Remedial Lecture', code: 'Remedial Lecture', type: 'remedial' },
      { time: '9:30-10:30', subject: 'AT', code: 'AT', type: 'lecture' },
      { time: '10:30-11:30', subject: 'SQL', code: 'SQL', type: 'lecture' },
      { time: '11:30-12:30', subject: 'ES', code: 'ES', type: 'lecture' },
      { time: '1:30-2:30', subject: 'ED', code: 'ED', type: 'lecture' },
      { time: '2:30-3:30', subject: 'ADSA', code: 'ADSA', type: 'lab' },
      { time: '3:30-4:30', subject: 'ES', code: 'ES', type: 'lecture' },
      { time: '4:30-5:30', subject: 'AMT', code: 'AMT', type: 'tutorial' }
    ],
    'THURSDAY': [
      { time: '8:30-9:30', subject: 'DMSA', code: 'DMSA', type: 'lecture' },
      { time: '9:30-10:30', subject: 'AT', code: 'AT', type: 'lecture' },
      { time: '10:30-11:30', subject: 'ADSA', code: 'ADSA', type: 'lab' },
      { time: '11:30-12:30', subject: 'ES', code: 'ES', type: 'lecture' },
      { time: '1:30-2:30', subject: 'SQL', code: 'SQL', type: 'lecture' },
      { time: '2:30-3:30', subject: 'FSJ', code: 'FSJ', type: 'remedial' },
      { time: '3:30-4:30', subject: 'Mentor Meeting', code: 'Mentor Meeting', type: 'combined' }
    ],
    'FRIDAY': [
      { time: '8:30-9:30', subject: 'Remedial Lecture', code: 'Remedial Lecture', type: 'remedial' },
      { time: '9:30-10:30', subject: 'OST', code: 'OST', type: 'lecture' },
      { time: '10:30-11:30', subject: 'ES', code: 'ES', type: 'lecture' },
      { time: '11:30-12:30', subject: 'ED', code: 'ED', type: 'lecture' },
      { time: '1:30-2:30', subject: 'SQL', code: 'SQL', type: 'lecture' },
      { time: '2:30-3:30', subject: 'DMSA', code: 'DMSA', type: 'lecture' },
      { time: '3:30-4:30', subject: 'AMT', code: 'AMT', type: 'tutorial' },
    ]
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (currentUser) fetchStudentData();
  }, [currentUser]);

  const calculateAttendance = (dailyAttendance) => {
    const newAttendance = {};
    Object.keys(subjects).forEach(sub => {
      let present = 0;
      let total = 0;

      dailyAttendance.forEach(record => {
        if (record.subject === sub) {
          total++;
          if (record.status === 'present') {
            present++;
          }
        }
      });
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      newAttendance[sub] = { present, total, percentage };
    });
    return newAttendance;
  };

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      // Removed the getDoc call for studentInfo as it's now in the context
      
      const dailyAttendanceRef = collection(db, "students", currentUser.uid, "dailyAttendance");
      const dailyAttendanceSnap = await getDocs(dailyAttendanceRef);
      const dailyAttendance = dailyAttendanceSnap.docs.map(doc => doc.data());
      setAttendanceData(calculateAttendance(dailyAttendance));
      
      const marksDoc = await getDoc(doc(db, "marks", currentUser.uid));
      if (marksDoc.exists()) setMarksData(marksDoc.data());
      else {
        const initialMarks = {};
        Object.keys(subjects).forEach(sub => initialMarks[sub] = { marks: [] });
        setMarksData(initialMarks);
        await setDoc(doc(db, "marks", currentUser.uid), initialMarks);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const time = now.getHours() * 100 + now.getMinutes();
    const slots = [
      { start: 830, end: 930, slot: '8:30-9:30' },
      { start: 930, end: 1030, slot: '9:30-10:30' },
      { start: 1030, end: 1130, slot: '10:30-11:30' },
      { start: 1130, end: 1230, slot: '11:30-12:30' },
      { start: 1330, end: 1430, slot: '1:30-2:30' },
      { start: 1430, end: 1530, slot: '2:30-3:30' },
      { start: 1530, end: 1630, slot: '3:30-4:30' },
      { start: 1630, end: 1730, slot: '4:30-5:30' }
    ];
    return slots.find(s => time >= s.start && time <= s.end)?.slot;
  };

  const getTodaysDay = () => ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'][new Date().getDay()];
  
  const getAttendanceStatus = (p) => p >= 75 ? 'good' : p >= 65 ? 'warning' : 'danger';

  const markAttendance = async (subjectCode, status) => {
    if (!currentUser) {
      alert("You must be logged in to mark attendance.");
      return;
    }

    try {
      const date = new Date().toISOString().split('T')[0];
      const docId = `${date}_${subjectCode}`;
      const attendanceRef = doc(db, "students", currentUser.uid, "dailyAttendance", docId);
      
      // Update local state first for instant UI feedback
      setAttendanceData(prevData => {
        const newTotal = (prevData[subjectCode]?.total || 0) + 1;
        const newPresent = (prevData[subjectCode]?.present || 0) + (status === 'present' ? 1 : 0);
        const newPercentage = Math.round((newPresent / newTotal) * 100);

        return {
          ...prevData,
          [subjectCode]: {
            total: newTotal,
            present: newPresent,
            percentage: newPercentage
          }
        };
      });

      // Then write to Firestore
      await setDoc(attendanceRef, { date, subject: subjectCode, status });
      console.log(`Attendance for ${subjectCode} marked as ${status}.`);
      
    } catch (err) {
      console.error("Error marking attendance: ", err);
      alert("Failed to mark attendance.");
      // In case of error, you might want to revert the state.
      // For simplicity, we'll just alert and let the next fetch correct it.
    }
  };

  const handleManualAttendance = async (e, action) => {
    e.preventDefault();
    if (!manualDate || !manualSubject) {
      alert("Please select a date and subject.");
      return;
    }

    try {
      const docId = `${manualDate}_${manualSubject}`;
      const attendanceRef = doc(db, "students", currentUser.uid, "dailyAttendance", docId);

      if (action === 'remove') {
        await deleteDoc(attendanceRef);
      } else {
        await setDoc(attendanceRef, { date: manualDate, subject: manualSubject, status: action });
      }
      
      // Re-fetch all data to ensure manual changes are reflected
      await fetchStudentData();
      alert(`Attendance for ${manualSubject} on ${manualDate} has been ${action}d.`);
    } catch (err) {
      console.error("Error updating attendance: ", err);
      alert("Failed to update attendance.");
    }
  };

  const currentSlot = getCurrentTimeSlot();
  const today = getTodaysDay();

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="student-dashboard" data-theme={theme}>
      {/* New: Display student information from the context */}
      <header>
        <h1>Welcome, {studentInfo?.name || 'Student'}!</h1>
      </header>

      {/* The rest of your component remains the same */}

      {/* Current Class */}
      {timetable[today] && (
        <div className="current-class-alert">
          {(() => {
            const slot = timetable[today].find(s => s.time === currentSlot);
            const subjectData = slot && subjects[slot.subject];
            
            return subjectData ? (
              <div>
                <h3>Current Lecture: {subjectData.name} ({subjectData.code})</h3>
                <p>Faculty: {subjectData.faculty}</p>
                <button onClick={() => markAttendance(subjectData.code, 'present')}>Mark Present</button>
              </div>
            ) : <span>No class now</span>;
          })()}
        </div>
      )}

      {/* Timetable */}
      <section className="timetable-section">
        <h2>Weekly Timetable</h2>
        <div className="day-selector">
          {Object.keys(timetable).map(day => (
            <button
              key={day}
              className={`day-btn ${selectedDay===day?'active':''} ${day===getTodaysDay()?'today':''}`}
              onClick={()=>setSelectedDay(day)}
            >
              {day.substring(0,3)}
            </button>
          ))}
        </div>
        <div className="timetable-grid">
          {timetable[selectedDay]?.map((s, i) => {
            const isCurrent = s.time === getCurrentTimeSlot() && selectedDay === getTodaysDay();
            return (
              <div key={i} className={`time-slot ${isCurrent ? 'current' : ''}`}>
                <span className="time">{s.time}</span>
                <div className="class-info">
                  <span className="subject-name">{s.subject || 'No Class'}</span>
                  <div className="class-details">
                    <span className="code">{s.code}</span>
                    <span className="faculty">{s.faculty}</span>
                    <span className={`class-type ${s.type}`}>{s.type}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Manual Attendance Section */}
      <section className="manual-attendance-section">
        <h2>Manual Attendance</h2>
        <form className="manual-attendance-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="date"
            value={manualDate}
            onChange={(e) => setManualDate(e.target.value)}
          />
          <select
            value={manualSubject}
            onChange={(e) => setManualSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {Object.entries(subjects).map(([code, data]) => (
              <option key={code} value={code}>{data.name}</option>
            ))}
          </select>
          <div className="button-group">
            <button onClick={(e) => handleManualAttendance(e, 'present')}>Mark Present</button>
            <button onClick={(e) => handleManualAttendance(e, 'absent')}>Mark Absent</button>
            <button onClick={(e) => handleManualAttendance(e, 'remove')} className="remove-btn">Remove</button>
          </div>
        </form>
      </section>

      {/* Attendance */}
      <section className="attendance-section">
        <h2>Attendance</h2>
        <div className="attendance-grid">
          {Object.entries(attendanceData).map(([sub, data]) => (
            <div key={sub} className="attendance-card">
              <h3>{subjects[sub]?.name}</h3>
              <span>{data.present}/{data.total} ({data.percentage}%)</span>
              <div className="progress-bar">
                <div className={`progress-fill ${getAttendanceStatus(data.percentage)}`} style={{ width: `${data.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Marks */}
      <section className="marks-section">
        <h2>Marks</h2>
        <div className="marks-grid">
          {Object.entries(marksData).map(([sub, data]) => (
            <div key={sub} className="marks-card">
              <h3>{subjects[sub]?.name}</h3>
              {data.marks.map((m, i) => (
                <div key={i}>
                  {m.test}: {m.score}/{m.total}
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${(m.score / m.total) * 100}%` }}></div>
                  </div>
                </div>
              ))}
              <strong>Total: {data.marks.reduce((sum, m) => sum + m.score, 0)}/
                      {data.marks.reduce((sum, m) => sum + m.total, 0)}
              </strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;