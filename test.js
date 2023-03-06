const BN = require('bn.js');
const bn = new BN();
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

let nodeIndex = [
    new BN(1),
    new BN(2),
    //new BN(3),
];

let shares = [
    new BN("a5bb7a55eb35bc5e2da6dbd32fe3d5d45b83c5816f5521e146ea0b4e305b85109178d50faa1214f616d24c0c32ecc46c1511b84e4364c8c4138d3976919cafb1", "hex"),
    new BN("14b76f4abd66b78bc5b4db7a65fc7aba8b7078b02deaa43c28dd4169c60b70a210a2612e8bf3678a9f0b83cb5b373700d14f1ec5221742d5d18e4136f0fa209cd", "hex"),
    //new BN("1f1326f01c1a1351a88f493798fab817d128b50844dff65a3d4be21ea91128f3182d350c1d45adc5dca9e2d5f33fa1bae14d22055ff8391f61e3aed678da763e9", "hex"),
];

function lagrangeInterpolation(shares, nodeIndex) {
    if (shares.length !== nodeIndex.length) {
        return null;
    }
    let secret = new BN(0);
    for (let i = 0; i < shares.length; i += 1) {
        let upper = new BN(1);
        let lower = new BN(1);
        for (let j = 0; j < shares.length; j += 1) {
            if (i !== j) {
                upper = upper.mul(nodeIndex[j].neg());
                upper = upper.umod(ec.n);
                let temp = nodeIndex[i].sub(nodeIndex[j]);
                temp = temp.umod(ec.n);
                lower = lower.mul(temp).umod(ec.n);
            }
        }
        let delta = upper.mul(lower.invm(ec.n)).umod(ec.n);
        delta = delta.mul(shares[i]);
        secret = secret.add(delta);
    }
    return secret.umod(ec.n);
}
const derivedPrivateKey = lagrangeInterpolation(shares, nodeIndex);
console.log(derivedPrivateKey);

