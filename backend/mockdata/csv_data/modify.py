import pandas as pd
import random

# Load the CSV file
df = pd.read_csv('events.csv')

# Add the CreatedBy column with random integers between 1 and 100
df['CreatedBy'] = [random.randint(1, 100) for _ in range(len(df))]

# Save the updated CSV file
df.to_csv('events.csv', index=False)