import React, { useState } from 'react';
import '/src/CSS/Cuotas.css';
const Cuotas = () => {
    // Datos de ejemplo 
    const data = [
        { nombre: 'Elias', rol: 'Socio', estado: 'Pendiente', monto: 1000, pagadas: 0, pendientes: 8, fecha: '2024-01-01' },
        { nombre: 'Jesus', rol: 'Socio', estado: 'Pagada', monto: 1000, pagadas: 4, pendientes: 5, fecha: '2023-02-15' },
        { nombre: 'Machado', rol: 'Administrador', estado: 'Pagada', monto: 1000, pagadas: 7, pendientes: 2, fecha: '2024-03-10' },
        { nombre: 'Doe John', rol: 'Socio', estado: 'Pagada', monto: 1000, pagadas: 4, pendientes: 5, fecha: '2023-01-20' },
        { nombre: 'Perez Juanito', rol: 'Tesorero', estado: 'Pagada', monto: 1000, pagadas: 6, pendientes: 3, fecha: '2024-04-05' },
        { nombre: 'Luciano', rol: 'Socio', estado: 'Pagada', monto: 1000, pagadas: 3, pendientes: 6, fecha: '2024-02-28' },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    // Obtener un conjunto único de años de los datos para el filtro
    const years = [...new Set(data.map(item => item.fecha.split('-')[0]))];

    // Meses para desplegar en el filtro
    const months = [
        { value: '', label: 'Todos los meses' },
        { value: '01', label: 'Enero' },
        { value: '02', label: 'Febrero' },
        { value: '03', label: 'Marzo' },
        { value: '04', label: 'Abril' },
        { value: '05', label: 'Mayo' },
        { value: '06', label: 'Junio' },
        { value: '07', label: 'Julio' },
        { value: '08', label: 'Agosto' },
        { value: '09', label: 'Septiembre' },
        { value: '10', label: 'Octubre' },
        { value: '11', label: 'Noviembre' },
        { value: '12', label: 'Diciembre' },
    ];

    // Filtrar datos según la búsqueda por nombre, año y mes seleccionado
    const filteredData = data.filter((item) => {
        const matchesName = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesYear = selectedYear ? item.fecha.startsWith(selectedYear) : true;
        const matchesMonth = selectedMonth ? item.fecha.split('-')[1] === selectedMonth : true;
        return matchesName && matchesYear && matchesMonth;
    });

    return (
        <div className="cuotas-container">
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={selectedYear}
                    onChange={(e) => {
                        setSelectedYear(e.target.value);
                        setSelectedMonth(''); // Resetear el mes cuando se cambia el año
                    }}
                    className="search-input"
                >
                    <option value="">Todos los años</option>
                    {years.map((year, index) => (
                        <option key={index} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="search-input"
                    disabled={!selectedYear} // Deshabilitar si no hay un año seleccionado
                >
                    {months.map((month, index) => (
                        <option key={index} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="cards-container">
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <div key={index} className="cuota-card">
                            <h3>{item.nombre}</h3>
                            <p className="rol">@{item.rol}</p>
                            <p className={`estado ${item.estado.toLowerCase()}`}>{item.estado}</p>
                            <p className="monto">${item.monto.toLocaleString('es-CL')}</p> {/* Formato de moneda */}
                            <button className={`pagar-button ${item.estado === 'Pendiente' ? 'active' : ''}`}>
                                {item.estado === 'Pendiente' ? 'Pagar' : 'Pagado'}
                            </button>
                            <div className="cuota-details">
                                <p><strong>{item.pagadas}</strong> Pagadas</p>
                                <p><strong>{item.pendientes}</strong> Pendientes</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron resultados.</p>
                )}
            </div>
        </div>
    );
};

export default Cuotas;
