import fastf1
import pandas as pd
import os

seasons = [2025]
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
    "São Paulo", "Interlagos", "Brazil",
    # Zandvoort
    "Zandvoort",
]

def get_race_list(seasons):
    raceList = []
    for year in seasons:
        schedule = fastf1.get_event_schedule(year)
        for _, row in schedule.iterrows(): #Allows iteration over a dataframe
            if row.get('EventFormat', 'conventional') != 'conventional' or row['Location'] not in current_circuits:
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
            
            if pd.notnull(fastest) and not isinstance(fastest, pd.Series):
                fastest_laps[driver] = fastest.total_seconds()
    
    return fastest_laps


def main():
    session_list = ['FP1', "FP2", "FP3", "Qualifying"]
    all_rows = []
    lap_times = []
    races = get_race_list(seasons)
    
    
    for idx, race in races.iterrows():
        season = race['season']
        round_number = race['round']
        event_name = race['event_name']
        circuit = race['circuit']
        #missing_rounds = [15,23,24]  # Replace with your actual missing round numbers from 2019
        #if race['round'] not in missing_rounds:
        #    continue
        session_times = {}
        driver_sets = []
        for session_type in session_list:
            try:
                lap_times = get_session_lap_times(season,round_number,session_type)
                session_times[session_type] = lap_times
                driver_sets.append(set(lap_times.keys()))
            except Exception as e:
                print((f"Skipping {event_name} ({season}, Round {round_number}, {session_type}) due to error: {e}"))
                user_input = input("Press enter to continue: ")
                break
        else:
            # Only keep drivers who have times in all sessions
            common_drivers = set.intersection(*driver_sets) if driver_sets else set()
            for driver in common_drivers:
                row = {
                    'season': season,
                    'round': round_number,
                    'event_name': event_name,
                    'circuit': circuit,
                    'driver': driver,
                    'fp1_time': session_times['FP1'][driver],
                    'fp2_time': session_times['FP2'][driver],
                    'fp3_time': session_times['FP3'][driver],
                    'quali_time': session_times['Qualifying'][driver],
                }
                all_rows.append(row)

    df = pd.DataFrame(all_rows)
    parquet_path  = "../data/raw.parquet"
   
   
    if os.path.exists(parquet_path):
        existing_df = pd.read_parquet(parquet_path)
        df = pd.concat([existing_df, df], ignore_index=True)

    df.to_parquet(parquet_path, index=False)

   
    print(f"Saved {len(df)} rows to ../data/raw.parquet")
            




    

    
main()