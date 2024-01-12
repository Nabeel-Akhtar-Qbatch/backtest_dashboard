import pandas as pd
import numpy as np
import math

def load_excel_sheets(file_path):
    # Load the Excel file
    xls = pd.ExcelFile(file_path)
    return {sheet_name: pd.read_excel(xls, sheet_name) for sheet_name in xls.sheet_names}

def interpret_cot_score(score):
    if score >= 1.20:
        return 5, 'Bullish'
    elif 1.04 <= score < 1.20:
        return 4, 'Slightly Bullish'
    elif 0.95 <= score < 1.04:
        return 3, 'Neutral'
    elif 0.81 <= score < 0.95:
        return 2, 'Slightly Bearish'
    else:
        return 1, 'Bearish'

def calculate_combined_score(first_currency_score, second_currency_score, is_cross_pair=False):
    if is_cross_pair:
        second_currency_score = 2 - second_currency_score
        first_currency_score = first_currency_score / 2
        second_currency_score = second_currency_score / 2
        # For cross pairs, give 50% weightage to each currency's score
        return (first_currency_score + second_currency_score) 
    else:
        # For direct and inverse pairs, consider the score directly
        return first_currency_score

def process_forex_pair(cot_data_sheets, pair):
    all_weeks_data = []
    first_currency, second_currency = pair[:3], pair[3:]
    if not second_currency:
        second_currency = first_currency

    # Determine if it's a cross pair
    is_cross_pair = first_currency != 'USD' and second_currency != 'USD' and second_currency != first_currency

    currency_with_data = first_currency
    if not is_cross_pair:
        currency_with_data = second_currency if first_currency == 'USD' else first_currency
        
    
    

    for week in cot_data_sheets[currency_with_data].index:
        first_currency_score = second_currency_score = 0
        if is_cross_pair:
            first_currency_score = cot_data_sheets[first_currency].loc[week, 'Current Week / (Averge 12 weeks)']
            try:
                second_currency_score = cot_data_sheets[second_currency].loc[week, 'Current Week / (Averge 12 weeks)']
            except Exception as e:
                second_currency_score = 0
        elif first_currency == 'USD':
            second_currency_score = cot_data_sheets[second_currency].loc[week, 'Current Week / (Averge 12 weeks)']
            first_currency_score =   second_currency_score
 
         
        elif second_currency == 'USD':
            first_currency_score = cot_data_sheets[first_currency].loc[week, 'Current Week / (Averge 12 weeks)']
            second_currency_score =   first_currency_score
       


        if  first_currency_score and second_currency_score and not (math.isnan(first_currency_score) or math.isnan(second_currency_score)):
            # Calculate the combined score
            combined_score = calculate_combined_score(first_currency_score, second_currency_score, is_cross_pair)
            score, remark = interpret_cot_score(combined_score)

            Date = cot_data_sheets[currency_with_data].loc[week, 'Date']
            from_date = cot_data_sheets[currency_with_data].loc[week, 'From ']
            to_date = cot_data_sheets[currency_with_data].loc[week, 'To']

            all_weeks_data.append({
                'Date':  Date,
                'From': from_date,
                'To': to_date,
                'Score': score,
                'Remark': remark
            })
     
    return pd.DataFrame(all_weeks_data)

# Define the path to your Excel file
input_path = '/Users/mac/Downloads/Currency Majors COT Data Index (Non-commercials Only) 05.01.2024 (updated for Indices and Comm).xlsx'

# Load the data from each sheet
cot_data_sheets = load_excel_sheets(input_path)

# List of FOREX pairs

forex_pairs = ['USDCHF','USDJPY','USO','XAG','XAU', 'AUDCHF', 'AUDJPY', 'CADCHF','EURCAD', 'EURCHF', 'GBPCAD', 'GBPCHF', 'USDJPY', 'AUDUSD', 'EURJPY', 'EURUSD' ,'NZDCHF','NZDJPY', 'GBPJPY','USDJPY','GBPUSD','NZDUSD','US30','USDCAD']

# Process each FOREX pair and save to a separate CSV file
for pair in forex_pairs:
    pair_df = process_forex_pair(cot_data_sheets, pair)
    output_file = f'cot_results/COT_Scores_{pair}.csv'
    pair_df.to_csv(output_file, index=False)
    print(f"Processed data for {pair}, saved to {output_file}")