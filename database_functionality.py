import numpy as np
import pandas as pd
import sqlite3
import threading # for performance

DATABASE = './datasets/climate.db'
    

# def get_landing_page_stats():
#     with sqlite3.connect(DATABASE) as con:
#         # STAT MOST REGIONS 
#         most_weather_stations_query = (
#             """
#             select state_name
#             from states
#             where state_id = (
#                 select state_id
#                 from weather_stations
#                 group by state_id
#                 order by count(site_id) desc
#                 limit 1
#             );
#             """
#         )
        
#         state = pd.read_sql_query(most_weather_stations_query,con).loc[0,"state_name"]


#         # STAT HOTTEST YEAR
#         hottest_year_query = (
#         """
#             select strftime('%Y',DMY) as year, AVG(MaxTemp) as avg_max_temp
#             from bom_data
#             group by strftime('%Y',DMY) 
#             order by 2 desc
#             limit 1;
#         """
#         )

#         hottest_year = pd.read_sql_query(hottest_year_query, con).loc[0,"year"]


#          # STAT highest temperature recorded

#         highest_temp_recorded_query = 'select MAX(MaxTemp) as highest_temp_recorded from bom_data;'
#         highest_temp_recorded = pd.read_sql_query(highest_temp_recorded_query, con).loc[0, 'highest_temp_recorded']

#         driest_year_query = (
#         """
#             select strftime('%Y',DMY) as year, SUM(Precipitation) as total_precipitation
#             from bom_data
#             group by strftime('%Y',DMY) 
#             order by 2 asc
#             limit 1;
#         """
#         )

#         driest_year = pd.read_sql_query(driest_year_query, con).loc[0,'year']

#     return (state, hottest_year, driest_year, highest_temp_recorded)

# # this is run when the file is being imported and we don't need to query for these stats every time someone loads the home page as it increases the wait time. Better to query once and use many times, especially when the stat won't change on each visit.
# stat1, stat2, stat3, stat4 = get_landing_page_stats()



landing_page_stats = {}

def get_landing_page_stats_v2(name, query):
    with sqlite3.connect(DATABASE, check_same_thread=False) as con:
       
        value = pd.read_sql_query(query,con).iloc[0,0]
        landing_page_stats[name] = value


most_weather_stations_query = (
            """
            select state_name
            from states
            where state_id = (
                select state_id
                from weather_stations
                group by state_id
                order by count(site_id) desc
                limit 1
            );
            """
        )
hottest_year_query = (
        """
            select strftime('%Y',DMY) as year, AVG(MaxTemp) as avg_max_temp
            from bom_data
            group by strftime('%Y',DMY) 
            order by 2 desc
            limit 1;
        """
        )
highest_temp_recorded_query = 'select MAX(MaxTemp) as highest_temp_recorded from bom_data;'
driest_year_query = (
        """
            select strftime('%Y',DMY) as year, SUM(Precipitation) as total_precipitation
            from bom_data
            group by strftime('%Y',DMY) 
            order by 2 asc
            limit 1;
        """
        )

landing_page_queries = {'most_weather_stations':most_weather_stations_query,
'hottest_year':hottest_year_query,
'highest_temp_recorded':highest_temp_recorded_query,
'driest_year':driest_year_query} 

landing_page_threads = []

for name, sql in landing_page_queries.items():
    t = threading.Thread(target=get_landing_page_stats_v2, args=(name, sql))
    landing_page_threads.append(t)
    t.start()

for t in landing_page_threads:
    t.join()

landing_page_threads.clear()


def get_states():

    with sqlite3.connect(DATABASE) as con:
        states_df = pd.read_sql_query('''select state_name from states''',con)
    return list(states_df.loc[:,'state_name'].values)


# States queried at the time of import
states_names = get_states()

def get_min_max_lat(state):
    
    with sqlite3.connect(DATABASE) as con:
        state_id = pd.read_sql_query(
            f'''
            select state_id
            from states
            where state_name = "{state}";
            '''
            , con).loc[0, "state_id"]
        
        min_max_df = pd.read_sql_query(
            f'''
            select ROUND(MIN(lat)-2,2) as min_lat, ROUND(MAX(lat)+2,2) as max_lat
            from weather_stations
            where state_id = {state_id};
            '''
            , con)
        
        return min_max_df.to_dict(orient='records')



