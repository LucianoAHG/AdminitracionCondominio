import React from 'react';
import '../CSS/Resumen.css';

const Resumen = () => {
    const cuotas = [
        { estado: 'Pagadas', cantidad: 40 },
        { estado: 'Pendientes', cantidad: 15 },
    ];

    const actasRecientes = [
        { id: 1, titulo: 'Reunión Anual', fecha: '2024-01-15' },
        { id: 2, titulo: 'Revisión de Presupuesto', fecha: '2024-02-10' },
    ];

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
                {cuotas.map((cuota) => (
                    <div key={`cuota-${cuota.estado}`} className="resumen-stat-item">
                        <p className="resumen-stat-title">Cuotas {cuota.estado}</p>
                        <p className="resumen-stat-value">{cuota.cantidad}</p>
                    </div>
                ))}
            </div>

            <div id="resumen-content-container">
                <div id="resumen-recent-acts">
                    <h2 className="resumen-section-title">Actas Recientes</h2>
                    <ul className="resumen-list">
                        {actasRecientes.map((acta) => (
                            <li key={`acta-${acta.id}`} className="resumen-list-item">
                                <strong>{acta.titulo}</strong> - {acta.fecha}
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
