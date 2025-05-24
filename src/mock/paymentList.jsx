import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Función para cargar los pagos desde Supabase
    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setPayments(data);
    };

    fetchPayments();

    // Suscripción realtime a la tabla payments
    const subscription = supabase
      .channel('public:payments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        (payload) => {
          console.log('Cambio detectado:', payload);
          fetchPayments();
        }
      )
      .subscribe();

    // Limpieza al desmontar componente
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div>
      <h2>Lista de Pagos</h2>
      {payments.length === 0 && <p>No hay pagos registrados.</p>}
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>
            <strong>{payment.description}</strong> — ${payment.amount} — {payment.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentsList;

