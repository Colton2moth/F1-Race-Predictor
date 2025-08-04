from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__, static_folder='../front-end', static_url_path='/front-end')

# ✅ Allow CORS for frontend on port 5500
CORS(app, resources={r"/predict": {"origins": "http://127.0.0.1:5500"}})

# Load model
model = joblib.load("podium_model.pkl")

@app.route('/predict', methods=['POST']) 
def predict():
    try:
        data = request.get_json()

        drivers = data.get('drivers')
        if not drivers or not isinstance(drivers, list):
            return jsonify({'error': 'Missing or invalid driver list'}), 400

        rows = []
        for d in drivers:
            circuit = d.get('circuit')
            fp1 = d.get('fp1')
            fp2 = d.get('fp2')
            fp3 = d.get('fp3')
            quali = d.get('quali')

            if None in (circuit, fp1, fp2, fp3, quali):
                return jsonify({'error': 'Missing inputs for one or more drivers'}), 400

            rows.append({
                'circuit': circuit,
                'fp1_time': fp1,
                'fp2_time': fp2,
                'fp3_time': fp3,
                'quali_time': quali,
                'fp2_minus_fp1': fp2 - fp1,
                'fp3_minus_fp2': fp3 - fp2
            })

        input_df = pd.DataFrame(rows)
        input_df = pd.get_dummies(input_df)

        for col in model.feature_names_in_:
            if col not in input_df.columns:
                input_df[col] = 0

        input_df = input_df[model.feature_names_in_]
        preds = model.predict(input_df)

        return jsonify({'predictions': preds.tolist()})

    except Exception as e:
        print("❗ INTERNAL SERVER ERROR:", e)
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
