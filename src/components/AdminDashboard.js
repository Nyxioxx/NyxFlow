import React, { useState, useEffect } from 'react';
import { getStorage, setStorage } from '../utils/storage';
import { formatDate } from '../utils/helpers';
import { users } from '../mock/users';

const AdminDashboard = ({ user, onLogout }) => {
  const [allCobros, setAllCobros] = useState([]);
  const [selectedCobro, setSelectedCobro] = useState(null);
  const [proofFile, setProofFile] = useState(null);

  useEffect(() => {
    const storedCobros = getStorage('cobros') || [];
    setAllCobros(storedCobros);
  }, []);

  const handleMarkAsPaid = (cobroId) => {
    const updatedCobros = allCobros.map(cobro =>
      cobro.id === cobroId ? { ...cobro, status: 'Pagado' } : cobro
    );
    setStorage('cobros', updatedCobros);
    setAllCobros(updatedCobros);
    if (selectedCobro && selectedCobro.id === cobroId) {
      setSelectedCobro(updatedCobros.find(c => c.id === cobroId));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofFile(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProofFile(null);
    }
  };

  const handleUploadProof = (cobroId) => {
    if (!proofFile) return;

    const updatedCobros = allCobros.map(cobro =>
      cobro.id === cobroId ? { ...cobro, proof: proofFile } : cobro
    );
    setStorage('cobros', updatedCobros);
    setAllCobros(updatedCobros);
    if (selectedCobro && selectedCobro.id === cobroId) {
      setSelectedCobro(updatedCobros.find(c => c.id === cobroId));
    }
    setProofFile(null);
  };

  const getUserName = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Usuario Desconocido';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Panel de Administrador</h1>
          <p className="text-gray-400">Bienvenido, {user.name}</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Historial Completo de Cobros</h2>
        {allCobros.length === 0 ? (
          <p className="text-gray-400">Aún no hay cobros registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Ticket</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Usuario</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Monto</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Descripción</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Tipo Pago</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Cuenta</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Fecha</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Estado</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Comprobante</th>
                  <th className="py-2 px-4 border-b border-gray-700 text-left text-gray-400 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {allCobros.map(cobro => (
                  <tr key={cobro.id} className="hover:bg-gray-700">
                    <td className="py-2 px-4 border-b border-gray-700">{cobro.ticketNumber}</td>
                    <td className="py-2 px-4 border-b border-gray-700">{getUserName(cobro.userId)}</td>
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
                    <td className="py-2 px-4 border-b border-gray-700">
                      {cobro.status !== 'Pagado' && (
                        <button
                          onClick={() => handleMarkAsPaid(cobro.id)}
                          className="bg-green-600 text-white py-1 px-3 rounded-lg text-sm hover:bg-green-700 transition-colors mr-2"
                        >
                          Marcar como Pagado
                        </button>
                      )}
                       {cobro.status === 'Pagado' && !cobro.proof && (
                         <>
                           <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm mb-2 text-gray-400"/>
                           <button
                             onClick={() => handleUploadProof(cobro.id)}
                             className="bg-yellow-500 text-gray-900 py-1 px-3 rounded-lg text-sm hover:bg-yellow-600 transition-colors font-semibold"
                           >
                             Subir Comprobante
                           </button>
                         </>
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

export default AdminDashboard;