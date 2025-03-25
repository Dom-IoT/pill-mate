import { FC } from 'react';
import './RegisteredObject.css';

interface Props {
    rappel: string,
    color:'blue' | 'green' | 'red' | 'orange',
    date: Date,
};

const RegisteredObject: FC<Props> = ({rappel, color, date }) => {
    let buttonText = "Modifier";

    if (color === "blue") {
        buttonText = "Modifier"
    }else if (color === "green") {
        buttonText = "Ajouter stock"
    }
    
    return (
        <div className={`RegisteredObject ${color}`}>
            <div>
                <p>{rappel}</p>
                <p>{date.toLocaleString()}</p>
            </div>
            <button className={`button ${color}`}>
                {buttonText}
            </button>
        </div>
    );
};

export default RegisteredObject;
