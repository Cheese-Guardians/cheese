import pandas as pd
import matplotlib.pyplot as plt

# 한글 폰트 설정
plt.rcParams['font.family'] = 'Malgun Gothic'
plt.rcParams['axes.unicoㅁde_minus'] = False

#증상별 통계(x축:날짜, y축:척도)
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

    #plt.show()
    plt.savefig(f'public/output/{symptom}.png')
    plt.close()

#전체통계
# 데이터 파일 로드
entire_symptom_df = pd.read_csv('csv/entireSymptom.csv')
last_entire_symptom_df = pd.read_csv('csv/lastEntireSymptom.csv')

# 'start_date' 열을 날짜로 변환
entire_symptom_df['start_date'] = pd.to_datetime(entire_symptom_df['start_date'])
last_entire_symptom_df['start_date'] = pd.to_datetime(last_entire_symptom_df['start_date'])

# 날짜를 월로 추출
entire_symptom_df['month'] = entire_symptom_df['start_date'].dt.month
last_entire_symptom_df['month'] = last_entire_symptom_df['start_date'].dt.month

# 날짜를 주차로 추출
entire_symptom_df['week'] = entire_symptom_df['start_date'].dt.strftime('%Y-%m-%d')
last_entire_symptom_df['week'] = last_entire_symptom_df['start_date'].dt.strftime('%Y-%m-%d')

# 두 데이터프레임을 합침
combined_df = pd.concat([entire_symptom_df, last_entire_symptom_df])

# 데이터를 월과 주차로 그룹화하여 합계 계산
monthly_data = combined_df.groupby(['month', 'symptom_name', 'week'])['total_degree'].sum().unstack(fill_value=0)

# 현재 달과 전달 데이터 분리
this_month = monthly_data[monthly_data.index.get_level_values('month') == 9]
last_month = monthly_data[monthly_data.index.get_level_values('month') == 8]

# 그래프 생성
fig, ax = plt.subplots(figsize=(12, 8))

this_month.plot(kind='bar', stacked=True, ax=ax, position=0, width=0.3, label='당월')
last_month.plot(kind='bar', stacked=True, ax=ax, position=1, width=0.3, label='전월')

# 레전드 레이블 설정
legend_labels = [
    '전월 1주차', '전월 2주차', '전월 3주차', '전월 4주차',
    '당월 1주차', '당월 2주차', '당월 3주차', '당월 4주차'
]
ax.legend(legend_labels, title='기간', loc='upper left')

# 오른쪽 여백 추가
fig.subplots_adjust(right=0.85)

plt.title('증상별 월별 빈도')
plt.xlabel('증상')
plt.ylabel('빈도')
plt.xticks(rotation=0)  # x축 레이블 회전 방지

# x축 레이블을 증상 이름으로 설정
ax.set_xticklabels(this_month.index.get_level_values('symptom_name'))

#plt.show()
plt.savefig(f'public/output/all.png')
plt.close()
