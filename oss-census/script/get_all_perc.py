import pandas as pd

path = "/data2/zihe/data/census/gender_contrib/"
dat = pd.read_csv(path + "All.csv")
dat["female+male"] = dat["female_all"] + dat["male_all"] + dat["unknown_all"]
dat["female_perc"] = dat["female_all"]/dat["female+male"]
dat["male_perc"] = dat["male_all"]/dat["female+male"]
dat["unknown_perc"] = dat["unknown_all"]/dat["female+male"]

for i in range(len(dat)):
  print("{x: "+str(dat.iloc[i]["win"])+", y:"+str(dat.iloc[i]["unknown_perc"])+"},")
