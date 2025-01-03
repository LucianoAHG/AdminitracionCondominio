import React, { useState, useEffect } from 'react';
import '../CSS/Resumen.css';
import axios from 'axios';

const Resumen = () => {
    const [cuotas, setCuotas] = useState({
        pagadas: 0,
        pendientes: 0,
        totalAcumulado: 0,
        totalPorPagar: 0, // Total por pagar para cuotas pendientes
    });
    const [actasRecientes, setActasRecientes] = useState([]);

    const fetchResumen = async () => {
        try {
            // Obtener las cuotas
            const cuotasResponse = await axios.get('https://elias.go.miorganizacion.cl/api/cuotas.php?action=fetch');
            if (cuotasResponse.data.status === 'success') {
                const cuotasData = cuotasResponse.data.data;

                // Calcular el total por pagar basado en cuotas pendientes
                const totalPorPagar = cuotasData
                    .filter((cuota) => cuota.Estado === 'Pendiente')
                    .reduce((total, cuota) => total + parseFloat(cuota.Monto || 0), 0);

                setCuotas({
                    pagadas: cuotasData.filter((cuota) => cuota.Estado === 'Pagada').length,
                    pendientes: cuotasData.filter((cuota) => cuota.Estado === 'Pendiente').length,
                    totalAcumulado: cuotasData.reduce((total, cuota) => total + parseFloat(cuota.Monto || 0), 0),
                    totalPorPagar, // Asignar el total calculado
                });
            } else {
                console.error('Error al obtener datos de cuotas:', cuotasResponse.data.message);
            }

            // Obtener las actas recientes
            const actasResponse = await axios.get('https://elias.go.miorganizacion.cl/api/actas.php?action=fetch');
            if (actasResponse.data.status === 'success') {
                // Asegurarse de que las actas tienen los campos `Titulo` y `Fecha`
                setActasRecientes(
                    actasResponse.data.data.map((acta) => ({
                        Titulo: acta.Detalle || 'Sin título',
                        Fecha: acta.Fecha || 'Sin fecha',
                    }))
                );
            } else {
                console.error('Error al obtener las actas recientes:', actasResponse.data.message);
            }
        } catch (error) {
            console.error('Error al obtener datos del resumen:', error.message);
        }
    };

    useEffect(() => {
        fetchResumen();
    }, []);

    const notificaciones = [
        'Nueva cuota asignada a los usuarios.',
        'Próxima reunión programada para el 20 de febrero.',
        'Se han actualizado las normas del condominio.',
    ];

    const anuncios = [
        { id: 1, titulo: 'Limpieza General', fecha: '2024-01-25' },
        { id: 2, titulo: 'Corte de Agua', fecha: '2024-02-05' },
        { id: 3, titulo: 'Nuevo Reglamento', fecha: '2024-03-01' },
    ];

    return (
        <div id="resumen-container">
            <h1 id="resumen-title">Panel de Resumen</h1>

            <div id="resumen-stats-container">
                <div className="resumen-stat-item">
                    <p className="resumen-stat-title">Cuotas Pagadas</p>
                    <p className="resumen-stat-value">{cuotas.pagadas}</p>
                </div>
                <div className="resumen-stat-item">
                    <p className="resumen-stat-title">Cuotas Pendientes</p>
                    <p className="resumen-stat-value">{cuotas.pendientes}</p>
                </div>
                <div className="resumen-stat-item">
                    <p className="resumen-stat-title">Total Acumulado</p>
                    <p className="resumen-stat-value" style={{ color: 'green' }}>
                        ${parseFloat(cuotas.totalAcumulado).toLocaleString('es-CL')}
                    </p>
                </div>
                <div className="resumen-stat-item">
                    <p className="resumen-stat-title">Total por Pagar</p>
                    <p className="resumen-stat-value" style={{ color: 'red' }}>
                        ${parseFloat(cuotas.totalPorPagar).toLocaleString('es-CL')}
                    </p>
                </div>
            </div>

            <div id="resumen-content-container">
                <div id="resumen-recent-acts">
                    <h2 className="resumen-section-title">Actas Recientes</h2>
                    <ul className="resumen-list">
                        {actasRecientes.map((acta, index) => (
                            <li key={`acta-${index}`} className="resumen-list-item">
                                <strong>{acta.Titulo}</strong> - {acta.Fecha}
                            </li>
                        ))}
                    </ul>
                </div>

                <div id="resumen-notifications">
                    <h2 className="resumen-section-title">Notificaciones</h2>
                    <ul className="resumen-list">
                        {notificaciones.map((notificacion, index) => (
                            <li key={`notificacion-${index}`} className="resumen-list-item">
                                {notificacion}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div id="resumen-announcements">
                <h2 className="resumen-section-title">Tabla de Anuncios</h2>
                <table id="resumen-announcements-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {anuncios.map((anuncio) => (
                            <tr key={`anuncio-${anuncio.id}`} className="resumen-announcement-row">
                                <td>{anuncio.titulo}</td>
                                <td>{anuncio.fecha}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Resumen;
