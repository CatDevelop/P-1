import React, {Component} from "react";
import mermaid from "mermaid";

export default class MermaidDiagram extends Component {
    constructor(props){
        super(props)
        this.state={
            chart: this.props.chart || ""
        }
        mermaid.initialize({
                startOnLoad: false,
                theme: props.theme
        })
        this.mermaidRef = React.createRef()
    }
    mermaidUpdate(){

        var cb = function (svgGraph) {
            this.mermaidRef.current.innerHTML = svgGraph
        };
        //console.log("this.state.chart", this.state.chart)
        mermaid.mermaidAPI.render('id0', this.state.chart, cb.bind(this));
    }
    componentDidMount(){
        this.mermaidUpdate()
    }
    componentDidUpdate(prevProps, prevState) {
        //console.log("Mermiad prevProps.chart", prevProps.chart)
        if (this.props.chart !== prevProps.chart) {
            this.setState({chart:this.props.chart},()=>{
                this.mermaidUpdate()
            })
        }
        // mermaid.mermaidAPI.setConfig({theme: this.props.theme})
    }
    render() {
        var outObj = (
            <div
                ref={this.mermaidRef}
                className="mermaid"
            >
                {this.state.chart}
            </div>
        )
        return outObj
    }
}
