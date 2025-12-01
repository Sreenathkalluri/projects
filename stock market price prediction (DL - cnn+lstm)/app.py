from flask import Flask, render_template, request
import numpy as np
import joblib
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load model and scaler
model = load_model("model/stock_model.h5", compile=False)
scaler = joblib.load("model/scaler.pkl")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input values from form
        input_data = []
        for i in range(1, 4):
            row = [
                float(request.form[f'open_{i}']),
                float(request.form[f'high_{i}']),
                float(request.form[f'low_{i}']),
                float(request.form[f'close_{i}']),
                float(request.form[f'volume_{i}']),
                float(request.form[f'vwap_{i}'])
            ]
            input_data.append(row)
        
        input_data = np.array(input_data)
        scaled_input = scaler.transform(input_data)
        X_test = np.expand_dims(scaled_input, axis=0)
        
        # Predict next day's closing price
        predicted_scaled = model.predict(X_test)
        predicted = scaler.inverse_transform(
            np.concatenate((np.zeros((1, 3)), predicted_scaled, np.zeros((1, 2))), axis=1)
        )[0, 3]

        # Prepare data for Plotly graph
        days = ['Day -3', 'Day -2', 'Day -1', 'Predicted']
        closes = list(input_data[:, 3]) + [predicted]

        return render_template(
            'result.html',
            predicted_price=round(predicted, 2),
            days=days,
            closes=closes
        )
    except Exception as e:
        return render_template('index.html', prediction_text=f"Error: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True)