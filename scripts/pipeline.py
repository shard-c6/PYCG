import json
import os
import sys

# Ensure backend module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.data_manager import get_full_dataset

def process_data():
    print("Initializing Python Data Analysis Pipeline (World Bank API)...")
    
    # Use the live World Bank API system to fetch/generate the dataset
    final_output = get_full_dataset()

    out_dir = os.path.join(os.path.dirname(__file__), '../public/data')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'gdp.json')
    
    with open(out_path, 'w') as f:
        json.dump(final_output, f, indent=2)
    
    print("Python data processing complete. Generated static dataset: public/data/gdp.json")

if __name__ == "__main__":
    process_data()
