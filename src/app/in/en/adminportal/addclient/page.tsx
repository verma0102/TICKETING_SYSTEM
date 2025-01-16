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
  contact: number;
  state: string;
  panNo: string;
}

const Page = () => {
  const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
    'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ]
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    serviceType: "",
    domain: "",
    saasProductName: "",
    cinNumber: "",
    gst: "",
    address: "",
    contact: "",
    state: "",
    panNo: ""
  });
  const [clients, setClients] = useState([]);

  const [errors, setErrors] = useState({
    cinNumber: "",
    contact: "",
    panNo: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { cinNumber: "", contact: "", panNo: "" };
    if (!/^[A-Za-z0-9]{21}$/.test(formData.cinNumber)) {
      newErrors.cinNumber = "CIN Number must be exactly 21 alphanumeric characters.";
      isValid = false;
    }
    if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact must be a valid 10-digit number.";
      isValid = false;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo)) {
      newErrors.panNo = "PAN Number must be 10 characters: 5 letters, 4 digits, and 1 letter.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res = await fetch("/api/v1/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
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
          contact: "",
          state: "",
          panNo: ""
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
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div>
      <div className={styles.Container}>
        <h1 className={styles.heading}>Add/Edit Client</h1>
        <form className={styles.Form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <div className={styles.formGrid}>
              <div className={styles.formItem}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formItem}>
                <label htmlFor="companyName">CompanyName</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formItem}>
                <label htmlFor="contact">Contact</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                />
                {errors.contact && (
                  <div className={styles.error}>{errors.contact}</div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.formGrid}>
              <div className={styles.formItem}>
                <label htmlFor="cinNumber">CinNumber</label>
                <input
                  type="text"
                  id="cinNumber"
                  name="cinNumber"
                  value={formData.cinNumber}
                  onChange={handleInputChange}
                  required
                />
                {errors.cinNumber && (
                  <div className={styles.error}>{errors.cinNumber}</div>
                )}
              </div>

              <div className={styles.formItem}>
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

              <div className={styles.formItem}>
                <label htmlFor="state">Select State</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                >
                  <option value="none">Select State</option>
                  {
                    states?.map((state, index) => (
                      <option key={index} value={state}>{state}</option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.formGrid}>
              <div className={styles.formItem}>
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

              <div className={styles.formItem}>
                <label htmlFor="panNo">PanNo</label>
                <input
                  type="text"
                  id="panNo"
                  name="panNo"
                  value={formData.panNo}
                  onChange={handleInputChange}
                  required
                />
                {errors.panNo && (
                  <div className={styles.error}>{errors.panNo}</div>
                )}
              </div>

              <div className={styles.formItem}>
                <label htmlFor="serviceType">Service Type</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="none">Select Service Type</option>
                  <option value="webApp">Web Application</option>
                  <option value="saasProduct">SaaS Product</option>
                </select>
              </div>
            </div>
          </div>

          {formData.serviceType === "webApp" && (
            <div className={styles.formItem}>
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
            <div className={styles.formItem}>
              <label htmlFor="saasProductName">Select SaaS Product</label>
              <select
                id="saasProductName"
                name="saasProductName"
                value={formData.saasProductName}
                onChange={handleInputChange}
                required
              >
                <option value="none">Select SaaS Option</option>
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
      <div className={styles.tableContainer}>
        <h2 className={styles.heading}>Clients List</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>CompanyName</th>
              <th>Service Type</th>
              <th>Domain</th>
              <th>SaaS Product</th>
              <th>CinNumber</th>
              <th>ContactNo</th>
              <th>Address</th>
              <th>Gst</th>
              <th>State</th>
              <th>PanNo</th>
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
                <td>{client.contact}</td>
                <td>{client.address || "N/A"}</td>
                <td>{client.gst || "N/A"}</td>
                <td>{client.state}</td>
                <td>{client.panNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Page;
