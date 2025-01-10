'use client';
import React, { useEffect, useState } from 'react';
import styles from './managePayments.module.css';
import { IBilling, BillingHistory } from "@/mongodb/schemas/billingSchema";
import { jsPDF } from 'jspdf';

const ManagePayments: React.FC = () => {
    const [clients, setClients] = useState<IBilling[]>([]);
    const [email, setEmail] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [subtotal, setSubtotal] = useState<number>(0);
    const [billingHistory, setBillingHistory] = useState<BillingHistory>({
        date: new Date(),
        amount: 0,
        message: '',
        dueDate: new Date(),
    });


    const fetchClients = async () => {
        try {
            const res = await fetch('/api/v1/client');
            if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
            const data = await res.json();
            const formattedData = data.map((client: any) => ({
                ...client,
                billingHistory: Array.isArray(client.billingHistory) ? client.billingHistory : [],
            }));
            setClients(formattedData);
        } catch (error) {
            console.error('Error fetching clients:', error);
            alert('Failed to fetch client data. Please try again later.');
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const downloadInvoice = (client: IBilling, history: BillingHistory) => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text(`Client Email: ${client.email}`, 10, 20);
        doc.text(`Date: ${history.date}`, 10, 70);
        doc.text(`Amount: $${history.amount.toFixed(2)}`, 10, 80);
        doc.text(`Message: ${history.message}`, 10, 90);
        // doc.save(`${history.invoiceId}.pdf`);
    };


    // const handleSubmit = async (event: React.FormEvent) => {
    //     event.preventDefault();
    //     try {
    //         const response = await fetch('/api/v1/billing', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },

    //             body: JSON.stringify({
    //                 email,
    //                 billingHistory,
    //             }),
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             console.error(errorData.error || 'Unknown error occurred');
    //             return;
    //         }

    //         const data = await response.json();
    //         console.log('Billing record created:', data);
    //     } catch (error) {
    //         console.error('Error submitting billing:', error);
    //     }
    // };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!email || !billingHistory.amount || !billingHistory.message) {
            console.log('Please fill in all required fields.');
            return;
        }

        try {
            const response = await fetch('/api/v1/billing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    billingHistory,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // setError(errorData.error || 'An unknown error occurred.');
                console.log('errorData', errorData);

                return;
            }

            const data = await response.json();
            // setSuccess('Billing record created successfully!');
            console.log('Billing record created:', data);
        } catch (error) {
            console.error('Error submitting billing:', error);
            // setError('Failed to submit billing data.');
        }
    };


    return (
        <div className={styles.adminDashboard}>
            <div className={styles.clientTable}>
                <div className={styles.fromHeader}>
                    <label>Bill Raise System</label>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Select Email</label>
                        <select
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.selectField}
                        >
                            <option value="none" disabled>Select Email</option>
                            {clients.map((client) => (
                                <option key={`${client.id}-${client.email}`} value={client.email}>
                                    {client.email}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>DueDate</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className={styles.inputField}
                            rows={2}
                            placeholder="Enter your message here"
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
                        Bill Raise
                    </button>
                </form>
            </div>

            <div className={styles.clientTable}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Domain</th>
                            <th>Product</th>
                            <th>Billing History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client, id) => (
                            <tr key={id}>
                                <td>{client.email}</td>
                                <td>{client.roles.join(', ')}</td>
                                <td>{client.domain}</td>
                                <td>{client.saasProductName}</td>
                                <td>
                                    <table className={styles.billingTable}>
                                        <thead>
                                            <tr>
                                                <th>dueDate</th>
                                                <th>Amount</th>
                                                <th>Message</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {client.billingHistory.length > 0 ? (
                                                client.billingHistory.map((history, index) => (
                                                    <tr key={index}>
                                                        {/* <td>{history.dueDate}</td> */}
                                                        <td>${history.amount.toFixed(2)}</td>
                                                        <td>{history.message}</td>
                                                        <td>
                                                            <button
                                                                onClick={() => downloadInvoice(client, history)}
                                                                className={styles.downloadButton}
                                                            >
                                                                Download
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4}>No billing history available</td>
                                                </tr>
                                            )}
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


