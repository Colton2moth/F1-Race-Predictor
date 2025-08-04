from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# Setup Flask and the corresponding static static folder
app = Flask(__name__, static_folder='../front-end', static_url_path='/front-end')
CORS(app)

# Load trained model
model = joblib.load("podium_model.pkl")

# Tells FLASK to run, predict(), when a, POST, request is sent to, /predict
@app.route('/predict', methods=['POST']) 
def predict():
    data = request.get_json()

    # Expecting a list of driver objects
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
            return jsonify({"⚠️ Error: Missing inputs for one or more drivers"}), 400

        row = {
            'circuit': circuit,
            'fp1_time': fp1,
            'fp2_time': fp2,
            'fp3_time': fp3,
            'quali_time': quali,
            'fp2_minus_fp1': fp2 - fp1,
            'fp3_minus_fp2': fp3 - fp2
        }
        rows.append(row)

    input_df = pd.DataFrame(rows)
    input_df = pd.get_dummies(input_df)

    for col in model.feature_names_in_:
        if col not in input_df.columns:
            input_df[col] = 0

    input_df = input_df[model.feature_names_in_]

    preds = model.predict(input_df)
    return jsonify({'predictions': preds.tolist()})


if __name__ == "__main__":
    app.run(debug=True)
