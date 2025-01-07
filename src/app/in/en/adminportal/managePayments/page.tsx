'use client';
import React, { useEffect, useState } from 'react';
import styles from './managePayments.module.css';
import { jsPDF } from 'jspdf';

interface ClientData {
    id: string;
    name: string;
    email: string;
    plan: string;
    renewalDate: string;
    billingHistory: BillingHistory[];
}

interface BillingHistory {
    date: string;
    amount: number;
    status: string;
    invoiceId: string;
}

const ManagePayments: React.FC = () => {
    const [clients, setClients] = useState<ClientData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [invoiceDate, setInvoiceDate] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<string>('Paid');
    const [invoiceDropdown, setInvoiceDropdown] = useState<string>('');
    const [subtotal, setSubtotal] = useState<number>(0);

    useEffect(() => {
        const fetchClients = async () => {
            const mockData: ClientData[] = [
                {
                    id: '1',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    plan: 'Pro',
                    renewalDate: '2025-01-01',
                    billingHistory: [
                        // { date: '2024-11-01', amount: 29.99, status: 'Paid', invoiceId: 'INV001' },
                    ],
                },
            ];
            setClients(mockData);
            console.log("mockData:", mockData);
            setLoading(false);
        };

        fetchClients();
    }, []);

    const downloadInvoice = (client: ClientData, history: BillingHistory) => {
        const doc = new jsPDF();
        doc.text(`Invoice ID: ${history.invoiceId}`, 10, 10);
        doc.text(`Client Name: ${client.name}`, 10, 20);
        doc.text(`Email: ${client.email}`, 10, 30);
        doc.text(`Plan: ${client.plan}`, 10, 40);
        doc.text(`Renewal Date: ${client.renewalDate}`, 10, 50);
        doc.text(`Invoice Date: ${history.date}`, 10, 60);
        doc.text(`Amount: $${history.amount.toFixed(2)}`, 10, 70);
        doc.text(`Status: ${history.status}`, 10, 80);
        doc.save(`${history.invoiceId}.pdf`);
    };

    const handleSubmit = (client: ClientData) => {
        const newInvoice: BillingHistory = {
            date: invoiceDate,
            amount: subtotal,
            status: paymentStatus,
            invoiceId: invoiceDropdown,
        };

        const updatedClient = { ...client };
        updatedClient.billingHistory.push(newInvoice);

        setClients(prevState =>
            prevState.map(client =>
                client.id === updatedClient.id ? updatedClient : client
            )
        );

        setInvoiceDate('');
        setPaymentStatus('Paid');
        setInvoiceDropdown('');
        setSubtotal(0);
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className={styles.adminDashboard}>
            <div className={styles.clientTable}>
                <div className={styles.fromHeader}>
                    <label>Bill raise system</label>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (clients.length > 0) handleSubmit(clients[0]);
                    }}
                    className={styles.form}
                >
                    <div className={styles.formGroup}>
                        <label>Invoice Date</label>
                        <input
                            type="date"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Payment Status</label>
                        <select
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                            required
                            className={styles.selectField}
                        >
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Invoice ID</label>
                        <input
                            type="text"
                            value={invoiceDropdown}
                            onChange={(e) => setInvoiceDropdown(e.target.value)}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Subtotal</label>
                        <input
                            type="number"
                            value={isNaN(subtotal) ? 0 : subtotal}
                            onChange={(e) => setSubtotal(parseFloat(e.target.value) || 0)}
                            required
                            className={styles.inputField}
                        />
                    </div>

                    <button type="submit" className={styles.button}>
                        Bill raise
                    </button>
                </form>
            </div>
            <div className={styles.clientTable}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Client ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Plan</th>
                            <th>Renewal Date</th>
                            <th>Billing History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients?.map((client, id) => (
                            <tr key={id}>
                                <td>{client.id}</td>
                                <td>{client.name}</td>
                                <td>{client.email}</td>
                                <td>{client.plan}</td>
                                <td>{client.renewalDate}</td>
                                <td>
                                    <table className={styles.billingTable}>
                                        <thead>
                                            <tr>
                                                <th>Invoice ID</th>
                                                <th>Invoice Date</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {client?.billingHistory?.map((history, index) => (
                                                <tr key={index}>
                                                    <td>{history.invoiceId}</td>
                                                    <td>{history.date}</td>
                                                    <td>${history.amount?.toFixed(2)}</td>
                                                    <td>{history.status}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => downloadInvoice(client, history)}
                                                            className={styles.downloadButton}
                                                        >
                                                            Download
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default ManagePayments;

