import json
import os
import math
import random

GDP_DATA = {
  "USA": {
    "name": "United States",
    "gdp": [
      {"year": 1995, "value": 7664060000000}, {"year": 1996, "value": 8100200000000}, {"year": 1997, "value": 8608500000000},
      {"year": 1998, "value": 9089200000000}, {"year": 1999, "value": 9660600000000}, {"year": 2000, "value": 10250000000000},
      {"year": 2001, "value": 10580000000000}, {"year": 2002, "value": 10936000000000}, {"year": 2003, "value": 11458000000000},
      {"year": 2004, "value": 12214000000000}, {"year": 2005, "value": 13037000000000}, {"year": 2006, "value": 13815000000000},
      {"year": 2007, "value": 14452000000000}, {"year": 2008, "value": 14713000000000}, {"year": 2009, "value": 14449000000000},
      {"year": 2010, "value": 14992000000000}, {"year": 2011, "value": 15543000000000}, {"year": 2012, "value": 16197000000000},
      {"year": 2013, "value": 16785000000000}, {"year": 2014, "value": 17527000000000}, {"year": 2015, "value": 18206000000000},
      {"year": 2016, "value": 18695000000000}, {"year": 2017, "value": 19477000000000}, {"year": 2018, "value": 20580000000000},
      {"year": 2019, "value": 21374000000000}, {"year": 2020, "value": 20936000000000}, {"year": 2021, "value": 23000000000000},
      {"year": 2022, "value": 25464000000000}, {"year": 2023, "value": 27360000000000}
    ],
    "growth": 2.5, "per_capita": 80034, "inflation": 3.4, "unemployment": 3.7, "currency": "USD", "data_year": 2023
  },
  "CHN": {
    "name": "China",
    "gdp": [
      {"year": 1995, "value": 728000000000}, {"year": 1996, "value": 860000000000}, {"year": 1997, "value": 952000000000},
      {"year": 1998, "value": 1029000000000}, {"year": 1999, "value": 1093000000000}, {"year": 2000, "value": 1215000000000},
      {"year": 2001, "value": 1340000000000}, {"year": 2002, "value": 1471000000000}, {"year": 2003, "value": 1661000000000},
      {"year": 2004, "value": 1955000000000}, {"year": 2005, "value": 2286000000000}, {"year": 2006, "value": 2752000000000},
      {"year": 2007, "value": 3552000000000}, {"year": 2008, "value": 4598000000000}, {"year": 2009, "value": 5102000000000},
      {"year": 2010, "value": 6087000000000}, {"year": 2011, "value": 7551000000000}, {"year": 2012, "value": 8532000000000},
      {"year": 2013, "value": 9571000000000}, {"year": 2014, "value": 10476000000000}, {"year": 2015, "value": 11065000000000},
      {"year": 2016, "value": 11234000000000}, {"year": 2017, "value": 12310000000000}, {"year": 2018, "value": 13895000000000},
      {"year": 2019, "value": 14280000000000}, {"year": 2020, "value": 14688000000000}, {"year": 2021, "value": 17734000000000},
      {"year": 2022, "value": 17963000000000}, {"year": 2023, "value": 17700000000000}
    ],
    "growth": 5.2, "per_capita": 12614, "inflation": 0.2, "unemployment": 5.2, "currency": "CNY", "data_year": 2023
  },
  "IND": {
    "name": "India",
    "gdp": [
      {"year": 1995, "value": 367000000000}, {"year": 1996, "value": 399000000000}, {"year": 1997, "value": 424000000000},
      {"year": 1998, "value": 428000000000}, {"year": 1999, "value": 466000000000}, {"year": 2000, "value": 476000000000},
      {"year": 2001, "value": 494000000000}, {"year": 2002, "value": 524000000000}, {"year": 2003, "value": 618000000000},
      {"year": 2004, "value": 722000000000}, {"year": 2005, "value": 834000000000}, {"year": 2006, "value": 949000000000},
      {"year": 2007, "value": 1238000000000}, {"year": 2008, "value": 1198000000000}, {"year": 2009, "value": 1365000000000},
      {"year": 2010, "value": 1708000000000}, {"year": 2011, "value": 1823000000000}, {"year": 2012, "value": 1828000000000},
      {"year": 2013, "value": 1856000000000}, {"year": 2014, "value": 2039000000000}, {"year": 2015, "value": 2103000000000},
      {"year": 2016, "value": 2294000000000}, {"year": 2017, "value": 2651000000000}, {"year": 2018, "value": 2702000000000},
      {"year": 2019, "value": 2870000000000}, {"year": 2020, "value": 2667000000000}, {"year": 2021, "value": 3150000000000},
      {"year": 2022, "value": 3385000000000}, {"year": 2023, "value": 3737000000000}
    ],
    "growth": 6.8, "per_capita": 2601, "inflation": 5.4, "unemployment": 7.2, "currency": "INR", "data_year": 2023
  },
  "GBR": {
    "name": "United Kingdom",
    "gdp": [
      {"year": 1995, "value": 1142000000000}, {"year": 1996, "value": 1223000000000}, {"year": 1997, "value": 1376000000000},
      {"year": 1998, "value": 1481000000000}, {"year": 1999, "value": 1548000000000}, {"year": 2000, "value": 1660000000000},
      {"year": 2001, "value": 1655000000000}, {"year": 2002, "value": 1754000000000}, {"year": 2003, "value": 1977000000000},
      {"year": 2004, "value": 2278000000000}, {"year": 2005, "value": 2528000000000}, {"year": 2006, "value": 2677000000000},
      {"year": 2007, "value": 3107000000000}, {"year": 2008, "value": 2948000000000}, {"year": 2009, "value": 2411000000000},
      {"year": 2010, "value": 2479000000000}, {"year": 2011, "value": 2618000000000}, {"year": 2012, "value": 2706000000000},
      {"year": 2013, "value": 2786000000000}, {"year": 2014, "value": 3064000000000}, {"year": 2015, "value": 2925000000000},
      {"year": 2016, "value": 2658000000000}, {"year": 2017, "value": 2638000000000}, {"year": 2018, "value": 2825000000000},
      {"year": 2019, "value": 2830000000000}, {"year": 2020, "value": 2765000000000}, {"year": 2021, "value": 3131000000000},
      {"year": 2022, "value": 3089000000000}, {"year": 2023, "value": 3079000000000}
    ],
    "growth": 0.1, "per_capita": 46125, "inflation": 6.7, "unemployment": 4.2, "currency": "GBP", "data_year": 2023
  },
  "JPN": {
    "name": "Japan",
    "gdp": [
      {"year": 1995, "value": 5449000000000}, {"year": 1996, "value": 4837000000000}, {"year": 1997, "value": 4416000000000},
      {"year": 1998, "value": 3920000000000}, {"year": 1999, "value": 4449000000000}, {"year": 2000, "value": 4888000000000},
      {"year": 2001, "value": 4303000000000}, {"year": 2002, "value": 3992000000000}, {"year": 2003, "value": 4444000000000},
      {"year": 2004, "value": 4815000000000}, {"year": 2005, "value": 4755000000000}, {"year": 2006, "value": 4530000000000},
      {"year": 2007, "value": 4515000000000}, {"year": 2008, "value": 5037000000000}, {"year": 2009, "value": 5231000000000},
      {"year": 2010, "value": 5759000000000}, {"year": 2011, "value": 6233000000000}, {"year": 2012, "value": 6272000000000},
      {"year": 2013, "value": 5212000000000}, {"year": 2014, "value": 4895000000000}, {"year": 2015, "value": 4444000000000},
      {"year": 2016, "value": 4949000000000}, {"year": 2017, "value": 4930000000000}, {"year": 2018, "value": 4954000000000},
      {"year": 2019, "value": 5080000000000}, {"year": 2020, "value": 5055000000000}, {"year": 2021, "value": 4940000000000},
      {"year": 2022, "value": 4232000000000}, {"year": 2023, "value": 4213000000000}
    ],
    "growth": 1.9, "per_capita": 33805, "inflation": 3.3, "unemployment": 2.6, "currency": "JPY", "data_year": 2023
  }
}

