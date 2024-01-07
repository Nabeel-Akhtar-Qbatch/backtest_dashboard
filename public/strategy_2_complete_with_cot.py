import json
import datetime
import pandas as pd
import numpy as np

risk_reward_ratios = [1.5, 2]
# USDJPY', 'AUDUSD', 'EURJPY', 'EURUSD','FTSE100 ,'NZDCHF','NZDJPY', 'GBPJPY','USDJPY','GBPUSD','GER30','NZDUSD','US30','US100','USDCAD',
# pairs = ['USDCHF','USDJPY','USO','XAG','XAU', 'AUDCHF', 'AUDJPY', 'CADCHF','EURCAD', 'EURCHF', 'GBPCAD', 'GBPCHF']


pairs = ['USDCHF']

def load_seasonality_data(file_path, sheet_name):
    return pd.read_excel(file_path, sheet_name=sheet_name)

def is_cross_pair(pair):
    return 'USD' not in pair

def get_seasonal_score_for_trade_date(trade_date, pair, file_path):
    # Split the pair into its constituent currencies
    first_currency = pair[:3]
    second_currency = pair[3:]
    if not second_currency:
        second_currency =  first_currency 

    
    # Convert trade_date to pandas Timestamp for comparison
    trade_month_day = (trade_date.month, trade_date.day)
  
    
    # Load the seasonality data
    if 'USD' == first_currency or 'USD' == second_currency or second_currency != first_currency :
        sheet_name = 'Seasonality FOREX'
    else:
        sheet_name = 'Seasonality Comm and Indices'
    seasonality_data = load_seasonality_data(file_path, sheet_name)

    # Initialize scores for both currencies
    first_currency_score = 3
    second_currency_score = 3
    
    # Find seasonality scores for both currencies
    for _, row in seasonality_data.iterrows():
        if row['Instrument'] == first_currency or row['Column1'] == first_currency:
            start_month_day = (row['Start Date'].month, row['Start Date'].day)
            end_month_day = (row['End Date'].month, row['End Date'].day)
            if start_month_day <= trade_month_day <= end_month_day:
                first_currency_score = row['Score']
                break
 
    for _, row in seasonality_data.iterrows():
        if row['Instrument'] == second_currency or row['Column1'] == second_currency:
            start_month_day = (row['Start Date'].month, row['Start Date'].day)
            end_month_day = (row['End Date'].month, row['End Date'].day)
            if start_month_day <= trade_month_day <= end_month_day:
                second_currency_score = row['Score']
                break
        
    # If it's a cross pair and we have scores for both currencies, adjust the scores
    if 'USD' not in pair and   second_currency != first_currency:
        # For cross pairs, invert the second currency's score
        second_currency_score = 5 - second_currency_score + 1
        # Calculate the average score
        return (first_currency_score + second_currency_score) / 2
    elif  first_currency== 'USD':
        second_currency_score = 5 - second_currency_score + 1
        return   second_currency_score
    elif  second_currency== 'USD':
        return first_currency_score 
    
    elif second_currency == first_currency:
        return first_currency_score 

  

seasonality_file_path = '/Users/mac/Downloads/Currency Majors Seasonality (updated 05.01.2024).xlsx'

