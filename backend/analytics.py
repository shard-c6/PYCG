import numpy as np
from sklearn.linear_model import LinearRegression

def predict_gdp(history, target_year=2030):
    """
    Predicts GDP for a given year based on historical data using linear regression.
    'history' is a list of dicts: [{'year': 1995, 'value': ...}, ...]
    """
    if not history or len(history) < 2:
        return None
    
    # Prepare data for regression
    X = np.array([d['year'] for d in history]).reshape(-1, 1)
    y = np.array([d['value'] for d in history])
    
    # Create and fit the model
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict for the target year
    prediction = model.predict(np.array([[target_year]]))[0]
    
    # Avoid negative predictions (though unlikely for GDP growth trends)
    return max(0, round(float(prediction)))

def calculate_momentum(history):
    """
    Calculates economic momentum based on the last 5 years vs the overall average.
    """
    if len(history) < 5:
        return 0.0
    
    recent = history[-5:]
    recent_growth = (recent[-1]['value'] - recent[0]['value']) / recent[0]['value']
    
    overall_growth = (history[-1]['value'] - history[0]['value']) / history[0]['value']
    
    # Relative momentum score
    return round((recent_growth / overall_growth) * 100, 2) if overall_growth != 0 else 0.0
