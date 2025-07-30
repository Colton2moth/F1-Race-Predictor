# 🏎️ F1 Race Predictor

This project predicts F1 podium outcomes based on free practice and qualifying lap times. It features a front-end form and a Flask-powered backend API using a pre-trained machine learning model (`podium_model.pkl`).

---

## 📁 Project Structure

```
F1-Race-Predictor/
├── back-end-bridge/
│   ├── app.py
│   ├── podium_model.pkl
│   └── (venv/)
├── front-end/
│   ├── HTML/
│   │   └── index.html
│   ├── JS/
│   │   └── script.js
│   └── CSS/
│       └── styles.css
└── README.md
```

---

## ⚙️ Setup Guide

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/F1-Race-Predictor.git
cd F1-Race-Predictor
```

---

### 2. Backend Setup (Flask + Model)

#### Step 1: Create a Virtual Environment (only need to do once)

```bash
cd back-end-bridge
python -m venv venv
```

#### Step 2: Activate the Virtual Environment

**Windows PowerShell**
```bash
cd ..
.\venv\Scripts\Activate.ps1
```

#### Step 3: Install Required Packages

Make sure your venv is active and run:

```bash
pip install pandas numpy flask flask-cors joblib scikit-learn
```

---

#### Step 4: Run the Flask Backend

```bash
cd back-end-bridge
python app.py

```

Right click index.html, opening it directly, and you'll see the website

---

## 🧠 Backend API Route

### `POST /predict`

- **URL:** `http://127.0.0.1:5000/predict`
- **Payload:**

```json
{
  "circuit": "Monaco",
  "fp1": 82.123,
  "fp2": 81.456,
  "fp3": 80.891,
  "quali": 79.874
}
```

- **Response:**

```json
{
  "prediction": 1
}
```

---

## 🌐 Frontend Setup

### How to Use

1. Open the HTML file in your browser:
   ```
   front-end/HTML/index.html
   ```

2. Fill in the form and hit "Predict".

> ⚠️ Make sure your backend Flask server is running before submitting the form.

---

## 🧼 Tips

- If `pip` breaks inside the venv:
```bash
python -m ensurepip --upgrade
```

- If you get errors about `sklearn`:
```bash
pip install scikit-learn
```

- To deactivate the virtual environment:
```bash
deactivate
```

---

## 👤 Author

Created by Gwantana Kiboigo
