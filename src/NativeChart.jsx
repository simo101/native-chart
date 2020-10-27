import { Component, createElement, Fragment } from "react";
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
                {this._dataReady(this.props.dataSeries) && (this._renderVictoryChart())}
            </View>
        );
    }

    _dataReady(dataSeries) {
        const nonReadySeries = dataSeries.filter(series => series.chartData.status !== "available");
        return nonReadySeries.length === 0;
    }

    _renderVictoryChart() {
        let renderCustomAxes = false;
        if (this.props.labelPrefix !== '') {
            renderCustomAxes = true
        }
        if (this.props.labelSuffix !== '') {
            renderCustomAxes = true
        }
        if (renderCustomAxes) {
            return (<Fragment>
                        {this._renderCustomizedAxes()}
                    </Fragment>
                )
        }
        else {
            return (<VictoryChart theme={VictoryTheme.material} domainPadding={20} children={this._renderAllDataSeries(this.props.dataSeries)}>                    
                    </VictoryChart>
                )
        }
    }

    _renderCustomizedAxes() {
        const prefix = this.props.labelPrefix !== '' ? this.props.labelPrefix : ''
        const suffix = this.props.labelSuffix !== '' ? this.props.labelSuffix : ''
        const scaleValue = this.props.formatXAxisDate ? {x:"time"} : null
        const tickFormatFn = (tickLabel) => {
            return `${prefix}${tickLabel}${suffix}`
        }
        return (<VictoryChart scale={scaleValue} theme={VictoryTheme.material} domainPadding={20}>
                    <VictoryAxis tickFormat={tickFormatFn} dependentAxis={true} />
                    <VictoryAxis  independentAxis={true} />
                    {this._renderAllDataSeries(this.props.dataSeries)}
                </VictoryChart>)

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
            const barChartLabels = series.showLabels ? this._generateLabelList(data) : null;
            return <VictoryBar key={i} data={data} labels={barChartLabels}  x="x" y="y"/>
        } else if (series.chartType === "line") {
            const lineChartLabels = series.showLabels ? this._generateLabelList(data) : null;
            return <VictoryLine key={i} data={data} labels={lineChartLabels} x="x" y="y" />         
        }
        else return null;
    }

    _checkXAxisDataType(itemXValue) {
        if (typeof itemXValue === 'object') {
            formattedDate = new Date(itemXValue)
            return formattedDate
        } else return itemXValue
    }

    _generateLabelList(itemList) {
        const labels = itemList.map(item => item.y)
        return labels
    }
    
}