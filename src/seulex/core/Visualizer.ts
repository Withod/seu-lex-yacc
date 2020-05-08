/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * 自动机可视化工具
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */

import { FiniteAutomata, getSpAlpha } from './FA'
import fs from 'fs'
import * as childProcess from 'child_process'

/**
 * 可视化自动机
 * @param viewNow 是否立即打开浏览器查看
 */
export function visualizeFA(fa: FiniteAutomata, viewNow = true) {
  let dumpObject: {
    nodes: {
      label: string
      color: string
    }[]
    edges: {
      source: string
      target: string
      name: string
      label: string
    }[]
  } = { nodes: [], edges: [] }
  // 设置点
  for (let i = 0; i < fa.states.length; i++) {
    dumpObject.nodes.push({
      label: i.toString(),
      color: fa.startStates.includes(fa.states[i])
        ? '#46A3FF'
        : fa.acceptStates.includes(fa.states[i])
        ? '#00DB00'
        : '#FFFFFF',
    })
  }
  // 设置边
  // TODO: 支持多边
  for (let i = 0; i < fa.transformAdjList.length; i++) {
    let transforms = fa.transformAdjList[i]
    for (let j = 0; j < transforms.length; j++) {
      dumpObject.edges.push({
        source: i.toString(),
        target: transforms[j].target.toString(),
        name: `${i}_${j}`,
        label:
          transforms[j].alpha < 0
            ? getSpAlpha(transforms[j].alpha)
            : fa.alphabet[transforms[j].alpha],
      })
    }
  }
  // 计算布局并导出
  let dagreJSON = JSON.stringify(dumpObject, null, 2)
  fs.writeFileSync('enhance\\Visualizer\\data.js', `let data = ${dagreJSON}`)
  // 启动浏览器显示
  viewNow && childProcess.exec(`start enhance\\Visualizer\\index.html`)
}