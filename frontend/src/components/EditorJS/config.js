import Table from "@editorjs/table";
import TextVariantTune from "@editorjs/text-variant-tune";
import Underline from "@editorjs/underline";
import Strikethrough from "@sotaproject/strikethrough";
import MathTex from "editorjs-math";
import ChangeCase from "editorjs-change-case";
import YoutubeEmbed from "editorjs-youtube-embed";
import Subscript from "editorjs-subscript";
import Telegram from "editorjs-telegram";
import List from "@editorjs/nested-list";
import Header from "@editorjs/header";
import Alert from "editorjs-alert";
import Paragraph from "@editorjs/paragraph";
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";
import Warning from "@editorjs/warning";
import InlineImage from "editorjs-inline-image";
import Code from "@elicodes/codex-code-plugin";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import AnyButton from "editorjs-button";
import Scheme from "./plugins/Scheme/Scheme"
import MyCodeEditor from "./plugins/Code/Code";

export const i18n = {
    messages: {
        toolNames: {
            Link: 'Ссылка',
            Underline: 'Подчёркнутый',
            Strikethrough: 'Зачёркнутый',
            Bold: 'Полужирный',
            Italic: 'Курсив',
            ChangeCase: 'Регистр',
            Marker: 'Маркер',
            InlineCode: 'Моноширинный', // TODO
            "Text": "Текст",
            "Heading": "Заголовок",
            "List": "Список",
            "Warning": "Примечание",
            "Checklist": "Чеклист",
            "Quote": "Цитата",
            "Code": "Код",
            "Delimiter": "Разделитель",
            "Raw HTML": "HTML-фрагмент",
            "Table": "Таблица",
            "Attachment": "Файл",
            // "InlineImage": "Изображение по ссылке",
            MathTex: "Математика",
            "mermaid": "Mermaid",
            "Alert": "Предупреждение",
            "Scheme": "Схема",
            "MyCode": "Код"
            // "Link": "Ссылка",
            // "Marker": "Маркер",
            // "Bold": "Полужирный",
            // "Italic": "Курсив",
            // "InlineCode": "Моноширинный",
        },
        tools: {
            "Warning": { // <-- 'Warning' tool will accept this dictionary section
                "Title": "Название",
                "Message": "Сообщение",
            },
            "Alert": {
                "Type here...": "123123",
                "Primary": 'awdawd'
            }
        },
        ui: {
            "blockTunes": {
                "toggler": {
                    "Click to tune": "Нажмите, чтобы настроить",
                    "or drag to move": "или перетащите"
                },
            },
            "inlineToolbar": {
                "converter": {
                    "Convert to": "Конвертировать в"
                }
            },
            "toolbar": {
                "toolbox": {
                    "Add": "Добавить"
                }
            }
        },
        blockTunes: {
            "delete": {
                "Delete": "Удалить"
            },
            "moveUp": {
                "Move up": "Вверх"
            },
            "moveDown": {
                "Move down": "Вниз"
            },
            "textVariant": {
                "Details": "Детали",
                "Citation": "Цитата",
                "Call-out": "Предупреждение",
                "Left": "По левому краю"
            },
            "anyTuneName": {
                "Left": "По левому краю"
            }
        },
    }
}

export const EDITOR_JS_TOOLS = {
    table: {
        class: Table,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+T',
    },
    textVariant: TextVariantTune,
    underline: {
        class: Underline,
        shortcut: 'CMD+U',
    },
    strikethrough: {
        class: Strikethrough,
        shortcut: 'CMD+T',
    },
    math: {
        class: MathTex, // for CDN: window.MathTex
        config: {
            title: "Math"
        },
        shortcut: 'CMD+SHIFT+F',
    },
    changeCase: {
        class: ChangeCase,
        config: {
            showLocaleOption: true, // enable locale case options
            locale: 'tr' // or ['tr', 'TR', 'tr-TR']
        }
    },
    youtubeEmbed:{
        class:YoutubeEmbed,
        shortcut: 'CMD+SHIFT+Y',
    },
    subscript: {
        class: Subscript,
        shortcut: 'CMD+G',
    },
    telegram: Telegram,
    scheme: {
        class: Scheme,
        shortcut: 'CMD+SHIFT+S',
    },
    // mermaid: {
    //     class: MermaidTool,
    //     config: {
    //         title: "Mermaid"
    //     },
    //     shortcut: 'CMD+SHIFT+M',
    // },
    // gist: {
    //     class: Gist,
    //     shortcut: 'CMD+SHIFT+G',
    // },
    list: {
        class: List,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+L',
    },
    header: {
        class: Header,
        inlineToolbar: true,
        tunes: ['anyTuneName'],
        shortcut: 'CMD+SHIFT+H',
    },
    alert: {
        class: Alert,
        shortcut: 'CMD+SHIFT+V',
        config: {
            defaultType: 'primary',
            messagePlaceholder: 'Ваше сообщение...',
        },
    },
    paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        config: {
            preserveBlank: true
        },
        tunes: ['anyTuneName'],
    },
    anyTuneName: {
        class: AlignmentTuneTool,
        config: {
            default: "left",
            blocks: {
                header: 'center',
                list: 'left'
            }
        },
    },
    warning: {
        class: Warning,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+W',
        config: {
            titlePlaceholder: 'Заголовок',
            messagePlaceholder: 'Сообщение',
        },
    },
    inlineImage: {
        class: InlineImage,
        inlineToolbar: false,
        config: {
            embed: {
                display: true,
            },
            unsplash: {
                appName: 'MermaidRender Hub',
                clientId: 'krIYOtKI1ukpgtQ0BHmFvhAALrP4ofOeg_DXn4G0ZJY'
            }
        },
        shortcut: 'CMD+SHIFT+I',
    },
    code: {
        class: Code,
        // class: MyCodeEditor,
        config: {
            title: "Код"
        },
        shortcut: 'CMD+SHIFT+C',
    },
    myCode: {
        class: MyCodeEditor,
        config: {
            title: "Код"
        },
        // shortcut: 'CMD+SHIFT+J',
    },
    quote: {
        class: Quote,
        shortcut: 'CMD+SHIFT+Q',
    },
    marker: {
        class: Marker,
        shortcut: 'CMD+M',
    },
    checklist: {
        class: CheckList,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+X',
    },
    delimiter: {
        class: Delimiter,
        shortcut: 'CMD+SHIFT+D',
    },
    inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+F',
    },
    AnyButton: {
        class: AnyButton,
        inlineToolbar: false,
        config: {
            css: {
                "btnColor": "btn--gray",
            }
        },
        shortcut: 'CMD+SHIFT+B',
    },
    // i18n: {
    //     messages: {
    //         tools: {
    //             image: {
    //                 'Upload an image': 'Up',
    //             }
    //         }
    //     }
    // }
}

