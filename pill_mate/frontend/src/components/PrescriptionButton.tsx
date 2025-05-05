import { FC } from 'react';
import { Link } from 'react-router';
import './DashboardButton.css';

interface Props {
    label: string,
    path: string,
    color:'red'
    icon: JSX.Element,
};

const PrescriptionButton: FC<Props> = ({ label, path, color, icon }) => {
    return (
        <Link to={path} className={'PrescriptionButton ${color}'}>
            <div className="icon">{icon}</div>
            <span className="label">{label}</span>
        </Link>
    );
};
export default PrescriptionButton;