task2A_init = {}

def task2A_initial_data(name,query):
    with sqlite3.connect(DATABASE, check_same_thread=False) as con:

        df = pd.read_sql_query(query,con)
        task2A_init[name] = [np.concatenate([np.arange(df.shape[0]).reshape(-1,1),df.values],axis=1).tolist(), list(df.columns), query]
        

weather_stations_per_state = '''
            select REPLACE(s.state_name,'.','') as state, COUNT(ws.site_id) as '# weather stations'
            from weather_stations ws join states s
            on ws.state_id = s.state_id
            group by s.state_name
            order by state;
            '''
all_sites = (
            '''
    select 
        site_id as site,
        name,
        ROUND(lat,2) as lat,
        ROUND(long,2) as long,
        REPLACE(state_name,'.','') as state,
        REPLACE(region_name,'N.A.','') as region
    from
        weather_stations ws 
            LEFT JOIN states s on ws.state_id = s.state_id
            LEFT JOIN regions r on ws.region_id = r.region_id
    '''
    )
avg_annual_rainfall_per_state = (
            '''
            select
                state,
                ROUND(AVG(avgRainfall),2) as 'avg annual rainfall (mm)'
            from (
                select
                    strftime('%Y',DMY) as year,
                    REPLACE(s.state_name,".","") as state,
                    AVG(Precipitation) as avgRainfall
                from bom_data bd
                    LEFT JOIN weather_stations ws on bd.Location = ws.site_id
                    LEFT JOIN states s on ws.state_id = s.state_id
                where ws.site_id IS NOT NULL
                group by s.state_name, strftime('%Y',DMY)
            )
            where avgRainfall IS NOT NULL
            group by state;
    '''
    )

avg_annual_max_temp_per_state = (
            '''
            select
                state,
                ROUND(AVG(avgMaxTemp),2) as 'avg annual max temp (℃)'
            from (
                select
                    strftime('%Y',DMY) as year,
                    REPLACE(s.state_name,".","") as state,
                    AVG(MaxTemp) as avgMaxTemp
                from bom_data bd
                    LEFT JOIN weather_stations ws on bd.Location = ws.site_id
                    LEFT JOIN states s on ws.state_id = s.state_id
                where ws.site_id IS NOT NULL
                group by s.state_name, strftime('%Y',DMY)
            )
            where avgMaxTemp IS NOT NULL
            group by state;
    '''
    )

avg_annual_min_temp_per_state = (
            '''
            select
                state,
                ROUND(AVG(avgMinTemp),2) as 'avg annual min temp (℃)'
            from (
                select
                    strftime('%Y',DMY) as year,
                    REPLACE(s.state_name,".","") as state,
                    AVG(MinTemp) as avgMinTemp
                from bom_data bd
                    LEFT JOIN weather_stations ws on bd.Location = ws.site_id
                    LEFT JOIN states s on ws.state_id = s.state_id
                where ws.site_id IS NOT NULL
                group by s.state_name, strftime('%Y',DMY)
            )
            where avgMinTemp IS NOT NULL
            group by state;
    '''
    )

avg_annual_evaporation_per_state = (
            '''
            select
                state,
                ROUND(AVG(avgEvaporation),2) as 'avg annual evaporation (mm)'
            from (
                select
                    strftime('%Y',DMY) as year,
                    REPLACE(s.state_name,".","") as state,
                    AVG(Evaporation) as avgEvaporation
                from bom_data bd
                    LEFT JOIN weather_stations ws on bd.Location = ws.site_id
                    LEFT JOIN states s on ws.state_id = s.state_id
                where ws.site_id IS NOT NULL
                group by s.state_name, strftime('%Y',DMY)
            )
            where avgEvaporation IS NOT NULL
            group by state;
            
    '''
    )

