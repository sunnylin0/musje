import { makeToJSON, extend } from '../util'
import ScoreHead from './ScoreHead'
import PartwiseParts from './PartwiseParts'
import TimewiseMeasures from './TimewiseMeasures'

/**
 * @param {Object} score - plain score object.
 * @mixes PlayerMixin
 */
class Score {
  constructor(score) {
    extend(this, score)
  }

  /**
   * Head of the score.
   * @type {ScoreHead}
   */
  get head() { return this._head || (this._head = new ScoreHead()) }
  set head(head) { this._head = new ScoreHead(head) }

  /**
   * Partwise parts.
   * - (Getter)
   * - (Setter)
   * @type {PartwiseParts}
   */
  get parts() {
    return this._parts || (this._parts = new PartwiseParts(this))
  }
  set parts(parts) {
    this.parts.removeAll()
    this.parts.addParts(parts)
    this.measures.fromPartwise()
  }

  /**
   * Timewise measures, generated by the initialize function.
   * @type {TimewiseMeasures}
   * @readonly
   */
  get measures() {
    return this._measures || (this._measures = new TimewiseMeasures(this))
  }

  /**
   * A cell is identically a measure in a part or a part in a measure.
   * @param {Function}
   */
  walkCells(callback) {
    this.parts.forEach((part, p) => {
      part.measures.forEach((cell, m) => { callback(cell, m, p) })
    })
  }

  /**
   * Walk each music data.
   * @param {Function} callback
   */
  walkMusicData(callback) {
    this.walkCells((cell, m, p) => {
      cell.data.forEach((data, d) => { callback(data, d, m, p) })
    })
  }

  /**
   * Convert score to string.
   * @return {string} Musje source code.
   */
  toString() {
    return this.head + this.parts.map((part) => part.toString()).join('\n\n')
  }

  /**
   * Custom toJSON method.
   * @method
   * @return {Object}
   */
  toJSON = makeToJSON({
    head: undefined,
    parts: undefined
  })
}

export default Score
