import xgboost as xgb
import pandas as pd
from sklearn.metrics import mean_squared_error
import numpy as np

model = xgb.Booster()
model.load_model('.\\model\\Blood\\model.json')
data = input()
data = data.split(',')
print(data)
datas = []
for d in data:
    if (d == 'None'):
        datas.append(None)
    else:
        datas.append(float(d))
print(data)
data = datas
print('-----------------------------')
print(data)
data = pd.DataFrame([pd.Series(data=data)])
print('-----------------------------')
data = data.drop(data.columns[[0, 0]], axis=1)
print(data)
xgb_test = xgb.DMatrix(data)
y_pred = model.predict(xgb_test)
print(y_pred)