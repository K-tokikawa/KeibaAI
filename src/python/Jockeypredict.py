import xgboost as xgb
import pandas as pd
from sklearn.metrics import mean_squared_error
import json
model = xgb.Booster()
model.load_model('.\\model\\Jockey\\model.json')
data = [[float(num) for num in input().split(',')]]
data = pd.DataFrame(data=data)
data = data.drop(data.columns[[0, 0]], axis=1)
xgb_test = xgb.DMatrix(data)
y_pred = model.predict(xgb_test)
print(y_pred)