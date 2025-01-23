

# 🎉 **Event Management Platform**

A powerful and intuitive platform to simplify event planning, attendee management, ticketing, and performance tracking. 

---

## 🚀 **Overview**

The **Event Management Platform** is your one-stop solution for organizing events of all scales. Whether you're hosting a small gathering or a large conference, this platform helps streamline every step, from scheduling to analytics.  

---

## ✨ **Features**

- **User Authentication**  
   Allow users to register and log in. Option for "Guest Login" to access limited features.  
   
- **Event Dashboard**  
   Display a list of upcoming and past events with filters for categories and dates.  

- **Event Creation**  
   A form to create an event with fields like event name, description, date/time, and more.  

- **Real-Time Attendee List**  
   Show the number of attendees for each event in real-time.  

- **Responsive Design**  
   Ensure the platform works seamlessly on all devices.   

---

## 🛠️ **Installation Guide**

### **Prerequisites**
Before setting up the platform, ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm (Node Package Manager)](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

---

### **Setup Instructions**

1. **Clone the Repository**  
   Open your terminal and run:  
   ```sh
   git clone https://github.com/hack-09/event-management-platform.git
   ```

2. **Navigate to the Project Directory**  
   ```sh
   cd event-management-platform
   ```

3. **Install Dependencies**  
   Navigate to both the `backend` and `frontend` directories and install the required packages:  
   ```sh
   cd backend
   npm install
   cd frontend
   npm install
   ```

4. **Configure Environment Variables**  
   Create a `.env` file in the root directory (next to `backend` and `frontend`) and add the following:  
   ```plaintext
   MONGODB_URI=your_mongodb_uri
   PORT=your_port
   ```

---

## 🎯 **Code Execution**

### **Backend**  
1. Navigate into the `backend` folder:  
   ```sh
   cd backend
   ```
2. Start the backend server using `nodemon`:  
   ```sh
   npx nodemon server.js
   ```
3. The backend should now be running at `http://localhost:your_port` (check your `.env` file for the port).

---

### **Frontend**  
1. Navigate into the `frontend` folder:  
   ```sh
   cd frontend
   ```
2. Start the frontend development server:  
   ```sh
   npm start
   ```
3. Your frontend should now be accessible at `http://localhost:3000` (default React app port).

---

## 🎯 **Usage Guide**

1. **User Registration**:  
   Register a new account or log in with existing credentials.  

2. **Event Management**:  
   Create, edit, and manage your events directly from the user-friendly dashboard.  

3. **Analytics Dashboard**:  
   Monitor event performance and generate reports to track success.

---

## 🤝 **Contributing**

We appreciate contributions to make this platform even better!  

### **Steps to Contribute**  
1. Fork the repository.  
2. Create a feature branch:  
   ```sh
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:  
   ```sh
   git commit -m 'Add some feature'
   ```
4. Push your branch:  
   ```sh
   git push origin feature/your-feature-name
   ```
5. Open a pull request.  

---

## 🛡️ **License**

This project is licensed under the [MIT License](LICENSE).  

---

## 📬 **Contact**

For queries, suggestions, or feedback, reach out to us:  
📧 [priyanshukumar9780@gmail.com](mailto:priyanshukumar9780@gmail.com)  

---

## 🌟 **Live Demo**  
🔗 Check out the live deployment here: [Event Management Platform](https://event-management-platform-beta.vercel.app/)  

---

## 📷 **Screenshots**

### 🎨 **Dashboard View**  
*Manage all your events from a single, clean dashboard!*  
![Dashboard Screenshot](https://github.com/user-attachments/assets/6a445033-b88b-4d31-88d6-5817535bbb8f)


### 📅 **Event Creation Page**  
*Create events with customizable options.*  
![Event Creation Screenshot](https://github.com/user-attachments/assets/57fc392d-5004-479d-a153-141f9b477663)
