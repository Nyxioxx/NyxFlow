import React, { useState, useEffect } from 'react';
import { generateTicketNumber, formatDate } from '../utils/helpers';
import { paymentTypes } from '../mock/payments';
import { getStorage, setStorage } from '../utils/storage';

const UserDashboard = ({ user, onLogout }) => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cobros, setCobros] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setTicketNumber(generateTicketNumber());
    const storedCobros = getStorage('cobros') || [];
    setCobros(storedCobros.filter(cobro => cobro.userId === user.id));
  }, [user.id]);

  const handleAddCobro = () => {
    const newCobro = {
      id: Date.now(),
      userId: user.id,
      amount: amount,
      description: description,
      paymentType: paymentType,
      accountNumber: accountNumber,
      ticketNumber: ticketNumber,
      date: new Date().toISOString(),
      status: 'Pendiente',
      proof: null,
    };

    const allCobros = getStorage('cobros') || [];
    const updatedCobros = [...allCobros, newCobro];
    setStorage('cobros', updatedCobros);
    setCobros(updatedCobros.filter(cobro => cobro.userId === user.id));

    setAmount('');
    setDescription('');
    setPaymentType('');
    setAccountNumber('');
    setTicketNumber(generateTicketNumber());
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Bienvenido, {user.name}</h1>
          <p className="text-gray-400">{user.position}</p>
          <p className="text-gray-400">Tu ID: {user.id}</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Generar Nuevo Cobro</h2>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-bold mb-2">Número de Ticket:</label>
          <input
            type="text"
            value={ticketNumber}
            readOnly
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white cursor-not-allowed"
          />
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-yellow-500 text-gray-900 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
          >
            Ingresar Datos del Cobro
          </button>
        )}

        {showForm && (
          <>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2">Monto a Cobrar:</label>
              <input
                type="number"
                placeholder="Ej: 150000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2">Detalles del Cobro:</label>
              <textarea
                placeholder="Descripción detallada del servicio o producto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2">Tipo de Pago:</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Selecciona un tipo de pago</option>
                {paymentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-bold mb-2">Número de Cuenta/Teléfono:</label>
              <input
                type="text"
                placeholder="Número de cuenta o teléfono"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <button
              onClick={handleAddCobro}
              className="w-full bg-yellow-500 text-gray-900 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
            >
              Registrar Cobro
            </button>
          </>
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Mis Cobros Registrados</h2>
        {cobros.length === 0 ? (
          <p className="text-gray-400">Aún no has registrado cobros.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Ticket</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Monto</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Descripción</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Tipo Pago</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Cuenta</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Fecha</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Estado</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {cobros.map(cobro => (
                  <tr key={cobro.id} className="hover:bg-gray-700">
                    <td className="py-2 px-4 border-b border-gray-700">{cobro.ticketNumber}</td>
                    <td className="py-2 px-4 border-b border-gray-700">${cobro.amount}</td>
                    <td className="py-2 px-4 border-b border-gray-700">{cobro.description}</td>
                    <td className="py-2 px-4 border-b border-gray-700">{cobro.paymentType}</td>
                    <td className="py-2 px-4 border-b border-gray-700">{cobro.accountNumber}</td>
                    <td className="py-2 px-4 border-b border-gray-700">{formatDate(cobro.date)}</td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cobro.status === 'Pagado' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>
                        {cobro.status}
                      </span>
                    </td>
                     <td className="py-2 px-4 border-b border-gray-700">
                      {cobro.proof ? (
                        <img src={cobro.proof} alt="Comprobante" className="h-16 w-auto object-cover rounded-md cursor-pointer" onClick={() => window.open(cobro.proof, '_blank')} />
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;