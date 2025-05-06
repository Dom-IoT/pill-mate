import { ChangeEvent, FC, useState } from 'react';
import {
    Calendar,
    ClipboardList,
    Scan,
    Settings,
    Square,
    SquareCheckBig,
} from 'lucide-react';
import './Dashboard.css';
import DashboardButton from '../components/DashboardButton.tsx';

const Dashboard: FC = () => {
    const iconSize = 'clamp(4rem, 10vw, 8rem)';

    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    return (
        <div>
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        style={{ display: 'none' }}
                    />
                    <div className="checkboxIcon">
                        {isChecked ? (
                            <SquareCheckBig size={iconSize} />
                        ) : (
                            <Square size={iconSize} />
                        )}
                    </div>
                </label>
            </div>
            <div className="container">
                <DashboardButton
                    label="Calendrier"
                    icon={<Calendar size={iconSize} />}
                    color="blue"
                    path="/calendar"
                />
                <DashboardButton
                    label="Gestion des stocks"
                    icon={<ClipboardList size={iconSize} />}
                    color="green"
                    path="/stock"
                />
                <DashboardButton
                    label="Ordonnance"
                    icon={<Scan size={iconSize} />}
                    color="red"
                    path="/prescription"
                />
                <DashboardButton
                    label="Paramètres"
                    icon={<Settings size={iconSize} />}
                    color="orange"
                    path="/"
                />
            </div>
        </div>
    );
};

export default Dashboard;
