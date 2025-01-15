"use client";
import { useState, useEffect } from "react";
import styles from "./AddClientForm.module.css";

interface Client {
  email: string;
  companyName: string;
  serviceType: string;
  domain?: string;
  saasProductName?: string;
  cinNumber: string;
  gst: number;
  address: string;
}
const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    serviceType: "",
    domain: "",
    saasProductName: "",
    cinNumber: "",
    gst: "",
    address: "",
  });

  const [clients, setClients] = useState([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log('formData:', formData);
      if (res.ok) {
        fetchClients();
        setFormData({
          email: "",
          companyName: "",
          serviceType: "",
          domain: "",
          saasProductName: "",
          cinNumber: "",
          gst: "",
          address: "",
        });
      } else {
        const errorData = await res.json();
        console.log('Data error-', errorData);
        console.error("Failed to add client");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/v1/client");
      const data = await res.json();
      setClients(data); // Populate the client state with fetched data
      console.log('data:', data);

    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients(); // Fetch clients on component mount
  }, []);

  return (
    <div>
      <div className={styles.Container}>
        <h1 className={styles.heading}>Add/Edit Client</h1>
        <form className={styles.Form} onSubmit={handleSubmit}>


          <div className={styles.formGroup}>
            <div className={styles.formGrid}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>



          <div className={styles.formGroup}>
            <label htmlFor="cinNumber">cinNumber</label>
            <input
              type="text"
              id="cinNumber"
              name="cinNumber"
              value={formData.cinNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gst">GST</label>
            <input
              type="number"
              id="gst"
              name="gst"
              value={formData.gst}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="serviceType">Service Type</label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Service Type</option>
              <option value="webApp">Web Application</option>
              <option value="saasProduct">SaaS Product</option>
            </select>
          </div>
          {formData.serviceType === "webApp" && (
            <div className={styles.formGroup}>
              <label htmlFor="domain">Domain</label>
              <input
                type="text"
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          {formData.serviceType === "saasProduct" && (
            <div className={styles.formGroup}>
              <label htmlFor="saasProductName">Select SaaS Product</label>
              <select
                id="saasProductName"
                name="saasProductName"
                value={formData.saasProductName}
                onChange={handleInputChange}
                required
              >
                <option value="">Select SaaS Option</option>
                <option value="ghg">GHG</option>
                <option value="brsr">BRSR</option>
              </select>
            </div>
          )}

          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>


      </div>
      {/* Display clients in a table */}
      <div className={styles.tableContainer}>
        <h2>Clients List</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Company Name</th>
              <th>Service Type</th>
              <th>Domain</th>
              <th>SaaS Product</th>
              <th>Address</th>
              <th>cinNumber</th>
              <th>Gst</th>
            </tr>
          </thead>
          <tbody>
            {clients?.map((client: Client, index: number) => (
              <tr key={index}>
                <td>{client.email}</td>
                <td>{client.companyName}</td>
                <td>{client.serviceType}</td>
                <td>{client.domain || "N/A"}</td>
                <td>{client.saasProductName || "N/A"}</td>
                <td>{client.cinNumber || "N/A"}</td>
                <td>{client.gst || "N/A"}</td>
                <td>{client.address || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
