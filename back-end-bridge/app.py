# back-end-bridge/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)

origins_csv = os.getenv("FRONTEND_ORIGINS", "").split(",")
ALLOWED_ORIGINS = [o.strip() for o in origins_csv if o.strip()]
CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}})

@app.get("/")
def health():
    return {"ok": True}, 200

# Load model (file sits next to app.py)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "podium_model.pkl")
model = joblib.load(MODEL_PATH)

def predict_podium_probability(circuit, fp1_time, fp2_time, fp3_time, quali_time):
    input_data = pd.DataFrame({
        'circuit': [circuit],
        'fp1_time': [fp1_time],
        'fp2_time': [fp2_time],
        'fp3_time': [fp3_time],
        'quali_time': [quali_time],
        'fp2_minus_fp1': [fp2_time - fp1_time],
        'fp3_minus_fp2': [fp3_time - fp2_time]
    })

    input_processed = pd.get_dummies(input_data, columns=['circuit'])

    for col in model.feature_names_in_:
        if col not in input_processed.columns:
            input_processed[col] = 0

    input_processed = input_processed[model.feature_names_in_]
    prob = model.predict_proba(input_processed)[0][1]
    return prob

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        drivers = data.get('drivers')
        if not drivers or not isinstance(drivers, list):
            return jsonify({'error': 'Missing or invalid driver list'}), 400

        predictions = []
        for d in drivers:
            circuit = d.get('circuit')
            fp1 = d.get('fp1'); fp2 = d.get('fp2'); fp3 = d.get('fp3'); quali = d.get('quali')
            if None in (circuit, fp1, fp2, fp3, quali):
                return jsonify({'error': 'Missing inputs for one or more drivers'}), 400

            podium_prob = predict_podium_probability(circuit, fp1, fp2, fp3, quali)
            predictions.append({
                "Driver Name": d.get("driverName"),
                "Podium Probability": round(float(podium_prob) * 100, 2)
            })

        return jsonify({'predictions': predictions})
    except Exception as e:
        print("❗ INTERNAL SERVER ERROR:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    # Local dev only. On Render you'll use gunicorn.
    app.run(host="0.0.0.0", port=8080, debug=False)
