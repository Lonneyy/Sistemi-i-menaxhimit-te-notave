import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import studentsData from '../data/students.json';
import '../index.css';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const results = studentsData.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
    setSelectedStudent(null);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="container">
      <div className="search-page">
        <div className="page-header">
          <button onClick={() => navigate('/')} className="back-button">← Kthehu në shtëpi</button>
          <h1>Kërko Student</h1>
          {isAuthenticated && (
            <div className="user-info">
              <span>Përdorues: {user?.username} ({user?.role})</span>
              <button onClick={() => { logout(); navigate('/'); }} className="btn-logout">Dil</button>
            </div>
          )}
        </div>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Shkruani emrin e studentit..."
              className="search-input"
            />
            <button type="submit" className="btn-search">Kërko</button>
          </form>
        </div>

        {searchResults.length > 0 && !selectedStudent && (
          <div className="results-section">
            <h2>Rezultatet e kërkimit ({searchResults.length})</h2>
            <div className="students-list">
              {searchResults.map(student => (
                <div
                  key={student.id}
                  className="student-card"
                  onClick={() => handleStudentClick(student)}
                >
                  <h3>{student.name}</h3>
                  <p>{student.subjects.length} lëndë</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedStudent && (
          <div className="student-details">
            <button onClick={() => setSelectedStudent(null)} className="back-button">← Kthehu te rezultatet</button>
            <h2>Detajet e {selectedStudent.name}</h2>
            
            <div className="grades-table">
              <table>
                <thead>
                  <tr>
                    <th>Lënda</th>
                    <th>Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.subjects.map((subject, index) => (
                    <tr key={index}>
                      <td>{subject.name}</td>
                      <td className="grade-cell">{subject.grade}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>Mesatarja:</strong></td>
                    <td className="grade-cell">
                      <strong>
                        {(selectedStudent.subjects.reduce((sum, s) => sum + s.grade, 0) / selectedStudent.subjects.length).toFixed(2)}
                      </strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {searchTerm && searchResults.length === 0 && (
          <div className="no-results">
            <p>Nuk u gjet asnjë student me këtë emër.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
