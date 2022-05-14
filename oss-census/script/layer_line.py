# getting necessary libraries
# https://www.python-graph-gallery.com/ridgeline-graph-plotly
import plotly.graph_objects as go
import numpy as np
import pandas as pd

# getting the data
temp = pd.read_csv('../all_eco_only_female.csv') # we retrieve the data from plotly's GitHub repository
temp = temp.loc[temp["win"] <= 53]

# as we expect to plot histograms-like plots for each year, we group by year and mean temperature and aggregate with 'count' function
#temp = temp.groupby(['eco', 'female_perc']).agg({'female_perc': 'count'}).rename(columns={'female_perc': 'count'}).reset_index()
eco_list = list(set(temp["eco"].tolist()))

# the idea behind this ridgeline plot with Plotly is to add traces manually, each trace corresponding to a particular year's temperature distribution
# thus, we are to store each year's data (temperatures and their respective count) in seperate arrays or pd.series that we store in a dictionnary to retrieve them easily
array_dict = {} # instantiating an empty dictionnary
for eco in temp["eco"]:
    array_dict[f'x_{eco}'] = temp[temp['eco']==eco]['win'] # storing the temperature data for each year
    array_dict[f'y_{eco}'] = temp[temp['eco']==eco]['female_perc'] # storing the temperature count for each year
    array_dict[f'y_{eco}'] = (array_dict[f'y_{eco}'] - array_dict[f'y_{eco}'].min()) \
                                / (array_dict[f'y_{eco}'].max() -
                                array_dict[f'y_{eco}'].min()) # we normalize the array (min max normalization)

# once all of this is done, we can create a plotly.graph_objects.Figure and add traces with fig.add_trace() method
# since we have stored the temperatures and their respective count for each year, we can plot scatterplots (go.Scatter)
# we thus iterate over year_list and create a 'blank line' that is placed at y = index, then the corresponding temperature count line
fig = go.Figure()
for index, eco in enumerate(eco_list):
    fig.add_trace(go.Scatter(
                            x=[
                                min(temp["win"].tolist()),
                                max(temp["win"].tolist())], 
                            y=np.full(2, len(eco_list)-index),
                            mode='lines',
                            line_color='white'))

    fig.add_trace(go.Scatter(
                            x=array_dict[f'x_{eco}'],
                            y=array_dict[f'y_{eco}'] + (len(eco_list)-index) + 0.4,
                            fill='tonexty',
                            name=f'{eco}'))

    # plotly.graph_objects' way of adding text to a figure
    fig.add_annotation(
                        x=0,
                        y=len(eco_list)-index,
                        text=f'{eco}',
                        showarrow=False,
                        yshift=10)

# here you can modify the figure and the legend titles
fig.update_layout(
                title='Female percentage in all ecosystems',
                showlegend=False,
                xaxis=dict(title='Window'),
                yaxis=dict(showticklabels=False) # that way you hide the y axis ticks labels
                )

#fig.show()

# If you need to save this file as a standalong html file:
fig.write_html("all_female_all_win.html")
