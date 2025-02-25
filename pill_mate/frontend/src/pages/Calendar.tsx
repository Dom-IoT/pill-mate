import  { FC } from 'react';
import { Link } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { CirclePlus } from 'lucide-react';

const Calendar: FC = () => {
    return (
        <div className="Calendar">
            <h1 className="Title">Liste de vos rappels</h1>
            <div className="foo">
                <div className="TitleBar">
                    Ajouter un rappel
                    <CirclePlus size={24} className='Icon'/>
                </div>
                <div className="RappelBar">Nom des rappels</div>
            </div>
            <nav>
                <Link to="/" className="Link">Retour au Tableau de bord</Link>
            </nav>
        </div>
    );
};

export default Calendar;
