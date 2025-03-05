import { FC } from 'react';
import './ToolBar.css';

interface Props {
    rappel: string,
    color:'blue' | 'green' | 'red' | 'orange',
    date: Date,
};

const ToolBar: FC<Props> = ({rappel, color, date }) => {
    return (
        <div className={`ReminderBar ${color}`}>
            <div>
                <p>{rappel}</p>
                <p>{date.toLocaleString()}</p>
            </div>
            <button className="button">Modifier</button>
        </div>
    );
};

export default ToolBar;
