import xarray as xr

# Your NetCDF file
file = "sci_sgps-l2-avg1m_g18_d20230101_v3-0-0.nc"

# Open NetCDF
ds = xr.open_dataset(file)

# Convert the complete dataset to a pandas DataFrame
df = ds.to_dataframe().reset_index()

# Save as CSV
df.to_csv("mpsh_data.csv", index=False)

print("Conversion completed!")
print("CSV file: mpsh_data.csv")

# Show first 10 rows
print(df.head(10))