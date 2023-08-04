import xgboost as xgb
import pandas as pd
from sklearn.metrics import mean_squared_error
import numpy as np

model = xgb.Booster()
data = 'blood,0,1500,1,2,1,-8.9,1,57,5,33068,74648,2128,33550,32966,33769,1972,8032,1922,34532,32864,9188,2097,33643,3525,15337,3447,19321,4077,19322,3448,22365,3536,19838,3494,22261,36462,36464,1949,7720,3469,7869,1900,63447,3470,19317,5189,19318,3912,57832,154,60457,627,7670,3410,16428,1852,7671,3411,19327,4451,19328,3834,23333,1896,7621,34372,34492,NaN,NaN,67942,67948,NaN,NaN,NaN,NaN,NaN,NaN,62431,67947,1943,34513,3203,18434,34387,34504,3484,18530,3064,18690,34438,34644,34364,34476,1927,8394,627,7667,1951,7766,3410,16428,724,7634,3490,18948,1157,67343,312,963,3142,16792,3774,16099,2990,17923,4101,18340,3468,20259,3901,21417,1935,34507,724,7947,34362,34476,3391,17727,984,7861,67987,67986,62431,67826,1.25588,None,None,None,None,None,None,2.55196,2.99268,None,None,5.78655,None,None,None,5.66149,None,1.06387,None,1.5343,7.59891,None,None,3.11181,None,None,None,None,1.23145,None,None,None,None,None,None,None,None,None,None,None,None,None,None,1.04254,1.41283,None,None,None,None,None,None,None,None,4.20584,None,None,5.7106,None,None,5.98873,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None '
data = data.split(',')
mode = data[0]
path = f'.\\model\\{mode}\\model.json'
model.load_model(path)
model.set_param({'tree_method':'gpu_hist'})
datas = []
for d in data:
    if (d == 'None'):
        datas.append(None)
    else:
        try:
            datas.append(float(d))
        except ValueError:
            path
data = pd.DataFrame([pd.Series(data=datas)])
data = data.drop(data.columns[[0, 0]], axis=1)
xgb_test = xgb.DMatrix(data)
y_pred = model.predict(xgb_test)
print(y_pred)