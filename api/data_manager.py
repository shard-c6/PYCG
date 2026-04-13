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
            {"year": 2019, "value": 21374000000000}, {"year": 2020, "value": 20936000000000}, {"year": 2021, "value": 23315000000000},
            {"year": 2022, "value": 25462700000000}, {"year": 2023, "value": 27361000000000}, {"year": 2024, "value": 29168000000000}
        ],
        "growth": 2.8, "per_capita": 85373, "inflation": 2.9, "unemployment": 4.1, "currency": "USD", "data_year": 2024
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
            {"year": 2022, "value": 17963000000000}, {"year": 2023, "value": 17795000000000}, {"year": 2024, "value": 18533000000000}
        ],
        "growth": 4.8, "per_capita": 13136, "inflation": 0.3, "unemployment": 5.1, "currency": "CNY", "data_year": 2024
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
            {"year": 2022, "value": 3385000000000}, {"year": 2023, "value": 3550000000000}, {"year": 2024, "value": 3937000000000}
        ],
        "growth": 6.5, "per_capita": 2731, "inflation": 4.6, "unemployment": 6.8, "currency": "INR", "data_year": 2024
    },
    "JPN": {
        "name": "Japan",
        "gdp": [
            {"year": 1995, "value": 5449100000000}, {"year": 1996, "value": 4834000000000}, {"year": 1997, "value": 4415000000000},
            {"year": 1998, "value": 4032000000000}, {"year": 1999, "value": 4562000000000}, {"year": 2000, "value": 4888000000000},
            {"year": 2001, "value": 4304000000000}, {"year": 2002, "value": 4115000000000}, {"year": 2003, "value": 4445000000000},
            {"year": 2004, "value": 4815000000000}, {"year": 2005, "value": 4756000000000}, {"year": 2006, "value": 4530000000000},
            {"year": 2007, "value": 4515000000000}, {"year": 2008, "value": 5038000000000}, {"year": 2009, "value": 5231000000000},
            {"year": 2010, "value": 5700000000000}, {"year": 2011, "value": 6157000000000}, {"year": 2012, "value": 6203000000000},
            {"year": 2013, "value": 5156000000000}, {"year": 2014, "value": 4850000000000}, {"year": 2015, "value": 4395000000000},
            {"year": 2016, "value": 4923000000000}, {"year": 2017, "value": 4931000000000}, {"year": 2018, "value": 5037000000000},
            {"year": 2019, "value": 5123000000000}, {"year": 2020, "value": 5040000000000}, {"year": 2021, "value": 4937000000000},
            {"year": 2022, "value": 4231000000000}, {"year": 2023, "value": 4213000000000}, {"year": 2024, "value": 4110000000000}
        ],
        "growth": 1.9, "per_capita": 33138, "inflation": 2.7, "unemployment": 2.5, "currency": "JPY", "data_year": 2024
    },
    "DEU": {
        "name": "Germany",
        "gdp": [
            {"year": 1995, "value": 2591400000000}, {"year": 1996, "value": 2502000000000}, {"year": 1997, "value": 2218000000000},
            {"year": 1998, "value": 2243000000000}, {"year": 1999, "value": 2198000000000}, {"year": 2000, "value": 1956000000000},
            {"year": 2001, "value": 1951000000000}, {"year": 2002, "value": 2079000000000}, {"year": 2003, "value": 2506000000000},
            {"year": 2004, "value": 2819000000000}, {"year": 2005, "value": 2861000000000}, {"year": 2006, "value": 3002000000000},
            {"year": 2007, "value": 3440000000000}, {"year": 2008, "value": 3752000000000}, {"year": 2009, "value": 3418000000000},
            {"year": 2010, "value": 3423000000000}, {"year": 2011, "value": 3749000000000}, {"year": 2012, "value": 3544000000000},
            {"year": 2013, "value": 3733000000000}, {"year": 2014, "value": 3885000000000}, {"year": 2015, "value": 3357000000000},
            {"year": 2016, "value": 3468000000000}, {"year": 2017, "value": 3694000000000}, {"year": 2018, "value": 3963000000000},
            {"year": 2019, "value": 3889000000000}, {"year": 2020, "value": 3846000000000}, {"year": 2021, "value": 4259000000000},
            {"year": 2022, "value": 4072000000000}, {"year": 2023, "value": 4456000000000}, {"year": 2024, "value": 4591000000000}
        ],
        "growth": 0.2, "per_capita": 54291, "inflation": 2.2, "unemployment": 5.9, "currency": "EUR", "data_year": 2024
    },
    "GBR": {
        "name": "United Kingdom",
        "gdp": [
            {"year": 1995, "value": 1335000000000}, {"year": 1996, "value": 1405000000000}, {"year": 1997, "value": 1540000000000},
            {"year": 1998, "value": 1620000000000}, {"year": 1999, "value": 1660000000000}, {"year": 2000, "value": 1657000000000},
            {"year": 2001, "value": 1640000000000}, {"year": 2002, "value": 1784000000000}, {"year": 2003, "value": 2053000000000},
            {"year": 2004, "value": 2416000000000}, {"year": 2005, "value": 2540000000000}, {"year": 2006, "value": 2714000000000},
            {"year": 2007, "value": 3100000000000}, {"year": 2008, "value": 2929000000000}, {"year": 2009, "value": 2410000000000},
            {"year": 2010, "value": 2476000000000}, {"year": 2011, "value": 2619000000000}, {"year": 2012, "value": 2704000000000},
            {"year": 2013, "value": 2786000000000}, {"year": 2014, "value": 3064000000000}, {"year": 2015, "value": 2929000000000},
            {"year": 2016, "value": 2694000000000}, {"year": 2017, "value": 2666000000000}, {"year": 2018, "value": 2828000000000},
            {"year": 2019, "value": 2829000000000}, {"year": 2020, "value": 2698000000000}, {"year": 2021, "value": 3131000000000},
            {"year": 2022, "value": 3070000000000}, {"year": 2023, "value": 3340000000000}, {"year": 2024, "value": 3495000000000}
        ],
        "growth": 1.1, "per_capita": 51075, "inflation": 2.5, "unemployment": 4.3, "currency": "GBP", "data_year": 2024
    },
    "BRA": {
        "name": "Brazil",
        "gdp": [
            {"year": 1995, "value": 786000000000}, {"year": 1996, "value": 851000000000}, {"year": 1997, "value": 883000000000},
            {"year": 1998, "value": 863000000000}, {"year": 1999, "value": 599000000000}, {"year": 2000, "value": 655000000000},
            {"year": 2001, "value": 559000000000}, {"year": 2002, "value": 507000000000}, {"year": 2003, "value": 553000000000},
            {"year": 2004, "value": 669000000000}, {"year": 2005, "value": 892000000000}, {"year": 2006, "value": 1089000000000},
            {"year": 2007, "value": 1397000000000}, {"year": 2008, "value": 1696000000000}, {"year": 2009, "value": 1667000000000},
            {"year": 2010, "value": 2209000000000}, {"year": 2011, "value": 2614000000000}, {"year": 2012, "value": 2465000000000},
            {"year": 2013, "value": 2473000000000}, {"year": 2014, "value": 2456000000000}, {"year": 2015, "value": 1802000000000},
            {"year": 2016, "value": 1796000000000}, {"year": 2017, "value": 2064000000000}, {"year": 2018, "value": 1917000000000},
            {"year": 2019, "value": 1874000000000}, {"year": 2020, "value": 1476000000000}, {"year": 2021, "value": 1609000000000},
            {"year": 2022, "value": 1920000000000}, {"year": 2023, "value": 2174000000000}, {"year": 2024, "value": 2331000000000}
        ],
        "growth": 3.2, "per_capita": 10808, "inflation": 4.4, "unemployment": 6.1, "currency": "BRL", "data_year": 2024
    },
    "ZAF": {
        "name": "South Africa",
        "gdp": [
            {"year": 1995, "value": 155000000000}, {"year": 1996, "value": 148000000000}, {"year": 1997, "value": 153000000000},
            {"year": 1998, "value": 137000000000}, {"year": 1999, "value": 136000000000}, {"year": 2000, "value": 136000000000},
            {"year": 2001, "value": 122000000000}, {"year": 2002, "value": 115000000000}, {"year": 2003, "value": 175000000000},
            {"year": 2004, "value": 229000000000}, {"year": 2005, "value": 258000000000}, {"year": 2006, "value": 271000000000},
            {"year": 2007, "value": 299000000000}, {"year": 2008, "value": 286000000000}, {"year": 2009, "value": 297000000000},
            {"year": 2010, "value": 375000000000}, {"year": 2011, "value": 422000000000}, {"year": 2012, "value": 396000000000},
            {"year": 2013, "value": 367000000000}, {"year": 2014, "value": 350000000000}, {"year": 2015, "value": 318000000000},
            {"year": 2016, "value": 296000000000}, {"year": 2017, "value": 349000000000}, {"year": 2018, "value": 368000000000},
            {"year": 2019, "value": 352000000000}, {"year": 2020, "value": 302000000000}, {"year": 2021, "value": 419000000000},
            {"year": 2022, "value": 406000000000}, {"year": 2023, "value": 380000000000}, {"year": 2024, "value": 401000000000}
        ],
        "growth": 1.6, "per_capita": 6485, "inflation": 4.5, "unemployment": 32.1, "currency": "ZAR", "data_year": 2024
    },
}

