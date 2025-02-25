import { FC } from 'react';
import './TitleBar.css';
import { CirclePlus } from 'lucide-react';

const TitleBar: FC = () => {
    return (
        <div className="TitleBar">
            Ajouter un rappel
            <CirclePlus size={24} className="Icon" />
        </div>
    );
};

export default TitleBar;
