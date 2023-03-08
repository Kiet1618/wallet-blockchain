const BN = require('bn.js');
const bn = new BN();
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

let nodeIndex = [
    new BN(1),
    new BN(2),
    new BN(3),
];

let shares = [
    new BN("5521f26d03fec1e92580a52ed6ac8452cd0c56f12f058ddece58dde0bcc1ce332a4db11fbf984b75f6dd124c56b608e3cb9d0c0f4de319aa22142eda5206fca4", "hex"),
    new BN("aa43e4da07fd83d24b014a5dad5908a59a18ade25e0b1bbd9cb1bbc179839c65622e1a5d700586efe6249ae35fc9939d687a80897220fba07e31b479c9424a2b", "hex"),
    new BN("ff65d7470bfc45bb7081ef8c84058cf8672504d38d10a99c6b0a99a236456a979a0e839b2072c269d56c237a68dd1e570557f503965edd96da4f3a19407d97b2", "hex"),
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