avg_annual_sunshine_per_state = (
            '''
            select
                state,
                ROUND(AVG(avgSunshine),2) as 'avg annual sunshine (hrs)'
            from (
                select
                    strftime('%Y',DMY) as year,
                    REPLACE(s.state_name,".","") as state,
                    AVG(Sunshine) as avgSunshine
                from bom_data bd
                    LEFT JOIN weather_stations ws on bd.Location = ws.site_id
                    LEFT JOIN states s on ws.state_id = s.state_id
                where ws.site_id IS NOT NULL
                group by s.state_name, strftime('%Y',DMY)
            )
            where avgSunshine IS NOT NULL
            group by state;
            
    '''
    )


task2A_initial_queries ={
    'weather_stations_per_state':weather_stations_per_state,
'all_sites':all_sites,
'avg_annual_rainfall_per_state':avg_annual_rainfall_per_state,
'avg_annual_max_temp_per_state':avg_annual_max_temp_per_state,
'avg_annual_min_temp_per_state':avg_annual_min_temp_per_state,
'avg_annual_evaporation_per_state':avg_annual_evaporation_per_state,
'avg_annual_sunshine_per_state':avg_annual_sunshine_per_state
}

task2A_initial_threads = []



for name, sql in task2A_initial_queries.items():
    t = threading.Thread(target=task2A_initial_data, args=(name, sql))
    task2A_initial_threads.append(t)
    t.start()

for t in task2A_initial_threads:
    t.join()

task2A_initial_threads.clear()



def get_stations_within_area(state, start_lat, end_lat):

    query = f'''
    SELECT 
        ws.site_id as site,
        ws.name as name,
        r.region_name as region,
        ROUND(ws.lat,2) as latitude
    FROM weather_stations ws 
        LEFT JOIN states s on ws.state_id = s.state_id
        LEFT JOIN regions r on ws.region_id = r.region_id
    WHERE 
        (s.state_name  = "{state}")
        AND 
        (ws.lat BETWEEN {start_lat} AND {end_lat})'''
    
    with sqlite3.connect(DATABASE) as con:
        df = pd.read_sql_query(query,con)
    
    return [np.concatenate([np.arange(df.shape[0]).reshape(-1,1),df.values],axis=1).tolist(), list(df.columns), query]
   
def region_wise_metrics():
    pass

def region_wise_metrics(state, start_lat, end_lat, metric, period):

    periods = { 'January':'01',
    'February':'02',
    'March':'03',
    'April':'04',
    'May':'05',
    'June':'06',
    'July':'07',
    'August':'08',
    'September':'09',
    'October':'10',
    'November':'11',
    'December':'12'}
   
    metricNames = {'Precipitation':['avgRainfall','avg rainfall (mm)'],'MaxTemp':['avgMaxTemp','avg max temp (℃)'],'MinTemp':['avgMinTemp','avg min temp (℃)'],'Evaporation':['avgEvaporation','avg evaporation (mm)'],'Sunshine':['avgSunshine','avg sunshine (hrs)']}

    if period == 'Annual':
        query = f'''
        WITH stations_within_area AS (
                SELECT 
                    ws.site_id as site,
                    r.region_name as region
                FROM weather_stations ws 
                    LEFT JOIN states s on ws.state_id = s.state_id
                    LEFT JOIN regions r on ws.region_id = r.region_id
                WHERE 
                    (s.state_name  = "{state}")
                    AND 
                    (ws.lat BETWEEN {start_lat} AND {end_lat})
        ),
        stations_per_region AS (
                SELECT
                    region,
                    COUNT(*) as '# weather stations'
                FROM stations_within_area swa
                GROUP BY swa.region
        ),
        region_wise_stats AS (
                SELECT
                    region,
                    ROUND(AVG({metricNames[metric][0]}),2) as '{metricNames[metric][1]}'
                FROM (
                    SELECT
                        strftime('%Y',DMY) as year,
                        swa.region,
                        AVG({metric}) as {metricNames[metric][0]}
                    FROM bom_data bd
                        LEFT JOIN stations_within_area swa on bd.Location = swa.site
                    WHERE swa.site IS NOT NULL
                    GROUP BY swa.region, strftime('%Y',DMY)
                )
                WHERE {metricNames[metric][0]} IS NOT NULL
                GROUP BY region
        )
        SELECT
            spr.region,
            spr."# weather stations",
            rws."{metricNames[metric][1]}"
        FROM stations_per_region spr
            INNER JOIN region_wise_stats rws on spr.region = rws.region;
        '''
    else:
        query = f'''
        WITH stations_within_area AS (
                SELECT 
                    ws.site_id as site,
                    r.region_name as region
                FROM weather_stations ws 
                    LEFT JOIN states s on ws.state_id = s.state_id
                    LEFT JOIN regions r on ws.region_id = r.region_id
                WHERE 
                    (s.state_name  = "{state}")
                    AND 
                    (ws.lat BETWEEN {start_lat} AND {end_lat})
        ),
        stations_per_region AS (
                SELECT
                    region,
                    COUNT(*) as '# weather stations'
                FROM stations_within_area swa
                GROUP BY swa.region
        ),
        region_wise_stats AS (
                SELECT
                    region,
                    ROUND(AVG({metricNames[metric][0]}),2) as '{metricNames[metric][1]}'
                FROM (
                    SELECT
                        strftime('%Y',DMY) as year,
                        strftime('%m',DMY) as month,
                        swa.region,
                        AVG({metric}) as {metricNames[metric][0]}
                    FROM bom_data bd
                        LEFT JOIN stations_within_area swa on bd.Location = swa.site
                    WHERE swa.site IS NOT NULL
                    GROUP BY swa.region, strftime('%Y',DMY), strftime('%m',DMY)
                )
                WHERE {metricNames[metric][0]} IS NOT NULL AND month = '{periods[period]}'
                GROUP BY region
        )
        SELECT
            spr.region,
            spr."# weather stations",
            rws."{metricNames[metric][1]}"
        FROM stations_per_region spr
            INNER JOIN region_wise_stats rws on spr.region = rws.region;
        '''
    
    with sqlite3.connect(DATABASE) as con:
        df = pd.read_sql_query(query,con)
    
    return [np.concatenate([np.arange(df.shape[0]).reshape(-1,1),df.values],axis=1).tolist(), list(df.columns), query]





