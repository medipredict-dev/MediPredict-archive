import pandas as pd
import numpy as np

np.random.seed(42)
n_samples = 2000

injury_types = ['Muscle Strain', 'Ligament Sprain', 'Fracture', 'Concussion', 'Tendinitis', 'Dislocation', 'Contusion', 'Other']
severities = ['Minor', 'Moderate', 'Severe', 'Critical']

# Base recovery days for injury types
base_days = {
    'Muscle Strain': 14, 'Ligament Sprain': 35, 'Fracture': 60,
    'Concussion': 14, 'Tendinitis': 21, 'Dislocation': 42,
    'Contusion': 7, 'Other': 21
}

# Multipliers for severity
severity_mult = {
    'Minor': 0.5, 'Moderate': 1.0, 'Severe': 2.5, 'Critical': 4.0
}

data = []
for _ in range(n_samples):
    age = np.random.randint(18, 40)
    weight = np.random.uniform(60, 100)
    height = np.random.uniform(160, 210)
    prev_injuries = np.random.randint(0, 5)
    training_intensity = np.random.uniform(0.1, 1.0)
    
    inj_type = np.random.choice(injury_types)
    sev = np.random.choice(severities, p=[0.4, 0.4, 0.15, 0.05])
    
    # Calculate recovery time based on type and severity, with some noise
    b = base_days[inj_type]
    m = severity_mult[sev]
    
    # Age factor: older players take slightly longer (up to 20% longer)
    age_factor = 1.0 + ((age - 18) / 22) * 0.2
    
    # Previous injuries factor: more injuries take slightly longer (up to 15% longer)
    prev_factor = 1.0 + (prev_injuries / 4) * 0.15
    
    recovery = b * m * age_factor * prev_factor
    # Add random noise +/- 15%
    noise = np.random.uniform(0.85, 1.15)
    recovery = int(round(recovery * noise))
    recovery = max(1, recovery) # Ensure at least 1 day
    
    data.append([age, weight, height, prev_injuries, training_intensity, inj_type, sev, recovery])

df = pd.DataFrame(data, columns=['Player_Age', 'Player_Weight', 'Player_Height', 'Previous_Injuries', 'Training_Intensity', 'Injury_Type', 'Severity', 'Recovery_Time'])
# Save to the current directory
output_path = 'enhanced_injury_data.csv'
df.to_csv(output_path, index=False)
print(f"Enhanced dataset created at: {output_path}")
