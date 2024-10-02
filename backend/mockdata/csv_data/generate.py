import random
import pandas as pd
from faker import Faker

fake = Faker()

# Number of rows for each entity
n_users = 200
n_events = 50
n_venues = 20
n_organizations = 50
n_sponsors = 100
n_user_event_links = 300  # Users attending events
n_event_sponsor_links = 150  # Sponsors sponsoring events

# Helper function to create unique emails
def generate_email(first_name, last_name):
    domains = ["@gmail.com", "@yahoo.com", "@hotmail.com"]
    return f"{first_name.lower()}_{last_name.lower()}{random.choice(domains)}"

# Function to randomly return None for a nullable field
def nullable_field(value, probability_of_null=0.1):
    return value if random.random() > probability_of_null else None

# 1. User Table Mock Data
users = []
for i in range(n_users):
    first_name = fake.first_name()
    last_name = fake.last_name()
    users.append({
        # "UserID": i + 1,
        "Name": f"{first_name} {last_name}",
        "Password": fake.password(),
        "Email": generate_email(first_name, last_name),
        "Phone": fake.phone_number(),
        "OrganizationID": nullable_field(random.randint(1, n_organizations), 0.2) #random.randint(1, n_organizations)
    })

# 2. Event Table Mock Data
events = []
for i in range(n_events):
    events.append({
        # "EventID": i + 1,
        "EventName": fake.catch_phrase(),
        "EventDate": fake.date_this_year(),
        "TicketPrice": round(random.uniform(20, 200), 2),
        "VenueID": random.randint(1, n_venues),
        "OrganizationID": random.randint(1, n_organizations)
    })

# 3. Venue Table Mock Data
venues = []
for i in range(n_venues):
    venues.append({
        # "VenueID": i + 1,
        "VenueName": fake.company_suffix() + " Convention Center",
        "Location": fake.city(),
        "Capacity": random.randint(1000, 5000)
    })

# 4. Organization Table Mock Data
organizations = []
for i in range(n_organizations):
    organizations.append({
        # "OrganizationID": i + 1,
        "OrganizationName": fake.company()
    })

# 5. Sponsor Table Mock Data
sponsors = []
for i in range(n_sponsors):
    sponsors.append({
        # "SponsorID": i + 1,
        "SponsorName": fake.company(),
        "SponsorEmail": generate_email(fake.first_name(), fake.last_name()),
        "SponsorPhone": fake.phone_number()
    })

# 6. UserEvent Table Mock Data (users attending events)
user_event = []
ticket_types = ['Standard', 'VIP', 'Premium']
for i in range(n_user_event_links):
    user_event.append({
        "UserID": random.randint(1, n_users),
        "EventID": random.randint(1, n_events),
		"TicketCount": random.randint(1, 5),  # Number of tickets purchased
        "TicketType": random.choice(ticket_types),  # Type of ticket
        "PurchaseDate": fake.date_this_year()  # Date of purchase
    })

# 7. EventSponsor Table Mock Data (sponsors for events)
event_sponsor = []
for i in range(n_event_sponsor_links):
    event_sponsor.append({
        "EventID": random.randint(1, n_events),
        "SponsorID": random.randint(1, n_sponsors),
		"SponsorshipAmount": random.randint(500, 50000)  # Generate a random sponsorship amount between 1000 and 50000
    })

# Convert to DataFrames
df_users = pd.DataFrame(users)
df_events = pd.DataFrame(events)
df_venues = pd.DataFrame(venues)
df_organizations = pd.DataFrame(organizations)
df_sponsors = pd.DataFrame(sponsors)
df_user_event = pd.DataFrame(user_event)
df_event_sponsor = pd.DataFrame(event_sponsor)

# Save to CSV files
df_users.to_csv('users.csv', index=False)
df_events.to_csv('events.csv', index=False)
df_venues.to_csv('venues.csv', index=False)
df_organizations.to_csv('organizations.csv', index=False)
df_sponsors.to_csv('sponsors.csv', index=False)
df_user_event.to_csv('user_event.csv', index=False)
df_event_sponsor.to_csv('event_sponsor.csv', index=False)

print("Mock data generated and saved to CSV files.")