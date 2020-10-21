import { Component, createElement } from "react";
import { StyleSheet, View } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine, VictoryTheme } from "victory-native";

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
        const data = series.chartData.items.map(dataRow => ({
            x: series.x(dataRow).value,
            y: parseFloat(series.y(dataRow).value.toFixed(series.yPrecision))
        }));
        if (series.chartType === "bar") {
            return <VictoryBar key={i} data={data} x="x" y="y" />;
        } else if (series.chartType === "line") {
            return <VictoryLine key={i} data={data} x="x" y="y" />;
        } else return null;
    }
}
