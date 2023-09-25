import React, {useEffect, useState} from 'react';
import s from './CodeRender.module.css'
import {ConfigProvider, message, Form, Input, Segmented, Select, Space, theme, Button, Tabs, Menu} from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import {langs} from '@uiw/codemirror-extensions-langs';
import {vscodeDark} from '@uiw/codemirror-theme-vscode';
import {autocompletion} from '@codemirror/autocomplete';
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneDark} from "react-syntax-highlighter/dist/cjs/styles/prism";
import "./TabMenu.css"

const TabPane = Tabs.TabPane;

function PreCode(props) {
    return <p className={s.preCode}>{props.children}</p>
}

function Code(props) {
    return <code className={s.code}>{props.children}</code>
}

function CodeRender(props) {
    const [code, setCode] = useState("")
    const [selectedFile, setSelectedFile] = useState(0)
    let filesOptions = props?.files?.map((file, index) => {
        return {key: index, label: file.fileName}
    })
    useEffect(() => {
        filesOptions = props.files.map((file, index) => {
            return {key: index, label: file.fileName}
        })
    }, [props])


    const languages = {
        "html": "HTML",
        "css": "CSS",
        "js": "JavaScript",
        "javascript": "JavaScript",
        "abap": "ABAP",
        "abnf": "Augmented Backus-Naur form",
        "actionscript": "ActionScript",
        "ada": "Ada",
        "al": "AL",
        "antlr4": "ANTLR4",
        "apacheconf": "Apache Configuration",
        "apl": "APL",
        "applescript": "AppleScript",
        "aql": "AQL",
        "arduino": "Arduino",
        "arff": "ARFF",
        "asciidoc": "AsciiDoc",
        "asm6502": "6502 Assembly",
        "aspnet": "ASP.NET (C#)",
        "autohotkey": "AutoHotkey",
        "autoit": "AutoIt",
        "bash": "Bash",
        "basic": "BASIC",
        "batch": "Batch",
        "bbcode": "BBcode",
        "bison": "Bison",
        "bnf": "Backus–Naur form",
        "brainfuck": "Brainfuck",
        "brightscript": "BrightScript",
        "bro": "Bro",
        "c": "C",
        "concurnas": "Concurnas",
        "csharp": "C#",
        "cpp": "C++",
        "cil": "CIL",
        "coffeescript": "CoffeeScript",
        "cmake": "CMake",
        "clojure": "Clojure",
        "crystal": "Crystal",
        "csp": "Content-Security-Policy",
        "css-extras": "CSS Extras",
        "d": "D",
        "dart": "Dart",
        "dax": "DAX",
        "diff": "Diff",
        "dns-zone-file": "DNS zone file",
        "docker": "Docker",
        "ebnf": "Extended Backus–Naur form",
        "eiffel": "Eiffel",
        "ejs": "EJS",
        "elixir": "Elixir",
        "elm": "Elm",
        "etlua": "Embedded Lua templating",
        "erb": "ERB",
        "erlang": "Erlang",
        "xlsx": "Excel Formula",
        "fsharp": "F#",
        "factor": "Factor",
        "firestore-security-rules": "Firestore security rules",
        "flow": "Flow",
        "fortran": "Fortran",
        "ftl": "FreeMarker Template Language",
        "gcode": "G-code",
        "gdscript": "GDScript",
        "gedcom": "GEDCOM",
        "gherkin": "Gherkin",
        "git": "Git",
        "glsl": "GLSL",
        "gml": "GameMaker Language",
        "go": "Go",
        "graphql": "GraphQL",
        "groovy": "Groovy",
        "haml": "Haml",
        "handlebars": "Handlebars",
        "haskell": "Haskell",
        "haxe": "Haxe",
        "hcl": "HCL",
        "hlsl": "HLSL",
        "http": "HTTP",
        "hpkp": "HTTP Public-Key-Pins",
        "hsts": "HTTP Strict-Transport-Security",
        "ichigojam": "IchigoJam",
        "icon": "Icon",
        "iecst": "Structured Text (IEC 61131-3)",
        "inform7": "Inform 7",
        "ini": "Ini",
        "io": "Io",
        "j": "J",
        "java": "Java",
        "javadoc": "JavaDoc",
        "javadoclike": "JavaDoc-like",
        "javastacktrace": "Java stack trace",
        "jinja2": "Jinja2",
        "jolie": "Jolie",
        "jq": "JQ",
        "jsdoc": "JSDoc",
        "js-extras": "JS Extras",
        "js-templates": "JS Templates",
        "json": "JSON",
        "jsonp": "JSONP",
        "json5": "JSON5",
        "julia": "Julia",
        "keyman": "Keyman",
        "kotlin": "Kotlin",
        "latex": "LaTeX",
        "latte": "Latte",
        "less": "Less",
        "lilypond": "LilyPond",
        "liquid": "Liquid",
        "lisp": "Lisp",
        "livescript": "LiveScript",
        "llvm": "LLVM IR",
        "lolcode": "LOLCODE",
        "lua": "Lua",
        "makefile": "Makefile",
        "markdown": "Markdown",
        "markup-templating": "Markup templating",
        "matlab": "MATLAB",
        "mel": "MEL",
        "mizar": "Mizar",
        "monkey": "Monkey",
        "moonscript": "MoonScript",
        "n1ql": "N1QL",
        "n4js": "N4JS",
        "nand2tetris-hdl": "Nand To Tetris HDL",
        "nasm": "NASM",
        "neon": "NEON",
        "nginx": "nginx",
        "nim": "Nim",
        "nix": "Nix",
        "nsis": "NSIS",
        "objectivec": "Objective-C",
        "ocaml": "OCaml",
        "opencl": "OpenCL",
        "oz": "Oz",
        "parigp": "PARI/GP",
        "parser": "Parser",
        "pascal": "Pascal",
        "pascaligo": "Pascaligo",
        "pcaxis": "PC-Axis",
        "peoplecode": "PeopleCode",
        "perl": "Perl",
        "php": "PHP",
        "phpdoc": "PHPDoc",
        "php-extras": "PHP Extras",
        "plsql": "PL/SQL",
        "powerquery": "PowerQuery",
        "powershell": "PowerShell",
        "processing": "Processing",
        "prolog": "Prolog",
        "properties": ".properties",
        "protobuf": "Protocol Buffers",
        "pug": "Pug",
        "puppet": "Puppet",
        "pure": "Pure",
        "purebasic": "PureBasic",
        "python": "Python",
        "q": "Q (kdb+ database)",
        "qml": "QML",
        "qore": "Qore",
        "r": "R",
        "racket": "Racket",
        "jsx": "React JSX",
        "tsx": "React TSX",
        "renpy": "Ren'py",
        "reason": "Reason",
        "regex": "Regex",
        "rest": "reST (reStructuredText)",
        "rip": "Rip",
        "roboconf": "Roboconf",
        "robotframework": "Robot Framework",
        "ruby": "Ruby",
        "rust": "Rust",
        "sas": "SAS",
        "sass": "Sass (Sass)",
        "scss": "Sass (Scss)",
        "scala": "Scala",
        "scheme": "Scheme",
        "shell-session": "Shell session",
        "smalltalk": "Smalltalk",
        "smarty": "Smarty",
        "solidity": "Solidity (Ethereum)",
        "solution-file": "Solution file",
        "soy": "Soy (Closure Template)",
        "sparql": "SPARQL",
        "splunk-spl": "Splunk SPL",
        "sqf": "SQF: Status Quo Function (Arma 3)",
        "sql": "SQL",
        "stylus": "Stylus",
        "swift": "Swift",
        "tap": "TAP",
        "tcl": "Tcl",
        "textile": "Textile",
        "toml": "TOML",
        "tt2": "Template Toolkit 2",
        "turtle": "Turtle",
        "twig": "Twig",
        "typescript": "TypeScript",
        "t4-cs": "T4 Text Templates (C#)",
        "t4-vb": "T4 Text Templates (VB)",
        "t4-templating": "T4 templating",
        "unrealscript": "UnrealScript",
        "vala": "Vala",
        "vbnet": "VB.Net",
        "velocity": "Velocity",
        "verilog": "Verilog",
        "vhdl": "VHDL",
        "vim": "vim",
        "visual-basic": "Visual Basic",
        "warpscript": "WarpScript",
        "wasm": "WebAssembly",
        "wiki": "Wiki markup",
        "xeora": "Xeora",
        "xml-doc": "XML doc (.net)",
        "xojo": "Xojo (REALbasic)",
        "xquery": "XQuery",
        "yaml": "YAML",
        "zig": "Zig"
    }

    console.log("PROPS", props, filesOptions)

    return (
        <>
            {
                props.files.length !== 1 ?
                    <div className={s.sContainer}>
                        <div className={s.codeContainer}>
                            {/*<p className={s.codeContainerTitle}>{languages[props.files[selectedFile].languageCode]}</p>*/}
                            {/*<p className={s.codeContainerTitle}>{props.files[selectedFile].fileName}</p>*/}
                            <Tabs tabBarGutter={0}
                                  tabPosition={"top"}
                                  tabBarStyle={{margin: "0 0", borderRadius: "15px 15px 0 0"}}
                                  type="card"
                                  onChange={e => setSelectedFile(e)}>
                                {
                                    filesOptions.map(tab => {
                                        return <TabPane rootClassName={s.tab} tab={tab.label} key={tab.key}></TabPane>
                                    })
                                }
                            </Tabs>
                            {/*<Segmented options={filesOptions} onChange={e => setSelectedFile(e)}/>*/}
                            <div className={s.codePart}>
                                <SyntaxHighlighter language={props.files[selectedFile].languageCode}
                                                   style={oneDark}
                                                   showLineNumbers
                                                   PreTag={PreCode}
                                                   CodeTag={Code}
                                                   lineNumberContainerStyle={{}}
                                                   lineNumberStyle={{minWidth: "2.25em"}}
                                >
                                    {props.files[selectedFile].code}
                                </SyntaxHighlighter>
                                <div className={s.footer}>
                                    <p className={s.footerDescription}>{props.description}</p>
                                    <p className={s.footerLanguage}>{languages[props.files[selectedFile].languageCode]}</p>
                                </div>

                            </div>


                            {/*<div className={s.footer}>*/}
                            {/*    <p className={s.footerDescription}>{props.description}</p>*/}
                            {/*    <p className={s.footerLanguage}>{languages[props.files[selectedFile].languageCode]}</p>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    : <div className={s.sContainer}>
                        <div className={s.codeContainer}>
                            <p className={s.codeContainerTitle}>{props.files[0].fileName}</p>
                            <div className={s.codePart}>
                                <SyntaxHighlighter language={props.files[0].languageCode}
                                                   style={oneDark}
                                                   showLineNumbers
                                                   PreTag={PreCode}
                                                   CodeTag={Code}
                                                   lineNumberContainerStyle={{}}
                                                   lineNumberStyle={{minWidth: "2.25em"}}
                                >
                                    {props.files[0].code}
                                </SyntaxHighlighter>
                                <div className={s.footer}>
                                    <p className={s.footerDescription}>{props.description}</p>
                                    <p className={s.footerLanguage}>{languages[props.files[0].languageCode]}</p>
                                </div>

                            </div>


                            {/*<div className={s.footer}>*/}
                            {/*    <p className={s.footerDescription}>{props.description}</p>*/}
                            {/*    <p className={s.footerLanguage}>{languages[props.files[selectedFile].languageCode]}</p>*/}
                            {/*</div>*/}
                        </div>
                    </div>
            }
        </>
    )
}

export default CodeRender;
