import fastf1
import pandas as pd


seasons = [2018,2019,2020,2021,2022,2023,2024]
# List of all known 'Location' values for current F1 circuits (2024 calendar and recent years)
# This list includes canonical and alternate names to ensure all races at current tracks are included.
current_circuits = [
    # Abu Dhabi
    "Abu Dhabi", "Yas Island", "Yas Marina",
    # Austin
    "Austin",
    # Bahrain
    "Bahrain", "Sakhir",
    # Baku
    "Baku",
    # Barcelona
    "Barcelona", "Montmeló", "Spain",
    # Budapest
    "Budapest",
    # Imola
    "Imola",
    # Jeddah
    "Jeddah",
    # Las Vegas
    "Las Vegas", "Vegas",
    # Lusail
    "Lusail", "Qatar",
    # Melbourne
    "Melbourne",
    # Mexico City
    "Mexico City",
    # Miami
    "Miami",
    # Monaco
    "Monaco", "Monte Carlo", "Monte-Carlo",
    # Montreal
    "Montreal", "Montréal",
    # Monza
    "Monza",
    # Shanghai
    "Shanghai",
    # Silverstone
    "Silverstone",
    # Singapore
    "Singapore", "Marina Bay",
    # Spa
    "Spa", "Spa-Francorchamps",
    # Spielberg
    "Spielberg",
    # Suzuka
    "Suzuka",
    # São Paulo
    "São Paulo",
    # Zandvoort
    "Zandvoort",
]

def get_race_list(seasons):
    raceList = []
    for year in seasons:
        schedule = fastf1.get_event_schedule(year)
        for _, row in schedule.iterrows(): #Allows iteration over a dataframe
            if row['EventFormat'] != 'conventional' or row['Location'] not in current_circuits:
                continue
            race_info = {
                'season': year,
                'round': row['RoundNumber'],
                'event_name': row['EventName'],
                'circuit': row["Location"],
                'event_date': row['EventDate']
                }
            raceList.append(race_info)
    return pd.DataFrame(raceList)

def get_session_lap_times(season, round_number, session_type):
    session = fastf1.get_session(season, round_number, session_type)
    session.load()
    laps = session.laps
    fastest_laps = {}
    for driver in laps['Driver'].unique():
        driver_laps = laps[laps["Driver"] == driver]
        if not driver_laps.empty:
            fastest = driver_laps['LapTime'].min()
            
            if pd.notnull(fastest):
                fastest_laps[driver] = fastest.total_seconds()
    
    return fastest_laps


def main():
    lap_times = []
    races = get_race_list(seasons)
    for idx, race in races.iterrows():
        season = race['season']
        round_number = race['round']
        event_name = race['event_name']
        session_type = 'FP1'
        print(f"Getting lap times for {event_name} ({season}, Round {round_number}, {session_type})")
        try:
            lap_times = get_session_lap_times(season,round_number,session_type)
            for driver, time in lap_times.items():
                print(f"Driver: {driver} Fastest Lap: {time}")
            input("Press Enter to load next session")
        except Exception as e:
            print((f"Skipping {event_name} ({season}, Round {round_number}, {session_type}) due to error: {e}"))
            input("Press Enter to load next session")


def test():
    races = get_race_list(seasons)
    print(races)
    

    
main()