SEED_MAP = {
  "CAN": 2140000000000, "KOR": 1709000000000, "AUS": 1688000000000,
  "RUS": 1862000000000, "ESP": 1582000000000, "MEX": 1274000000000,
  "IDN": 1371000000000, "NLD": 1092000000000, "SAU": 1067000000000,
  "TUR": 1029000000000, "CHE": 905000000000, "POL": 811000000000,
  "ARG": 640000000000, "SWE": 597000000000, "BEL": 624000000000,
  "THA": 574000000000, "NGA": 477000000000, "AUT": 516000000000,
  "ARE": 499000000000, "NOR": 546000000000, "ISR": 509000000000,
  "DNK": 406000000000, "SGP": 501000000000, "MYS": 430000000000,
  "PHL": 404000000000, "BGD": 460000000000, "EGY": 396000000000,
  "CHL": 344000000000, "FIN": 305000000000, "ROU": 300000000000,
  "CZE": 330000000000, "PRT": 277000000000, "IRQ": 264000000000,
  "NZL": 247000000000, "PER": 268000000000, "GRC": 241000000000,
  "KAZ": 259000000000, "COL": 363000000000, "DZA": 228000000000,
  "QAT": 211000000000, "PAK": 341000000000, "UKR": 174000000000,
  "ETH": 156000000000, "TZA": 79000000000, "FRA": 3049000000000,
  "ITA": 2254000000000
}

