import React, {useEffect} from 'react';
import s from './Note.module.css';
import classNames from "classnames";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {useTheme} from "../../hooks/use-theme";
import MermaidRender from "../MermaidRender/MermaidRender";
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import Gist from 'super-react-gist'
import {Alert, Image, Checkbox, Spin} from 'antd';
import SchemePreview from "../SchemePreview/SchemePreview";
import {useDispatch} from "react-redux";
import {useSchemes} from "../../hooks/use-schemes";
import {getSchemes} from "../../store/slices/schemesSlice";
import CodeRender from "../CodeRender/CodeRender";
import {Blockquote} from "@mantine/core";

function PreCode(props) {
    return <p className={s.preCode}>{props.children}</p>
}

function Code(props) {
    return <code className={s.code}>{props.children}</code>
}

function Note(props) {
    const dispatch = useDispatch()
    const schemes = useSchemes();

    useEffect(() => {
        dispatch(getSchemes())
    }, [])
    const theme = useTheme()
    const code = {
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


    console.log(props.portfolio)

    const createList = (items, isOrdered) => {
        console.log("ITEMS ", items, isOrdered)
        return (
            <ul className={s.nestedList}>
                {
                    items.map(item => {
                        console.log("ITEM ", item)
                        return (
                            <li className={classNames(s.nestedListItem, isOrdered ? s.nestedListItemOrdered : s.nestedListItemUnordered)}>
                                <div>
                                    <div dangerouslySetInnerHTML={{__html: item.content}}/>
                                    {
                                        item.items[0] ?
                                            createList(item.items, isOrdered) : <></>
                                    }
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        )

    }

    const createChecklist = (items) => {
        return (
            <div className={s.checklist}>
                {
                    items?.map(item => {
                        return <div>
                            <Checkbox checked={item.checked} >
                                <div className={s.checklistItem} dangerouslySetInnerHTML={{__html: item.text}}/>
                            </Checkbox>
                            {/*<label className={s.checklistItem}>*/}
                            {/*    <input type="checkbox" checked={item.checked}/>*/}
                            {/*    <div dangerouslySetInnerHTML={{__html: item.text}}/>*/}
                            {/*    /!*<span>{item.text}</span>*!/*/}
                            {/*</label>*/}
                        </div>
                    })
                }
            </div>
        )
    }

    if (schemes.isLoading)
        return <Spin/>

    const createTable = (data) => {
        if (data.content.length === 0)
            return;
        const columnsCount = data.content[0].length;
        console.log(columnsCount)
        return (
            <div className={s.table}>
                {
                    data.withHeadings ?
                        <div className={classNames(s.tableRow, s.tableHeadings)}
                             style={{gridTemplateColumns: "1fr ".repeat(columnsCount)}}>
                            {
                                data.content[0].map(cell => {
                                    return <div className={classNames(s.tableCell, s.tableHeadingsCell)}
                                                dangerouslySetInnerHTML={{__html: cell}}/>
                                })
                            }
                        </div> :
                        <div className={s.tableRow} style={{gridTemplateColumns: "1fr ".repeat(columnsCount)}}>
                            {
                                data.content[0].map(cell => {
                                    return <div className={s.tableCell} dangerouslySetInnerHTML={{__html: cell}}/>
                                })
                            }
                        </div>
                }
                {
                    data.content.map((row, index) => {
                        return index === 0 ? <></> :
                            <div className={s.tableRow} style={{gridTemplateColumns: "1fr ".repeat(columnsCount)}}>
                                {
                                    row.map(cell => {
                                        return <div className={s.tableCell} dangerouslySetInnerHTML={{__html: cell}}/>
                                    })
                                }
                            </div>
                    })
                }
                {/*{*/}
                {/*    items?.map(item => {*/}
                {/*        return <div><label className={s.checklistItem}>*/}
                {/*            <input type="checkbox" checked={item.checked}/>*/}
                {/*            <div dangerouslySetInnerHTML={{__html: item.text}}/>*/}
                {/*            /!*<span>{item.text}</span>*!/*/}
                {/*        </label></div>*/}
                {/*    })*/}
                {/*}*/}
            </div>
        )
    }


    return (
        <div className={classNames(s.portfolio, !theme.isDark ? s.lightTheme : "")}>
            {
                props.portfolio.blocks?.map(block => {
                    if (block.type === "header") {
                        if (block.data.level === 1)
                            return <h1 key={block.id}
                                       className={classNames(s.h1, s[block.tunes.anyTuneName.alignment])}
                                       dangerouslySetInnerHTML={{__html: block.data.text}}/>
                        if (block.data.level === 2)
                            return <h2 key={block.id}
                                       className={classNames(s.h2, s[block.tunes.anyTuneName.alignment])}
                                       dangerouslySetInnerHTML={{__html: block.data.text}}/>
                        if (block.data.level === 3)
                            return <h3 key={block.id}
                                       className={classNames(s.h3, s[block.tunes.anyTuneName.alignment])}
                                       dangerouslySetInnerHTML={{__html: block.data.text}}/>
                        if (block.data.level === 4)
                            return <h4 key={block.id}
                                       className={classNames(s.h4, s[block.tunes.anyTuneName.alignment])}
                                       dangerouslySetInnerHTML={{__html: block.data.text}}/>
                        if (block.data.level === 5)
                            return <h5 key={block.id}
                                       className={classNames(s.h5, s[block.tunes.anyTuneName.alignment])}
                                       dangerouslySetInnerHTML={{__html: block.data.text}}/>
                        if (block.data.level === 6)
                            return <h6 key={block.id}
                                       className={classNames(s.h6, s[block.tunes.anyTuneName.alignment])}
                                       dangerouslySetInnerHTML={{__html: block.data.text}}/>
                    }

                    if (block.type === "paragraph") {
                        if (!block.data.text)
                            return <p key={block.id} className={classNames(s.p, s[block.tunes.anyTuneName.alignment])}>
                                <br/></p>
                        else
                            return <div className={classNames(s.p, s[block.tunes.anyTuneName.alignment])}
                                        dangerouslySetInnerHTML={{__html: block.data.text}}
                                        key={block.id}
                            />
                    }

                    if (block.type === "delimiter") {
                        return <div className={classNames(s.delimiter)} key={block.id}/>
                    }

                    if (block.type === "list") {
                        return createList(block.data.items, block.data.style === "ordered")
                    }

                    if (block.type === "checklist")
                        return createChecklist(block.data.items)

                    if (block.type === "table")
                        return createTable(block.data)

                    if (block.type === "gist")
                        return <Gist url={block.data.url.slice(0, -3)} key={block.id}/>

                    const alerts = {
                        "primary": 'info',
                        'secondary': 'info',
                        'info': 'info',
                        'success': 'success',
                        'warning': 'warning',
                        'danger': 'error',
                        'light': 'info',
                        'dark': 'info',
                    }

                    if (block.type === "alert")
                        return <Alert message={block.data.message} type={alerts[block.data.type]} showIcon
                                      key={block.id}/>

                    if (block.type === "warning")
                        return <div className={s.warning} key={block.id}>
                            <p className={s.warningIcon}>❗</p>
                            <div className={s.warningTitle}
                                 dangerouslySetInnerHTML={{__html: block.data.title}}></div>
                            <div className={s.warningMessage}
                                 dangerouslySetInnerHTML={{__html: block.data.message}}></div>
                        </div>

                    if (block.type === "youtubeEmbed")
                        if (block.data.url.match(/https:\/\/www.youtube.com\/embed\/bpPWkd8-Lkk/gi)?.length === 1)
                            return <iframe width="853" height="480" src={block.data.url} allowfullscreen
                                           ng-show="showvideo" key={block.id}/>
                        else
                            return <p key={block.id}>Неверная ссылка на видео: должна иметь вид
                                https://www.youtube.com/embed/...URL</p>

                    if (block.type === "math")
                        return <TeX key={block.id}
                                    math={block.data.text}
                                    renderError={(error) => {
                                        return <b>Неверное математическое выражение: {error.name}</b>;
                                    }}
                        />

                    if (block.type === "mermaid")
                        return <MermaidRender key={block.id} chart={block.data.code}
                                              theme={theme.isDark ? 'dark' : 'base'}/>

                    if (block.type === "scheme") {
                        let scheme = schemes.schemes.find(scheme => scheme.id === block.data.schemeID)?.scheme
                        if (!block.data.schemeID)
                            return;
                        return <div className={s.schemeContainer}>
                            <SchemePreview selectScheme={scheme ? JSON.parse(scheme) : {}}/>
                            <p className={s.schemeDescription}>{block.data.description}</p>
                        </div>

                    }

                    // DEPRECATED
                    if (block.type === "code")
                        return (
                            <div className={s.codeContainer} key={block.id}>
                                <p className={s.codeContainerTitle}>{code[block.data.languageCode]}</p>
                                <SyntaxHighlighter language={block.data.languageCode}
                                                   style={oneDark}
                                                   showLineNumbers
                                                   PreTag={PreCode}
                                                   CodeTag={Code}
                                >
                                    {block.data.code}
                                </SyntaxHighlighter>
                            </div>
                        );

                    if (block.type === "myCode")
                        return (
                            <div key={block.id}>
                                <CodeRender files={block.data.files} description={block.data.description}/>
                            </div>
                        );

                    if (block.type === "AnyButton")
                        return (
                            <div className={s.navButton} key={block.id}>
                                <a href={block.data.link}>{block.data.text}</a>
                            </div>
                        );

                    if (block.type === "inlineImage")
                        return (
                            <div className={s.inlineImage} key={block.id}>
                                <div className={block.data.withBorder ? s.inlineImageWithBorder : ""}>
                                    <Image
                                           src={block.data.url} alt={""}
                                    />
                                </div>

                                {/*<img className={block.data.withBorder ? s.inlineImageWithBorder : ""}*/}
                                {/*     src={block.data.url} alt={""}/>*/}
                                <div className={s.inlineImageCaption}
                                     dangerouslySetInnerHTML={{__html: block.data.caption}}></div>
                            </div>
                        );

                    if (block.type === "quote") {
                        if (block.data.alignment === "left") {
                            return (
                                <Blockquote cite={block.data.caption}>
                                    <div dangerouslySetInnerHTML={{__html: block.data.text}}/>
                                </Blockquote>
                                // <blockquote className={s.sidekick} key={block.id}>
                                //     <div dangerouslySetInnerHTML={{__html: block.data.text}}/>
                                //     <cite>{block.data.caption}</cite>
                                // </blockquote>
                            )
                        } else {
                            return (
                                <div className={s.quoteContainerContainer} key={block.id}>
                                    <div className={s.quoteContainer}>
                                        <div className={s.quoteText}
                                             dangerouslySetInnerHTML={{__html: block.data.text}}/>
                                        <div className={s.quoteAuthor}
                                             dangerouslySetInnerHTML={{__html: "- " + block.data.caption}}/>

                                    </div>
                                </div>
                            )
                        }
                    }
                })
            }
        </div>
    )
}

export default Note;
