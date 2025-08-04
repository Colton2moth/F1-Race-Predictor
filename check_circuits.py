import pandas as pd

# Read the processed data
df = pd.read_parquet('data/processed.parquet')

# Get unique circuits
unique_circuits = sorted(df['circuit'].unique())

print("Unique circuits in processed.parquet:")
for circuit in unique_circuits:
    print(f"- {circuit}")

print(f"\nTotal unique circuits: {len(unique_circuits)}") 