'use client';
import React, { useEffect, useState } from 'react';
import styles from './managePayments.module.css';
import { IBilling } from "@/mongodb/schemas/billingSchema";

const ManagePayments: React.FC = () => {
    const [emails, setEmails] = useState<string[]>([]);
    const [companyName, setCompanyName] = useState<string>('');
    const [subtotal, setSubtotal] = useState<number>(0);
    const [billingRecords, setBillingRecords] = useState<IBilling[]>([]);

    const fetchClients = async () => {
        try {
            const res = await fetch("/api/v1/client");
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data: IBilling[] = await res.json();
            const clientCompanyName = data?.map((client) => client.companyName);
            setEmails(clientCompanyName);
        } catch (error) {
            console.error("Error fetching clients:", error);
            setEmails([]);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/v1/billing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companyName,
                    amount: subtotal,
                    date: new Date().toISOString(),
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to raise a bill.");
            }
            const billingData = await response.json();
            setBillingRecords((prev) => [...prev, billingData]);
            console.log("Created Billing Record:", billingData);
            setCompanyName('');
            setSubtotal(0);
        } catch (error: any) {
            console.error("Error raising bill:", error.message);

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
                        <label>Select CompanyName</label>
                        <select
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                            className={styles.selectField}
                        >
                            <option value="none" disabled>Select companyName</option>
                            {emails.map((companyName) => (
                                <option key={companyName} value={companyName}>
                                    {companyName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Subtotal</label>
                        <input
                            type="number"
                            value={subtotal}
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
                            <th>companyName</th>
                            <th>Subtotal</th>

                        </tr>
                    </thead>
                    <tbody>
                        {billingRecords?.map((record, item) => (
                            <tr key={item}>
                                <td>{record.companyName}</td>
                                <td>{record.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagePayments;


