import { Link } from 'react-router-dom';
import '../index.css';

function Grades() {
  return (
    <div className="container">
      <div className="page-header">
        <Link to="/" className="back-button">← Kthehu në shtëpi</Link>
        <h1>Notat</h1>
      </div>
      
      <div className="grades-content">
        <div className="info-box">
          <p>Kjo faqe do të përdoret për të shfaqur dhe menaxhuar notat tuaja.</p>
          <p>Lidhja me bazën e të dhënave do të shtohet së shpejti.</p>
        </div>
        
        <div className="grades-table-placeholder">
          <h2>Lista e Notave</h2>
          <p>Tabela e notave do të shfaqet këtu pas lidhjes me bazën e të dhënave.</p>
        </div>
      </div>
    </div>
  );
}

export default Grades;
