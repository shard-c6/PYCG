from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
try:
    from .data_manager import get_full_dataset
    from .analytics import predict_gdp, calculate_momentum
except ImportError:
    # Fallback for local non-package execution
    from data_manager import get_full_dataset
    from analytics import predict_gdp, calculate_momentum

app = FastAPI(title="GlobalLedger Analytics API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global dataset (loaded in memory)
DATASET = get_full_dataset()

@app.get("/api/python")
async def root():
    return {"message": "GlobalLedger Analytics API is online via Vercel Serverless"}

@app.get("/api/data")
async def get_all_data():
    """Returns the entire cached dataset."""
    return DATASET

@app.get("/api/country/{code}")
async def get_country_data(code: str):
    """Returns data for a specific country by ISO code."""
    country_code = code.upper()
    if country_code not in DATASET["countries"]:
        raise HTTPException(status_code=404, detail="Country code not found")
    
    country_data = DATASET["countries"][country_code]
    
    # Enrichment
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

@app.get("/api/stats/global-average")
async def get_global_average():
    """Returns the global average GDP over time."""
    return DATASET["globalAverage"]

@app.get("/api/export/{code}")
async def export_country_csv(code: str):
    """Generates a CSV report for a country's GDP history using Pandas."""
    country_code = code.upper()
    if country_code not in DATASET["countries"]:
        raise HTTPException(status_code=404, detail="Country code not found")
        
    country_data = DATASET["countries"][country_code]
    df = pd.DataFrame(country_data["gdp"])
    
    # Generate CSV in memory
    output = io.StringIO()
    df.to_csv(output, index=False)
    csv_content = output.getvalue()
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={country_code}_GDP_Report.csv"
        }
    )
