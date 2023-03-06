const BN = require('bn.js');
const bn = new BN();
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');



let nodeIndex = [
    new BN(1),
    //new BN(2),
    new BN(3),
];



let shares = [
    new BN("1fdcaed1c2f55a881041bbab0969da1ea7d290fb15f3c531d579cf86146908a879f967c2b23d3e1bb5edd7fa8425dc05954df0348d2dd634b645f113776a3927", "hex"),
    //new BN("9279484fbb9a7a67980e4faf98581d80c4754ee4e3912ddefe1fd50a004ef9873ec3bf26c6077b3063af8dc4abc8ecb5fb8c167b730da782482d43058cd30d81", "hex"),
    new BN("5f960c7548e00f9830c533011c3d8e5bf777b2f141db4f95806d6e923d3b19f8d4b110bd9c8b53e8722132e6de2e1cebfaca8f19384ca5a31ca89cd168033827", "hex"),
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

