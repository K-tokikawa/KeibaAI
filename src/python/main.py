import math
import glob
import pandas as pd
import xgboost as xgb
import optuna
import subprocess
import json
import pprint

from matplotlib import pyplot as plt
from sklearn.metrics import mean_squared_error

DEFAULT_ATTRIBUTES = (
    'index',
    'uuid',
    'name',
    'timestamp',
    'memory.total',
    'memory.free',
    'memory.used',
    'utilization.gpu',
    'utilization.memory'
)
def get_gpu_info(nvidia_smi_path='nvidia-smi', keys=DEFAULT_ATTRIBUTES, no_units=True):
    nu_opt = '' if not no_units else ',nounits'
    cmd = '%s --query-gpu=%s --format=csv,noheader%s' % (nvidia_smi_path, ','.join(keys), nu_opt)
    output = subprocess.check_output(cmd, shell=True)
    lines = output.decode().split('\n')
    lines = [ line.strip() for line in lines if line.strip() != '' ]

    return [ { k: v for k, v in zip(keys, line.split(', ')) } for line in lines ]



def objective(trial):
    params = {
        'eta': trial.suggest_float("eta", 0.01, 1.0, log=True),
        'objective': 'reg:squarederror',
        'eval_metric': 'rmse',
        'max_depth': trial.suggest_int("max_depth", 6, 9),
        'lambda': trial.suggest_int("lambda", 0, 10000),
        'tree_method':'gpu_hist' 
        }
    xgb_train_copy = xgb.DMatrix(traindata, label=trainlabel)
    cv_results = xgb.cv(
        params,
        xgb_train_copy,
        num_boost_round=10000,
        nfold=5, # CVの分割数
        early_stopping_rounds=500
    )
    pprint.pprint(get_gpu_info())
    result = cv_results["test-rmse-mean"].min()
    cv_results.__del___()
    del xgb_train_copy
    pprint.pprint(get_gpu_info())
    return result

files = glob.glob('.\\data\\blood\\*.csv')

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



study = optuna.create_study()
study.optimize(objective, n_trials=5000)

print("Number of finished trials: ", len(study.trials))
print("Best trial:")
trial = study.best_trial

print("  Value: {}".format(trial.value))
print("  Params: ")
for key, value in trial.params.items():
    print("    {}: {}".format(key, value))

param = {
    'objective': 'reg:squarederror',
    'eval_metric': 'rmse',
    'tree_method':'gpu_hist' 
}

param["max_depth"] = trial.params["max_depth"]
param["eta"] = trial.params["eta"]
param["lambda"] = trial.params["lambda"]

xgb_train = xgb.DMatrix(traindata, label=trainlabel)
xgb_test = xgb.DMatrix(testdata, label=testlabel)

evals = [(xgb_train, 'train'), (xgb_test, 'eval')]
evals_result = {}
bst = xgb.train(param,
                xgb_train,
                num_boost_round=75000,
                early_stopping_rounds=100,
                evals=evals,
                evals_result=evals_result,
                )

y_pred = bst.predict(xgb_test)
mse = mean_squared_error(testlabel, y_pred)
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
