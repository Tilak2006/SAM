import React, { useState, useEffect } from 'react';
import './timetable.css';

const Timetable = () => {
  const [theme, setTheme] = useState('light');

  // Faculty mapping from the image
  const faculty = {
    'AK': 'PROF. ARCHANA KALE',
    'AM': 'PROF. ANUJA MALVIYA', 
    'ABM': 'PROF. ANUKHA M',
    'AD': 'DR. ARTI DESHPANDE',
    'MK': 'DR. MANSHA KOTWANI',
    'CA': 'PROF. CHETAN AGARWAL',
    'ST': 'DR. SHANTHI THERESE',
    'KS': 'DR. KAMISHA SAXENA',
    'NJ': 'DR. NIKHILESH JOSHI',
    'MI': 'PROF. RESHMA MALIK',
    'ISKANI': 'DR. MUKESH ISKANI'
  };

  // Subject mapping from the image
  const subjects = {
    'AMT-I': 'Applied Mathematics Thinking I (234311)',
    'ADSA': 'Advance Data Structure and Analysis (234117)',
    'DMSA': 'Database Management System Application (234113)',
    'AT': 'Automata Theory (234114)',
    'ED': 'Entrepreneurship Development (2992511)',
    'ES': 'Environment Science (2993512)',
    'FSJ': 'Full Stack Java Programming (2343611)',
    'OST': 'Operating System Technologies (OBC301)'
  };

  // Timetable data based on the provided image
  const timetableData = {
    'MONDAY': [
      { time: '8:30 - 9:30', subject: '', code: '', faculty: '', room: '', type: 'break' },
      { time: '9:30 - 10:30', subject: 'FSJ', code: 'FSJ AD', faculty: 'AD', room: '', type: 'lecture' },
      { time: '10:30 - 11:30', subject: 'FSJ', code: 'FSJ S11 AD (1004)', faculty: 'AD', room: '1004', type: 'lab' },
      { time: '11:30 - 12:30', subject: 'ADSA/ES', code: 'ADSA S12 KS (1003) / ES S13 ABM (1003)', faculty: 'KS/ABM', room: '1003', type: 'combined' },
      { time: '1:30 - 2:30', subject: 'AT', code: 'AT NJ', faculty: 'NJ', room: '', type: 'lecture' },
      { time: '2:30 - 3:30', subject: 'AMT-I', code: 'AMT-I MK', faculty: 'MK', room: '', type: 'tutorial' },
      { time: '3:30 - 4:30', subject: 'AMT-I', code: 'AMT-I MK', faculty: 'MK', room: '', type: 'tutorial' },
      { time: '4:30 - 5:30', subject: 'AMT-I', code: 'AMT-I Tutorial', faculty: 'MK', room: '', type: 'tutorial' }
    ],
    'TUESDAY': [
      { time: '8:30 - 9:30', subject: 'Remedial', code: 'Remedial Lecture', faculty: '', room: '', type: 'remedial' },
      { time: '9:30 - 10:30', subject: 'OST', code: 'OST CA', faculty: 'CA', room: '', type: 'lecture' },
      { time: '10:30 - 11:30', subject: 'FSJ', code: 'FSJ AD', faculty: 'AD', room: '', type: 'lecture' },
      { time: '11:30 - 12:30', subject: 'DMSA', code: 'DMSA RM', faculty: 'RM', room: '', type: 'lecture' },
      { time: '1:30 - 2:30', subject: 'ADSA', code: 'ADSA AK', faculty: 'AK', room: '', type: 'lecture' },
      { time: '2:30 - 3:30', subject: 'ED', code: 'ED S11 MI (1003)', faculty: 'MI', room: '1003', type: 'lab' },
      { time: '3:30 - 4:30', subject: 'FSJ', code: 'FSJ S12 AD (1004)', faculty: 'AD', room: '1004', type: 'lab' },
      { time: '4:30 - 5:30', subject: 'ADSA/Remedial', code: 'ADSA S13 KS (1003)', faculty: 'KS', room: '1003', type: 'combined' }
    ],
    'WEDNESDAY': [
      { time: '8:30 - 9:30', subject: 'Remedial', code: 'Remedial Lecture', faculty: '', room: '', type: 'remedial' },
      { time: '9:30 - 10:30', subject: 'AT', code: 'AT NJ', faculty: 'NJ', room: '', type: 'lecture' },
      { time: '10:30 - 11:30', subject: 'SQL/ES/ED', code: 'SQL S11 RM (1004) / ES S12 ABM (1003) / ED S13 AM (1003)', faculty: 'RM/ABM/AM', room: '1003-1004', type: 'combined' },
      { time: '11:30 - 12:30', subject: 'ED', code: 'ED AM', faculty: 'AM', room: '', type: 'lecture' },
      { time: '1:30 - 2:30', subject: 'ADSA', code: 'ADSA KS', faculty: 'KS', room: '', type: 'lecture' },
      { time: '2:30 - 3:30', subject: 'ES', code: 'ES ABM', faculty: 'ABM', room: '', type: 'lecture' },
      { time: '3:30 - 4:30', subject: 'AMT-I', code: 'AMT-I Tutorial', faculty: 'MK', room: '', type: 'tutorial' },
      { time: '4:30 - 5:30', subject: '', code: '', faculty: '', room: '', type: 'break' }
    ],
    'THURSDAY': [
      { time: '8:30 - 9:30', subject: 'DMSA', code: 'DMSA RM', faculty: 'RM', room: '', type: 'lecture' },
      { time: '9:30 - 10:30', subject: 'AT', code: 'AT NJ', faculty: 'NJ', room: '', type: 'lecture' },
      { time: '10:30 - 11:30', subject: 'ADSA', code: 'ADSA AK', faculty: 'AK', room: '', type: 'lecture' },
      { time: '11:30 - 12:30', subject: 'ES', code: 'ES ABM', faculty: 'ABM', room: '', type: 'lecture' },
      { time: '1:30 - 2:30', subject: 'ADSA', code: 'ADSA S11 AK (1003)', faculty: 'AK', room: '1003', type: 'lab' },
      { time: '2:30 - 3:30', subject: 'SQL', code: 'SQL S12 ST (1004)', faculty: 'ST', room: '1004', type: 'lab' },
      { time: '3:30 - 4:30', subject: 'FSJ', code: 'FSJ S13 NJ (1004)', faculty: 'NJ', room: '1004', type: 'lab' },
      { time: '4:30 - 5:30', subject: 'Mentor', code: 'Mentor Meeting', faculty: '', room: '', type: 'meeting' }
    ],
    'FRIDAY': [
      { time: '8:30 - 9:30', subject: 'Remedial', code: 'Remedial Lecture', faculty: '', room: '', type: 'remedial' },
      { time: '9:30 - 10:30', subject: 'OST', code: 'OST MI', faculty: 'MI', room: '', type: 'lecture' },
      { time: '10:30 - 11:30', subject: 'ES/ED/SQL', code: 'ES S11 ABM (1003) / ED S12 MI (1003) / SQL S13 RM (1004)', faculty: 'ABM/MI/RM', room: '1003-1004', type: 'combined' },
      { time: '11:30 - 12:30', subject: 'ED', code: 'ED AM', faculty: 'AM', room: '', type: 'lecture' },
      { time: '1:30 - 2:30', subject: 'DMSA', code: 'DMSA RM', faculty: 'RM', room: '', type: 'lecture' },
      { time: '2:30 - 3:30', subject: 'AMT-I', code: 'AMT-I Tutorial', faculty: 'MK', room: '', type: 'tutorial' },
      { time: '3:30 - 4:30', subject: 'Remedial', code: 'Remedial Lecture', faculty: '', room: '', type: 'remedial' },
      { time: '4:30 - 5:30', subject: '', code: '', faculty: '', room: '', type: 'break' }
    ]
  };

  const timeSlots = ['8:30 - 9:30', '9:30 - 10:30', '10:30 - 11:30', '11:30 - 12:30', '1:30 - 2:30', '2:30 - 3:30', '3:30 - 4:30', '4:30 - 5:30'];
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const slots = [
      { start: 830, end: 930, slot: '8:30 - 9:30' },
      { start: 930, end: 1030, slot: '9:30 - 10:30' },
      { start: 1030, end: 1130, slot: '10:30 - 11:30' },
      { start: 1130, end: 1230, slot: '11:30 - 12:30' },
      { start: 1330, end: 1430, slot: '1:30 - 2:30' },
      { start: 1430, end: 1530, slot: '2:30 - 3:30' },
      { start: 1530, end: 1630, slot: '3:30 - 4:30' },
      { start: 1630, end: 1730, slot: '4:30 - 5:30' }
    ];

    return slots.find(slot => currentTime >= slot.start && currentTime <= slot.end)?.slot;
  };

  const getCurrentDay = () => {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[new Date().getDay()];
  };

  const currentTime = getCurrentTimeSlot();
  const currentDay = getCurrentDay();

  return (
    <div className="timetable-container" data-theme={theme}>
      <div className="timetable-wrapper">
        <table className="timetable">
          <thead>
            <tr>
              <th className="day-header">Day \ Time</th>
              {timeSlots.map((time, index) => (
                <th key={index} className={`time-header ${currentTime === time ? 'current-time' : ''}`}>
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day} className={`day-row ${currentDay === day ? 'current-day' : ''}`}>
                <td className="day-cell">
                  <span className="day-name">{day}</span>
                </td>
                {timeSlots.map((timeSlot, timeIndex) => {
                  const classData = timetableData[day][timeIndex];
                  const isCurrentClass = currentDay === day && currentTime === timeSlot;
                  
                  return (
                    <td 
                      key={timeIndex} 
                      className={`class-cell ${classData.type} ${isCurrentClass ? 'current-class' : ''}`}
                    >
                      {classData.subject ? (
                        <div className="class-content">
                          <div className="subject-code">{classData.code}</div>
                          {classData.room && (
                            <div className="room-number">({classData.room})</div>
                          )}
                          <div className="faculty-name">
                            {classData.faculty.split('/').map(f => faculty[f.trim()] || f).join(' / ')}
                          </div>
                        </div>
                      ) : (
                        <div className="empty-slot">
                          {classData.type === 'break' ? '' : 'Free'}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="legend">
        <h3>Faculty & Subjects</h3>
        <div className="legend-grid">
          <div className="faculty-list">
            <h4>FACULTIES</h4>
            {Object.entries(faculty).map(([code, name]) => (
              <div key={code} className="faculty-item">
                <span className="code">{code}</span> - {name}
              </div>
            ))}
          </div>
          <div className="subjects-list">
            <h4>SUBJECTS</h4>
            {Object.entries(subjects).map(([code, name]) => (
              <div key={code} className="subject-item">
                <span className="code">{code}</span> - {name}
              </div>
            ))}
          </div>
          <div className="labs-list">
            <h4>LABS</h4>
            <div className="subject-item">
              <span className="code">ADSA</span> - Advance Data Structure Lab
            </div>
            <div className="subject-item">
              <span className="code">SQL</span> - SQL Lab
            </div>
            <div className="subject-item">
              <span className="code">FSJ</span> - Full Stack Java Programming
            </div>
            <div className="subject-item">
              <span className="code">ED</span> - Entrepreneurship Development
            </div>
            <div className="subject-item">
              <span className="code">ES</span> - Environment Science Lab
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;