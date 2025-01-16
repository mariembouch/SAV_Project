import React, { useEffect, useState } from 'react';
import axios from 'axios';
import defaultImage from './assets/images/default.jpg'; // Assurez-vous que ce chemin est correct

// Importez dynamiquement les images des employés
const importImage = (imageName) => {
    try {
        return require(`./assets/images/${imageName}`);
    } catch (error) {
        return defaultImage; // Retourne l'image par défaut si l'import échoue
    }
};

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:5140/api/employees');
                console.log(response.data); // Debug the API response
                setEmployees(response.data);
            } catch (err) {
                setError('Erreur lors de la récupération des employés');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Liste des Employés</h1>
            <ul>
                {employees.map((employee) => (
                    <li key={employee.id || employee.employeeId}>
                        <h2>{employee.firstName} {employee.lastName}</h2>
                        <img 
                            src={importImage(employee.photoPath)} 
                            alt={`${employee.firstName} ${employee.lastName}`} 
                            style={{ width: '100px', height: '100px' }} 
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;
