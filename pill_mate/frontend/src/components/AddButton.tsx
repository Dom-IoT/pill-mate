import { FC } from 'react';
import './AddButton.css';
import { CirclePlus } from 'lucide-react';

interface Props {
    title: string,
    color: 'blue' | 'green' | 'red' | 'orange'
};

const AddButton: FC<Props> = ({ title, color}) => {
    return (
        <div className={`AddButton ${color}`}>
            {title}
            <CirclePlus size={24} className="Icon" />
        </div>
    );
};

export default AddButton;
