import { Component, createElement } from "react";
import { StyleSheet, View } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine, VictoryPie, VictoryTheme } from "victory-native";

export class NativeChart extends Component {
    render() {
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5fcff"
            }
        });
        return (
            <View style={styles.container}>
                {this._dataReady(this.props.dataSeries) && (
                    <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                        {this._renderAllDataSeries(this.props.dataSeries)}
                    </VictoryChart>
                )}
            </View>
        );
    }

    _dataReady(dataSeries) {
        const nonReadySeries = dataSeries.filter(series => series.chartData.status !== "available");
        return nonReadySeries.length === 0;
    }

    _renderAllDataSeries(dataSeries) {
        const charts = [];
        if (dataSeries) {
            dataSeries.forEach((series, i) => {
                const chart = this._renderOneDataSeries(series, i);
                if (chart) {
                    charts.push(chart);
                }
            });
        }
        return charts;
    }

    _renderOneDataSeries(series, i) {
        const data = series.chartData.items.map(dataRow => 
        ({
            x: this._checkXAxisDataType(series.x(dataRow).value),
            y: parseFloat(series.y(dataRow).value.toFixed(series.yPrecision))
        }));
        if (series.chartType === "bar") {
            const barChart = series.showLabels ? 
            <VictoryBar key={i} data={data} labels={this._generateLabelList(data)}  x="x" y="y"/> : <VictoryBar key={i} data={data} x="x" y="y" />
            return barChart
        } else if (series.chartType === "line") {
            const lineChart = series.showLabels ? 
            <VictoryLine key={i} data={data} labels={this._generateLabelList(data)} x="x" y="y" /> : <VictoryLine key={i} data={data} x="x" y="y" />
            return lineChart
        } else if (series.chartType === "pie") {
            return <VictoryPie key={i} data={data} />
        } 
        else return null;
    }

    _checkXAxisDataType(itemXValue) {
        if (typeof itemXValue === 'object') {
            const formattedDate = (itemXValue.getMonth() + 1) + '/' + itemXValue.getDate() + '/' + itemXValue.getFullYear();
            return formattedDate
        } else return itemXValue
    }

    _generateLabelList(itemList) {
        const labels = itemList.map(item => item.y)
        return labels
    }
    
}