import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import {stringify, v4 as uuidv4} from 'uuid';

const MermaidRender = (props) => {
    const a = uuidv4() ;
    const mermaidContainerRef = useRef(null);

    useEffect(() => {
        try {
            const mermaidContainer = mermaidContainerRef.current;
            mermaid.initialize({startOnLoad: true, theme: props.theme});
            mermaid.render('mermaidContainer' + a, props.chart, (svgCode) => {
                mermaidContainer.innerHTML = svgCode;
            });
        } catch (e) {

        }
    }, [props.chart]);

    useEffect(() => {
        // mermaid.mermaidAPI.setConfig({theme: props.theme})
        // mermaid.mermaidAPI.updateSiteConfig({theme: props.theme})
        mermaid.initialize({ startOnLoad: true, theme: props.theme })
    }, [props.theme]);

    useEffect(() => {
        try {
            mermaid.render('mermaidContainer' + a, props.chart, (svgCode) => {
                mermaidContainerRef.current.innerHTML = svgCode;
            });
        } catch (e) {

        }
    }, [mermaid.mermaidAPI.getConfig()]);

    return <div ref={mermaidContainerRef}></div>;
};

export default MermaidRender;
