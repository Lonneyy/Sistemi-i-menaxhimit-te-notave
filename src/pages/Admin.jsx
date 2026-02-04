import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import studentsData from '../data/students.json';
import '../index.css';

function Admin() {
  const { isAdmin, user, logout, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', subjects: [] });
  const [newSubject, setNewSubject] = useState({ name: '', grade: '' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isAdmin()) {
      // Load students from JSON (in real app, this would be from database)
      setStudents(studentsData);
    }
  }, [isAdmin]);

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(loginForm.username, loginForm.password);
    if (result.success) {
      if (result.role === 'admin') {
        setLoginError('');
        setLoginForm({ username: '', password: '' });
        setStudents(studentsData);
      } else {
        setLoginError('Vetëm administratorët mund të aksesojnë këtë panel!');
      }
    } else {
      setLoginError(result.error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student.id);
    setFormData({
      name: student.name,
      subjects: [...student.subjects]
    });
  };

  const handleSave = () => {
    const updatedStudents = students.map(student => {
      if (student.id === editingStudent) {
        return {
          ...student,
          name: formData.name,
          subjects: formData.subjects
        };
      }
      return student;
    });
    setStudents(updatedStudents);
    setEditingStudent(null);
    setFormData({ name: '', subjects: [] });
    alert('Të dhënat u ruajtën! (Në aplikacionin real, kjo do të ruhej në bazën e të dhënave)');
  };

  const handleCancel = () => {
    setEditingStudent(null);
    setFormData({ name: '', subjects: [] });
    setNewSubject({ name: '', grade: '' });
  };

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.grade) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, {
          name: newSubject.name,
          grade: parseFloat(newSubject.grade)
        }]
      });
      setNewSubject({ name: '', grade: '' });
    }
  };

  const handleRemoveSubject = (index) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index)
    });
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Jeni të sigurt që dëshironi të fshini këtë student?')) {
      const updatedStudents = students.filter(s => s.id !== studentId);
      setStudents(updatedStudents);
      alert('Studenti u fshi! (Në aplikacionin real, kjo do të fshihej nga baza e të dhënave)');
    }
  };

  if (!isAdmin()) {
    return (
      <div className="container">
        <div className="search-page">
          <div className="login-section">
            <button onClick={() => navigate('/')} className="back-button">← Kthehu në shtëpi</button>
            <h1>Hyrje në Panelin e Administratorit</h1>
            <p className="subtitle">Vetëm administratorët mund të aksesojnë këtë panel</p>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>Përdoruesi:</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="Shkruani emrin e përdoruesit"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Fjalëkalimi:</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Shkruani fjalëkalimin"
                  required
                />
              </div>
              
              {loginError && <div className="error-message">{loginError}</div>}
              
              <button type="submit" className="btn-primary">Hyr</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-page">
        <div className="page-header">
          <button onClick={() => navigate('/')} className="back-button">← Kthehu në shtëpi</button>
          <h1>Paneli i Administratorit</h1>
          <div className="user-info">
            <span>Përdorues: {user?.username}</span>
            <button onClick={() => { logout(); navigate('/'); }} className="btn-logout">Dil</button>
          </div>
        </div>

        <div className="admin-content">
          <div className="info-box">
            <p><strong>Kujdes:</strong> Ndryshimet që bëni këtu do të ruhen vetëm në memorie. 
            Për ruajtje të përhershme, duhet të lidheni me bazën e të dhënave.</p>
            <p><strong>Konfigurimi:</strong> Të dhënat e studentëve mund të konfigurohen në <code>src/data/students.json</code></p>
          </div>

          <h2>Lista e Studentëve</h2>
          
          <div className="students-admin-list">
            {students.map(student => (
              <div key={student.id} className="admin-student-card">
                {editingStudent === student.id ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Emri i Studentit:</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="subjects-edit">
                      <h4>Lëndët:</h4>
                      {formData.subjects.map((subject, index) => (
                        <div key={index} className="subject-item">
                          <input
                            type="text"
                            value={subject.name}
                            onChange={(e) => {
                              const updated = [...formData.subjects];
                              updated[index].name = e.target.value;
                              setFormData({ ...formData, subjects: updated });
                            }}
                            placeholder="Emri i lëndës"
                          />
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={subject.grade}
                            onChange={(e) => {
                              const updated = [...formData.subjects];
                              updated[index].grade = parseFloat(e.target.value);
                              setFormData({ ...formData, subjects: updated });
                            }}
                            placeholder="Nota"
                          />
                          <button onClick={() => handleRemoveSubject(index)} className="btn-remove">Fshi</button>
                        </div>
                      ))}

                      <div className="add-subject">
                        <input
                          type="text"
                          value={newSubject.name}
                          onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                          placeholder="Emri i lëndës së re"
                        />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={newSubject.grade}
                          onChange={(e) => setNewSubject({ ...newSubject, grade: e.target.value })}
                          placeholder="Nota"
                        />
                        <button onClick={handleAddSubject} className="btn-add">Shto Lëndë</button>
                      </div>

                      <div className="edit-actions">
                        <button onClick={handleSave} className="btn-save">Ruaj</button>
                        <button onClick={handleCancel} className="btn-cancel">Anulo</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="student-info">
                      <h3>{student.name}</h3>
                      <div className="subjects-preview">
                        {student.subjects.map((subject, index) => (
                          <span key={index} className="subject-badge">
                            {subject.name}: {subject.grade}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="student-actions">
                      <button onClick={() => handleEdit(student)} className="btn-edit">Ndrysho</button>
                      <button onClick={() => handleDeleteStudent(student.id)} className="btn-delete">Fshi</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
