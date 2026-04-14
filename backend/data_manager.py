from .worldbank_client import fetch_all_countries, CURRENCY_MAP
from .wb_cache import get_cached_data

def get_full_dataset():
    """Aggregates all country data from the World Bank API."""
    
    # Get raw WB data (cached or fresh)
    country_data = get_cached_data(fetch_all_countries)
    
    result_data = {}
    
    # Process into the exact shape expected by the frontend
    for code, data in country_data.items():
        gdp_hist = data.get("gdp_history", [])
        
        # Calculate delta if we have at least 2 years of data
        delta = None
        if len(gdp_hist) >= 2:
            last_val = gdp_hist[-1]['value']
            prev_val = gdp_hist[-2]['value']
            if prev_val > 0:
                delta = round(((last_val - prev_val) / prev_val) * 100, 2)
                
        # Only include countries that have valid GDP data
        if not gdp_hist:
            continue
            
        result_data[code] = {
            "country": code,
            "name": data.get("name", code),
            "gdp": gdp_hist,
            "growth": data.get("growth"), # May be None if World Bank doesn't have it
            "per_capita": data.get("per_capita"),
            "inflation": data.get("inflation"),
            "unemployment": data.get("unemployment"),
            "currency": CURRENCY_MAP.get(code, "USD"),
            "data_year": data.get("data_year", 2024),
        }
        
        # Only add delta if it could be calculated
        if delta != None:
            result_data[code]["delta"] = delta
            
    # Calculate global average
    global_avg = []
    # Find overlapping years across the dataset
    all_years = set()
    for c_data in result_data.values():
        for point in c_data.get("gdp", []):
            all_years.add(point["year"])
            
    sorted_years = sorted(list(all_years))
    
    for year in sorted_years:
        total = 0
        count = 0
        for c_data in result_data.values():
            for point in c_data.get("gdp", []):
                if point["year"] == year:
                    total += point["value"]
                    count += 1
                    break
        if count > 0:
           global_avg.append({"year": year, "value": round(total / count)})

    return {
        "countries": result_data,
        "globalAverage": global_avg
    }
