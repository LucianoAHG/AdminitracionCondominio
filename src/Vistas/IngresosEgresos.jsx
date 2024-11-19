import React, { useState } from 'react';
import { FaPlus, FaMoneyBillWave, FaTimes, FaCalendarAlt, FaClipboardList, FaCreditCard } from 'react-icons/fa';

const IngresosEgresos = () => {
    const [transactions, setTransactions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        tipo: 'Ingreso',
        fecha: '',
        descripcion: '',
        categoria: '',
        monto: '',
        metodoPago: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setTransactions([...transactions, formData]);
        setShowForm(false);
        setFormData({
            tipo: 'Ingreso',
            fecha: '',
            descripcion: '',
            categoria: '',
            monto: '',
            metodoPago: ''
        });
    };

    return (
        <div className="ingresos-egresos-container">
            <h2>Gestión de Ingresos y Egresos</h2>
            <div className="buttons-container">
                <button onClick={() => setShowForm(true)} className="add-button">
                    <FaPlus className="icon" /> Agregar Ingreso/Egreso
                </button>
            </div>
            {showForm && (
                <form onSubmit={handleFormSubmit} className="transaction-form">
                    <label>
                        Tipo de Transacción:
                        <select name="tipo" value={formData.tipo} onChange={handleInputChange}>
                            <option value="Ingreso">Ingreso</option>
                            <option value="Egreso">Egreso</option>
                        </select>
                    </label>
                    <label>
                        Fecha:
                        <div className="input-with-icon">
                            <FaCalendarAlt className="icon" />
                            <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} required />
                        </div>
                    </label>
                    <label>
                        Descripción:
                        <div className="input-with-icon">
                            <FaClipboardList className="icon" />
                            <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} required />
                        </div>
                    </label>
                    <label>
                        Categoría:
                        <input type="text" name="categoria" value={formData.categoria} onChange={handleInputChange} required />
                    </label>
                    <label>
                        Monto:
                        <div className="input-with-icon">
                            <FaMoneyBillWave className="icon" />
                            <input type="number" name="monto" value={formData.monto} onChange={handleInputChange} required />
                        </div>
                    </label>
                    <label>
                        Método de Pago:
                        <div className="input-with-icon">
                            <FaCreditCard className="icon" />
                            <select name="metodoPago" value={formData.metodoPago} onChange={handleInputChange}>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Transferencia">Transferencia</option>
                                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                            </select>
                        </div>
                    </label>
                    <div className="form-buttons">
                        <button type="submit" className="submit-button">Guardar</button>
                        <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                            <FaTimes className="icon" /> Cancelar
                        </button>
                    </div>
                </form>
            )}
            <div className="transactions-table">
                <h3>Transacciones Registradas</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Categoría</th>
                            <th>Tipo</th>
                            <th>Monto</th>
                            <th>Método de Pago</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{transaction.fecha}</td>
                                <td>{transaction.descripcion}</td>
                                <td>{transaction.categoria}</td>
                                <td>{transaction.tipo}</td>
                                <td>{transaction.monto}</td>
                                <td>{transaction.metodoPago}</td>
                                <td>
                                    <button className="edit-button">Editar</button>
                                    <button className="delete-button">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IngresosEgresos;
