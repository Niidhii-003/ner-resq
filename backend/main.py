
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib


# =========================================================
# APP
# =========================================================

app = FastAPI(title="NER-RESQ Backend")


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# LOAD MODEL
# =========================================================

landslide_model = joblib.load(
    "model/ner_resq_landslide_model.pkl"
)


# =========================================================
# MODEL FEATURES
# =========================================================

MODEL_FEATURES = [
    "Rainfall_mm",
    "Slope_Angle",
    "Soil_Saturation",
    "Vegetation_Cover",
    "Rainfall_3Day",
    "Rainfall_7Day",
    "Aspect",
    "Elevation_m",
    "NDVI_Index",
    "Land_Use_Urban",
    "Land_Use_Forest",
    "Land_Use_Agriculture",
    "Earthquake_Activity",
    "Proximity_to_Water",
    "Distance_to_Road_m",
    "Temperature_C",
    "Humidity_percent",
    "Soil_pH",
    "Clay_Content",
    "Sand_Content",
    "Silt_Content",
    "Soil_Erosion_Rate",
    "Historical_Landslide_Count",
    "Soil_Type_Gravel",
    "Soil_Type_Sand",
    "Soil_Type_Silt",
    "Soil_Type_Clay",
    "Pore_Water_Pressure_kPa",
    "Soil_Moisture_Content",
    "Microseismic_Activity",
    "Acoustic_Emission_dB",
    "Soil_Strain",
    "Soil_Temperature_C",
    "TDR_Reflection_Index",
    "Rainfall_Accumulation_Index",
    "Rainfall_Intensity_Index",
    "Short_Long_Rainfall_Ratio",
    "Slope_Rainfall_Index",
    "Moisture_Saturation_Index",
    "Water_Pressure_Risk_Index"
]


# =========================================================
# RISK LEVEL
# =========================================================

def get_risk_level(score):

    if score < 0.30:
        return "LOW"

    elif score < 0.60:
        return "MODERATE"

    elif score < 0.80:
        return "HIGH"

    else:
        return "CRITICAL"


# =========================================================
# REQUEST MODEL
# =========================================================

class PredictionRequest(BaseModel):

    features: dict

    # Optional so the frontend does not get a 422 error
    # if rainfall risk is not supplied.
    rainfall_risk: float = 0.35


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message": "NER-RESQ Backend is running"
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# =========================================================
# MODEL INFO
# =========================================================

@app.get("/model-info")
def model_info():

    return {
        "model": "Random Forest",
        "features": 40,
        "message": "NER-RESQ landslide model loaded successfully"
    }


# =========================================================
# PREDICT RISK
# =========================================================

@app.post("/predict-risk")
def predict_risk(request: PredictionRequest):

    # -----------------------------------------------------
    # CHECK MISSING FEATURES
    # -----------------------------------------------------

    missing_features = [
        feature
        for feature in MODEL_FEATURES
        if feature not in request.features
    ]

    if missing_features:

        return {
            "error": "Missing features",
            "features": missing_features
        }


    # -----------------------------------------------------
    # CHECK EXTRA FEATURES
    # -----------------------------------------------------

    extra_features = [
        feature
        for feature in request.features
        if feature not in MODEL_FEATURES
    ]

    if extra_features:

        return {
            "error": "Unknown features",
            "features": extra_features
        }


    # -----------------------------------------------------
    # CREATE MODEL INPUT
    # -----------------------------------------------------

    input_data = pd.DataFrame(
        [
            [
                request.features[feature]
                for feature in MODEL_FEATURES
            ]
        ],
        columns=MODEL_FEATURES
    )


    # -----------------------------------------------------
    # LANDSLIDE PREDICTION
    # -----------------------------------------------------

    landslide_probability = (
        landslide_model
        .predict_proba(input_data)[0][1]
    )


    # -----------------------------------------------------
    # HAZARD SCORE
    # -----------------------------------------------------

    hazard_score = (
        0.40 * request.rainfall_risk
        +
        0.60 * landslide_probability
    )


    # -----------------------------------------------------
    # HAZARD LEVEL
    # -----------------------------------------------------

    hazard_level = get_risk_level(
        hazard_score
    )


    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {

        "landslide_probability": round(
            float(landslide_probability),
            4
        ),

        "rainfall_risk": round(
            float(request.rainfall_risk),
            4
        ),

        "hazard_score": round(
            float(hazard_score),
            4
        ),

        # Frontend uses risk_level
        "risk_level": hazard_level,

        # Keep hazard_level too for compatibility
        "hazard_level": hazard_level
    }

