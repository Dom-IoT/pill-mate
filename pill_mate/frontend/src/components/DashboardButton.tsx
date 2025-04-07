import { FC } from 'react';
import { Link } from 'react-router';
import './DashboardButton.css';

interface Props {
    label: string,
    path: string,
    color: 'blue' | 'green' | 'red' |'orange',
    icon: JSX.Element,
};

const DashboardButton: FC<Props> = ({ label, path, color, icon }) => {
    return (
        <Link to={path} className={`DashboardButton ${color}`}>
            <div className="icon">{icon}</div>
            <span className="label">{label}</span>
        </Link>
    );
};
export default DashboardButton;