def get_stations_in_state(state):
    
    with sqlite3.connect(DATABASE) as con:
        state_id = pd.read_sql_query(
            f'''
            select state_id
            from states
            where state_name = "{state}";
            '''
            , con).loc[0, "state_id"]
        
        stations_df = pd.read_sql_query(
            f'''
              with exclude_stations as (
      
                select DISTINCT(site_id) as missing_stations
                from bom_data bd
                    RIGHT JOIN weather_stations ws on bd.Location = ws.site_id
                where bd.Location IS NULL
            )


            select site_id, name
            from weather_stations
            where state_id = {state_id} AND
            site_id NOT IN (select missing_stations from exclude_stations)
            order by name;
            '''
            , con)
        
        return stations_df.to_dict(orient='records')



def get_decades():

    with sqlite3.connect(DATABASE) as con:
        decades = pd.read_sql_query(
            '''
select DISTINCT(CAST(FLOOR(CAST(strftime("%Y",DMY) as INT) / 10) * 10 as TEXT)) as decades
from bom_data
'''
,con)
        
        decades_list = list(decades.loc[:,"decades"].values)

    return {"decades": decades_list}

decades = get_decades()


def get_station_name(station_id):
    with sqlite3.connect(DATABASE) as con:
        station_name = pd.read_sql_query(
            f'''
        select name
        from weather_stations
        where site_id = {station_id}
''',con).loc[0,"name"]
    
    return station_name


