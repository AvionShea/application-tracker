## 📋 <a name="table">Table of Contents</a>

1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Current Features](#current-features)
5. [Future Implementations](#future-implementation)
6. [Quick Start](#quick-start)
7. [More](#more)

---

## <a name="introduction">Introduction</a>

This Job Tracker is a simple and effective web application that allows users to manage their internship and full-time job applications. Users can add new applications, update their status and interview stage using dropdowns.

Ideal for job seekers looking to stay organized while job hunting, this app is beginner-friendly and built with core frontend technologies.

---

## <a name="tech-stack">Tech Stack</a>

- HTML
- CSS
- JavaScript (Vanilla)

---

## <a name="features">Features</a>

👉 **Track Applications**: Add details like company, role, date applied, location, and more.  
👉 **Update Status**: Use dropdowns to easily change the status or interview stage of any saved application.  
👉 **Edit or Delete Entries**: Manage or remove saved entries easily.

---

## <a name="current-feature">Current Features</a>

| Feature           | Description                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| Dropdown Editing  | Application status and interview stage fields are editable dropdowns within the saved table rows. |
| PATCH-like Update | Only the changed fields are updated without rewriting the entire entry.                           |

## <a name="future-implementation">Future Implementations</a>

| Feature                 | Description                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Local Storage           | Application data is persisted across browser sessions using `localStorage`.                                                                                                                            |
| Clean UI with Bootstrap | Basic design is handled with Bootstrap for quick responsiveness and aesthetics.                                                                                                                        |
| Sort by Date/Status     | Enables users to organize applications in ascending or descending order based on the date applied or current status. This helps prioritize follow-ups and track application progress more efficiently. |
| Export to Excel/CSV     | Allows users to export their job application data into an Excel or CSV file format for offline access, advanced filtering, or external reporting. Useful for backup and sharing purposes.              |

---

## <a name="quick-start">Quick Start</a>

### **Prerequisites**

npm install express pg body-parser dotenv

### **Clone the Repo**

```bash
git clone https://github.com/AvionShea/application-tracker.git
cd application-tracker
```

### **Configure Environment Variables (.env)**

Create a new file named `.env` in the root of your project and add the following content:

```env
#POSTGRES
POSTGRES_DB_PW =;
POSTGRES_DB_NAME =;
```
