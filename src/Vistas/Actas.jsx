import React, { useState } from 'react';
import '/src/CSS/Actas.css'; 

const Actas = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [newActa, setNewActa] = useState({
        fecha: '',
        numero: '',
        detalle: '',
        acuerdo: '',
        invitados: '',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [searchDate, setSearchDate] = useState('');

    const actasData = [
        { fecha: '07/abr/2020', numero: '1', detalle: 'Reunión ordinaria del centro', acuerdo: 'Cobrar las cuotas', invitados: '' },
        { fecha: '02/abr/2020', numero: '2', detalle: 'Pago', acuerdo: '...', invitados: '..' },
        { fecha: '13/abr/2020', numero: '3', detalle: 'Pago', acuerdo: '...', invitados: '..' },
        { fecha: '13/abr/2020', numero: '4', detalle: 'Pago', acuerdo: '...', invitados: '..' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewActa({ ...newActa, [name]: value });
    };

    const handleAddActa = () => {
        console.log('Nueva acta:', newActa);
        setShowModal(false);
        setNewActa({ fecha: '', numero: '', detalle: '', acuerdo: '', invitados: '' });
    };

    const nextActa = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredActas.length);
    };

    const prevActa = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredActas.length) % filteredActas.length);
    };

    // Filtrar actas según el término de búsqueda o la fecha
    const filteredActas = actasData.filter((acta) => {
        const matchesTerm = searchTerm
            ? Object.values(acta).some((value) =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
            : true; // Si no hay término de búsqueda, incluir todo
        const matchesDate = searchDate ? acta.fecha.includes(searchDate) : true; // Si no hay fecha, incluir todo
        return matchesTerm && matchesDate;
    });

    // Verificar si hay resultados y ajustar el índice
    if (filteredActas.length === 0 && currentIndex !== 0) {
        setCurrentIndex(0); // Restablecer el índice si no hay resultados
    }

    return (
        <div className="actas-container-unique">
            <h2>Gestión de Actas</h2>
            <div className="search-container-unique">
                <input
                    type="text"
                    placeholder="Buscar por término..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-unique"
                />
                <input
                    type="date"
                    placeholder="Buscar por fecha..."
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="search-input-unique"
                />
            </div>
            <button className="add-button-unique" onClick={() => setShowModal(true)}>+ Agregar Acta</button>
            <div className="carrusel-container-unique">
                {filteredActas.length > 0 ? (
                    <>
                        <button className="nav-button-unique prev-button-unique" onClick={prevActa}>⟨</button>
                        <div className="acta-card-unique">
                            <p className="acta-date-unique">{filteredActas[currentIndex].fecha}</p>
                            <h3 className="acta-number-unique">Acta #{filteredActas[currentIndex].numero}</h3>
                            <p><strong>Detalle:</strong> {filteredActas[currentIndex].detalle}</p>
                            <p><strong>Acuerdo:</strong> {filteredActas[currentIndex].acuerdo}</p>
                            <p><strong>Invitados:</strong> {filteredActas[currentIndex].invitados}</p>
                            <div className="acta-actions-unique">
                                <button className="view-button-unique">👁️</button>
                                <button className="edit-button-unique">✏️</button>
                                <button className="delete-button-unique">🗑️</button>
                            </div>
                        </div>
                        <button className="nav-button-unique next-button-unique" onClick={nextActa}>⟩</button>
                    </>
                ) : (
                    <p>No hay actas disponibles que coincidan con la búsqueda.</p>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay-unique">
                    <div className="modal-content-unique">
                        <h3>Crear Nueva Acta</h3>
                        <form>
                            <div className="form-group-unique">
                                <label htmlFor="fecha">Fecha:</label>
                                <input type="date" id="fecha" name="fecha" value={newActa.fecha} onChange={handleChange} />
                            </div>
                            <div className="form-group-unique">
                                <label htmlFor="numero">Número:</label>
                                <input type="text" id="numero" name="numero" value={newActa.numero} onChange={handleChange} />
                            </div>
                            <div className="form-group-unique">
                                <label htmlFor="detalle">Detalle:</label>
                                <textarea id="detalle" name="detalle" value={newActa.detalle} onChange={handleChange}></textarea>
                            </div>
                            <div className="form-group-unique">
                                <label htmlFor="acuerdo">Acuerdo:</label>
                                <input type="text" id="acuerdo" name="acuerdo" value={newActa.acuerdo} onChange={handleChange} />
                            </div>
                            <div className="form-group-unique">
                                <label htmlFor="invitados">Invitados:</label>
                                <input type="text" id="invitados" name="invitados" value={newActa.invitados} onChange={handleChange} />
                            </div>
                            <div className="modal-buttons-unique">
                                <button type="button" onClick={handleAddActa} className="save-button-unique">Guardar</button>
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-button-unique">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Actas;
