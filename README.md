<p align="center">
\________________\_______/_______________/
<p align="center">
|⭕️⭕️\__ F1 Race Predictor __/⭕️⭕️|

---

This project predicts F1 podium outcomes using driver performance data from free practice and qualifying sessions. The app features:

- A dynamic web interface built with modular HTML, CSS, and JS
- A Flask backend serving predictions from a scikit-learn/XGBoost model, trained on F1 session data. The model calculates podium finish probabilities using Free Practice and Qualifying performance trends.
- Clean design and modular file separation for easy scalability

---

## 🧰 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla), Live Server
- **Backend**: Python, Flask, Flask-CORS
- **Machine Learning**: scikit-learn, XGBoost, pandas, numpy
- **Data Formats**: Parquet
- **Testing**: Jupyter Notebook (for backend API)

---

## 📁 Project Structure

```
F1-Race-Predictor/
├── back-end-bridge/          # Flask backend and ML model
│   ├── app.py
│   ├── force_wrap.py
│   ├── podium_model.pkl
│   ├── venv/                 # Virtual environment
├── cache/                    # (Optional) model caching
├── data/                     # Parquet files for input/output
│   ├── raw.parquet
│   ├── processed.parquet
├── front-end/                # Front-end files (HTML/CSS/JS)
│   ├── CSS/
│   ├── JS/
│   ├── HTML/
│   └── fonts/
├── other/                    # Images/icons
│   ├── F1.svg.png
│   └── racecar_clipart.png
├── src/                      # ML training and preprocessing
│   ├── data_aquisition.py
│   ├── model_training.ipynb
│   ├── preprocessing.ipynb
│   └── utils.py
├── testing/
│   └── apiTests.ipynb
├── requirements.txt
├── README.md
└── main.py
```

---

## ⚙️ Setup Instructions

### 🔧 Clone the Project

```bash
git clone https://github.com/your-username/F1-Race-Predictor.git
cd F1-Race-Predictor
```

---

### 🧠 Backend Setup (Flask + ML Model)

#### 1. Create a Virtual Environment

```bash
cd back-end-bridge
python -m venv venv
```

#### 2. Activate the Environment

**Windows (PowerShell):**
```bash
.
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

#### 3. Install Required Packages

```bash
pip install -r ../requirements.txt
```

(If no `requirements.txt`, use this instead:)

```bash
pip install flask flask-cors fastf1 pandas numpy scikit-learn matplotlib xgboost
```

#### 4. Run the Flask Backend

```bash
python app.py
```

---

### Backend Quick Setup (Ctrl C + Ctrl V)

> ⚠️ Note: This quick-setup block assumes a Windows environment and may need minor tweaks for other platforms. Use at your own discretion.

```bash
cd back-end-bridge
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r ../requirements.txt
python app.py
```

### 🌐 Frontend Setup

#### Option 1: Manual (No extensions needed)

You can manually open the UI by double-clicking the following file:

```bash
front-end/HTML/index.html
```

This opens the static HTML in your browser. Make sure the backend is already running.

---

#### Option 2: Using Live Server (Recommended for Development)

1. Install the **Live Server** extension in VS Code  
2. Right-click `index.html` → **Open with Live Server**
3. The app will open in your browser (usually at `http://127.0.0.1:5500`)

> ⚠️ Ensure your Flask backend is running at `http://127.0.0.1:5000` for predictions to work.

---

## 📡 API Endpoint

### `POST /predict`

- **URL:** `http://127.0.0.1:5000/predict`
- **Payload:**

```json
{
  "drivers": [
    {
      "driverName": "Yuki Tsunoda",
      "circuit": "Monaco",
      "fp1": 82.123,
      "fp2": 81.456,
      "fp3": 80.891,
      "quali": 79.874
    },
    {
      "driverName": "Oscar Piastri",
      "circuit": "Monaco",
      "fp1": 82.123,
      "fp2": 81.456,
      "fp3": 80.891,
      "quali": 79.874
    },
    {
      "driverName": "Lance Stroll",
      "circuit": "Monaco",
      "fp1": 82.123,
      "fp2": 81.456,
      "fp3": 80.891,
      "quali": 79.874
    }
  ]
}

```

- **Response:**

```json
{
  "predictions": [
    {
      "Driver Name": "Yuki Tsunoda",
      "Podium Probability": 0.25594621896743774
    },
    {
      "Driver Name": "Oscar Piastri",
      "Podium Probability": 0.25594621896743774
    },
    {
      "Driver Name": "Lance Stroll",
      "Podium Probability": 0.25594621896743774
    }
  ]
}

```

---

## 💡 Features

- Dynamic, multi-driver form injection
- Styled UI with modular CSS (driver forms, buttons, etc.)
- Smooth animations and visual feedback
- Backend prediction using `.pkl` model

---

## 🧪 Testing

- Backend API tested using `apiTests.ipynb` notebook
- Model training & preprocessing available in `src/`

---

## 🧠 Model Training (safe to ignore)

The podium prediction model was trained using historical driver data and lap times across multiple F1 circuits. To retrain or modify the model:

1. Open `src/model_training.ipynb`
2. Preprocess with `preprocessing.ipynb`
3. Export the model as `podium_model.pkl`

> The model uses a gradient boosting classifier (XGBoost) trained on delta timings (FP2–FP1, FP3–FP2) and qualifying performance.

---

## 🧼 Troubleshooting

- **Virtual environment issues:**  
  Run `python -m ensurepip --upgrade`

- **Backend errors (e.g., `sklearn`):**  
  Run `pip install scikit-learn`

- **Deactivate environment:**  
  `deactivate`

---

## 👥 Authors

Created by **[Colton Tumoth](https://github.com/Colton2moth)** & **[Gwantana Kiboigo](https://github.com/gwan-kib)**  
> Contact us for questions, suggestions, or if you're interested in contributing.

---

## 📝 Licenses(s)
