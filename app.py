from flask import Flask, url_for, render_template, redirect, request, jsonify, render_template_string, send_file
import database_functionality
import json
import tempfile
import pandas




'''
###################################
            VARIABLES
###################################
'''




app = Flask(__name__)


'''
###################################
              ROUTES
###################################
'''

@app.route('/')
@app.route('/home')
def home():
    
    landing_page_stats = database_functionality.landing_page_stats
    # stat1, stat2, stat3, stat4 = [database_functionality.stat1, database_functionality.stat2,
    #                               database_functionality.stat3, database_functionality.stat4]
    stat1, stat2, stat3, stat4 = [landing_page_stats['most_weather_stations'],landing_page_stats['hottest_year'],landing_page_stats['driest_year'],landing_page_stats['highest_temp_recorded']]
    # print(landing_page_stats)
       
  



    return render_template(
        'index.html',
        stat1 = stat1,
        stat2 = stat2,
        stat3 = stat3,
        stat4 = stat4)


# @app.route('/about')
# def about():
#     return render_template('about.html')


@app.route('/task2A', methods=['GET','POST'])
def task_2A():
    state_names = database_functionality.states_names
    climate_metrics = {'Precipitation': 'Rainfall', 'MaxTemp': 'Max Temp',
                            'MinTemp': 'Min Temp', 'Evaporation':'Evaporation',
                            'Sunshine':'Sunshine Duration'}
    
    if request.method == "GET":
        data_title = f'Australia — Overview'
        # weather_stations_per_state = ('Weather Stations per State',database_functionality.get_weather_stations_per_state())
        # sites_across_australia = ('Sites across Australia', database_functionality.get_sites_across_australia())
        # avg_annual_rainfall_per_state = ('Avg Annual Rainfall per State', database_functionality.get_avg_annual_rainfall_per_state())
        # avg_annual_max_temp_per_state = ('Avg Annual Max Temp per State', database_functionality.get_avg_annual_max_temp_per_state())
        # avg_annual_min_temp_per_state = ('Avg Annual Min Temp per State', database_functionality.get_avg_annual_min_temp_per_state())
        # avg_annual_evaporation_per_state = ('Avg Annual Evaporation per State', database_functionality.get_avg_annual_evaporation_per_state())
        # avg_annual_sunshine_per_state = ('Avg Annual Sunshie Duration per State', database_functionality.get_avg_annual_sunshine_per_state())

        weather_stations_per_state = ('Weather Stations per State',database_functionality.task2A_init['weather_stations_per_state'])
        sites_across_australia = ('Sites across Australia', database_functionality.task2A_init['all_sites'])
        avg_annual_rainfall_per_state = ('Avg Annual Rainfall per State', database_functionality.task2A_init['avg_annual_rainfall_per_state'])
        avg_annual_max_temp_per_state = ('Avg Annual Max Temp per State', database_functionality.task2A_init['avg_annual_max_temp_per_state'])
        avg_annual_min_temp_per_state = ('Avg Annual Min Temp per State', database_functionality.task2A_init['avg_annual_min_temp_per_state'])
        avg_annual_evaporation_per_state = ('Avg Annual Evaporation per State', database_functionality.task2A_init['avg_annual_evaporation_per_state'])
        avg_annual_sunshine_per_state = ('Avg Annual Sunshie Duration per State', database_functionality.task2A_init['avg_annual_sunshine_per_state'])

        return render_template('shallow-glance-1.html', state_names = state_names, climate_metrics = climate_metrics, request_method="GET", data_title = data_title, data_subtitle = None , tables = [weather_stations_per_state,sites_across_australia,avg_annual_rainfall_per_state,avg_annual_max_temp_per_state,avg_annual_min_temp_per_state,avg_annual_evaporation_per_state, avg_annual_sunshine_per_state])
    else:
        # Collecting form Inputs
        form = request.form
        input_state = form['state-sidebar']
        input_start_latitude = form['start-latitude-sidebar']
        input_end_latitude = form['end-latitude-sidebar']
        input_climate_metric = form['climate-metric-sidebar'] 
        input_period = form['period-sidebar']

        data_title = fr'{input_state.replace('.','')} | {climate_metrics[input_climate_metric]} Trends ({input_period}) '
        data_subtitle = fr'Latitude range ({input_start_latitude}&deg; &mdash; {input_end_latitude}&deg;)'

        stations_within_area = ('Weather Stations within Specified Area', database_functionality.get_stations_within_area(input_state,input_start_latitude,input_end_latitude))
        region_wise_stats = ('Region wise Statistics', database_functionality.region_wise_metrics(input_state,input_start_latitude,input_end_latitude,input_climate_metric,input_period))
        

        return render_template('shallow-glance-1.html', state_names = state_names, climate_metrics = climate_metrics, 
        request_method="POST", data_title = data_title, data_subtitle = data_subtitle, tables=[stations_within_area, region_wise_stats])


@app.route('/task3A', methods=['GET','POST'])
def task_3A():
    return render_template('deep-dive-1.html')





# @app.route('/download_data/<data>')
# def download_data(data):
#     title = json.loads(data)['table']['title']
#     columns = json.loads(data)['table']['columns']
#     data = json.loads(data)['table']['content']

#     df = pandas.DataFrame(data, columns=columns)

#     with tempfile.NamedTemporaryFile(mode="w", suffix=".csv", delete=True) as tmpfile:
#         df.to_csv(tmpfile.name, index=False)

#         return send_file(
#             tmpfile.name,
#             mimetype='text/csv',
#             download_name=f'{title}.csv',
#             as_attachment=True
#         )

@app.route('/download_data_v2/<query>/<title>')
def download_data_v2(query,title):

    df = database_functionality.download_data(query)

    with tempfile.NamedTemporaryFile(mode="w", suffix=".csv", delete=True) as tmpfile:
        df.to_csv(tmpfile.name, index=False)

        return send_file(
            tmpfile.name,
            mimetype='text/csv',
            download_name=f'{title}.csv',
            as_attachment=True
        )




@app.route('/in_production')
def in_production():
    return ('''
            <h1 style="color:red; margin-bottom:24px;">THESE PAGES BELONG TO SUB-TASK B.<br/> PLEASE REFER TO THE WORK OF MY GROUP MEMBER <br/> 
            <span style="color:#000;">STUDENT ID: s4153182, STUDENT NAME: LUCAS WONG.</span><br/> 
            THIS ISSUE HAD ALREADY BEEN DISCUSSED AND RESOLVED WITH STAFF MEMBERS.</h1>
            <ul>
                <li>
                    <a href="/home">Task 1A</a>
                </li>
                <li>
                    <a href="/task2A">Task 2A</a>
                </li>
                <li>
                    <a href="/task3A">Task 3A</a>
                </li>
            </ul>''')



'''
###################################
          API ENDPOINTS
###################################
'''

# javascript will use this route to query the range of acceptable values for latitude whenever a user selects a state and restricts the user input so that they won't accidentally choose a invalid range.
@app.route('/get_min_max_lat/<state>')
def get_min_max_lat(state):
    return jsonify(database_functionality.get_min_max_lat(state))



if __name__ == '__main__':
    app.run(debug=True, port=8090)