SEED_MAP = {
    "CAN": 2242000000000, "KOR": 1713000000000, "AUS": 1802000000000,
    "RUS": 2021000000000, "ESP": 1582000000000, "MEX": 1789000000000,
    "IDN": 1475000000000, "NLD": 1167000000000, "SAU": 1109000000000,
    "TUR": 1108000000000, "CHE": 906000000000, "POL": 842000000000,
    "ARG": 640000000000, "SWE": 600000000000, "BEL": 632000000000,
    "THA": 548000000000, "NGA": 253000000000, "AUT": 516000000000,
    "ARE": 528000000000, "NOR": 579000000000, "ISR": 530000000000,
    "DNK": 406000000000, "SGP": 515000000000, "MYS": 447000000000,
    "PHL": 440000000000, "BGD": 460000000000, "EGY": 348000000000,
    "CHL": 335000000000, "FIN": 306000000000, "ROU": 351000000000,
    "CZE": 338000000000, "PRT": 288000000000, "IRQ": 255000000000,
    "NZL": 253000000000, "PER": 267000000000, "GRC": 239000000000,
    "KAZ": 281000000000, "COL": 383000000000, "DZA": 267000000000,
    "QAT": 246000000000, "PAK": 374000000000, "UKR": 179000000000,
    "ETH": 164000000000, "TZA": 85000000000, "FRA": 3131000000000,
    "ITA": 2329000000000
}

