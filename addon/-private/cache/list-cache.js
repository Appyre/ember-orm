import EmptyObject from '../ember/empty-object';
import FastArray from './fast-array';

const SMALL_ARRAY_SIZE = 200;
const LARGE_ARRAY_SIZE = 64000;

export default class ListCache {

  constructor(length = SMALL_ARRAY_SIZE) {
    this.length = 0;
    this.maxLength = length;
    this._indeces = new Array(length);
    this._values = new Array(length);
    this.isMap = false;
    this._map = undefined;
  }

  forEach(cb) {
    if (this.length >= SMALL_ARRAY_SIZE) {
      if (this._map instanceof EmptyObject) {
        for (let i in this._map) {
          cb(this._map[i], i);
        }
      } else {
        this._map.forEach(cb);
      }
    } else {
      for (let i = 0; i < this.length; i++) {
        let key;

        if (key = this._indeces[i]) {
          cb(this._values[i], key);
        }
      }
    }
  }

  get(key) {
    if (this.length <= MAX_ARRAY_SIZE) {
      let index = this._indeces.indexOf(key);

      if (index === -1) {
        return undefined;
      }

      return this._values[index];
    }

    return this._map[key];
  }

  set(key, value) {
    if (this.length <= MAX_ARRAY_SIZE) {
      let index = this._indeces.indexOf(key);

      if (index !== -1) {
        this._values[index] = value;
        return;
      }

      index = this.length++;

      if (index !== MAX_ARRAY_SIZE) {
        if (index === this.maxLength) {
          let len = this.maxLength * 2;

          if (len > MAX_ARRAY_SIZE) {
            len = MAX_ARRAY_SIZE;
          }

          this.maxLength = len;
          this._indeces.length = len;
          this._values.length = len;
        }

        if (index !== MAX_ARRAY_SIZE) {
          this._indeces[index] = key;
          this._values[index] = value;
          return;
        }
      }

      this.constructor = new Map();

      for (let i = 0; i < MAX_ARRAY_SIZE; i++) {
        this._map[this._indeces[i]] = this._values[i];
      }
      this._indeces = undefined;
      this._values = undefined;
    }

    this._map[key] = value;
  }

  remove(key) {
    if (this.length < MAX_ARRAY_SIZE) {
      let index = this._indeces.indexOf(key);

      if (index === -1) {
        return undefined;
      }

      let value = this._values[index];

      this._indeces[index] = undefined;
      this._values[index] = undefined;

      return value;
    }

    return this._map[key] = undefined;
  }

}
