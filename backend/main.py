from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .data_manager import get_full_dataset
from .analytics import predict_gdp, calculate_momentum

app = FastAPI(title="GlobalLedger Analytics API")

# Configure CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since this is a local project, we'll allow all for simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global dataset (loaded in memory)
DATASET = get_full_dataset()

@app.get("/")
async def root():
    return {"message": "GlobalLedger Analytics API is online"}

@app.get("/data")
async def get_all_data():
    """Returns the entire cached dataset."""
    return DATASET

@app.get("/country/{code}")
async def get_country_data(code: str):
    """Returns data for a specific country by ISO code."""
    country_code = code.upper()
    if country_code not in DATASET["countries"]:
        raise HTTPException(status_code=404, detail="Country code not found")
    
    country_data = DATASET["countries"][country_code]
    
    # Enrich with dynamic analytics on-the-fly
    history = country_data.get("gdp", [])
    prediction_2030 = predict_gdp(history, 2030)
    momentum = calculate_momentum(history)
    
    return {
        **country_data,
        "analytics": {
            "prediction_2030": prediction_2030,
            "momentum_score": momentum,
            "forecasting_model": "LinearRegression (Scikit-Learn)"
        }
    }

@app.get("/stats/global-average")
async def get_global_average():
    """Returns the global average GDP over time."""
    return DATASET["globalAverage"]