def generate_generic_gdp(base_value):
    data = []
    current = base_value * 0.4
    for year in range(1995, 2025):
        growth_rate = 0.03 + (math.sin(year * 0.7) * 0.02)
        current *= (1 + growth_rate)
        if year in [2009, 2020]:
            current *= 0.96
        data.append({"year": year, "value": round(current)})
    return data

def get_full_dataset():
    """Aggregates all country data into a single structure."""
    result_data = {}

    for code, data in GDP_DATA.items():
        last_val = data['gdp'][-1]['value']
        prev_val = data['gdp'][-2]['value']
        delta = ((last_val - prev_val) / prev_val) * 100
        result_data[code.upper()] = {
            "country": code.upper(),
            **data,
            "delta": round(delta, 2)
        }

    for code, base in SEED_MAP.items():
        gdp_hist = generate_generic_gdp(base)
        last_val = gdp_hist[-1]['value']
        prev_val = gdp_hist[-2]['value']
        delta = ((last_val - prev_val) / prev_val) * 100
        result_data[code.upper()] = {
            "country": code.upper(),
            "name": code.upper(),
            "gdp": gdp_hist,
            "growth": round(1.5 + random.random() * 4, 1),
            "per_capita": round(2000 + random.random() * 30000),
            "inflation": round(2.0 + random.random() * 6, 1),
            "unemployment": round(3.0 + random.random() * 12, 1),
            "currency": "USD",
            "data_year": 2024,
            "delta": round(delta, 2)
        }
    
    global_avg = []
    for year in range(1995, 2025):
        total = sum(c_data['gdp'][year - 1995]['value'] for c_data in result_data.values())
        count = len(result_data)
        global_avg.append({"year": year, "value": total / count if count > 0 else 0})

    return {
        "countries": result_data,
        "globalAverage": global_avg
    }
