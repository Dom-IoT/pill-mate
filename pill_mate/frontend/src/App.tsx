import { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from './AppRoutes.tsx';

const App: FC = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;
