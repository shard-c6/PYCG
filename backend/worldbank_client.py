"""
World Bank Indicators API Client
Fetches real economic data for all tracked countries.
API Docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
"""

import requests
import logging
import time

logger = logging.getLogger(__name__)

# World Bank API base
WB_API_BASE = "https://api.worldbank.org/v2"

# The 53 countries tracked by GlobalLedger (ISO3 codes)
COUNTRY_CODES = [
    "USA", "CHN", "JPN", "DEU", "IND", "GBR", "FRA", "ITA",
    "CAN", "KOR", "RUS", "AUS", "BRA", "ESP", "MEX", "IDN",
    "NLD", "SAU", "TUR", "CHE", "POL", "ARG", "SWE", "BEL",
    "THA", "NGA", "AUT", "ARE", "NOR", "ISR", "ZAF", "DNK",
    "SGP", "MYS", "PHL", "BGD", "EGY", "CHL", "FIN", "ROU",
    "CZE", "PRT", "IRQ", "NZL", "PER", "GRC", "KAZ", "COL",
    "DZA", "QAT", "PAK", "UKR", "ETH", "TZA",
]

# Indicators to fetch
INDICATORS = {
    "NY.GDP.MKTP.CD":   "gdp_history",    # GDP (current US$) — full time series
    "NY.GDP.PCAP.CD":   "per_capita",     # GDP per capita (current US$)
    "NY.GDP.MKTP.KD.ZG": "growth",        # GDP growth (annual %)
    "FP.CPI.TOTL.ZG":  "inflation",       # Inflation, consumer prices (annual %)
    "SL.UEM.TOTL.ZS":  "unemployment",    # Unemployment (% of labor force)
}

# Date range for GDP history time series
GDP_DATE_RANGE = "1995:2024"
# Date range for snapshot indicators (get recent years to find latest non-null)
SNAPSHOT_DATE_RANGE = "2020:2024"

# ISO3 → Currency code mapping (World Bank API doesn't provide this)
CURRENCY_MAP = {
    "USA": "USD", "CHN": "CNY", "JPN": "JPY", "DEU": "EUR", "IND": "INR",
    "GBR": "GBP", "FRA": "EUR", "ITA": "EUR", "CAN": "CAD", "KOR": "KRW",
    "RUS": "RUB", "AUS": "AUD", "BRA": "BRL", "ESP": "EUR", "MEX": "MXN",
    "IDN": "IDR", "NLD": "EUR", "SAU": "SAR", "TUR": "TRY", "CHE": "CHF",
    "POL": "PLN", "ARG": "ARS", "SWE": "SEK", "BEL": "EUR", "THA": "THB",
    "NGA": "NGN", "AUT": "EUR", "ARE": "AED", "NOR": "NOK", "ISR": "ILS",
    "ZAF": "ZAR", "DNK": "DKK", "SGP": "SGD", "MYS": "MYR", "PHL": "PHP",
    "BGD": "BDT", "EGY": "EGP", "CHL": "CLP", "FIN": "EUR", "ROU": "RON",
    "CZE": "CZK", "PRT": "EUR", "IRQ": "IQD", "NZL": "NZD", "PER": "PEN",
    "GRC": "EUR", "KAZ": "KZT", "COL": "COP", "DZA": "DZD", "QAT": "QAR",
    "PAK": "PKR", "UKR": "UAH", "ETH": "ETB", "TZA": "TZS",
}

# World Bank name overrides for cleaner display
WB_NAME_OVERRIDES = {
    "Korea, Rep.": "South Korea",
    "Turkiye": "Turkey",
    "Russian Federation": "Russia",
    "Iran, Islamic Rep.": "Iran",
    "Egypt, Arab Rep.": "Egypt",
    "Venezuela, RB": "Venezuela",
    "Czechia": "Czech Republic",
    "Slovak Republic": "Slovakia",
    "Congo, Dem. Rep.": "DR Congo",
    "Lao PDR": "Laos",
    "Viet Nam": "Vietnam",
    "Cabo Verde": "Cape Verde",
    "Cote d'Ivoire": "Ivory Coast",
    "Eswatini": "Eswatini",
    "Hong Kong SAR, China": "Hong Kong",
    "Macao SAR, China": "Macao",
}


def _batch_codes(codes, batch_size=15):
    """Split country codes into batches for API calls."""
    for i in range(0, len(codes), batch_size):
        yield codes[i:i + batch_size]


