import pandas as pd
import matplotlib.pyplot as plt
import mpld3
import json

# 한글 폰트 설정
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['axes.unicode_minus'] = False  # 마이너스 기호 표시 설정 (한글 폰트 설정 시 필요)

# CSV 파일을 상대 경로로 지정 (만약 같은 디렉토리에 있다면 './csv/symptomcl.csv'로 지정)
file_path = 'csv/symptom_3.csv'

# CSV 파일을 읽어서 dataset에 저장
dataset = pd.read_csv(file_path, delimiter=',')

# CSV 파일에 symptom_name과 degree의 이름 추가하여 다시 저장
dataset.columns = ['symptom_name', 'degree', 'date']
dataset.to_csv(file_path, sep=',', index=False)

# 'date' 컬럼을 날짜 순서대로 정렬
dataset['date'] = pd.to_datetime(dataset['date'])  # 날짜 데이터를 datetime 형식으로 변환
dataset = dataset.sort_values(by='date')  # 'date' 컬럼을 기준으로 정렬

# symptom_names를 그룹화하여 같은 증상 이름을 가진 항목들을 각각의 plot으로 나타내기
plt.figure(figsize=(10, 6))  # 그래프 크기 조절
for name, group in dataset.groupby('symptom_name'):
    plt.plot(group['date'], group['degree'], label=name)  # 그룹별로 plot 생성

plt.xlabel('date')
plt.ylabel('degree')
plt.title('요일별 증상 척도')
plt.legend(loc='lower right')
plt.xticks(rotation=45)  # x축의 날짜 라벨을 45도 회전하여 표시 (길어지는 경우)
plt.tight_layout()  # 그래프 간격 조절
# 그래프를 이미지로 저장
plt.savefig('output/graph.png')

plt.close()  # 그래프 출력을 종료
