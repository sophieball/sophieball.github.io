import pandas as pd
import os

path = "/data2/zihe/data/census/gender_contrib/"
fs = os.listdir(path)
fs = [f for f in fs if f[-4:] == ".csv"]

res = []
for f in fs:
  dat = pd.read_csv(path+f)
  year = dat.loc[dat["win"] ==34].iloc[0]
  total = (year["female_all"] + year["male_all"])
  if total <= 30:
    res.append({
        "eco": f.replace(".csv", ""),
        "female_perc": 0, 
        "male_perc": 0
    })
    continue
  female_perc = year["female_all"] / total
  male_perc = year["male_all"] / total
  res.append({
      "eco": f.replace(".csv", ""),
      "female_perc": female_perc*100, 
      "male_perc": male_perc*100
  })

print(res)
res = pd.DataFrame(res)
res = res.sort_values("female_perc")
print(res["eco"].tolist())
print(res["female_perc"].tolist())
res.to_csv("win_34_perc.csv", index=False)
