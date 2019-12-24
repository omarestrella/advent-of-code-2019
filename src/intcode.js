/* eslint-disable no-console */
import * as R from "ramda";

function getDigit(val, n) {
  const mod = val % Math.pow(10, n);
  return Math.floor(mod / Math.pow(10, n - 1));
}

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;

export class Computer {
  constructor(instructions, input = 1, phaseSetting = 0) {
    this.output = [];
    this.pointer = 0;
    this.lastOpcode = null;
    this.input = input;
    this.phaseSetting = phaseSetting;

    this.instructions = [...instructions];

    this.useInput = false;
  }

  advancePointer(amount) {
    this.pointer = this.pointer + amount;
  }

  halt() {
    this.pointer = this.instructions.length + 1;
  }

  getInput() {
    if (this.useInput) {
      return this.input;
    }
    this.useInput = true;
    return this.phaseSetting;
  }

  getOutput() {
    return this.output[this.output.length - 1];
  }

  processInstruction(code) {
    const pointer = this.pointer;
    const opcode = code % 100;

    const mode1 = getDigit(code, 3);
    const mode2 = getDigit(code, 4);
    const mode3 = getDigit(code, 5);

    if (opcode === 1 || opcode === 2) {
      const operation = opcode === 1 ? R.add : R.multiply;
      let [arg1, arg2, location] = R.slice(
        pointer + 1,
        pointer + 4,
        this.instructions
      );
      if (mode1 === POSITION_MODE) {
        arg1 = this.instructions[arg1];
      }
      if (mode2 === POSITION_MODE) {
        arg2 = this.instructions[arg2];
      }
      this.instructions[location] = operation(arg1, arg2);

      this.advancePointer(4);
    } else if (opcode === 3) {
      let arg1 = this.instructions[pointer + 1];
      this.instructions[arg1] = this.getInput();

      this.advancePointer(2);
    } else if (opcode === 4) {
      let arg1 = this.instructions[pointer + 1];
      if (mode1 === POSITION_MODE) {
        arg1 = this.instructions[arg1];
      }
      this.output.push(arg1);

      this.advancePointer(2);
    } else if (opcode === 5 || opcode === 6) {
      // jump if true/false
      let [arg1, arg2] = R.slice(pointer + 1, pointer + 3, this.instructions);

      if (mode1 === POSITION_MODE) {
        arg1 = this.instructions[arg1];
      }
      if (mode2 === POSITION_MODE) {
        arg2 = this.instructions[arg2];
      }

      const shouldJump = opcode === 5 ? arg1 !== 0 : arg1 === 0;
      if (shouldJump) {
        this.pointer = arg2;
      } else {
        this.advancePointer(3);
      }
    } else if (opcode === 7 || opcode === 8) {
      // less than/equal to
      let [arg1, arg2, arg3] = R.slice(
        pointer + 1,
        pointer + 4,
        this.instructions
      );

      if (mode1 === POSITION_MODE) {
        arg1 = this.instructions[arg1];
      }
      if (mode2 === POSITION_MODE) {
        arg2 = this.instructions[arg2];
      }
      // if (mode3 === POSITION_MODE) {
      //   arg3 = this.instructions[arg3];
      // }

      const shouldStore = opcode === 7 ? arg1 < arg2 : arg2 === arg1;
      if (shouldStore) {
        this.instructions[arg3] = 1;
      } else {
        this.instructions[arg3] = 0;
      }
      this.advancePointer(4);
    } else if (opcode === 99) {
      if (this.lastOpcode) {
        // We done!
        this.halt();
        return;
      }
    } else {
      console.error({
        code,
        pointer: this.pointer,
        computer: this
      });
      throw new Error("Got a weird opcode:", code);
    }

    if (this.pointer === pointer) {
      console.error({
        code,
        pointer: this.pointer,
        computer: this
      });
      throw new Error("You did not advance the pointer:", code);
    }

    this.lastOpcode = opcode;
  }

  run() {
    while (this.pointer < this.instructions.length) {
      const code = this.instructions[this.pointer];
      this.processInstruction(code);
    }
  }
}
