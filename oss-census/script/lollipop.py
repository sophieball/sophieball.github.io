# libraries
# https://www.python-graph-gallery.com/184-lollipop-plot-with-2-groups
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Create a dataframe
df = pd.read_csv("/data3/sophie/code/max_min_perc.csv")

# Reorder it following the values of the first value:
ordered_df = df.sort_values(by='min')
my_range=range(1,len(df.index)+1)

# The horizontal plot is made using the hline function
plt.hlines(y=my_range, xmin=ordered_df['min'], xmax=ordered_df['max'], color='grey', alpha=0.4)
plt.scatter(ordered_df['min'], my_range, color='skyblue', alpha=1, label='min')
plt.scatter(ordered_df['max'], my_range, color='green', alpha=0.4 , label='max')
plt.legend()

# Add title and axis names
plt.yticks(my_range, ordered_df['eco'])
plt.title("Max and min percentage of women in each ecosystem", loc='left')
plt.xlabel('Percentage of women')
plt.ylabel('Ecosystem')

# Show the graph
plt.savefig("lollipop.svg")
