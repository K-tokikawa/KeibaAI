import math
import glob
import pandas as pd
import xgboost as xgb
import optuna
import subprocess

from matplotlib import pyplot as plt
from sklearn.metrics import mean_squared_error

DEFAULT_ATTRIBUTES = (
    'index',
    'uuid',
    'memory.total',
    'memory.free',
    'memory.used',
)
def get_gpu_info(nvidia_smi_path='nvidia-smi', keys=DEFAULT_ATTRIBUTES, no_units=True):
    nu_opt = '' if not no_units else ',nounits'
    cmd = '%s --query-gpu=%s --format=csv,noheader%s' % (nvidia_smi_path, ','.join(keys), nu_opt)
    output = subprocess.check_output(cmd, shell=True)
    lines = output.decode().split('\n')
    lines = [ line.strip() for line in lines if line.strip() != '' ]

    return [ { k: v for k, v in zip(keys, line.split(', ')) } for line in lines ]

def objective(trial):
    global datas
    datas = datas.sample(frac=1)
    row = datas.shape[0]
    studytrain = round(row * 0.7)
    studytraindata = datas[0: studytrain]
    studytrainlabel = studytraindata.iloc[0:,[0]]
    studytraindata = studytraindata.drop(studytraindata.columns[[0, 0]], axis=1)

    studytestdata = datas[studytrain: row]
    studytestlabel = studytestdata.iloc[0:,[0]]
    studytestdata = studytestdata.drop(studytestdata.columns[[0, 0]], axis=1)

    studyxgb_train = xgb.DMatrix(studytraindata, label=studytrainlabel)
    studyxgb_test = xgb.DMatrix(studytestdata, label=studytestlabel)

    params = {
        'eta': trial.suggest_float("eta", 0.01, 1.0, log=False),
        'objective': 'reg:squarederror',
        'eval_metric': 'rmse',
        'max_depth': trial.suggest_int("max_depth", 3, 7),
        'lambda': trial.suggest_int("lambda", 100, 1000),
        'tree_method':'gpu_hist' 
        }
    evals = [(studyxgb_train, 'train'), (studyxgb_test, 'eval')]
    evals_result = {}
    xgb.train(params,
              studyxgb_train,
              num_boost_round=3000,
              early_stopping_rounds=100,
              verbose_eval=100,
              evals=evals,
              evals_result=evals_result,
              )

    result = evals_result['eval']['rmse']
    result = result[len(result)-1]
    return result

mode = 4
print('Start')

print('Read File')
files = glob.glob('.\\data\\Rotation\\*.csv')
global datas
datas = pd.DataFrame()
for file in files:
    data = pd.read_csv(file, sep=',', header=None)
    if datas.index.size == 0 :
        datas = data
    else :
        datas = pd.concat([datas, data])


datas = datas.dropna(subset=[0])
print(datas)
if (mode == 4):
    datas = datas.dropna(subset=[1])
    datas = datas.dropna(subset=[2])
    datas = datas.drop(datas.columns[[1, 2]], axis=1)
print(datas)
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

print('Start Study')
study = optuna.create_study()
study.optimize(objective, n_trials=500, gc_after_trial = True)
print('Finish Study')
trial = study.best_trial

param = {
    'objective': 'reg:squarederror',
    'eval_metric': 'rmse',
    'tree_method':'gpu_hist' 
}

# param["eta"] = 0.12446843751961466
# param["max_depth"] = 9
# param["lambda"] = 865
param["max_depth"] = trial.params["max_depth"]
param["eta"] = trial.params["eta"]
param["lambda"] = trial.params["lambda"]
evals = [(xgb_train, 'train'), (xgb_test, 'eval')]
evals_result = {}
print('Start Train')
bst = xgb.train(param,
                xgb_train,
                num_boost_round=3000,
                early_stopping_rounds=100,
                verbose_eval=100,
                evals=evals,
                evals_result=evals_result,
                )
bst.save_model('.\\model\\blood\\model.json')
y_pred = bst.predict(xgb_test)
mse = mean_squared_error(testlabel, y_pred)
print('Finish Train')
print('RMSE:', math.sqrt(mse))

train_metric = evals_result['train']['rmse']
plt.plot(train_metric, label='train rmse')
eval_metric = evals_result['eval']['rmse']
plt.plot(eval_metric, label='eval rmse')
xgb.plot_importance(bst)
plt.grid()
plt.legend()
plt.xlabel('rounds')
plt.ylabel('rmse')
plt.show()