def generate_generic_gdp(base_value):
    data = []
    current = base_value * 0.4
    for year in range(1995, 2024):
        growth_rate = 0.03 + (math.sin(year * 0.7) * 0.02)
        current *= (1 + growth_rate)
        if year in [2009, 2020]:
            current *= 0.96
        data.append({"year": year, "value": round(current)})
    return data

def process_data():
    print("Initializing Python Data Analysis Pipeline (Pandas mock)...")
    result_data = {}

    for code, data in GDP_DATA.items():
        last_val = data['gdp'][-1]['value']
        prev_val = data['gdp'][-2]['value']
        delta = ((last_val - prev_val) / prev_val) * 100
        result_data[code] = {
            "country": code,
            **data,
            "delta": round(delta, 2)
        }

    for code, base in SEED_MAP.items():
        gdp_hist = generate_generic_gdp(base)
        last_val = gdp_hist[-1]['value']
        prev_val = gdp_hist[-2]['value']
        delta = ((last_val - prev_val) / prev_val) * 100
        result_data[code] = {
            "country": code,
            "name": code,
            "gdp": gdp_hist,
            "growth": round(1.5 + random.random() * 4, 1),
            "per_capita": round(2000 + random.random() * 30000),
            "inflation": round(2.0 + random.random() * 6, 1),
            "unemployment": round(3.0 + random.random() * 12, 1),
            "currency": "USD",
            "data_year": 2023,
            "delta": round(delta, 2)
        }

    global_avg = []
    for year in range(1995, 2024):
        total = sum(c_data['gdp'][year - 1995]['value'] for c_data in result_data.values())
        count = len(result_data)
        global_avg.append({"year": year, "value": total / count if count > 0 else 0})

    final_output = {
        "countries": result_data,
        "globalAverage": global_avg
    }

    out_dir = os.path.join(os.path.dirname(__file__), '../public/data')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'gdp.json')
    
    with open(out_path, 'w') as f:
        json.dump(final_output, f, indent=2)
    
    print("Python data processing complete. Generated static dataset: public/data/gdp.json")

if __name__ == "__main__":
    process_data()
