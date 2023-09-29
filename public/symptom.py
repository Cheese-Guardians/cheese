#증상별 통계(x축:날짜, y축:척도)

import pandas as pd
import matplotlib.pyplot as plt

# 한글 폰트 설정
plt.rcParams['font.family'] = 'Malgun Gothic'
plt.rcParams['axes.unicode_minus'] = False

# CSV 파일 경로 설정
file_path = 'csv/eachSymptom.csv'

# CSV 파일 읽기
dataset = pd.read_csv(file_path, delimiter=',')
dataset['date'] = pd.to_datetime(dataset['date'])  # 'date' 컬럼을 날짜로 변환
#print(dataset)
dataset = dataset.sort_values(by=['symptom_name', 'date'])  # 'symptom_name'과 'date'로 정렬

# 각 증상별로 그래프 생성 및 저장
symptoms = dataset['symptom_name'].unique()

for symptom in symptoms:
    plt.figure(figsize=(5, 5))
    symptom_data = dataset[dataset['symptom_name'] == symptom]
    plt.plot(symptom_data['date'], symptom_data['degree'], label=symptom)
    plt.xlabel('날짜')
    plt.ylabel('척도')
    plt.title(symptom )
    plt.xticks(rotation=45)
    plt.legend()
    plt.tight_layout()

    plt.show()
    plt.savefig(f'output/{symptom}.png')
    plt.close()