def _fetch_indicator(indicator_id, country_codes, date_range, per_page=1000):
    """
    Fetch a single indicator for multiple countries from the World Bank API.
    Returns a dict: { "USA": [{"date": "2023", "value": 27292...}, ...], ... }
    """
    codes_str = ";".join(country_codes)
    url = f"{WB_API_BASE}/country/{codes_str}/indicator/{indicator_id}"
    params = {
        "date": date_range,
        "format": "json",
        "per_page": per_page,
    }

    all_records = []
    page = 1

    while True:
        params["page"] = page
        try:
            resp = requests.get(url, params=params, timeout=60)
            resp.raise_for_status()
            data = resp.json()
        except (requests.RequestException, ValueError) as e:
            logger.error(f"World Bank API error for {indicator_id}: {e}")
            break

        # WB API returns [metadata, [records]] or [{"message": ...}]
        if not isinstance(data, list) or len(data) < 2:
            logger.warning(f"Unexpected WB response for {indicator_id}: {data}")
            break

        metadata = data[0]
        records = data[1]

        if records is None:
            break

        all_records.extend(records)

        # Check if more pages exist
        total_pages = metadata.get("pages", 1)
        if page >= total_pages:
            break
        page += 1

    # Group by country ISO3 code
    result = {}
    for record in all_records:
        iso3 = record.get("countryiso3code", "")
        if not iso3:
            continue
        if iso3 not in result:
            result[iso3] = {
                "name": record.get("country", {}).get("value", iso3),
                "data": [],
            }
        result[iso3]["data"].append({
            "date": record.get("date", ""),
            "value": record.get("value"),
        })

    return result


def _get_latest_value(data_points):
    """From a list of {"date": "2023", "value": ...}, get the most recent non-null value."""
    # Sort by date descending
    sorted_points = sorted(data_points, key=lambda x: x["date"], reverse=True)
    for point in sorted_points:
        if point["value"] is not None:
            return point["value"], int(point["date"])
    return None, None


def fetch_all_countries():
    """
    Fetches all economic data for all tracked countries from the World Bank API.
    Returns a dict keyed by ISO3 code with the full data structure.
    """
    logger.info("Fetching data from World Bank API for %d countries...", len(COUNTRY_CODES))
    start_time = time.time()

    # Storage for all fetched data
    country_data = {code: {"gdp_history": [], "name": code} for code in COUNTRY_CODES}

    # 1. Fetch GDP history (full time series 1995-2024)
    logger.info("  Fetching GDP history (NY.GDP.MKTP.CD)...")
    for batch in _batch_codes(COUNTRY_CODES):
        result = _fetch_indicator("NY.GDP.MKTP.CD", batch, GDP_DATE_RANGE)
        for code, info in result.items():
            if code in country_data:
                # Clean the country name
                raw_name = info["name"]
                country_data[code]["name"] = WB_NAME_OVERRIDES.get(raw_name, raw_name)
                # Sort by year ascending and filter nulls
                gdp_points = []
                for dp in sorted(info["data"], key=lambda x: x["date"]):
                    if dp["value"] is not None:
                        gdp_points.append({
                            "year": int(dp["date"]),
                            "value": round(dp["value"]),
                        })
                country_data[code]["gdp_history"] = gdp_points

    # 2. Fetch snapshot indicators (per_capita, growth, inflation, unemployment)
    snapshot_indicators = {
        "NY.GDP.PCAP.CD": "per_capita",
        "NY.GDP.MKTP.KD.ZG": "growth",
        "FP.CPI.TOTL.ZG": "inflation",
        "SL.UEM.TOTL.ZS": "unemployment",
    }

    for indicator_id, field_name in snapshot_indicators.items():
        logger.info(f"  Fetching {field_name} ({indicator_id})...")
        for batch in _batch_codes(COUNTRY_CODES):
            result = _fetch_indicator(indicator_id, batch, SNAPSHOT_DATE_RANGE)
            for code, info in result.items():
                if code in country_data:
                    value, data_year = _get_latest_value(info["data"])
                    if value is not None:
                        country_data[code][field_name] = round(value, 2)
                        # Track the most recent data year
                        existing_year = country_data[code].get("data_year")
                        if existing_year is None or (data_year and data_year > existing_year):
                            country_data[code]["data_year"] = data_year

    elapsed = time.time() - start_time
    logger.info("World Bank API fetch complete in %.1fs", elapsed)

    return country_data
