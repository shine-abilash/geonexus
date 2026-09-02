import os
import pickle
import torch
import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings("ignore")

from predict_sep import SEPProbabilityModel

def run_mock_demo():
    print("=========================================================")
    print(" ☀️ SEP Event Probability Forecasting - Mock Data Demo ")
    print("=========================================================")

    # 1. Load Trained Model File (.pkl)
    model_path = "models/sep_model.pkl"
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file {model_path} not found. Please run predict_sep.py first.")

    print(f"Loading trained model bundle from: {model_path} ...")
    with open(model_path, "rb") as f:
        bundle = pickle.load(f)
    
    model = bundle['model']
    scaler = bundle['scaler']
    predictors = bundle['predictors']
    threshold = bundle['optimal_threshold']
    
    model.eval()
    print(f"Model loaded successfully! Feature Count: {len(predictors)} | Decision Threshold: {threshold:.2f}\n")

    # 2. Load Sample Solar Event Rows to construct Mock Test Scenarios
    data_path = "data/rolling_combinded_testing.csv"
    if not os.path.exists(data_path):
        data_path = "data/rolling_combinded_training.csv"
    df_raw = pd.read_csv(data_path)
    if 'sharp_label' in df_raw.columns and 'flare_label' in df_raw.columns:
        df_raw = df_raw[(df_raw['sharp_label'] == 1) & (df_raw['flare_label'] == 1)]

    # Take representative mock samples
    mock_samples = df_raw[predictors].head(5).copy().fillna(0)

    scenario_names = [
        "Scenario 1: Major Solar Eruption (X-Class Flare & Fast CME)",
        "Scenario 2: Active Region Eruption with High Particle Acceleration",
        "Scenario 3: Complex Magnetic Active Region (High Flux)",
        "Scenario 4: Moderate Solar Flare Activity",
        "Scenario 5: Low-level Background Solar Activity"
    ]

    # 3. Preprocess Mock Features & Scale
    X_mock_scaled = scaler.transform(mock_samples)
    X_mock_tensor = torch.tensor(X_mock_scaled, dtype=torch.float32)

    # 4. Model Prediction
    with torch.no_grad():
        logits = model(X_mock_tensor)
        probs = torch.sigmoid(logits).numpy()

    # 5. Format & Print Prediction Output
    print("---------------------------------------------------------------------------------------------------")
    print(f"{'Sample ID':<10} | {'Predicted SEP Probability':<27} | {'Decision (Thresh=' + str(round(threshold,2)) + ')':<22} | Scenario Description")
    print("---------------------------------------------------------------------------------------------------")

    output_rows = []
    for idx, prob in enumerate(probs):
        pred_label = "🚨 SEP EVENT WARNING" if prob > threshold else "✅ SAFE / NO SEP EVENT"
        prob_pct = f"{prob * 100:.2f}%"
        scenario = scenario_names[idx]
        print(f"Sample #{idx + 1:<4} | {prob_pct:<27} | {pred_label:<22} | {scenario}")
        
        output_rows.append({
            "Sample_ID": idx + 1,
            "Scenario": scenario,
            "SEP_Probability": f"{prob:.4f}",
            "SEP_Probability_Percent": prob_pct,
            "Prediction_Warning": pred_label
        })

    print("---------------------------------------------------------------------------------------------------")

    # Save mock prediction demo output
    os.makedirs("data", exist_ok=True)
    mock_out_file = "data/mock_data_predictions.csv"
    pd.DataFrame(output_rows).to_csv(mock_out_file, index=False)
    print(f"\nDemo prediction results saved to: {mock_out_file}\n")

if __name__ == "__main__":
    run_mock_demo()
