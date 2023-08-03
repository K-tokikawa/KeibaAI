import math
import glob
import pandas as pd
import xgboost as xgb
import optuna
import subprocess

from matplotlib import pyplot as plt
from sklearn.metrics import mean_squared_error
rotation = 'rotation'
aptitude = 'aptitude'
achievement = 'achievement'
Jockey = 'Jockey'
blood = 'blood'
predict = 'predict'
pace = 'pace'

mode = rotation
trial = 1

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
    params = {
        'eta': trial.suggest_float("eta", 0.01, 1.0, log=False),
        'objective': 'reg:squarederror',
        'eval_metric': 'rmse',
        'max_depth': trial.suggest_int("max_depth", 3, 9),
        'lambda': trial.suggest_int("lambda", 100, 1000),
        'tree_method':'gpu_hist'
        }
    evals = [(xgb_train, 'train'), (xgb_test, 'eval')]
    evals_result = {}
    xgb.train(params,
              xgb_train,
              num_boost_round=3000,
              early_stopping_rounds=100,
              verbose_eval=100,
              evals=evals,
              evals_result=evals_result,
              )
    result = evals_result['eval']['rmse']
    result = result[len(result)-1]
    return result


print('Start')

print('Read File')

files = glob.glob(f'.\\data\\{mode}\\*.csv')

datas = pd.DataFrame()
count = 0
for file in files:
    data_reader = pd.read_csv(file, sep=',', header=None, low_memory=True, chunksize=1000)
    count += 1
    if datas.index.size == 0 :
        datas = pd.concat((r for r in data_reader), ignore_index=True)
    else :
        datas = pd.concat([datas, pd.concat((r for r in data_reader), ignore_index=True)])
datas = datas.dropna(subset=[0])
datas = datas.sample(frac=1)
row = datas.shape[0]
train = round(row * 0.7)

traindata = datas[0: train]
trainlabel = traindata.iloc[0:,[0]]
traindata = traindata.drop(traindata.columns[[0, 0]], axis=1)
xgb_train = xgb.DMatrix(traindata, label=trainlabel)
del trainlabel, traindata

testdata = datas[train: row]
testlabel = testdata.iloc[0:,[0]]
testdata = testdata.drop(testdata.columns[[0, 0]], axis=1)
xgb_test = xgb.DMatrix(testdata, label=testlabel)
del testdata, datas
print('Start Study')
# DATABASE_URI = 'postgresql://postgres:pegunike39@localhost:5432/keibaai'
# study_name = mode

study = optuna.create_study(
    # study_name=study_name,
    # storage=DATABASE_URI,
    # load_if_exists=True
)
study.optimize(objective, n_trials=trial, gc_after_trial = True)
print('Finish Study')
trial = study.best_trial

param = {
    'objective': 'reg:squarederror',
    'eval_metric': 'rmse',
    'tree_method':'gpu_hist'
}

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

bst.save_model(f'.\\model\\{mode}\\model.json')
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