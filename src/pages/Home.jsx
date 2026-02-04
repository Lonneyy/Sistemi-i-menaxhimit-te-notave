import { Link } from 'react-router-dom';
import '../index.css';

function Home() {
  return (
    <div className="container">
      <div className="home-content">
        <h1>Mirë se vini!</h1>
        <p className="subtitle">Shkolla Mehmet Isai <br /> Klasa: X/1</p>
        
        <div className="navigation-cards">
          <Link to="/search" className="nav-card">
            <h2>Kërko Student</h2>
            <p>Kërko dhe shiko notat e studentëve</p>
          </Link>
          
          <Link to="/admin" className="nav-card">
            <h2>Paneli i Administratorit</h2>
            <p>Menaxho studentët dhe notat (vetëm admin)</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
