from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd


app = Flask(__name__, static_folder='../front-end', static_url_path='/front-end')

# ✅ Allow CORS for frontend on port 5500
CORS(app, resources={r"/predict": {"origins": "http://127.0.0.1:5500"}})

# Load model
model = joblib.load("podium_model.pkl")

def predict_podium_probability(circuit, fp1_time, fp2_time, fp3_time, quali_time):
    """
    Predict podium probability for a driver with given lap times
    
    Parameters:
    circuit (str): Circuit name (e.g., 'Budapest', 'Monaco', etc.)
    fp1_time (float): FP1 lap time in seconds
    fp2_time (float): FP2 lap time in seconds  
    fp3_time (float): FP3 lap time in seconds
    quali_time (float): Qualifying lap time in seconds
    
    Returns:
    float: Probability of podium finish (0-1)
    """
    # Create input data
    input_data = pd.DataFrame({
        'circuit': [circuit],
        'fp1_time': [fp1_time],
        'fp2_time': [fp2_time],
        'fp3_time': [fp3_time], 
        'quali_time': [quali_time],
        'fp2_minus_fp1': [fp2_time - fp1_time],
        'fp3_minus_fp2': [fp3_time - fp2_time]
    })
    
    # Apply same preprocessing as training
    input_processed = pd.get_dummies(input_data, columns=['circuit'])
    
    # Add missing circuit columns
    for col in model.feature_names_in_:
        if col not in input_processed.columns:
            input_processed[col] = 0
    
    # Reorder to match training data
    input_processed = input_processed[model.feature_names_in_]
    
    # Make prediction
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
            fp1 = d.get('fp1')
            fp2 = d.get('fp2')
            fp3 = d.get('fp3')
            quali = d.get('quali')

            if None in (circuit, fp1, fp2, fp3, quali):
                return jsonify({'error': 'Missing inputs for one or more drivers'}), 400

            # Use the function
            podium_prob = predict_podium_probability(circuit, fp1, fp2, fp3, quali)
            driver_prediction = {"Driver Name": d.get("driverName"),
            'Podium Probability': float(podium_prob)}
            predictions.append(driver_prediction)

        return jsonify({'predictions': predictions})

    except Exception as e:
        print("❗ INTERNAL SERVER ERROR:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
