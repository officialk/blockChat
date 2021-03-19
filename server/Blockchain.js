const SHA = require("crypto-js/sha256");
const _DIFFICULTY_ = 4;

class Blockchain {
  constructor() {
    this.chain = [new Block(Date.now(), {})];
  }
  addBlock(data) {
    let newBlock = new Block(
      Date.now(),
      data,
      this.getBlock(this.chain.length).calculateHash()
    );
    this.chain.push(newBlock);
  }
  getBlock(id = this.chain.length) {
    return this.chain[id - 1];
  }
  getBlocksData() {
    if (this.isChainValid()) {
      return this.chain
        .map((block, id) => {
          let data = block.getData();
          data.id = id;
          return data;
        })
        .slice(1);
    } else {
      return [
        {
          err: "Invalid Blockchain Tampered",
        },
      ];
    }
  }
  isChainValid() {
    for (let i = 2; i < this.chain.length; i++) {
      let curr = this.getBlock(i);
      let prev = this.getBlock(i - 1);
      if (curr.hash !== curr.calculateHash()) {
        return false;
      }
      if (curr.previousHash !== prev.calculateHash()) {
        return false;
      }
    }
    return true;
  }
}

class Block {
  constructor(timestamp, data, previousHash = "") {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = "";
    this.nonce = 0;
    this.mineBlock();
  }
  calculateHash() {
    return SHA(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }
  mineBlock() {
    while (
      this.hash.substring(0, _DIFFICULTY_) !== Array(_DIFFICULTY_ + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
  getData() {
    return {
      timestamp: this.timestamp,
      data: this.data,
      previousHash: this.previousHash,
      hash: this.hash,
      nonce: this.nonce,
    };
  }
}

module.exports = { Blockchain };
