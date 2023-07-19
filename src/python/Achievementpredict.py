import xgboost as xgb
import pandas as pd
from sklearn.metrics import mean_squared_error
import numpy as np

model = xgb.Booster()
model.load_model('.\\model\\achievement\\model.json')
data = input()
data = data.split(',')
datas = []
for d in data:
    if (d == 'None'):
        datas.append(None)
    else:
        datas.append(float(d))
data = pd.DataFrame([pd.Series(data=datas)])
data = data.drop(data.columns[[0, 0]], axis=1)
xgb_test = xgb.DMatrix(data)
y_pred = model.predict(xgb_test)
print(y_pred)