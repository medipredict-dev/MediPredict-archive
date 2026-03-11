import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
import os

# Load dataset
data_path = '../../enhanced_injury_data.csv'
if not os.path.exists(data_path):
    print(f"Error: {data_path} not found")
    exit(1)

df = pd.read_csv(data_path)

# Features and Target
X = df[['Player_Age', 'Player_Weight', 'Player_Height', 'Previous_Injuries', 'Training_Intensity', 'Injury_Type', 'Severity']]
y = df['Recovery_Time']

# One-hot encode categorical variables
X = pd.get_dummies(X, columns=['Injury_Type', 'Severity'])

# Save the exact columns used during training
model_columns = list(X.columns)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest Regressor
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
print(f"Model Mean Absolute Error: {mae}")

# Save the model
if not os.path.exists('models'):
    os.makedirs('models')

joblib.dump(model, 'models/recovery_model.pkl')
joblib.dump(model_columns, 'models/model_columns.pkl')
print("Model and columns saved to models/")
