# modify 1:
# import pandas as pd
# import random

# # Load the CSV file
# df = pd.read_csv('events.csv')

# # Add the CreatedBy column with random integers between 1 and 100
# df['CreatedBy'] = [random.randint(1, 100) for _ in range(len(df))]

# # Save the updated CSV file
# df.to_csv('events.csv', index=False)


# modify 2:
# Modify and add data for Event Sponsors
# import random
# import pandas as pd

# # Function to generate new unique records, with random number of sponsors for each user
# def generate_unique_data(existing_pairs, num_users, max_sponsors):
#     new_data = []
#     for user_id in range(1, num_users + 1):
#         num_sponsors = random.randint(0, max_sponsors)  # Random number of sponsors for each user
#         for _ in range(num_sponsors):
#             event_id = random.randint(1, 219)
#             sponsorship_amount = random.randint(1000, 50000)
#             if (user_id, event_id) not in existing_pairs:
#                 new_data.append((user_id, event_id, sponsorship_amount))
#                 existing_pairs.add((user_id, event_id))
#     return new_data

# # Set existing data for uniqueness check
# existing_pairs = set()

# # Generate data for 100 users with up to 5 sponsors per user
# new_records = generate_unique_data(existing_pairs, num_users=200, max_sponsors=5)

# # Assuming df_existing is defined
# df_existing = pd.DataFrame([], columns=['UserID', 'EventID', 'SponsorshipAmount'])  # Empty DataFrame to start

# # Convert new records to DataFrame
# df_new = pd.DataFrame(new_records, columns=['UserID', 'EventID', 'SponsorshipAmount'])

# # Combine existing and new records into a DataFrame
# df_combined = pd.concat([df_existing, df_new], ignore_index=True)

# # Save the combined DataFrame to a CSV file
# file_path = "event_sponsordata.csv"
# df_combined.to_csv(file_path, index=False)

# print(f"File saved as {file_path}")

# modify 3
# for user_event
import random
import pandas as pd

# Function to generate new unique records for users purchasing tickets for events
def generate_ticket_data(existing_pairs, num_events, max_users_per_event):
    ticket_types = ["Standard", "Premium", "VIP"]  # Ticket types
    new_data = []
    for event_id in range(1, num_events + 1):
        num_users = random.randint(1, max_users_per_event)  # Random number of users per event
        for _ in range(num_users):
            user_id = random.randint(1, 200)
            ticket_type = random.choice(ticket_types)
            purchase_date = pd.Timestamp('2024-01-01') + pd.to_timedelta(random.randint(0, 365), unit='days')
            if (user_id, event_id) not in existing_pairs:
                new_data.append((user_id, event_id, ticket_type, purchase_date))
                existing_pairs.add((user_id, event_id))
    return new_data

# Set existing data for uniqueness check
existing_pairs = set()

# Generate data for 219 events with up to 10 users per event
new_records = generate_ticket_data(existing_pairs, num_events=219, max_users_per_event=10)

# Assuming df_existing is defined
df_existing = pd.DataFrame([], columns=['UserID', 'EventID', 'TicketType', 'PurchaseDate'])  # Empty DataFrame to start

# Convert new records to DataFrame
df_new = pd.DataFrame(new_records, columns=['UserID', 'EventID', 'TicketType', 'PurchaseDate'])

# Combine existing and new records into a DataFrame
df_combined = pd.concat([df_existing, df_new], ignore_index=True)

# Save the combined DataFrame to a CSV file
file_path = "user_event.csv"
df_combined.to_csv(file_path, index=False)

print(f"File saved as {file_path}")