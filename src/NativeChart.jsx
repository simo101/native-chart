import { Component, createElement } from "react";
import { StyleSheet, View } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

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
                <VictoryChart
                    // adding the material theme provided with Victory
                    theme={VictoryTheme.material}
                    domainPadding={20}
                >
                    <VictoryAxis
                    //tickValues={[1, 2, 3, 4]}
                    //tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
                    />
                    <VictoryAxis
                    //dependentAxis
                    //tickFormat={x => `$${x / 1000}k`}
                    />
                    {this._renderDataSeries(this.props.dataSeries)}
                </VictoryChart>
            </View>
        );
    }

    _renderDataSeries(dataSeries) {
        const charts = [];
        if (dataSeries) {
            console.info(JSON.stringify(dataSeries));
            const formattedDataArray = dataSeries.map(series => {
                console.info("data series: " + JSON.stringify(series));
                if (series.chartData.status === "available") {
                    return series.chartData.items.map(dataRow => ({
                        x: series.x(dataRow).value,
                        y: series.y(dataRow).value
                    }));
                } else {
                    return [];
                }
            });
            console.info("Formatted: " + JSON.stringify(formattedDataArray));

            for (let i = 0; i < formattedDataArray.length; i++) {
                charts.push(<VictoryBar key={i} data={formattedDataArray[i]} x="x" y="y" />);
            }
        }
        return charts;
    }
}