def get_similar_stations(metric, period_1, period_2, reference_station, topN):

    metricNames = {'Precipitation':'avg rainfall (mm)','MaxTemp':'avg max temp (℃)','MinTemp':'avg min temp (℃)'}

    period_1_end = int(period_1) + 9
    period_2_end = int(period_2) + 9
    metric_alias = metricNames[metric]

    with sqlite3.connect(DATABASE) as con:

        query = f'''
        with period1_stats as (
            select Location, AVG({metric}) as "{metric_alias} {period_1}'s"
            from bom_data
            where CAST(strftime('%Y', DMY) as INT) BETWEEN {period_1} AND {period_1_end}
            group by Location
        ),
        period2_stats as (
            select Location, AVG({metric}) as "{metric_alias} {period_2}'s"
            from bom_data
            where CAST(strftime('%Y', DMY) as INT) BETWEEN {period_1} AND {period_2_end}
            group by Location
        ),
        combined_stats as (
            select 
                p1.Location,
                "{metric_alias} {period_1}'s",
                "{metric_alias} {period_2}'s",
                100 * ("{metric_alias} {period_2}'s" - "{metric_alias} {period_1}'s") / "{metric_alias} {period_1}'s" as "% change"
            from period1_stats p1
                INNER JOIN period2_stats p2 on p1.Location = p2.Location
            WHERE "{metric_alias} {period_1}'s" IS NOT NULL AND 
                "{metric_alias} {period_2}'s" IS NOT NULL
        ),
        final_cte as (
            select 
                *,
                "% change" - (select "% change" from combined_stats where Location = {reference_station}) as "relative difference",
                ABS("% change" - (select "% change" from combined_stats where Location = {reference_station})) as "absDiff"
            from combined_stats
            order by absDiff
        )
        select
            name as "station name",
            ROUND("{metric_alias} {period_1}'s", 3) as "{metric_alias} {period_1}'s",
            ROUND("{metric_alias} {period_2}'s", 3) as "{metric_alias} {period_2}'s",
            ROUND("% change",4) as "% change",
            ROUND("relative difference", 5) as "relative difference (%)"
        from final_cte fc
            LEFT JOIN weather_stations ws on fc.Location = ws.site_id
        where "station name" IS NOT NULL
        order by absDiff
        limit {int(topN) + 1}
    '''
        df = pd.read_sql_query(query, con)

    return [np.concatenate([np.arange(df.shape[0]).reshape(-1,1),df.values],axis=1).tolist(), list(df.columns), query]
   


def download_data(query):
    with sqlite3.connect(DATABASE) as con:
        df = pd.read_sql_query(query,con)
    return df










# ---------------------------------------------------- TASK 2A INITIAL DATA OLD VERSION

# def get_weather_stations_per_state():
#     with sqlite3.connect(DATABASE) as con:
#         query = '''
#             select REPLACE(s.state_name,'.','') as state, COUNT(ws.site_id) as stations
#             from weather_stations ws join states s
#             on ws.state_id = s.state_id
#             group by s.state_name
#             order by state;
#             '''
#         df = pd.read_sql_query(query,con)

        
    
#     # return df.to_html(classes='data-table', justify='left'), list(df.columns)
#     return np.concatenate([np.arange(df.shape[0]).reshape(-1,1),df.values],axis=1).tolist(), list(df.columns), query


# def get_sites_across_australia():
#     with sqlite3.connect(DATABASE) as con:
#         query = (
#             '''
#     select 
#         site_id as site,
#         name,
#         ROUND(lat,2) as lat,
#         ROUND(long,2) as long,
#         REPLACE(state_name,'.','') as state,
#         REPLACE(region_name,'N.A.','') as region
#     from
#         weather_stations ws 
#             LEFT JOIN states s on ws.state_id = s.state_id
#             LEFT JOIN regions r on ws.region_id = r.region_id
#     '''
#     )
#         df = pd.read_sql_query(query,con)


#     return np.concatenate([np.arange(df.shape[0]).reshape(-1,1),df.values],axis=1).tolist(), list(df.columns), query



# def get_avg_annual_rainfall_per_state():
#     with sqlite3.connect(DATABASE) as con:
#         query = (
#             '''
#             select
#                 state,
#                 ROUND(AVG(avgRainfall),2) as 'avg annual rainfall (mm)'
#             from (
#                 select
#                     strftime('%Y',DMY) as year,
#                     REPLACE(s.state_name,".","") as state,
#                     AVG(Precipitation) as avgRainfall
#                 from bom_data bd
#                     LEFT JOIN weather_stations ws on bd.Location = ws.site_id
#                     LEFT JOIN states s on ws.state_id = s.state_id
#                 where ws.site_id IS NOT NULL
#                 group by s.state_name, strftime('%Y',DMY)
#             )
#             group by state;
#     '''
#     )
#         df = pd.read_sql_query(query,con)


