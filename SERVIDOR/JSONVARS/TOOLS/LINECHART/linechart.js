class LineChart {
    constructor() {
        this.general = {
            title: "",
            description: "",
            idVariableJson: undefined,
            idVariableModbus: undefined,
            idVariableMemory: undefined,
            idVariableEndpoint: undefined,
            sampling_number: 0,
            isArray: false,
            issaveblobdata: false,
            idblobdata: 0,
            polling: {
                time: 0,
                type: "sg"
            }
        };
        this.styles = {
            fill: false,
            fill_color: "",
            line: false,
            line_color: "",
            line_size: 1,
            line_tension: 0,
            line_stepped: false,
            point_style: "circle",
            point_color: "",
            point_border_color: "",
            point_border_size: 1,
            point_width: 1
        };
    }
}

module.exports = LineChart;