import xgboost as xgb
import pandas as pd
import numpy as np


achievement = '.\\model_alpha\\achievement_alpha\\model.json'
rotation = '.\\model_alpha\\rotation_alpha\\model.json'
blood = '.\\model_alpha\\blood_alpha\\model.json'
Jockey = '.\\model_alpha\\jockey_alpha\\model.json'

achievementmodel = xgb.Booster()
rotationmodel = xgb.Booster()
bloodmodel = xgb.Booster()
jockeymodel = xgb.Booster()

achievementmodel.load_model(achievement)
rotationmodel.load_model(rotation)
bloodmodel.load_model(blood)
jockeymodel.load_model(Jockey)

achievementmodel.set_param({'tree_method':'gpu_hist'})
rotationmodel.set_param({'tree_method':'gpu_hist'})
bloodmodel.set_param({'tree_method':'gpu_hist'})
jockeymodel.set_param({'tree_method':'gpu_hist'})
while(True):
    data = input()
    data = data.split(',')
    mode = data[0]
    datas = []
    datas.append(None) #field name 調整のため
    for d in data:
        if (d == 'None' or d == 'null' or d == ''):
            datas.append(None)
        else:
            try:
                datas.append(float(d))
            except ValueError:
                None
    data = pd.DataFrame([pd.Series(data=datas)])
    data = data.drop(data.columns[[0, 0]], axis=1)
    xgb_test = xgb.DMatrix(data)
    if mode == 'achievement':
        y_pred = achievementmodel.predict(xgb_test)
    if mode == 'rotation':
        y_pred = rotationmodel.predict(xgb_test)
    if mode == 'blood':
        y_pred = bloodmodel.predict(xgb_test)
    if mode == 'jockey':
        y_pred = jockeymodel.predict(xgb_test)
    print(y_pred)
