"use strict";
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-use-before-define */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 可视化工具
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const childProcess = __importStar(require("child_process"));
/**
 * 可视化GOTO图（LR1DFA）
 */
function visualizeGOTOGraph(lr1dfa, lr1Analyzer, viewNow = true) {
    let dumpObject = { nodes: [], edges: [] };
    // 设置点（项目集）
    for (let i = 0; i < lr1dfa.states.length; i++) {
        let topPart = `I${i}\n=======\n`, stateLines = [], kernelItem = true;
        for (let item of lr1dfa.states[i].items) {
            let leftPart = '';
            leftPart += lr1Analyzer.symbols[item.rawProducer.lhs].content;
            leftPart += ' -> ';
            let j = 0;
            for (; j < item.rawProducer.rhs.length; j++) {
                if (j == item.dotPosition)
                    leftPart += '●';
                leftPart += lr1Analyzer.getSymbolString(item.rawProducer.rhs[j]) + ' ';
            }
            if (j == item.dotPosition)
                leftPart = leftPart.substring(0, leftPart.length - 1) + '●';
            leftPart += ' § ';
            let lookahead = lr1Analyzer.getSymbolString(item.lookahead);
            let sameLeftPos = stateLines.findIndex(x => x.leftPart == leftPart);
            if (sameLeftPos !== -1) {
                stateLines[sameLeftPos].lookahead += '/' + lookahead;
            }
            else {
                stateLines.push({ leftPart, lookahead });
            }
            if (kernelItem) {
                leftPart = '--------\n';
                lookahead = '';
                stateLines.push({ leftPart, lookahead });
                kernelItem = false;
            }
        }
        console.log(stateLines);
        let stateString = topPart;
        stateLines.forEach(v => {
            stateString += v.leftPart + v.lookahead + '\n';
        });
        dumpObject.nodes.push({ key: `K${i}`, label: stateString.trim(), color: '#FFFFFF' });
    }
    // 设置边（迁移）
    for (let i = 0; i < lr1dfa.states.length; i++) {
        lr1dfa.adjList[i].forEach(x => {
            dumpObject.edges.push({
                source: `K${i}`,
                target: `K${x.to}`,
                name: `K${i}_${x.to}`,
                label: lr1Analyzer.symbols[x.alpha].content,
            });
        });
    }
    let dagreJSON = JSON.stringify(dumpObject, null, 2);
    const VisualizerPath = path_1.default.join(__dirname, '../../../enhance/Visualizer');
    const shape = 'rect';
    fs_1.default.writeFileSync(path_1.default.join(VisualizerPath, './data.js'), `window._seulex_shape = '${shape}'; let data = ${dagreJSON}`);
    // 启动浏览器显示
    viewNow && childProcess.exec(`start ${path_1.default.join(VisualizerPath, './index.html')} `);
}
exports.visualizeGOTOGraph = visualizeGOTOGraph;