for pair in pairs:
    summary_text =''
    
    #Data Trim

    # Daily 1000 for 5 years
    # 5 min 300000
    # Read daily data
    df_daily = pd.read_csv(f'/Users/mac/Desktop/forex_back_test/Data daily and 5 min/D/{pair}_D.csv')
    df_last_100_daily = df_daily.tail(500)

    # Change headers to uppercase
    df_last_100_daily.columns = map(str.upper, df_last_100_daily.columns)

    # Print and save to CSV
    # print(df_last_100_daily)
    daily_trimmed_output_file = f'/Users/mac/Desktop/forex_back_test/results/{pair}/{pair}_D_trimmed.csv'
    df_last_100_daily.to_csv(daily_trimmed_output_file, index=False)

    # Read 5-minute data
    df_5min = pd.read_csv(f'/Users/mac/Desktop/forex_back_test/Data daily and 5 min/5T/{pair}_5T.csv')
    df_last_100_5min = df_5min.tail(150000)

    # Change headers to uppercase
    df_last_100_5min.columns = map(str.upper, df_last_100_5min.columns)

    # Print and save to CSV
    # print(df_last_100_5min)
    min5_trimmed_output_file = f'/Users/mac/Desktop/forex_back_test/results/{pair}/{pair}_5T_trimmed.csv'
    df_last_100_5min.to_csv(min5_trimmed_output_file, index=False)

    # Part 1: Initial Setup and Data Loading
    # **************************************************
    # Read the CSV data into a DataFrame
    file_path_daily_data = daily_trimmed_output_file
    file_path_5_min_data = min5_trimmed_output_file

    data = pd.read_csv(file_path_daily_data)

    # Define the True Range function
    def true_range(HIGH, LOW, close):
        # The true range is the largest of the:
        # Current HIGH minus the current LOW,
        # Absolute value of the current HIGH minus the previous close,
        # Absolute value of the current LOW minus the previous close.
        tr = HIGH - LOW
        tr = np.maximum(tr, abs(HIGH - close.shift()))
        tr = np.maximum(tr, abs(LOW - close.shift()))
        return tr


    # Calculate True Range for each candle
    data['TR'] = true_range(data['HIGH'], data['LOW'], data['CLOSE'])

    # Calculate the Average True Range (ATR)
    data['ATR'] = round(data['TR'].rolling(window=14, min_periods=1).mean(), 5)

    # Function to check if the current candle closes above the HIGH of the last three candles


    def check_signal(row, df):
        if row.name >= 3:
            if row['CLOSE'] > df['HIGH'][row.name-3:row.name].max():
                return "BUY"
            elif row['CLOSE'] < df['LOW'][row.name-3:row.name].min():
                return "SELL"
        return ''

    data['Signal'] = data.apply(check_signal, axis=1, df=data)
    data['Signal'] = data['Signal'].shift(+1)


    daily_signal_path = f'/Users/mac/Desktop/forex_back_test/results/{pair}/DAILY_{pair}_D_SIGNAL.csv'
    # Save the DataFrame to a new CSV file
    data.to_csv(daily_signal_path, index=False)

        # print(data)
        # Part 2: Generate Trading Signals

        # Read and preprocess daily data
    for risk_reward_ratio in risk_reward_ratios:
        daily_df = pd.read_csv(daily_signal_path)
        daily_df['DATETIME'] = pd.to_datetime(
            daily_df['DATETIME'], errors='coerce', format='%Y-%m-%d %H:%M:%S')
        daily_df.dropna(subset=['DATETIME'], inplace=True)


        # Read and preprocess 5 min data
        five_min_df = pd.read_csv(file_path_5_min_data)
        five_min_df['DATETIME'] = pd.to_datetime(
            five_min_df['DATETIME'], errors='coerce', format='%Y-%m-%d %H:%M:%S')
        five_min_df.dropna(subset=['DATETIME'], inplace=True)


        five_min_groups = five_min_df.groupby(five_min_df['DATETIME'].dt.date)


        def compute_atr(df):
            df['TR'] = (df['HIGH'] - df['LOW']).round(4)
            return df


        def place_trades(df, sub_df, daily_atr, signal):
            trades = []

            for i in range(2, len(sub_df)):
            
                high_max = sub_df['HIGH'].iloc[i-2:i+1].max()
                low_min = sub_df['LOW'].iloc[i-2:i+1].min()
                candle_move = high_max - low_min

                if candle_move > (0.25 * daily_atr):
                    retracement = 0.20 * candle_move
                    entry_price = (
                        high_max - retracement) if signal == 'BUY' else (low_min + retracement)

                    # Check for bullish scenario
                    if signal == 'BUY' and sub_df['CLOSE'].iloc[i] > sub_df['HIGH'].iloc[i-1] and sub_df['CLOSE'].iloc[i-1] > sub_df['HIGH'].iloc[i-2]:
                        # Check for fair value gap (FVG)
                        if sub_df['LOW'].iloc[i] > sub_df['HIGH'].iloc[i-2]:
                            # Find the subset of candles for the rest of the day after the signal
                            end_of_day = sub_df['DATETIME'].iloc[i].replace(hour=16, minute=0)
                            remaining_day_candles = sub_df.iloc[i +
                                                                1:].loc[sub_df['DATETIME'] <= end_of_day]

                            # Check if any of the remaining candles trigger the limit order
                            trigger_candles = remaining_day_candles[(remaining_day_candles['LOW'] <= entry_price) & (remaining_day_candles['HIGH'] >= entry_price)]

                            # If a trigger candle is found, process the trade
                            if not trigger_candles.empty:
                                # The candle where the limit order is executed
                                trigger_candle = trigger_candles.iloc[0]
                                stop_loss = low_min
                                risk_amount = abs(entry_price - stop_loss)
                                take_profit = entry_price + (risk_reward_ratio * risk_amount)

                                trades.append({
                                    'DATETIME': trigger_candle['DATETIME'],
                                    'Signal': signal,
                                    'Entry_Price': entry_price,
                                    'Stop_Loss': stop_loss,
                                    'Take_Profit': take_profit,
                                    'Trigger_Price': trigger_candle['CLOSE']
                                })

                                # Mark the signal and SUM_ATR_LAST_3 in the original dataframe
                                df.loc[trigger_candle.name, 'Signal'] = signal
                                df.loc[trigger_candle.name, 'SUM_ATR_LAST_3'] = candle_move

                            

                    # Check for bearish scenario
                    elif signal == 'SELL' and  sub_df['CLOSE'].iloc[i] < sub_df['LOW'].iloc[i-1] and sub_df['CLOSE'].iloc[i-1] < sub_df['LOW'].iloc[i-2]:
                        # Check for fair value gap (FVG)
                        if sub_df['HIGH'].iloc[i] < sub_df['LOW'].iloc[i-2]:
                            # Find the subset of candles for the rest of the day after the signal
                            end_of_day = sub_df['DATETIME'].iloc[i].replace(hour=16, minute=0)
                            remaining_day_candles = sub_df.iloc[i +
                                                                1:].loc[sub_df['DATETIME'] <= end_of_day]

                            # Check if any of the remaining candles trigger the limit order
                            trigger_candles = remaining_day_candles[(remaining_day_candles['LOW'] <= entry_price) & (remaining_day_candles['HIGH'] >= entry_price)]

                            # If a trigger candle is found, process the trade
                            if not trigger_candles.empty:
                                # The candle where the limit order is executed
                                trigger_candle = trigger_candles.iloc[0]
                                stop_loss = high_max
                                risk_amount = abs(entry_price - stop_loss)
                                take_profit = entry_price - (risk_reward_ratio * risk_amount)

                                trades.append({
                                    'DATETIME': trigger_candle['DATETIME'],
                                    'Signal': signal,
                                    'Entry_Price': entry_price,
                                    'Stop_Loss': stop_loss,
                                    'Take_Profit': take_profit,
                                    'Trigger_Price': trigger_candle['CLOSE']
                                })

                                # Mark the signal and SUM_ATR_LAST_3 in the original dataframe
                                df.loc[trigger_candle.name, 'Signal'] = signal
                                df.loc[trigger_candle.name, 'SUM_ATR_LAST_3'] = candle_move
            return trades

        compute_atr(five_min_df)
        five_min_df['Signal'] = None
        all_trades = []

        for index, row in daily_df.iterrows():
            if row['Signal'] in ['BUY', 'SELL']:
                date = row['DATETIME'].date()
                daily_atr = daily_df.loc[index - 1, 'ATR'] if index > 0 else None
                if date in five_min_groups.groups:
                    sub_df = five_min_groups.get_group(date)

                    # Set DATETIME as the index
                    sub_df.set_index('DATETIME', inplace=True)
                    # Reset index after filtering
                    sub_df = sub_df.between_time('04:00:00', '16:00:00').reset_index()
                    trades = place_trades(five_min_df, sub_df,
                                        daily_atr, row['Signal'])
                    all_trades.extend(trades)
        
        if not all_trades:
            continue
        trades_df = pd.DataFrame(all_trades)
        results_file_path = f'/Users/mac/Desktop/forex_back_test/results/{pair}/{pair}_trade_results.csv'
        trades_df.to_csv(results_file_path, index=False)


        # Part 3: Backtest Results Analysis

        # Load the historical 5-minute candle data
        historical_data = pd.read_csv(file_path_5_min_data)
        historical_data['DATETIME'] = pd.to_datetime(historical_data['DATETIME'], format="%Y-%m-%d %H:%M:%S")
        # historical_data['DATETIME'] = pd.to_datetime(historical_data['DATETIME'], format="%d/%m/%Y %H:%M")

        # Load your strategy results
        strategy_results = pd.read_csv(results_file_path)
        strategy_results['DATETIME'] = pd.to_datetime(
            strategy_results['DATETIME'], format="%Y-%m-%d %H:%M:%S")

        # Define the initial balance and risk per trade
        initial_balance = 100000
        risk_per_trade = 0.0025  # 0.25%

        # Function to calculate the volume based on risk management
        def calculate_volume(entry_price, stop_loss, balance, risk_per_trade):
            risk_amount = balance * risk_per_trade
            sl_distance = abs(entry_price - stop_loss)
            if sl_distance > 0:
                volume = risk_amount / sl_distance
            else:
                volume = 0
            return volume
        
        def group_and_calculate(df, group_by_column, position_type=None):
                if position_type:
                    df = df[df['order_type'] == position_type]
                
                grouped = df.groupby(group_by_column).agg(
                    net_profit=('profit', 'sum'),  
                    trade_count=('profit', 'count')
                ).reset_index()

                return grouped
        

        def max_consecutive_wins_losses(profits):
            max_wins = 0
            max_losses = 0
            current_wins = 0
            current_losses = 0
            
            for profit in profits:
                if profit > 0:  # It's a win
                    current_wins += 1
                    current_losses = 0  # Reset losses count
                elif profit < 0:  # It's a loss
                    current_losses += 1
                    current_wins = 0  # Reset wins count
                else:  # If no profit or loss, reset both
                    current_wins = 0
                    current_losses = 0
                
                # Check if the current streak is the longest
                if current_wins > max_wins:
                    max_wins = current_wins
                if current_losses > max_losses:
                    max_losses = current_losses

            return max_wins, max_losses
        
        
            # Define additional metrics
        def calculate_metrics(trade_results_df):
            gross_profit = trade_results_df[trade_results_df['profit'] > 0]['profit'].sum()
            gross_loss = trade_results_df[trade_results_df['profit'] <= 0]['profit'].sum()
            net_profit = gross_profit + gross_loss

            total_trades = len(trade_results_df)
            long_trades = trade_results_df[trade_results_df['order_type'] == 'buy']
            short_trades = trade_results_df[trade_results_df['order_type'] == 'sell']

            long_net_result = long_trades['profit'].sum()
            short_net_result = short_trades['profit'].sum()

            long_trades_count = len(long_trades)
            short_trades_count = len(short_trades)

            long_win_percentage = len(long_trades[long_trades['profit'] > 0]) / long_trades_count * 100 if long_trades_count > 0 else 0
            short_win_percentage = len(short_trades[short_trades['profit'] > 0]) / short_trades_count * 100 if short_trades_count > 0 else 0

            # max_consecutive_wins = max_consecutive_counts(trade_results_df['profit'] > 0)
            # max_consecutive_losses = max_consecutive_counts(trade_results_df['profit'] <= 0)
    
            max_consecutive_wins , max_consecutive_losses = max_consecutive_wins_losses(trade_results_df['profit'])

            # Calculate Relative Drawdown
            balance_series = trade_results_df['profit'].cumsum() + initial_balance
            running_max = balance_series.cummax()
            drawdown = running_max - balance_series
            relative_drawdown = drawdown.max()

            # Day of the Week Analysis
            day_of_week_metrics_long = group_and_calculate(trade_results_df, 'TDOW', 'buy')
            day_of_week_metrics_short = group_and_calculate(trade_results_df, 'TDOW', 'sell')

            hour_of_day_metrics_long = group_and_calculate(trade_results_df, 'THOD', 'buy')
            hour_of_day_metrics_short = group_and_calculate(trade_results_df, 'THOD', 'sell')

            date_of_month_metrics_long = group_and_calculate(trade_results_df, 'TDOM', 'buy')
            date_of_month_metrics_short = group_and_calculate(trade_results_df, 'TDOM', 'sell')

            # COT Score Metrics
            cot_metrics_long = trade_results_df[trade_results_df['order_type'] == 'buy'].groupby('cot_score')['profit'].agg(['count', 'sum']).rename(columns={'count': 'Trade Count', 'sum': 'Net Profit'})
            cot_metrics_short = trade_results_df[trade_results_df['order_type'] == 'sell'].groupby('cot_score')['profit'].agg(['count', 'sum']).rename(columns={'count': 'Trade Count', 'sum': 'Net Profit'})

            # Seasonality Score Metrics
            seasonal_metrics_long = trade_results_df[trade_results_df['order_type'] == 'buy'].groupby('seasonal_score')['profit'].agg(['count', 'sum']).rename(columns={'count': 'Trade Count', 'sum': 'Net Profit'})
            seasonal_metrics_short = trade_results_df[trade_results_df['order_type'] == 'sell'].groupby('seasonal_score')['profit'].agg(['count', 'sum']).rename(columns={'count': 'Trade Count', 'sum': 'Net Profit'})



            metrics = {
                'Gross Profit': round(gross_profit,2),
                'Gross Loss':  round(gross_loss,2),
                'Net Profit':  round(net_profit,2),
                'Total Trades': total_trades,
                'Long Trades': long_trades_count,
                'Short Trades': short_trades_count,
                'Long Position Net Result': f"${round(long_net_result),2} / {round(long_win_percentage,2)}%",
                'Short Position Net Result': f"${round(short_net_result),2} / {round(short_win_percentage,2)}%",
                'Maximum Consecutive Wins': f"{max_consecutive_wins}",
                'Maximum Consecutive Loses': f"{max_consecutive_losses}",
                'Relative Drawdown': f"${relative_drawdown}",
                'Long Position Metrics by Day of Week':day_of_week_metrics_long,
                'Short Position Metrics by Day of Week:':day_of_week_metrics_short,
                'Long Position Metrics by Hour of Day:':hour_of_day_metrics_long,
                'Short Position Metrics by Hour of Day:':hour_of_day_metrics_short,
                'Long Position Metrics by Date of Month:':date_of_month_metrics_long,
                'Short Position Metrics by Date of Month:':date_of_month_metrics_short,
                'COT Score Metrics (Long)': cot_metrics_long.to_dict('index'),
                'COT Score Metrics (Short)': cot_metrics_short.to_dict('index'),
                'Seasonality Score Metrics (Long)': seasonal_metrics_long.to_dict('index'),
                'Seasonality Score Metrics (Short)': seasonal_metrics_short.to_dict('index'),
            }


            return metrics
        
        def get_cot_score_for_trade_date(trade_date, pair):
                """
                Fetch the COT score for a given trade date from the COT data file.
                
                Returns:
                int: The COT score for the given trade date.
                """
                # Load the COT data file for the given pair

                trade_date = pd.Timestamp(trade_date)
                cot_data_file = f'cot_results/COT_Scores_{pair}.csv'  # Adjust the path to your COT data files
                cot_df = pd.read_csv(cot_data_file)
                
                # Convert string dates to datetime objects for comparison
                cot_df['From'] = pd.to_datetime(cot_df['From'])
                cot_df['To'] = pd.to_datetime(cot_df['To'])
                
                # Find the COT score for the trade date
                cot_score = cot_df[(cot_df['From'] <= trade_date) & (cot_df['To'] >= trade_date)]['Score']
    
                # Return the COT score if found, otherwise return a neutral score
                if not cot_score.empty:
                    return cot_score.iloc[0]
                else:
                    return ''
                
                
        # Backtesting function

        def backtest_trades(historical_data, strategy_results, initial_balance, risk_per_trade, stoploss_type ):
            print('Evaluating Pair:', pair, 'and R:R', risk_reward_ratio, 'with SL',stoploss_type)

            trade_results = []
            balance = initial_balance

            end_of_trading_time = datetime.time(16, 0)  # 4 PM NY time

            for index, trade in strategy_results.iterrows():

                
                # Get the data for the day of the trade
                trade_date = trade['DATETIME'].date()
                trade_time = trade['DATETIME'].time()
                daily_data = historical_data[historical_data['DATETIME'].dt.date == trade_date]

                # Find the index in historical_data corresponding to the strategy trade time
                trade_index = daily_data[daily_data['DATETIME'].dt.time == trade_time].index

                if not trade_index.empty:
                    trade_index = trade_index[0]  # Assuming there's only one match, take the first
                    volume = calculate_volume(
                            trade['Entry_Price'], trade['Stop_Loss'], balance, risk_per_trade)
                    # Start iterating from the trade_index until the end of the trading day
                    for _, row in daily_data.loc[trade_index:].iterrows():
                        trade_executed = False
                        profit = 0
                        close_datetime = None
                        exit_price = None

                        risk_amount = abs(trade['Entry_Price'] - trade['Stop_Loss'])

                        if trade['Signal'] == 'BUY':
                            hit_tp = row['HIGH'] >= trade['Take_Profit']
                            hit_sl = row['LOW'] <= trade['Stop_Loss']

                            if stoploss_type == 'Breakeven SL' and row['HIGH'] >= trade['Entry_Price'] + risk_amount:
                                trade['Stop_Loss'] = trade['Entry_Price']  # Update to breakeven
                            # elif stoploss_type == 'Trailing SL':
                            #     for i in range(1, int(risk_reward_ratio)):
                            #         if row['HIGH'] >= trade['Entry_Price'] + i * risk_amount:
                            #             trade['Stop_Loss'] = max(trade['Stop_Loss'], trade['Entry_Price'] + (i - 1) * risk_amount)

                        else:
                            hit_tp = row['LOW'] <= trade['Take_Profit']
                            hit_sl = row['HIGH'] >= trade['Stop_Loss']

                            if stoploss_type == 'Breakeven SL' and row['LOW'] <= trade['Entry_Price'] - risk_amount:
                                trade['Stop_Loss'] = trade['Entry_Price']
                            # elif stoploss_type == 'Trailing SL':
                            #     for i in range(1, int(risk_reward_ratio)):
                            #         if row['LOW'] <= trade['Entry_Price'] - i * risk_amount:
                            #             trade['Stop_Loss'] = min(trade['Stop_Loss'], trade['Entry_Price'] - (i - 1) * risk_amount)

                        if hit_tp or hit_sl or row['DATETIME'].time() >= end_of_trading_time:
                            # Close the trade either at TP/SL or at the end of trading time
                            exit_price = trade['Take_Profit'] if hit_tp else trade['Stop_Loss'] if hit_sl else row['CLOSE']
                            profit = (exit_price - trade['Entry_Price']) * volume if trade['Signal'] == 'BUY' else (
                                trade['Entry_Price'] - exit_price) * volume

                            close_datetime = row['DATETIME']
                            trade_executed = True
                            break

                        # If no TP/SL was hit during the day, close the trade at the last available price
                        if not trade_executed and row['DATETIME'].time() == end_of_trading_time:
                            exit_price = row['CLOSE']
                            profit = (exit_price - trade['Entry_Price']) * volume if trade['Signal'] == 'BUY' else (
                                trade['Entry_Price'] - exit_price) * volume
                            close_datetime = row['DATETIME']
                            trade_executed = True
                            break
                    
                    cot_score = get_cot_score_for_trade_date(trade_date, pair)
                    seasonal_score = get_seasonal_score_for_trade_date(trade_date, pair, seasonality_file_path)
                    # Record the trade result
                    trade_results.append({
                        'open_datetime': trade['DATETIME'],
                        'open_price': trade['Entry_Price'],
                        'order_type': 'buy' if trade['Signal'] == 'BUY' else 'sell',
                        'volume': volume,
                        'sl': trade['Stop_Loss'],
                        'tp': trade['Take_Profit'],
                        'close_datetime': close_datetime,
                        'close_price': exit_price,
                        'profit': profit,
                        'status': 'closed',
                        'day': trade['DATETIME'].strftime('%A'),  # Day of the week
                        'TDOW': trade['DATETIME'].weekday() + 1,  # Trading Day Of Week (1 for Monday, 2 for Tuesday, etc.)
                        'THOD': trade['DATETIME'].hour,  # Trading Hour Of Day
                        'TDOM': trade['DATETIME'].day, # Trading Day Of Month
                        'cot_score': cot_score,
                        'seasonal_score': seasonal_score
                    })
                    balance += profit


            # Compile overall results
            results_df = pd.DataFrame(trade_results)
            total_profit = results_df['profit'].sum()
            win_count = len(results_df[results_df['profit'] > 0])
            loss_count = len(results_df[results_df['profit'] <= 0])
            win_rate = ((win_count)/(win_count + loss_count)) if (win_count + loss_count) > 0 else 0

            return results_df, total_profit, win_count, loss_count, balance, win_rate


        # stoplosses = ['Fixed SL', 'Breakeven SL', "Trailing SL"]

        stoplosses = ['Fixed SL', 'Breakeven SL']
        for stoploss in stoplosses:
        # Perform the backtest
            trade_results_df, total_profit, win_count, loss_count, ending_balance, win_rate = backtest_trades(
                historical_data, strategy_results, initial_balance, risk_per_trade, stoploss)
            
            additional_metrics = calculate_metrics(trade_results_df)

            # Display the overall results
            print('Pair: ', pair)
            print(f"Ending Balance: {round(ending_balance,2)}")
            print(f"Total Profit: {round(total_profit,2)}")
            print(f"Total Trades: {win_count+ loss_count}")
            print(f"Win Count: {win_count }")
            print(f"Loss Count: {loss_count}")
            print(f"Win Rate: {round(win_rate/100,2)}%")
            print()


            summary_text += (
                "-------------\n"
                f"Evaluating Pair:, {pair} and R:R  {risk_reward_ratio} with SL ,{stoploss}\n"
                f"Pair: : {pair}\n"
                f"Ending Balance: {round(ending_balance, 2)}\n"
                f"Total Profit: {round(total_profit, 2)}\n"
                f"Total Trades: {win_count + loss_count}\n"
                f"Win Count: {win_count}\n"
                f"Loss Count: {loss_count}\n"
                f"Win Rate: {round(win_rate, 2)}%\n"
            )
            for metric, value in additional_metrics.items():
                if isinstance(value, pd.DataFrame):
                    df_string = value.to_string(index=False)
                    summary_text += f"{metric}:\n{df_string}\n\n"

                    print(f"{metric}:")
                    print(value)
                    print()
                else:
                    print(f"{metric}: {value}")
                    summary_text += f"{metric}: {value}\n"

            # Define the file path
            results_file_path = f'/Users/mac/Desktop/forex_back_test/results/{pair}/{pair}_results.txt'

            # Write the summary text to the file
            with open(results_file_path, 'w') as file:
                file.write(summary_text)

            # Save the detailed trade results to a CSV file
            trade_results_df.to_csv(
                f'/Users/mac/Desktop/forex_back_test/results/{pair}/backtest_results_{risk_reward_ratio}_{pair}_{stoploss}.csv', index=False)



