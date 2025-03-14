
# 🎉 **Eventify** 🎉

**A Powerful and Intuitive Platform to Simplify Event Planning, Attendee Management, Ticketing, and Performance Tracking**  

---

## 🚀 **Overview**  

The **Event Management Platform** is your **one-stop solution** for organizing events of all scales. Whether you're hosting a small gathering or a large conference, this platform helps **streamline every step**, from scheduling to analytics.  

---

## ✨ **Key Features**  

### 🔐 **User Authentication**  
- Allow users to register and log in securely.  
- Option for **"Guest Login"** to access limited features.  

### 📊 **Event Dashboard**  
- Display a **list of upcoming and past events** with filters for categories and dates.  
- **Real-time updates** for event status and attendee counts.  

### 🎟️ **Event Creation**  
- A **user-friendly form** to create events with fields like:  
  - Event Name  
  - Description  
  - Date & Time  
  - Category  
  - Event Poster  

### 👥 **Real-Time Attendee List**  
- Show the **number of attendees** for each event in real-time.  
- Export attendee lists for further analysis.  

### 📱 **Responsive Design**  
- Ensure the platform works **seamlessly on all devices** (desktop, tablet, and mobile).  

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

1. **User Registration**  
   Register a new account or log in with existing credentials.  

2. **Event Management**  
   Create, edit, and manage your events directly from the **user-friendly dashboard**.  

3. **Analytics Dashboard**  
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
![Dashboard Screenshot](https://github.com/user-attachments/assets/ac28b19c-2afe-4a6d-9c0e-c445d9c6c958)


### 📅 **Event Deatil Page**  
*Detailed information of event.*  
![Event Detail](https://github.com/user-attachments/assets/4bd9112e-369b-4bb2-b45b-a61074b6be4c)


### 📅 **Event Creation Page**  
*Create events with customizable options.*  
![Event Creation Screenshot](https://github.com/user-attachments/assets/57fc392d-5004-479d-a153-141f9b477663)  

---

### 🎉 **Why Choose Us?**  
- **Ease of Use**: Intuitive interface for seamless event management.  
- **Scalability**: Perfect for events of all sizes.  
- **Real-Time Analytics**: Track event performance effortlessly.  
- **Open Source**: Contribute and customize as per your needs!  

---

Let’s make event management **smarter, faster, and more efficient**! 🚀  