#     return np.concatenate([np.arange(df.shape[0]).reshape(-1,1),df.values],axis=1).tolist(), list(df.columns), query


# def get_avg_annual_max_temp_per_state():
#     with sqlite3.connect(DATABASE) as con:
#         query = (
#             '''
#             select
#                 state,
#                 ROUND(AVG(avgMaxTemp),2) as 'avg annual max temp (℃)'
#             from (
#                 select
#                     strftime('%Y',DMY) as year,
#                     REPLACE(s.state_name,".","") as state,
#                     AVG(MaxTemp) as avgMaxTemp
#                 from bom_data bd
#                     LEFT JOIN weather_stations ws on bd.Location = ws.site_id
#                     LEFT JOIN states s on ws.state_id = s.state_id
#                 where ws.site_id IS NOT NULL
#                 group by s.state_name, strftime('%Y',DMY)
#             )
#             group by state;
#     '''
#     )
#         df = pd.read_sql_query(query,con)


#     return np.concatenate([np.arange(df.shape[0]).reshape(-1,1),df.values],axis=1).tolist(), list(df.columns), query


# def get_avg_annual_min_temp_per_state():
#     with sqlite3.connect(DATABASE) as con:
#         query = (
#             '''
#             select
#                 state,
#                 ROUND(AVG(avgMinTemp),2) as 'avg annual min temp (℃)'
#             from (
#                 select
#                     strftime('%Y',DMY) as year,
#                     REPLACE(s.state_name,".","") as state,
#                     AVG(MinTemp) as avgMinTemp
#                 from bom_data bd
#                     LEFT JOIN weather_stations ws on bd.Location = ws.site_id
#                     LEFT JOIN states s on ws.state_id = s.state_id
#                 where ws.site_id IS NOT NULL
#                 group by s.state_name, strftime('%Y',DMY)
#             )
#             group by state;
#     '''
#     )
#         df = pd.read_sql_query(query,con)


#     return np.concatenate([np.arange(df.shape[0]).reshape(-1,1),df.values],axis=1).tolist(), list(df.columns), query


# def get_avg_annual_evaporation_per_state():
#     with sqlite3.connect(DATABASE) as con:
#         query = (
#             '''
#             select
#                 state,
#                 ROUND(AVG(avgEvaporation),2) as 'avg annual evaporation (mm)'
#             from (
#                 select
#                     strftime('%Y',DMY) as year,
#                     REPLACE(s.state_name,".","") as state,
#                     AVG(Evaporation) as avgEvaporation
#                 from bom_data bd
#                     LEFT JOIN weather_stations ws on bd.Location = ws.site_id
#                     LEFT JOIN states s on ws.state_id = s.state_id
#                 where ws.site_id IS NOT NULL
#                 group by s.state_name, strftime('%Y',DMY)
#             )
#             where avgEvaporation IS NOT NULL
#             group by state;
            
#     '''
#     )
#         df = pd.read_sql_query(query,con)


#     return np.concatenate([np.arange(df.shape[0]).reshape(-1,1),df.values],axis=1).tolist(), list(df.columns), query


# def get_avg_annual_sunshine_per_state():
#     with sqlite3.connect(DATABASE) as con:
#         query = (
#             '''
#             select
#                 state,
#                 ROUND(AVG(avgSunshine),2) as 'avg annual sunshine (hrs)'
#             from (
#                 select
#                     strftime('%Y',DMY) as year,
#                     REPLACE(s.state_name,".","") as state,
#                     AVG(Sunshine) as avgSunshine
#                 from bom_data bd
#                     LEFT JOIN weather_stations ws on bd.Location = ws.site_id
#                     LEFT JOIN states s on ws.state_id = s.state_id
#                 where ws.site_id IS NOT NULL
#                 group by s.state_name, strftime('%Y',DMY)
#             )
#             where avgSunshine IS NOT NULL
#             group by state;
            
#     '''
#     )
#         df = pd.read_sql_query(query,con)


#     return np.concatenate([np.arange(df.shape[0]).reshape(-1,1),df.values],axis=1).tolist(), list(df.columns), query

