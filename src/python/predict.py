import xgboost as xgb
import glob
import pandas as pd
from sklearn.metrics import mean_squared_error
import math

model = xgb.Booster()
model.load_model('.\\model\\blood\\model.json')
files = glob.glob('.\\data\\Jocky\\*.csv')
global datas
datas = pd.DataFrame()
for file in files:
    data = pd.read_csv(file, sep=',', header=None)
    if datas.index.size == 0 :
        datas = data
    else :
        datas = pd.concat([datas, data])

datas = datas.sample(frac=1)
row = datas.shape[0]
train = round(row * 0.7)

traindata = datas[0: train]
trainlabel = traindata.iloc[0:,[0]]
traindata = traindata.drop(traindata.columns[[0, 0]], axis=1)

testdata = datas[train: row]
testlabel = testdata.iloc[0:,[0]]
testdata = testdata.drop(testdata.columns[[0, 0]], axis=1)

xgb_train = xgb.DMatrix(traindata, label=trainlabel)
xgb_test = xgb.DMatrix(testdata, label=testlabel)

y_pred = model.predict(xgb_test)
mse = mean_squared_error(testlabel, y_pred)
print('RMSE:', math.sqrt(mse))