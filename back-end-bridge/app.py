import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load your trained model
model = joblib.load("podium_model.pkl")  # adjust name if needed


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Raw inputs
    circuit = data.get('circuit')  # string
    fp1 = data.get('fp1')
    fp2 = data.get('fp2')
    fp3 = data.get('fp3')
    quali = data.get('quali')

    # Validate
    if None in (circuit, fp1, fp2, fp3, quali):
        return jsonify({'error': 'Missing inputs'}), 400

    # Derived features
    fp2_minus_fp1 = fp2 - fp1
    fp3_minus_fp2 = fp3 - fp2

    # Create DataFrame
    input_df = pd.DataFrame([{
        'circuit': circuit,
        'fp1_time': fp1,
        'fp2_time': fp2,
        'fp3_time': fp3,
        'quali_time': quali,
        'fp2_minus_fp1': fp2_minus_fp1,
        'fp3_minus_fp2': fp3_minus_fp2
    }])

    # Match training encoding
    input_df = pd.get_dummies(input_df)
    
    # Align columns with training set
    for col in model.feature_names_in_:
        if col not in input_df.columns:
            input_df[col] = 0  # add missing dummy columns

    input_df = input_df[model.feature_names_in_]  # order correctly

    # Predict
    pred = int(model.predict(input_df)[0])
    return jsonify({'prediction': pred})


if __name__ == "__main__":
    app.run(debug=True)
